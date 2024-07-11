import React from 'react';
import { useLocation } from 'react-router-dom';
import WeatherCard from "custom-components/card/WeatherCard";
import { Col, Row } from "react-bootstrap";

function WeatherSearchResult() {
    const location = useLocation();
    const { image } = location.state || {};

    return(
        <>
            <Row className="px-5">
                <Col className="col-8 mt-5">
                    <div className="border-5 h-[500px]">
                        {image ? <img src={image} alt="Uploaded Landscape" className="w-100 h-100 object-cover" /> : <h1>파일을 업로드하세요.</h1>}
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
