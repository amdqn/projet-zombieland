import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";
import ModalBurgerMenu from "./modals/modalBurgerMenu.tsx";
import {colors} from "../theme";

export default function Header() {

    const [open, setOpen] = useState(false);

    // TODO ajouter ici les autres routes
    const pages = [
        { name : "Réservations", path : "/" },
        { name : "Activités", path : "/activities" },
        { name : "Infos", path : "/" },
    ]

    const navigate = useNavigate()

    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    return (
        <>
            <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent !important'}}>
                <Toolbar disableGutters sx={{
                    justifyContent: 'space-between',
                    alignItems:'center',
                    width: '100%',
                    px: 5,
                    py: 2,
                    pb: 10,
                    pt: 5
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
                        <Typography variant="h2">
                            <Box component="span" sx={{ color: colors.secondaryGreen, fontWeight: 'bold' }}>
                                ZOMBIE
                            </Box>
                            <Box component="span" sx={{ color: 'secondary', fontWeight: 'bold' }}>
                                LAND
                            </Box>
                        </Typography>
                    </Box>

                    {/* Menu burger à droite */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, pr: 5 }}>
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
                    </Box>

                    {/* VUE MOBILE */}
                    <Box sx={{
                        display: { xs: 'flex', md: 'none' },
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ width: 40 }} />
                        <Typography variant="h2">
                            <Box component="span" sx={{ color: colors.secondaryGreen, fontWeight: 'bold' }}>
                                ZOMBIE
                            </Box>
                            <Box component="span" sx={{ color: 'secondary', fontWeight: 'bold' }}>
                                LAND
                            </Box>
                        </Typography>
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
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}