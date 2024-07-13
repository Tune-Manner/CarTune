import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import WeatherCard from 'custom-components/card/WeatherCard';

const weatherMapping = {
    1: "Rainy",
    2: "Cloudy",
    3: "Sunny",
    4: "Snowy",
    5: "Foggy"
};

function WeatherSearchResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { image, predictedClass } = location.state || {};
    const weatherName = weatherMapping[predictedClass] || "Unknown";

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleNextStep();
        }
    }, [countdown]);

    const handleNextStep = () => {
        // 다음 단계로 이동하는 로직을 여기에 추가
        console.log('다음 단계로 이동');
        navigate('/search/weather/options',{state : {weatherName}}); // 다음 화면으로 이동하는 경로를 여기에 설정
    };

    return (
        <>
            <Row className="px-5">
                <Col className="col-8 mt-5">
                    <div className="border-5 h-[500px]">
                        {image ? <img src={image} alt="Uploaded Landscape" className="w-100 h-100 object-cover" /> : <h1>파일을 업로드하세요.</h1>}
                    </div>
                </Col>
                <Col className="col-4 mt-5">
                    <WeatherCard weatherName={weatherName} countdown={countdown} handleNextStep={handleNextStep} />
                </Col>
            </Row>
        </>
    );
}

export default WeatherSearchResult;
