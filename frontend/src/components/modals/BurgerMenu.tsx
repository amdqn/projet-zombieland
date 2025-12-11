import {Box, Button, IconButton, Modal, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import logo from "../../assets/logo.png"
import sang from "../../assets/tache-sang.png";
import {useNavigate} from "react-router";
import {useContext} from "react";
import {LoginContext} from "../../context/UserLoginContext.tsx";
import {PrimaryButton} from "../common";

interface ModalBurgerMenuProps {
    open: boolean;
    onClose: () => void;
}

export default function ModalBurgerMenu({ open, onClose }: ModalBurgerMenuProps) {

    const fullScreenStyle = {
        position: 'absolute' as 'absolute',
        backgroundColor: '#10130C',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
    }

    const { isLogged, logout } = useContext(LoginContext);

    const navigate = useNavigate();

    const navigateLoginPage = () => {
        navigate('/login');
        setTimeout(onClose, 50);
    }

    const navigateAfterLogout = () => {
        logout();
        navigate('/');
        setTimeout(onClose, 50);
    }

    const navigateActivitiesPage = () => {
        navigate('/activities');
        setTimeout(onClose, 50);
    }

    const navigateReservationPage = () => {
        navigate('/reservations');
        setTimeout(onClose, 50);
    }

    const navigateInfoPage = () => {
        navigate('/info');
        setTimeout(onClose, 50);
    }


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={fullScreenStyle}>
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

                <Box sx={{
                    display: {xs: 'none', md: 'flex'},
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: 5,
                    py: 2,
                }}>
                    <PrimaryButton
                    text={isLogged ? "Se deconnecter" : "Connexion"}
                    textMobile={isLogged ? "Se deconnecter" : "Connexion"}
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

                    {/* Vue Mobile */}
                    <Box sx={{
                        display: { xs: 'flex', md: 'none', zIndex: 2 },
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Box />
                        <IconButton
                            sx={{
                                color: 'white',
                                zIndex: 2,
                                pr: 4,
                                p: 1
                            }}
                            onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

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

                {/* Contenu de la modal Desktop */}
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
                            EXPERIENCES
                        </Typography>
                        <Button sx={{ color: "white" }} onClick={navigateActivitiesPage}>
                            Activités
                        </Button>
                        <Button sx={{ color: "white" }} onClick={navigateActivitiesPage}>
                            Attractions
                        </Button>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h3" color="white" sx={{ mb: 2, fontWeight: 'bold' }}>
                            BILLETTERIE
                        </Typography>
                        <Button sx={{ color: "white" }} onClick={navigateReservationPage}>
                            Tarifs
                        </Button>
                        <Button sx={{ color: "white" }} onClick={navigateReservationPage}>
                            Réservation
                        </Button>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h3" color="white" sx={{ mb: 2, fontWeight: 'bold' }}>
                            INFORMATIONS
                        </Typography>
                        <Button sx={{ color: "white" }} onClick={navigateInfoPage}>
                            Accessibilité du parc
                        </Button>
                        <Button sx={{ color: "white" }} onClick={navigateInfoPage}>
                            Horaires
                        </Button>
                        <Button sx={{ color: "white" }} onClick={navigateInfoPage}>
                            Contact
                        </Button>
                    </Box>
                </Box>

                {/* Contenu de la modal Mobile */}
                {/* Croix Mobile uniquement */}
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
                }}>
                    <Button sx={{
                        color: "white",
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        zIndex: 2
                    }}
                        onClick={navigateActivitiesPage}
                    >
                        ACTIVITÉS
                    </Button>

                    <Button sx={{
                        color: "white",
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        zIndex: 2
                    }}
                            onClick={navigateReservationPage}
                    >
                        RESERVATION
                    </Button>

                    <Button sx={{
                        color: "white",
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        zIndex: 2
                    }}
                            onClick={navigateInfoPage}
                    >
                        INFORMATIONS
                    </Button>
                    <Box sx={{ mt: 4, display: {xs: 'flex', md: 'none', zIndex: 2}}}>
                        <PrimaryButton
                            text={isLogged ? "Se deconnecter" : "Connexion"}
                            textMobile={isLogged ? "Se deconnecter" : "Connexion"}
                            onClick={isLogged ? navigateAfterLogout : navigateLoginPage}
                            href={"/login"}
                            fullWidth={false}/>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}