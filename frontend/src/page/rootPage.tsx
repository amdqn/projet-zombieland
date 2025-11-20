import {Outlet} from "react-router";
import Header from "../component/header.tsx";
import "../index.css";
import LateralBar from "../component/lateralBar.tsx";

export default function RootPage(){

    return (
        <>
            <Header/>
            <LateralBar/>
            <Outlet/>
        </>
    )
}