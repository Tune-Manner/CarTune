import { Button, Image, Navbar, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function SearchHeader() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 로고 클릭 시 메인 페이지로 이동
    const onClickHandler = () => navigate("/");

    return(
        <div className="border">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                        src="cartune-logo.png"
                        width="70"
                        height="70"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                        onClick={ onClickHandler }
                        />
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </div>
    );
}

export default SearchHeader;