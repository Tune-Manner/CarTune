import React from 'react';
import {
    Card,
    CardContent,
    CardFooter,
} from "components/ui/card";
import SearchBtn from "custom-components/btn/SearchBtn";
import { TiWeatherCloudy, TiWeatherShower, TiWeatherSunny, TiWeatherSnow, TiWeatherWindyCloudy } from "react-icons/ti";

function WeatherCard({ weatherName, noValue, countdown, handleNextStep }) {
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

    if (!noValue) {
        return (
            // 값을 직접 넣는 카드의 경우
            <Card className="w-[450px] h-[470px] mx-3 flex flex-col items-center" style={{ borderRadius: '10px' }}>
                <CardContent className="grid w-full mt-5 h-[200px] text-center justify-center pb-0">
                    {weatherIcon}
                </CardContent>
                <CardFooter className="flex flex-col">
                    <h2>{weatherName}</h2>
                    <p className="fs-6">저희가 인식한 날씨는 '{weatherKrName}'입니다.</p>
                    <p className="fs-6 mt-3" style={{ color: '#4B0082', fontWeight: 'bold' }}>
                        다음 단계로 이동하기까지 <span style={{ fontWeight: 'bolder', fontSize: '1.2em' }}>{countdown}</span>초 남았습니다.
                    </p>
                    <div className="mt-8"></div> {/* 간격 조정을 위한 추가 요소 */}
                    <SearchBtn buttonTitle={"다음 단계"} onClick={handleNextStep} />
                </CardFooter>
            </Card>
        );
    } else {
        return (
            // 값을 수동으로 넣는 카드의 경우
            <Card className="w-[200px] h-[280px] mx-1" style={{ borderRadius: '10px' }}>
                <CardContent className="grid w-full mt-0 h-[180px] text-center justify-center pb-0">
                    {weatherIcon}
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                    <h2>{weatherName}</h2>
                    <div>{weatherKrName}</div>
                </CardFooter>
            </Card>
        );
    }
}

export default WeatherCard;
