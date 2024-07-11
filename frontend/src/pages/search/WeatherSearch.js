import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBtn from "custom-components/btn/SearchBtn";
import WeatherCard from "custom-components/card/WeatherCard";
import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { callWeatherPredictAPI } from "../../apis/weatherAPICalls";

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

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // API 호출 액션 디스패치
            await dispatch(callWeatherPredictAPI(file));

            // weather 객체 확인 후 navigate
            if (weather && weather.predicted_class) {
                console.log("예측 된 날씨", weather.predicted_class);
                navigate('/search/weather/result', { state: { image: URL.createObjectURL(file), predictedClass: weather.predicted_class } });
            } else {
                console.error("예측된 날씨를 가져올 수 없습니다.");
            }
        }
    };

    return (
        <>
            <Container className="d-flex align-items-center justify-content-center flex-column p-5">
                <h1>풍경을 업로드해주세요.</h1>
                <p className="py-2">날씨를 인식해서 음악을 추천해 드릴게요!</p>
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
