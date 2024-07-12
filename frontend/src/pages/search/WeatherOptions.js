import React, { useState } from 'react';

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

    return (
        <>
            <h1>하이미디어</h1>
            <button onClick={startRecording} disabled={recording}>
                {recording ? "녹음 중..." : "음성 인식 시작"}
            </button>
            {transcript && (
                <p>인식된 텍스트: {transcript}</p>
            )}
            {error && (
                <p style={{ color: 'red' }}>{error}</p>
            )}
        </>
    );
}

export default WeatherOptions;