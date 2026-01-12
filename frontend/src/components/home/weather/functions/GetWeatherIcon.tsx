import CloudySnowingIcon from '@mui/icons-material/CloudySnowing';
import type {WeatherCondition} from "../types/weatherTypes.ts";
import CloudIcon from '@mui/icons-material/Cloud'
import SunnyIcon from '@mui/icons-material/Sunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import FoggyIcon from '@mui/icons-material/Foggy';
import AirIcon from '@mui/icons-material/Air';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WaterIcon from '@mui/icons-material/Water';

export function getWeatherIcon(condition: WeatherCondition) {
    switch (condition) {
        case 'Clear':
            return <SunnyIcon sx={{ color: '#FFD700', fontSize: '2rem' }} />;

        case 'Clouds':
            return <CloudIcon sx={{ color: '#9E9E9E', fontSize: '2rem' }} />;

        case 'Rain':
        case 'Drizzle':
            return <CloudySnowingIcon sx={{ color: '#2196F3', fontSize: '2rem' }} />;

        case 'Thunderstorm':
            return <ThunderstormIcon sx={{ color: '#FFA726', fontSize: '2rem' }} />;

        case 'Snow':
            return <AcUnitIcon sx={{ color: '#E3F2FD', fontSize: '2rem' }} />;

        case 'Fog':
        case 'Sand':
        case 'Ash':
            return <FoggyIcon sx={{ color: '#BDBDBD', fontSize: '2rem' }} />;

        case 'Squall':
        case 'Tornado':
            return <AirIcon sx={{ color: '#757575', fontSize: '2rem' }} />;

        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
            return <WaterIcon/>;

        default:
            return <HelpOutlineIcon sx={{ color: '#9E9E9E', fontSize: '2rem' }} />;
    }
}