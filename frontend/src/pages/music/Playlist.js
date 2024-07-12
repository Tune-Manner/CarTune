import React, { useState } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { FiShare } from "react-icons/fi";
import axios from 'axios';
import { BsFillPlayFill } from "react-icons/bs";
import './Playlist.css';  // CSS 파일 추가
import { useNavigate,useLocation } from "react-router-dom";

function Playlist() {
    const [playlistDetails, setPlaylistDetails] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { entities } = location.state || {};

    // 로고 클릭 시 메인 페이지로 이동
    const onClickHandler = () => navigate("/");

    const containerStyle = {
        paddingTop: 50,
        textAlign: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1e1e, #3B2951)',
        color: 'white'
    };
  
    const fetchLatestPlaylist = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/latest_playlist');
            const { playlist_id, refresh_token, playlist_name } = response.data;
            const accessToken = await getAccessToken(refresh_token);
            fetchPlaylistDetails(playlist_id, accessToken);
        } catch (error) {
            console.error('최신 플레이리스트 정보를 가져오는 중 오류 발생:', error);
        }
    };

    const getAccessToken = async (refreshToken) => {
        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', null, {
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: 'ac56d5b5d54b42f18ebdae8323547f75',
                    client_secret: process.env.REACT_APP_CLIENT_SECRET,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data.access_token;
        } catch (error) {
            console.error('액세스 토큰을 가져오는 중 오류 발생:', error);
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
        } catch (error) {
            console.error('플레이리스트 정보를 가져오는 중 오류 발생:', error);
        }
    };

    const playPlaylist = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/create_and_play_playlist');
            fetchLatestPlaylist(); // 새로고침 없이 최신 플레이리스트 업데이트
        } catch (error) {
            console.error('플레이리스트 재생 중 오류 발생:', error);
        }
    };

    const playTrack = async (trackUri) => {
        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', null, {
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: playlistDetails.refresh_token,
                    client_id: 'ac56d5b5d54b42f18ebdae8323547f75',
                    client_secret: process.env.REACT_APP_CLIENT_SECRET,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const accessToken = response.data.access_token;

            await axios.put(
                `https://api.spotify.com/v1/me/player/play`,
                {
                    uris: [trackUri],
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
        } catch (error) {
            console.error('트랙 재생 중 오류 발생:', error);
        }
    };

    return (
        <Container style={containerStyle}>
            <img
                src="/cartune-logo-white.png"
                width="70"
                height="70"
                className="align-top mx-5 mb-5"
                alt="logo"
                onClick={onClickHandler}
            />
            <button
                className="btn btn-primary play-button"
                onClick={playPlaylist}
            >
                <BsFillPlayFill size={24} /> Play
            </button>
            <Row className="px-5">
                <Col className="col-6">
                    {playlistDetails && (
                        <div className="border-5 h-[500px] mx-5 position-relative">
                            <img
                                src={playlistDetails.images[0].url}
                                alt="Playlist Cover"
                                className="img-fluid playlist-cover"
                            />
                        </div>
                    )}
                </Col>
                <Col className="col-6 text-align-center">
                    <h1 className="d-flex text-between px-4">
                        {playlistDetails ? playlistDetails.name : 'Playlist'} &nbsp;
                        <FiShare onClick={() => navigate('/playlist/send-email')} className="text-end" width={200} height={200} />
                    </h1>
                    {playlistDetails && (
                        <div className="track-list">
                            {playlistDetails.tracks.items.map((item, index) => (
                                <div key={index} className="track-item" onClick={() => playTrack(item.track.uri)}>
                                    <div className="track-index">{index + 1}</div>
                                    <img src={item.track.album.images[2].url} alt="Track Cover" className="track-cover" />
                                    <div className="track-info">
                                        <div className="track-name">{item.track.name}</div>
                                        <div className="track-artists">{item.track.artists.map(artist => artist.name).join(', ')}</div>
                                    </div>
                                    <div className="track-duration">{Math.floor(item.track.duration_ms / 60000)}:{Math.floor((item.track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}</div>
                                </div>
                            ))}

                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Playlist;
