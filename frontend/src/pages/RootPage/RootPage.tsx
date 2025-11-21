import {Outlet} from "react-router";
import Header from "../../components/layout/Header";
import "../../index.css";
import LateralBar from "../../components/layout/LateralBar";
import Footer from "../../components/layout/footer";
import {Box} from "@mui/material";

export default function RootPage(){

    return (
        <>
            <Header/>
            <LateralBar/>
            <Box component="main" sx={{ minHeight: '100vh' }}>
                <Outlet/>
            </Box>
            <Footer/>
        </>
    )
}