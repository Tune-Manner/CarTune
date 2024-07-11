import OptionBadge from "custom-components/btn/OptionBadge";
import SearchBtn from "custom-components/btn/SearchBtn";
import WeatherCard from "custom-components/card/WeatherCard";
import { Col, Container, Row } from "react-bootstrap";

function WeatherSearchResult() {

    return(
        <>
            <Row className="px-5">
                <Col className="col-8 mt-5">
                    <div
                        className="border-5 h-[500px]"
                    >
                        {/* <Image src=""/> */}
                        <h1>test</h1>
                    </div>
                </Col>
                <Col className="col-4 mt-5">
                    <WeatherCard weatherName={"Foggy"}/>
                </Col>
            </Row>
        </>
    );
}

export default WeatherSearchResult;