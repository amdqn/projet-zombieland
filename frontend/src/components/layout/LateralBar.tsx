import {AppBar, Box, IconButton, Typography} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import logo from "../../assets/logo.png";
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useTranslation } from "react-i18next";
import { colors } from "../../theme";
import {useNavigate} from "react-router";

export default function LateralBar() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language?.split('-')[0] || 'fr';
    const navigate = useNavigate();

    return (
        <AppBar
            position="fixed"
            sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                width: 80,
                alignItems: 'center',
                justifyContent: 'space-between',
                left: 10,
                right: 'auto',
                top: 90,
                bottom: 80,
                borderRadius: 5,
                py: 2,
                gap: 2,
                background: 'black',
            }}
        >
            {/* Logo et selecteur de langue */}
            <Box>
                <Box
                    component="img"
                    src={logo}
                    alt="Logo"
                    sx={{
                        height: { md: 60 },
                        borderRadius: 5,
                        width: 'auto',
                        zIndex: 2,
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        gap: 0.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 1,
                    }}
                >
                    <Typography
                        component="button"
                        onClick={() => i18n.changeLanguage('fr')}
                        sx={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: currentLang === 'fr' ? 'bold' : 'normal',
                            color: currentLang === 'fr' ? colors.primaryGreen : 'grey',
                            transition: 'all 0.2s',
                            font: 'inherit',
                            padding: 0,
                            '&:hover': { color: colors.primaryGreen },
                        }}
                    >
                        FR
                    </Typography>
                    <Typography component="span" sx={{ color: 'grey' }}>|</Typography>
                    <Typography
                        component="button"
                        onClick={() => i18n.changeLanguage('en')}
                        sx={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: currentLang === 'en' ? 'bold' : 'normal',
                            color: currentLang === 'en' ? colors.primaryGreen : 'grey',
                            transition: 'all 0.2s',
                            font: 'inherit',
                            padding: 0,
                            '&:hover': { color: colors.primaryGreen },
                        }}
                    >
                        EN
                    </Typography>
                </Box>
            </Box>

            {/* Icones des réseaux sociaux */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2}}>
                <IconButton sx={{ color: 'white' }} onClick={() => window.open('https://youtube.com/', '_blank', 'noopener,noreferrer')}>
                    <YouTubeIcon />
                </IconButton>
                <IconButton sx={{ color: 'white' }} onClick={() => window.open('https://facebook.com/', '_blank', 'noopener,noreferrer')}>
                    <FacebookIcon />
                </IconButton>
                <IconButton sx={{ color: 'white' }} onClick={() => window.open('https://x.com/', '_blank', 'noopener,noreferrer')}>
                    <XIcon />
                </IconButton>
                <IconButton sx={{ color: 'white' }} onClick={() => window.open('https://instagram.com/', '_blank', 'noopener,noreferrer')}>
                    <InstagramIcon />
                </IconButton>
            </Box>

            {/* Icone contact */}
            <IconButton
                sx={{ color: 'white' }}
                onClick={() => navigate("/info#contact")}
            >
                <EmailIcon />
            </IconButton>

        </AppBar>
    )
}