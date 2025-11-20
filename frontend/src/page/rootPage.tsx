import {Outlet} from "react-router";
import Header from "../component/header.tsx";
import "../index.css";

export default function RootPage(){

    return (
        <>
            <Header/>
            <Outlet/>
        </>
    )
}