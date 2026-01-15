
import {Box, IconButton, Typography} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import {useNavigate} from "react-router";

export default function Footer() {

    const navigate = useNavigate();
    const year = new Date().getFullYear();

    return (
        <>
            {/* Block supperieur */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                {/* Premier block */}
                <Box sx={{ display: {xs: 'none', md: 'block'} }}>
                    <Typography onClick={() => navigate("/static/mentions-legales")} sx={{ cursor: 'pointer' }}>
                        Mentions légales
                    </Typography>
                    <Typography onClick={() => navigate("/static/gestion-cookies")} sx={{ cursor: 'pointer' }}>
                        Gestion des cookies
                    </Typography>
                    <Typography onClick={() => navigate("/static/cgv")} sx={{ cursor: 'pointer' }}>
                        Conditions de vente
                    </Typography>
                    <Typography onClick={() => navigate("/static/cgu")} sx={{ cursor: 'pointer' }}>
                        CGU
                    </Typography>
                    <Typography onClick={() => navigate("/static/rgpd")} sx={{ cursor: 'pointer' }}>
                        RGPD
                    </Typography>
                </Box>

                {/* Liens Menus */}
                <Box sx={{ display: {xs: 'none', md: 'flex'}, gap: 3 }}>
                    <Box onClick={() => navigate("/info")} sx={{ cursor: "pointer" }}>
                        INFOS
                    </Box>
                    <Box onClick={() => navigate("/activities")} sx={{ cursor: "pointer" }}>
                        ACTIVITES
                    </Box>
                    <Box onClick={() => navigate("/reservations")} sx={{ cursor: "pointer" }}>
                        RESERVATIONS
                    </Box>
                    <Box onClick={() => navigate("/contact")} sx={{ cursor: "pointer" }}>
                        NOUS CONTACTER
                    </Box>
                </Box>


                {/* Réseaux sociaux */}
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Box>
                        <IconButton
                            sx={{ color: 'white' }}
                            component="a"
                            href="https://www.youtube.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <YouTubeIcon />
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton
                            sx={{ color: 'white' }}
                            component="a"
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FacebookIcon />
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton
                            sx={{ color: 'white' }}
                            component="a"
                            href="https://www.twitter.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <XIcon />
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton
                            sx={{ color: 'white' }}
                            component="a"
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <InstagramIcon />
                        </IconButton>
                    </Box>
                </Box>

            </Box>

            {/* Block inferieur */}
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Typography>
                    Projet équipe O'Clock - {year}
                </Typography>
            </Box>

        </>
    )
}