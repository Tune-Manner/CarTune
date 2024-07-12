import EmailInput from "custom-components/form/EmailInput";
import { useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { FiShare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function SendEmail() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    // 로고 클릭 시 메인 페이지로 이동
    const onClickHandler = () => navigate("/");

    const containerStyle = {
        paddingTop: 50,
        textAlign: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1e1e, #3B2951)',
        color: 'white'
    };

    const handleEmailSubmit = (email) => {
        // 이메일 제출 시 처리할 로직
        console.log("Submitted email:", email);
        // 여기서 서버로 이메일을 전송하거나 다른 로직을 처리
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
                <Row className="px-5 justify-content-center">
                    <Col className="col-9 mt-5">
                        <div
                            style={{"backgroundColor": "white", "borderRadius": "20px"}}
                            className="h-[400px] d-flex align-items-center justify-content-center flex-column">
                             <Image src="/cartune-logo.png" className="logo-image w-[150px] mb-4"/>
                            <h2 className="mb-2 text-dark">이메일로 현재 플레이리스트를 전송할게요.</h2>
                            <p className="mb-3 fs-6 text-dark">이후 이메일을 입력하시면 같은 플레이리스트를 조회할 수 있습니다.</p>
                            <EmailInput
                                onEmailSubmit={handleEmailSubmit}
                                fontStyle="text-dark"
                                className="text-dark hover:bg-stone-100"
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SendEmail;