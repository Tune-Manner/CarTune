import { Container } from "react-bootstrap";
import PlayListHeader from "../custom-components/common/PlayListHeader";
import { Outlet } from "react-router-dom";

function PlayListLayout() {
    return(
        <>
            <main className="main" style={{"backgroundColor": "black"}}>
                <Outlet/>
            </main>
        </>
    );
}

export default PlayListLayout;