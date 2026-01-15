import {Box, Typography} from "@mui/material";
import {useState, useEffect} from "react";
import CircleIcon from '@mui/icons-material/Circle';
import {colors} from "../../theme";
import getTodaySchedule from "../../functions/getTodaySchedule.ts";
import getWeather from "../../services/getApiWeather.ts";
import WeatherBackground from "./weather/functions/WeatherBackground.tsx";
import type {WeatherCondition} from "./weather/types/weatherTypes.ts";
import {getWeatherIcon} from "./weather/functions/GetWeatherIcon.tsx";
import {formatWeather} from "../../functions/formatWeather.ts";

export default function ImageBanner() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [weather, setWeather] = useState<any>(null);
    const [errorWeather, setErrorWeather] = useState<any>(null);

    // Correspond aux données de Paris
    const cityName = "Paris";

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const schedule = await getTodaySchedule();
                setIsOpen(schedule.is_open);
            } catch (error) {
                console.error("Erreur lors de la récupération des horaires:", error);
                setIsOpen(false);
            }
        };

        // On récupère les données météos
        const fetchWeatherApi = async (cityName: string) => {
            try {
                const response = await getWeather(cityName);
                setWeather(response);
                setErrorWeather(null)
            } catch (error) {
                setErrorWeather("Erreur lors de la récupération des données météo : " + error);
            }
        }

        fetchSchedule();
        fetchWeatherApi(cityName);

    }, []);

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '400px', md: '300px' },
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
                    top: { xs: '30%', md: '50%' },
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
                    {errorWeather && <Typography sx={{ color: colors.secondaryRed }}>{errorWeather}</Typography>}
                    {/* Animation météo dans le conteneur */}
                    {weather && <WeatherBackground weather={weather}/>}
                    <Box sx={{ zIndex: 2, position: 'relative', display: 'flex', alignItems: 'center' }}>
                        {weather && getWeatherIcon(weather.weather[0].main as WeatherCondition)}
                    </Box>
                    <Typography variant="h6" sx={{ fontSize: '1rem', zIndex: 2, position: 'relative', color: "black" }}>
                        {weather?.name}, {formatWeather(weather?.main.temp)}°C, {weather?.weather[0].description}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}