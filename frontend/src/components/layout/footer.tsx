
import {Box, IconButton, Typography} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import {useNavigate} from "react-router";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    return (
        <>
            {/* Block supperieur */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                {/* Premier block */}
                <Box sx={{ display: {xs: 'none', md: 'block'} }}>
                    <Typography onClick={() => navigate("/static/mentions-legales")} sx={{ cursor: 'pointer' }}>
                        {t("footer.legal.mentionsLegales")}
                    </Typography>
                    <Typography onClick={() => navigate("/static/gestion-cookies")} sx={{ cursor: 'pointer' }}>
                        {t("footer.legal.gestionCookies")}
                    </Typography>
                    <Typography onClick={() => navigate("/static/cgv")} sx={{ cursor: 'pointer' }}>
                        {t("footer.legal.conditionsVente")}
                    </Typography>
                    <Typography onClick={() => navigate("/static/cgu")} sx={{ cursor: 'pointer' }}>
                        {t("footer.legal.cgu")}
                    </Typography>
                    <Typography onClick={() => navigate("/static/rgpd")} sx={{ cursor: 'pointer' }}>
                        {t("footer.legal.rgpd")}
                    </Typography>
                </Box>

                {/* Liens Menus */}
                <Box sx={{ display: {xs: 'none', md: 'flex'}, gap: 3 }}>
                    <Box onClick={() => navigate("/info")} sx={{ cursor: "pointer" }}>
                        {t("footer.links.infos")}
                    </Box>
                    <Box onClick={() => navigate("/activities")} sx={{ cursor: "pointer" }}>
                        {t("footer.links.activities")}
                    </Box>
                    <Box onClick={() => navigate("/reservations")} sx={{ cursor: "pointer" }}>
                        {t("footer.links.reservations")}
                    </Box>
                    <Box onClick={() => navigate("/info#contact")} sx={{ cursor: "pointer" }}>
                        {t("footer.links.contact")}
                    </Box>
                    <Box onClick={() => navigate("/info#faq")} sx={{ cursor: "pointer" }}>
                        FAQ
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
                    {t("footer.copyright", { year })}
                </Typography>
            </Box>

        </>
    )
}