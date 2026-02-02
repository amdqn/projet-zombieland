import {PrimaryButton} from "../common/Button";
import {useNavigate} from "react-router";
import {Box, Typography} from "@mui/material";
import {colors} from "../../theme";
import { useTranslation } from "react-i18next";

export default function VideoBanner() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '500px', md: '650px' },  // ← Plus petit sur mobile
                backgroundColor: 'black'
            }}
        >
            <Box
                component="video"
                autoPlay
                loop
                muted
                playsInline
                src="homepage-images/zombie.mp4"
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    top: { xs: '75%', md: '85%' },
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    textAlign: 'center',
                    zIndex: 3,
                    width: { xs: '90%', md: 'auto' },
                    px: { xs: 2, md: 0 }
                }}
            >
                <Typography variant="h3" sx={{
                    pb: 3,
                    color: colors.secondaryGreen,
                    fontSize: { xs: '1.5rem', md: '2.5rem' }
                }}>
                    {t("home.hero.videoTitle")}
                </Typography>
                <PrimaryButton
                    text={t("home.hero.reserveButton")}
                    textMobile={t("home.hero.reserveButton")}
                    onClick={() => navigate("/reservations")}
                    href={"/reservations"}
                    fullWidth={false}
                />
            </Box>

            {/* Vagues en bas avec background image */}
            <Box
                component="svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '80px',
                    zIndex: 2
                }}
            >
                <defs>
                    <pattern id="img1" patternUnits="userSpaceOnUse" width="1200" height="120">
                        <image href="homepage-images/banniere-zombie.png" x="0" y="0" width="1200" height="120" preserveAspectRatio="xMidYMid slice"/>
                    </pattern>
                </defs>
                <path
                    d="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50 L1200,120 L0,120 Z"
                    fill="url(#img1)"
                />
            </Box>
        </Box>
    );
}