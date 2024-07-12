import React from 'react';
import {
    Card,
    CardContent,
    CardFooter,
} from "components/ui/card";
import SearchBtn from "custom-components/btn/SearchBtn";
import { TiWeatherCloudy, TiWeatherShower, TiWeatherSunny, TiWeatherSnow, TiWeatherWindyCloudy } from "react-icons/ti";

function WeatherCard_v2({ weatherName, noValue }) {
    let weatherIcon;
    let weatherKrName;

    switch (weatherName) {
        case "Rainy":
            weatherIcon = <TiWeatherShower className="mt-4" style={{ width: "130px", height: "130px" }} />;
            weatherKrName = "비";
            break;
        case "Cloudy":
            weatherIcon = <TiWeatherCloudy className="mt-4" style={{ width: "130px", height: "130px" }} />;
            weatherKrName = "흐림";
            break;
        case "Sunny":
            weatherIcon = <TiWeatherSunny className="mt-4" style={{ width: "130px", height: "130px" }} />;
            weatherKrName = "맑음";
            break;
        case "Snowy":
            weatherIcon = <TiWeatherSnow className="mt-4" style={{ width: "130px", height: "130px" }} />;
            weatherKrName = "눈";
            break;
        case "Foggy":
            weatherIcon = <TiWeatherWindyCloudy className="mt-4" style={{ width: "130px", height: "130px" }} />;
            weatherKrName = "안개";
            break;
        default:
            weatherIcon = null;
            break;
    }

    const h2Style = {
        fontWeight: 'bold',
        fontSize: '24px',
        marginBottom: '30px', // 간격을 위한 마진 추가
    };

    const pStyle = {
        fontSize: '24px', // 글자 크기 키우기
    };

    const weatherKrNameStyle = {
        fontWeight: 'bold',
        color: 'red', // 강조를 위한 색상 추가
    };

    return !noValue ? (
        // 값을 직접 넣는 카드의 경우
        <Card className="w-[450px] h-[470px] mx-3 flex flex-col items-center" style={{ borderRadius: '10px' }}>
            <CardContent className="grid w-full mt-5 h-[200px] text-center justify-center pb-0">
                {weatherIcon}
            </CardContent>
            <CardFooter className="flex flex-col items-center">
                <h2 style={h2Style}>{weatherName}</h2>
                <h3 className="fs-6" style={pStyle}>
                    저희가 인식한 날씨는 '<span style={weatherKrNameStyle}>{weatherKrName}</span>'입니다.
                </h3>
            </CardFooter>
        </Card>
    ) : (
        // 값을 수동으로 넣는 카드의 경우
        <Card className="w-[200px] h-[280px] mx-1" style={{ borderRadius: '10px' }}>
            <CardContent className="grid w-full mt-0 h-[180px] text-center justify-center pb-0">
                {weatherIcon}
            </CardContent>
            <CardFooter className="flex flex-col items-center">
                <h2 style={h2Style}>{weatherName}</h2>
                <div style={pStyle}>
                    <span style={weatherKrNameStyle}>{weatherKrName}</span>
                </div>
            </CardFooter>
        </Card>
    );
}

export default WeatherCard_v2;
