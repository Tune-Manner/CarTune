import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBtn from "custom-components/btn/SearchBtn";
import WeatherCard from "custom-components/card/WeatherCard";
import { Container, Row } from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {callWeatherPredictAPI} from "../../apis/weatherAPICalls";

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
            dispatch(callWeatherPredictAPI(file));

            console.log("예측 된 날씨",weather.predicted_class)
            // navigate를 포함하여 추가 작업 수행
            navigate('/search/weather/result', { state: { image: URL.createObjectURL(file) } });
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