import { Col, Container, Row } from "react-bootstrap";
import { FiShare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Playlist() {

    const navigate = useNavigate();

    // 로고 클릭 시 메인 페이지로 이동
    const onClickHandler = () => navigate("/");

    const containerStyle = {
        paddingTop: 50,
        textAlign: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1e1e, #3B2951)',
        color: 'white'
    };

    return(
        <>
            <Container style={containerStyle}>
                <img
                    src="/cartune-logo-white.png"
                    width="70"
                    height="70"
                    className="align-top mx-5 mb-5"
                    alt="logo"
                    onClick={onClickHandler}
                />
                <Row className="px-5">
                    <Col className="col-6">
                        <div
                            className="border-5 h-[500px] mx-5"
                        >
                            test
                        </div>
                    </Col>
                    <Col className="col-6 text-align-center">
                        <h1 className="d-flex text-between px-4">
                            playlist &nbsp;
                            <FiShare onClick={() => navigate('/playlist/send-email')} className="text-end" width={200} height={200}/>
                        </h1>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Playlist;