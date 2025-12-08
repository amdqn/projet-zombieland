import VideoBanniere from "../../components/home/VideoBanniere.tsx";
import ImageBanniere from "../../components/home/ImageBanniere.tsx";
import {Box}  from "@mui/material";
import SocialNetwork from "../../components/home/SocialNetwork.tsx";
import InformationsMain from "../../components/home/InformationsMain.tsx";
import PriceMain from "../../components/home/PriceMain.tsx";
import CarouselActivityMain from "../../components/home/CarouselActivityMain.tsx";

export default function HomePage() {



    return (
        <Box sx={{
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden',
            margin: 0,
            padding: 0
        }}>
            <VideoBanniere/>
            <ImageBanniere/>

            <Box sx={{
                py: { xs: 3, md: 5 },
                px: { xs: 2, sm: 5, md: 15, lg: 20 },
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
            }}>
                <Box sx={{ paddingTop: { xs: 10, md: 20 } }}>
                    <CarouselActivityMain/>
                </Box>

                <Box sx={{ paddingTop: { xs: 10, md: 20 } }}>
                    <PriceMain/>
                </Box>

                <Box sx={{ paddingTop: { xs: 10, md: 20 } }}>
                    <SocialNetwork/>
                </Box>

                <Box sx={{ paddingTop: { xs: 10, md: 20 } }}>
                    <InformationsMain/>
                </Box>
            </Box>
        </Box>
    )
}