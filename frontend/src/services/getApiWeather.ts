import axios from 'axios';
// Fonction générale de connexion à l'api météo
// docs https://openweathermap.org/current

const baseURL = import.meta.env.VITE_API_WEATHER_URL;
const apiKey = import.meta.env.VITE_API_METEO_KEY;

const getWeather = async (cityName: string) => {
    const res = await axios.get(`${baseURL}/weather?q=${cityName}&lang=fr&units=metric&appid=${apiKey}`);;
    return res.data;
}

export default getWeather;