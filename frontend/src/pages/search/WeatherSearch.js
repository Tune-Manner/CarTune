import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBtn from "custom-components/btn/SearchBtn";
import WeatherCard from "custom-components/card/WeatherCard";
import { Container, Row } from "react-bootstrap";

function WeatherSearch() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                navigate('/search/weather/result', { state: { image: reader.result } });
            };
            reader.readAsDataURL(file);
        }
    };

    return(
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
                {/* 값을 넘길 때는 noValue를 따로 쓰지 않는다. */}
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

