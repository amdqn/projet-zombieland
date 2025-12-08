import {Box, Typography} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import {useState} from "react";
import {colors} from "../../theme";

export default function ImageBanniere() {

    // Permet de gérer l'ouverture/fermeture du parc
    const [ isOpen, setIsOpen ] = useState<boolean>(true)

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '400px',
                backgroundColor: 'black'
            }}
        >
            <Box
                component="img"
                src="homepage-images/banniere-zombie.png"
                alt="Bannière zombie"
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    textAlign: 'center',
                    zIndex: 1
                }}
            >
                <Typography variant="h5" sx={{pb: 3, pt: { xs: 13, md: 0 }}}>
                    Survivrez-vous au parc post-apocalyptique ? Réservez votre séjour
                    et venez affronter vos peurs au cœur de ZombieLand !
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                    <CircleIcon sx={{ color: isOpen ? colors.primaryGreen : colors.primaryRed, fontSize: '1rem' }}/>
                    <Typography variant="h6">
                        Aujourd'hui, le parc est {isOpen ? "ouvert" : "fermé"}.
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h6">
                        Météo :
                        {/* API METEO */}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}