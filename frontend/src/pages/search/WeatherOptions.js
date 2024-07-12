import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faRedo, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './WeatherOptions.css'; // CSS 파일을 import 합니다.

function WeatherOptions() {
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');

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
            if (data.error) {
                setError(data.error);
            } else {
                setTranscript(data.text);
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
                if (data.error) {
                    setError(data.error);
                } else {
                    setTranscript(data.text);
                }
            } catch (e) {
                setError("음성 인식 요청 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <>
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
        </>
    );
}

export default WeatherOptions;
