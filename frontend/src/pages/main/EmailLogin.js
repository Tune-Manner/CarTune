import EmailInput from "custom-components/form/EmailInput";
import { Button, Col, Container, Image } from "react-bootstrap";


function EmailLogin() {
    const containerStyle = {
        paddingTop: 150,
        textAlign: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1e1e, #3B2951)',
        color: 'white'
    };

    return(
        <>
            <Container style={containerStyle}>
                <Col className="d-flex align-items-center justify-content-center flex-column">
                    <Image src="/cartune-logo.png" fluid className="logo-image"/>
                    <h1 className="mb-3">CARTUNE</h1>
                    <p className="mb-5 fs-5">음성과 현재 날씨에 어울리는<br/>드라이브 음악을 추천해 드릴게요.</p>
                    <EmailInput/>
                </Col>
            </Container>
        </>
    );
}

export default EmailLogin;