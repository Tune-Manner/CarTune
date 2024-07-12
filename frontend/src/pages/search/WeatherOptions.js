import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faRedo, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './WeatherOptions.css'; // CSS 파일을 import 합니다.
import WeatherCard_v2 from 'custom-components/card/WeatherCard_v2';

function WeatherOptions() {
    const location = useLocation();
    const { weatherName } = location.state || {};
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const [entities, setEntities] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (transcript) {
            const timer = setTimeout(() => {
                navigate('/playlist', { state: { entities } });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [transcript, navigate, entities]);

    const startRecording = async () => {
        setRecording(true);
        setError('');
        setTranscript('');

        try {
            const response = await fetch("http://localhost:8000/transcribe/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            console.log("음성 텍스트:", data);
            if (data.error) {
                setError(data.error);
            } else {
                setTranscript(data.text);
                setEntities(data.entities);
            }
        } catch (e) {
            setError("음성 인식 요청 중 오류가 발생했습니다.");
        } finally {
            setRecording(false);
        }
    };

    const handleInputBlur = async () => {
        if (transcript) {
            try {
                const response = await fetch("http://localhost:8000/transcribe/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                console.log("음성 텍스트:", data);
                if (data.error) {
                    setError(data.error);
                } else {
                    setTranscript(data.text);
                    setEntities(data.entities);
                }
            } catch (e) {
                setError("음성 인식 요청 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="container">
            {/*<div className="weather-card-container">*/}
            {/*    <WeatherCard_v2 weatherName={weatherName} />*/}
            {/*</div>*/}
            <div className="icon-container" onClick={recording ? null : startRecording}>
                {error ? (
                    <>
                        <FontAwesomeIcon icon={faRedo} className="redo-icon" />
                        <div className="retry-message">다시 시도</div>
                    </>
                ) : (
                    <>
                        {recording ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
                                <div className="loading-message">노래 세부 옵션을 말해주세요.</div>
                            </>
                        ) : (
                            <FontAwesomeIcon icon={faMicrophone} className="microphone-icon" />
                        )}
                    </>
                )}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={transcript}
                    placeholder="ex. ost로 등록된 재즈 느낌의 대한민국 피아노 곡을 추천해줘."
                    className="email-input"
                    readOnly
                    onBlur={handleInputBlur}
                />
            </div>
        </div>
    );
}

export default WeatherOptions;
