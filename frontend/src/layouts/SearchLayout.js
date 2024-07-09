import { Outlet } from "react-router-dom";
import SearchHeader from "../components/common/SearchHeader";

function SearchLayout() {
    return(
        <>
            <SearchHeader/>
            <main className="main">
                <Outlet/>
            </main>
        </>
    );
}

export default SearchLayout;