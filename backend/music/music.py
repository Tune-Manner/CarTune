from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from typing import List
from cryptography.fernet import Fernet
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from credentials.credentials import Encrypted_text, Encrypted_text1

app = FastAPI()

CLIENT_ID = "ac56d5b5d54b42f18ebdae8323547f75"

with open("encryption_key.key", "rb") as key_file:
    key = key_file.read()

cipher_suite =Fernet(key)

CLIENT_SECRET = cipher_suite.decrypt(Encrypted_text).decode(  )

with open("encryption_key1.key", "rb") as key_file:
    key = key_file.read()

cipher_suite = Fernet(key)

REFRESH_TOKEN = cipher_suite.decrypt(Encrypted_text1).decode()

# CORS 설정 추가
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_playlist_info = {}

class Song(BaseModel):
    title: str
    artist: str

class PlaylistRequest(BaseModel):
    songs: List[Song]
    playlist_name: str

def refresh_access_token(REFRESH_TOKEN):
    refresh_response = requests.post("https://accounts.spotify.com/api/token", data={
        'grant_type': 'refresh_token',
        'refresh_token': REFRESH_TOKEN,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    })
    refresh_response_data = refresh_response.json()
    if 'error' in refresh_response_data:
        raise HTTPException(status_code=400, detail=refresh_response_data['error_description'])
    return refresh_response_data["access_token"]

def get_spotify_headers(token: str):
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

def get_user_id(headers):
    user_response = requests.get("https://api.spotify.com/v1/me", headers=headers)
    if user_response.status_code != 200:
        raise HTTPException(status_code=user_response.status_code, detail=user_response.json().get('error', {}).get('message', 'Error fetching user data'))
    return user_response.json()["id"]

def create_playlist(headers, user_id, playlist_name):
    playlist_response = requests.post(
        f"https://api.spotify.com/v1/users/{user_id}/playlists",
        headers=headers,
        json={"name": playlist_name}
    )
    if playlist_response.status_code != 201:
        raise HTTPException(status_code=playlist_response.status_code, detail=playlist_response.json().get('error', {}).get('message', 'Error creating playlist'))
    return playlist_response.json()["id"]

def search_tracks(headers, songs):
    track_uris = []
    for song in songs:
        search_url = f"https://api.spotify.com/v1/search?q=track:{song.title}%20artist:{song.artist}&type=track"
        search_response = requests.get(search_url, headers=headers)
        if search_response.status_code != 200:
            raise HTTPException(status_code=search_response.status_code, detail=f"Error searching for track {song.title} by {song.artist}")
        search_result = search_response.json()
        if search_result['tracks']['items']:
            track_uris.append(search_result['tracks']['items'][0]['uri'])
        else:
            raise HTTPException(status_code=404, detail=f"Track {song.title} by {song.artist} not found")
    return track_uris

def add_tracks_to_playlist(headers, playlist_id, track_uris):
    add_tracks_response = requests.post(
        f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks",
        headers=headers,
        json={"uris": track_uris}
    )
    if add_tracks_response.status_code != 201:
        raise HTTPException(status_code=add_tracks_response.status_code, detail=add_tracks_response.json().get('error', {}).get('message', 'Error adding tracks to playlist'))

def get_active_device(headers):
    devices_response = requests.get("https://api.spotify.com/v1/me/player/devices", headers=headers)
    if devices_response.status_code != 200:
        raise HTTPException(status_code=devices_response.status_code, detail="Error fetching devices")
    devices = devices_response.json()["devices"]
    for device in devices:
        if device["is_active"]:
            return device["id"]
    return None

def play_playlist(headers, playlist_id):
    device_id = get_active_device(headers)
    if not device_id:
        raise HTTPException(status_code=404, detail="No active device found. Please open Spotify on one of your devices and try again.")

    play_response = requests.put(
        "https://api.spotify.com/v1/me/player/play",
        headers=headers,
        json={"context_uri": f"spotify:playlist:{playlist_id}", "device_id": device_id}
    )
    if play_response.status_code != 204:
        raise HTTPException(status_code=play_response.status_code, detail=play_response.json().get('error', {}).get('message', 'Error playing playlist'))

@app.post("/create_and_play_playlist")
def create_and_play_playlist(request: PlaylistRequest):
    try:
        # 1. 액세스 토큰 갱신
        access_token = refresh_access_token(REFRESH_TOKEN)
        headers = get_spotify_headers(access_token)

        # 2. 사용자 ID 가져오기
        user_id = get_user_id(headers)

        # 3. 플레이리스트 생성
        playlist_id = create_playlist(headers, user_id, request.playlist_name)

        # 4. 트랙 검색 및 URI 수집
        track_uris = search_tracks(headers, request.songs)

        # 5. 트랙을 플레이리스트에 추가
        add_tracks_to_playlist(headers, playlist_id, track_uris)

        # 6. 플레이리스트 재생
        play_playlist(headers, playlist_id)

        # 최신 플레이리스트 정보 저장
        global latest_playlist_info
        latest_playlist_info = {
            "playlist_id": playlist_id,
            "track_uris": track_uris,
            "refresh_token": REFRESH_TOKEN
        }

        return {"playlist_id": playlist_id, "track_uris": track_uris, "refresh_token": REFRESH_TOKEN}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/latest_playlist")
def get_latest_playlist():
    if not latest_playlist_info:
        raise HTTPException(status_code=404, detail="No playlist created yet")
    return latest_playlist_info

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)


