import { Outlet } from "react-router-dom";

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