import {Box, Card, CardContent, Typography} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

export default function AccessCard() {
    return (
    <Card sx={{minWidth: 275, borderRadius: 5, backgroundColor: 'colors.secondaryDark', color: 'white'}}>
        <CardContent>
            <Box sx={{
                paddingBottom: 3,
                textAlign: 'center'
            }}>
                <Typography variant="h5">
                    Accès au parc
                </Typography>
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                paddingBottom: 3
            }}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center', paddingTop: 7}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <LocationOnIcon color="primary" />
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            ZombieLand Park
                        </Typography>
                    </Box>
                    <Typography variant="body1">
                        13 Allée des Ombres Errantes
                    </Typography>
                    <Typography variant="body1">
                        Zone Industrielle Désaffectée
                    </Typography>
                    <Typography variant="body1">
                        75000 Paris, France
                    </Typography>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 2}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <DirectionsCarIcon />
                        <Typography variant="subtitle1">
                            En voiture : Sortie A7 "Zone Contaminée"
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <DirectionsBusIcon />
                        <Typography variant="subtitle1">
                            Bus ligne 13 - Arrêt "Cimetière"
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CardContent>
    </Card>
    )
}