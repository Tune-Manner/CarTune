import { Outlet } from "react-router-dom";
import SearchHeader from "../components/common/SearchHeader";
import { Container } from "react-bootstrap";

function SearchLayout() {
    return(
        <>
            <SearchHeader/>
            <Container className="mt-5 justify-content-md-center">
            <main className="main">
                <Outlet/>
            </main>
            </Container>
        </>
    );
}

export default SearchLayout;