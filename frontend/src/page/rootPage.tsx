import {Outlet} from "react-router";
import Header from "../component/header.tsx";
import "../index.css";
import LateralBar from "../component/lateralBar.tsx";
import Footer from "../component/footer.tsx";

export default function RootPage(){

    return (
        <>
            <Header/>
            <LateralBar/>
            <Outlet/>
            <Footer/>
        </>
    )
}