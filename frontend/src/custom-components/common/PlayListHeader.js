import { Navbar, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function PlayListHeader() {
    const navigate = useNavigate();

    // 로고 클릭 시 메인 페이지로 이동
    const onClickHandler = () => navigate("/");

    return (
        <>
            <Navbar className="bg-transparent">
                <Container fluid>
                    <Navbar.Brand onClick={onClickHandler}>
                        <img
                            src="/cartune-logo-white.png"
                            width="70"
                            height="70"
                            className="d-inline-block align-top"
                            alt="logo"
                        />
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    );
}

export default PlayListHeader;
