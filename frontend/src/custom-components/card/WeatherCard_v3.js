import React from 'react';
import {
    Card,
    CardContent,
    CardFooter,
} from "components/ui/card";
import SearchBtn from "custom-components/btn/SearchBtn";
import { TiWeatherCloudy, TiWeatherShower, TiWeatherSunny, TiWeatherSnow, TiWeatherWindyCloudy, TiImage } from "react-icons/ti";

function WeatherCard_v3({ weatherName, noValue, countdown, handleNextStep }) {
    const weatherMap = {
        "Rainy": { icon: <TiWeatherShower className="mt-4" style={{ width: "130px", height: "130px" }} />, name: "비" },
        "Cloudy": { icon: <TiWeatherCloudy className="mt-4" style={{ width: "130px", height: "130px" }} />, name: "흐림" },
        "Sunny": { icon: <TiWeatherSunny className="mt-4" style={{ width: "130px", height: "130px" }} />, name: "맑음" },
        "Snowy": { icon: <TiWeatherSnow className="mt-4" style={{ width: "130px", height: "130px" }} />, name: "눈" },
        "Foggy": { icon: <TiWeatherWindyCloudy className="mt-4" style={{ width: "130px", height: "130px" }} />, name: "안개" },
    };

    const fixedIcon = <TiImage className="mt-4" style={{ width: "130px", height: "130px" }} />;

    // weatherName이 배열인지 확인하고, 배열이 아닌 경우 빈 배열로 설정
    const weatherNamesToShow = Array.isArray(weatherName) ? weatherName.slice(0, 5) : [];

    if (!noValue) {
        return (
            // 값을 직접 넣는 카드의 경우
            <Card className="w-[450px] h-[500px] mx-3 flex flex-col items-center" style={{ borderRadius: '10px' }}>
                <CardContent className="grid w-full h-[200px] text-center justify-center pb-0">
                    {fixedIcon}
                </CardContent>
                <CardFooter className="flex flex-col">
                    <CardContent className="grid w-full mt-2 h-[200px] text-left justify-center pb-0">
                        <p className="fs-6">
                            저희가 인식한 풍경 키워드는
                            <div className="flex flex-col items-start">
                                {weatherNamesToShow.map((name, index) => (
                                    <h2 key={index} className="flex items-center text-2xl">
                                        <span className="mr-2">•</span>
                                        <span>{weatherMap[name]?.name || name}</span>
                                    </h2>
                                ))}
                            </div>
                            입니다.
                        </p>
                    </CardContent>
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
                    {fixedIcon}
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                    <CardContent className="grid w-full mt-0 h-[180px] text-left justify-center pb-0">
                        {weatherNamesToShow.map((name, index) => (
                            <h2 key={index} className="flex items-center text-2xl">
                                <span className="mr-2">•</span>
                                <span>{weatherMap[name]?.name || name}</span>
                            </h2>
                        ))}
                    </CardContent>
                </CardFooter>
            </Card>
        );
    }
}

export default WeatherCard_v3;
