import {AppBar, Box, IconButton, Typography} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import logo from "../assets/logo.png";
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function LateralBar() {
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
                gap: 2
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
                <Box>
                    <Typography component="h5" textAlign={"center"}>
                        FR
                    </Typography>
                </Box>
            </Box>

            {/* Icones des réseaux sociaux */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2}}>
                <IconButton sx={{ color: 'white' }}>
                    <YouTubeIcon />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                    <FacebookIcon />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                    <XIcon />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                    <InstagramIcon />
                </IconButton>
            </Box>

            {/* Icone contact */}
            <IconButton sx={{ color: 'white' }}>
                <EmailIcon />
            </IconButton>

        </AppBar>
    )
}