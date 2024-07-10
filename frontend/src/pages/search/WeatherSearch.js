import OptionBadge from "custom-components/btn/OptionBadge";
import SearchBtn from "custom-components/btn/SearchBtn";
import WeatherCard from "custom-components/card/WeatherCard";
import { Col, Container, Row } from "react-bootstrap";

function WeatherSearch() {

    return(
        <>
            <h1>content</h1>
            <SearchBtn
                buttonTitle={"풍경 업로드하기"}
                // onClick={}
                />
            <Row className="px-5">
                {/* 값을 넘길 때는 noValue를 따로 쓰지 않는다. */}
                <WeatherCard weatherName={"Cloudy"} noValue={true} />
                <WeatherCard weatherName={"Rainy"} noValue={true} />
                <WeatherCard weatherName={"Sunny"} noValue={true} />
                <WeatherCard weatherName={"Snowy"} noValue={true} />
                <WeatherCard weatherName={"Foggy"} noValue={true} />
            </Row>
            <WeatherCard weatherName={"Foggy"}/>
            <OptionBadge optionName={"test"} />
        </>
    );
}

export default WeatherSearch;