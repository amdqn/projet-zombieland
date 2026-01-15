import {AppBar, Box, Button, IconButton, Toolbar, Typography, Link} from "@mui/material";
import {useNavigate} from "react-router";
import MenuIcon from '@mui/icons-material/Menu';
import {useContext, useEffect, useState} from "react";
import ModalBurgerMenu from "../modals/BurgerMenu";
import {colors} from "../../theme";
import {LoginContext} from "../../context/UserLoginContext.tsx";

export default function Header() {

    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // TODO ajouter ici les autres routes
    const pages = [
        { name : "Réservations", path : "/reservations" },
        { name : "Activités", path : "/activities" },
        { name : "Infos", path : "/info" },
    ]

    const { isLogged, pseudo } = useContext(LoginContext);

    const navigate = useNavigate()

    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    useEffect(()=> {
        const handleScroll = () => {
            // Calcule 50% de la hauteur de la fenêtre
            const scrollThreshold = window.innerHeight * 0.5;

            // Vérifie si on a dépassé ce seuil
            if (window.scrollY > scrollThreshold){
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        };

        // Ajouter l'évenement
        window.addEventListener("scroll", handleScroll);

        // Nettoie l'écouteur lors du démontage du composant
        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    return (
        <>
            <AppBar position="fixed" elevation={0} sx={{
                backgroundColor: scrolled ? colors.secondaryDark : 'transparent',
            }}>
                <Toolbar disableGutters sx={{
                    justifyContent: 'space-between',
                    alignItems:'center',
                    width: '100%',
                    px: 5,
                    py: 2,
                    pb: 1,
                    pt: 1
                }}>
                    {/* VUE DESKTOP */}
                    {/* Pages à gauche */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }}}>
                        {pages.map((page) => (
                            <Button
                                key={page.path}
                                sx={{ color: "white" }}
                                onClick={() => navigate(page.path)}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/* Titre au centre */}
                    <Box sx={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: { xs: 'none', md: 'block' }
                    }}>
                        <Typography variant="h2" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
                            <Box component="span" sx={{ color: colors.secondaryGreen, fontWeight: 'bold' }}>
                                ZOMBIE
                            </Box>
                            <Box component="span" sx={{ color: 'secondary', fontWeight: 'bold' }}>
                                LAND
                            </Box>
                        </Typography>
                    </Box>
                    { isLogged ? (
                        <Box sx={{
                            position: 'absolute',
                            left: '80%',
                            transform: 'translateX(-50%)',
                            display: { xs: 'none', md: 'block' }
                        }}>
                            <Typography>
                                Bienvenue{' '}
                                <Link
                                    component="button"
                                    onClick={() => navigate('/account')}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    {pseudo}
                                </Link>
                            </Typography>
                        </Box>
                        ):""}

                    {/* Menu burger à droite */}
                    <IconButton
                        sx={{
                            color: 'white',
                            position: 'absolute',
                            right: 40,
                            display: { xs: 'none', md: 'flex' }
                        }}
                        onClick={handleOpen}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* VUE MOBILE */}
                    <Box sx={{
                        display: { xs: 'flex', md: 'none' },
                        width: '100%',
                        justifyContent: 'space-between',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ width: 40 }} />
                        <Typography variant="h2" onClick={() => navigate("/")}>
                            <Box component="span" sx={{ color: colors.secondaryGreen, fontWeight: 'bold' }}>
                                ZOMBIE
                            </Box>
                            <Box component="span" sx={{ color: 'secondary', fontWeight: 'bold' }}>
                                LAND
                            </Box>
                        </Typography>
                        { isLogged ? (
                            <Box sx={{
                                display: { xs: 'block', md: 'none' }
                            }}>
                                <Typography>
                                    Bienvenue{' '}
                                    <Link
                                        component="button"
                                        onClick={() => navigate('/account')}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {pseudo}
                                    </Link>
                                </Typography>
                            </Box>
                        ):""}
                    </Box>
                    <IconButton
                        sx={{ color: 'white' }}
                        onClick={handleOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <ModalBurgerMenu
                        open={open}
                        onClose={handleClose}
                    />
                </Toolbar>
            </AppBar>
        </>
    )
}