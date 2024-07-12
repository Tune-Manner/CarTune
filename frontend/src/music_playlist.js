import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';


function App() {
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    const fetchLatestPlaylist = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/latest_playlist');
        const { playlist_id, refresh_token } = response.data;
        setRefreshToken(refresh_token); // set refresh token state
        const accessToken = await getAccessToken(refresh_token);
        fetchPlaylistDetails(playlist_id, accessToken);
      } catch (error) {
        console.error('Error fetching latest playlist:', error);
      }
    };

    const interval = setInterval(() => {
      fetchLatestPlaylist();
    }, 5000); // 5초마다 최신 플레이리스트 정보를 가져옴
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
  }, []);

  const getAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: 'ac56d5b5d54b42f18ebdae8323547f75', // 여기에 실제 클라이언트 ID를 입력하세요
          client_secret: ProcessingInstruction.env.REACT_APP_CLIENT_SECRET, // 여기에 실제 클라이언트 시크릿을 입력하세요
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const fetchPlaylistDetails = async (playlistId, accessToken) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setPlaylistDetails(response.data);
      play(playlistId, accessToken);
    } catch (error) {
      console.error('Error fetching playlist details:', error);
    }
  };

  const play = (playlistId, accessToken) => {
    if (window.spotifyPlayer && window.deviceId) {
      axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${window.deviceId}`,
        {
          context_uri: `spotify:playlist:${playlistId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => {
        console.log('Playback started');
      })
      .catch(error => {
        console.error('Error starting playback', error);
      });
    } else {
      console.error('Spotify player or device ID is not ready');
    }
  };

  return (
    <div className="App">
      <h1>Spotify Playlist</h1>
      {playlistDetails ? (
        <div>
          <h2>{playlistDetails.name}</h2>
          {playlistDetails.images.length > 0 && (
            <img src={playlistDetails.images[0].url} alt="Playlist Cover" />
          )}
          <h3>Tracks:</h3>
          <ul>
            {playlistDetails.tracks.items.map((item, index) => (
              <li key={index}>
                {item.track.name} by {item.track.artists.map(artist => artist.name).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No playlist created yet</p>
      )}
    </div>
  );
}

export default App;
