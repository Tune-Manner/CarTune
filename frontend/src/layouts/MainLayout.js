import { Outlet } from "react-router-dom";

function MainLayout() {
    return(
        <>
            <main className="main" style={{"backgroundColor": "black"}}>
                <Outlet/>
            </main>
        </>
    );
}

export default MainLayout;