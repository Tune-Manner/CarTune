import { Container } from "react-bootstrap";
import PlayListHeader from "../components/common/PlayListHeader";
import { Outlet } from "react-router-dom";

function PlayListLayout() {
    return(
        <>
            <PlayListHeader/>
            <Container className="mt-5 justify-content-md-center">
            <main className="main">
                <Outlet/>
            </main>
            </Container>
        </>
    );
}

export default PlayListLayout;