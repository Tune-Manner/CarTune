import { Outlet } from "react-router-dom";
import SearchHeader from "../custom-components/common/SearchHeader";
import { Container, Image } from "react-bootstrap";

function SearchLayout() {
    return(
        <>
            <SearchHeader/>
            <Container className="mt-5 justify-content-md-center px-5">
            <main className="main">
                <Outlet/>
            </main>
            </Container>
            <div className="d-flex justify-content-center mt-4">
                <Image src="/search-footer.png"/>
            </div>
        </>
    );
}

export default SearchLayout;