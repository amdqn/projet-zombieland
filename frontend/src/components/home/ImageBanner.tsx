import {Box, Typography} from "@mui/material";
import {useState, useEffect} from "react";
import CircleIcon from '@mui/icons-material/Circle';
import CloudIcon from '@mui/icons-material/Cloud';
import {colors} from "../../theme";
import getTodaySchedule from "../../functions/getTodaySchedule.ts";
import WeatherBackground from "./weather/WeatherBackground";

export default function ImageBanner() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    // Météo en dur
    const weather = {
        city: "Zombieland",
        temperature: 12,
        condition: "pluvieux",
        icon: "🌧️"
    };

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const schedule = await getTodaySchedule();
                setIsOpen(schedule.isOpen);
            } catch (error) {
                console.error("Erreur lors de la récupération des horaires:", error);
                setIsOpen(false);
            }
        };
        fetchSchedule();
    }, []);

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '400px',
                backgroundColor: 'black',
                overflow: 'hidden'
            }}
        >
            <Box
                component="img"
                src="homepage-images/banniere-zombie.png"
                alt="Bannière zombie"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1
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
                    zIndex: 3
                }}
            >
                <Typography variant="h5" sx={{pb: 3, pt: { xs: 13, md: 0 }}}>
                    Survivrez-vous au parc post-apocalyptique ? Réservez votre séjour
                    et venez affronter vos peurs au cœur de ZombieLand !
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CircleIcon sx={{ color: isOpen ? colors.primaryGreen : colors.primaryRed, fontSize: '1rem' }}/>
                    <Typography variant="h6">
                        Aujourd'hui, le parc est {isOpen ? "ouvert" : "fermé"}.
                    </Typography>
                </Box>
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1.5,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '20px 40px',
                    borderRadius: '12px',
                    backdropFilter: 'blur(4px)',
                    overflow: 'hidden',
                    minWidth: '350px',
                    minHeight: '100px'
                }}>
                    {/* Animation météo dans le conteneur */}
                    <WeatherBackground weather={weather} />

                    <CloudIcon sx={{ fontSize: '1.5rem', color: colors.secondaryGrey, zIndex: 2, position: 'relative' }} />
                    <Typography variant="h6" sx={{ fontSize: '1rem', zIndex: 2, position: 'relative' }}>
                        {weather.city} - {weather.temperature}°C - {weather.condition}
                    </Typography>
                    <Typography sx={{ fontSize: '1.5rem', zIndex: 2, position: 'relative' }}>
                        {weather.icon}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}