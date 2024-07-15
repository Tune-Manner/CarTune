import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBtn from "custom-components/btn/SearchBtn";
import WeatherCard_v3 from "custom-components/card/WeatherCard_v3";
import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { callWeatherPredictAPI } from "../../apis/weatherAPICalls";
import WeatherCard from "../../custom-components/card/WeatherCard";

const weatherMapping = {
    1: "Rainy",
    2: "Cloudy",
    3: "Sunny",
    4: "Snowy",
    5: "Foggy"
};

function WeatherSearch() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);

    const { weather } = useSelector(state => state.weatherReducer);

    useEffect(() => {
        if (weather && weather.tags) {
            console.log("예측 된 날씨", weather.tags);
            navigate('/search/weather/result', { state: { image, predictedClass: weather.tags } });
        }
    }, [weather, navigate, image]);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // 이미지 URL을 상태에 저장
            await dispatch(callWeatherPredictAPI(file));
        }
    };

    return (
        <>
            <Container className="d-flex align-items-center justify-content-center flex-column p-5">
                <h1>풍경을 업로드해주세요.</h1>
                <p className="py-2">풍경을 인식해서 음악을 추천해 드릴게요!</p>
                <SearchBtn
                    buttonTitle={"풍경 업로드하기"}
                    onClick={handleButtonClick}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </Container>
            <Row className="px-3 justify-content-center">
                <WeatherCard weatherName={"Cloudy"} noValue={true} />
                <WeatherCard weatherName={"Rainy"} noValue={true} />
                <WeatherCard weatherName={"Sunny"} noValue={true} />
                <WeatherCard weatherName={"Snowy"} noValue={true} />
                <WeatherCard weatherName={"Foggy"} noValue={true} />
            </Row>
        </>
    );
}

export default WeatherSearch;
