import { Navbar, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function SearchHeader() {

    const navigate = useNavigate();

    // 로고 클릭 시 메인 페이지로 이동
    const onClickHandler = () => navigate("/");

    return(
        <>
            <Navbar className="bg-body-tertiary border-2 border-bottom">
                <Container>
                    <Navbar.Brand href="">
                        <img
                        src="/cartune-logo.png"
                        width="70"
                        height="70"
                        className="d-inline-block align-top"
                        alt="logo"
                        onClick={ onClickHandler }
                        />
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    );
}

export default SearchHeader;