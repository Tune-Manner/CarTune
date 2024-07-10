import { Outlet } from "react-router-dom";

function MainLayout() {
    return(
        <>
            <main className="main">
                <Outlet/>
            </main>
        </>
    );
}

export default MainLayout;