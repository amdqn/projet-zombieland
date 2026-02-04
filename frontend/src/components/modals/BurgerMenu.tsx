import {Box, Button, IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import logo from "../../assets/logo.webp"
import sang from "../../assets/tache-sang.webp";
import {useNavigate} from "react-router";
import {useContext} from "react";
import {LoginContext} from "../../context/UserLoginContext.tsx";
import {PrimaryButton} from "../common";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme";
import {AnimatePresence, motion} from "framer-motion";

interface ModalBurgerMenuProps {
    open: boolean;
    onClose: () => void;
}

export default function ModalBurgerMenu({ open, onClose }: ModalBurgerMenuProps) {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language?.split('-')[0] || 'fr';

    const { isLogged, logout } = useContext(LoginContext);

    const navigate = useNavigate();

    const navigateActivitiesTab = (hash: string) => {
        onClose();
        setTimeout(() => {
            navigate(`/activities${hash}`);
        }, 300);
    };

    const navigateLoginPage = () => {
        navigate('/login');
        setTimeout(onClose, 50);
    }

    const navigateAfterLogout = () => {
        logout();
        navigate('/');
        setTimeout(onClose, 50);
    }

    const navigateActivitiesPage = () => navigateActivitiesTab('#activities')
    const navigateAttractionsPage = () => navigateActivitiesTab('#attractions')
    const navigateRestaurantPage = () => navigateActivitiesTab('#restaurants')

    const navigateInfoPagePrices = () => {
        onClose();
        setTimeout(() => {
            navigate('/info#prices');
        }, 300);
    }

    const navigateReservationPage = () => {
        navigate('/reservations');
        setTimeout(onClose, 50);
    }

    const navigateInfoPageAccessibility = () => {
        onClose();
        setTimeout(() => {
            navigate('/info#accessibility');
        }, 300);
    }

    const navigateInfoPageSchedules = () => {
        onClose();
        setTimeout(() => {
            navigate('/info#schedules');
        }, 300);
    }

    const navigateInfoPageContact = () => {
        onClose();
        setTimeout(() => {
            navigate('/info#contact');
        }, 300);
    }

    const navigateInfoPage = () => {
        navigate('/info');
        setTimeout(onClose, 50);
    }

    const navigateProfilPage = () => {
        navigate('/account');
        setTimeout(onClose, 50);
    }

    return (
        <AnimatePresence mode="wait">
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1300,
                    }}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            zIndex: -1,
                        }}
                    />
                        {/* Modale principale */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                duration: 0.5,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                backgroundColor: '#10130C',
                                overflowY: 'auto',
                            }}
                        >
                            {/* Images absolute */}
                            <Box sx={{ display: { xs: 'block', md: 'block'} }}>
                                {/* Image en haut à droite */}
                                <Box
                                    component="img"
                                    src={sang}
                                    alt="Tâche de sang"
                                    sx={{
                                        position: 'absolute',
                                        top: -40,
                                        right: -30,
                                        width: 500,
                                        height: 'auto',
                                        zIndex: 1
                                    }}
                                />

                                {/* Image en bas à gauche */}
                                <Box
                                    component="img"
                                    src={sang}
                                    alt="Tache de sang"
                                    sx={{
                                        position: 'absolute',
                                        bottom:350,
                                        left: -200,
                                        width: 700,
                                        height: 'auto',
                                        zIndex: 1,
                                        transform: 'rotate(-90deg)'
                                    }}
                                />
                            </Box>

                            {/* VUE DESKTOP */}
                            <Box sx={{
                                display: {xs: 'none', md: 'flex'},
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                px: 5,
                                py: 15,
                            }}>
                                <PrimaryButton
                                text={isLogged ? t("common.logout") : t("common.login")}
                                textMobile={isLogged ? t("common.logout") : t("common.login")}
                                onClick={isLogged ? navigateAfterLogout : navigateLoginPage}
                                href={"/login"}
                                fullWidth={false}/>
                                {/* Croix de fermeture en position absolute (Desktop) */}
                                <IconButton
                                    sx={{
                                        color: 'white',
                                        zIndex: 2,
                                        position: 'absolute',
                                        right: 40,
                                        top: 16,
                                        display: { xs: 'none', md: 'flex' }
                                    }}
                                    onClick={onClose}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <Box sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: 6,
                                    py: 4
                                }}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            zIndex: 2
                                        }}>
                                            <Typography variant="h3" color="white" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                {t("home.experiences.title")}
                                            </Typography>
                                            <Button sx={{ color: "white" }} onClick={navigateActivitiesPage}>
                                                {t("home.experiences.activities")}
                                            </Button>
                                            <Button sx={{ color: "white" }} onClick={navigateAttractionsPage}>
                                                {t("home.experiences.attractions")}
                                            </Button>
                                            <Button sx={{ color: "white" }} onClick={navigateRestaurantPage}>
                                                {t("home.experiences.restaurants")}
                                            </Button>
                                        </Box>

                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="h3" color="white" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                {t("home.ticketing.title")}
                                            </Typography>
                                            <Button sx={{ color: "white" }} onClick={navigateInfoPagePrices}>
                                                {t("home.ticketing.prices")}
                                            </Button>
                                            <Button sx={{ color: "white" }} onClick={navigateReservationPage}>
                                                {t("home.ticketing.reservation")}
                                            </Button>
                                        </Box>

                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="h3" color="white" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                {t("home.information.title")}
                                            </Typography>
                                            <Button sx={{ color: "white" }} onClick={navigateInfoPageAccessibility}>
                                                {t("home.information.accessibility")}
                                            </Button>
                                            <Button sx={{ color: "white" }} onClick={navigateInfoPageSchedules}>
                                                {t("home.information.schedule")}
                                            </Button>
                                            <Button sx={{ color: "white" }} onClick={navigateInfoPageContact}>
                                                {t("home.information.contact")}
                                            </Button>
                                        </Box>
                                </Box>
                            </Box>

                            {/* VUE MOBILE */}
                            <Box sx={{
                                display: { xs: 'flex', md: 'none', zIndex: 2 },
                                width: '100%',
                                flexDirection: "column",
                                justifyContent: 'space-between',
                                alignItems: 'center'
                                }}
                            >
                                <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <Box
                                        component="img"
                                        src={logo}
                                        alt="Logo"
                                        sx={{
                                            height: { xs: 60, md: 90 },
                                            width: 'auto',
                                            zIndex: 2,
                                        }}
                                    />
                                    <Box />
                                </Box>
                                    <IconButton
                                        sx={{
                                            color: 'white',
                                            zIndex: 2,
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            display: { xs: 'flex', md: 'none' }
                                        }}
                                        onClick={onClose}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <Box sx={{
                                        display: { xs: 'flex', md: 'none' },
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: 4,
                                        minHeight: 'calc(60vh - 100px)',
                                        py: 4,
                                        }}
                                    >
                                        <Button sx={{
                                            color: "white",
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            zIndex: 2
                                        }}
                                            onClick={navigateActivitiesPage}
                                        >
                                            {t("navigation.activities").toUpperCase()}
                                        </Button>
                                        <Button sx={{
                                            color: "white",
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            zIndex: 2
                                        }}
                                                onClick={navigateReservationPage}
                                        >
                                            {t("navigation.reservations").toUpperCase()}
                                        </Button>
                                        <Button sx={{
                                            color: "white",
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            zIndex: 2
                                        }}
                                                onClick={navigateProfilPage}
                                        >
                                            {t("navigation.account").toUpperCase()}
                                        </Button>
                                        <Button sx={{
                                            color: "white",
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            zIndex: 2
                                        }}
                                                onClick={navigateInfoPage}
                                        >
                                            {t("navigation.info").toUpperCase()}
                                        </Button>
                                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', zIndex: 2, mb: 2 }}>
                                                <Typography
                                                    component="button"
                                                    onClick={() => i18n.changeLanguage('fr')}
                                                    sx={{
                                                        border: 'none',
                                                        background: 'none',
                                                        cursor: 'pointer',
                                                        fontWeight: currentLang === 'fr' ? 'bold' : 'normal',
                                                        color: currentLang === 'fr' ? colors.primaryGreen : 'grey',
                                                        font: 'inherit',
                                                        padding: 0,
                                                        fontSize: '1rem',
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
                                                        font: 'inherit',
                                                        padding: 0,
                                                        fontSize: '1rem',
                                                        '&:hover': { color: colors.primaryGreen },
                                                    }}
                                                >
                                                    EN
                                                </Typography>
                                            </Box>
                                            <Box sx={{ mt: 4, display: {xs: 'flex', md: 'none', zIndex: 2}}}>
                                                <PrimaryButton
                                                    text={isLogged ? t("common.logout") : t("common.login")}
                                                    textMobile={isLogged ? t("common.logout") : t("common.login")}
                                                    onClick={isLogged ? navigateAfterLogout : navigateLoginPage}
                                                    href={"/login"}
                                                    fullWidth={false}/>
                                            </Box>
                                        </Box>
                            </Box>
                        </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}