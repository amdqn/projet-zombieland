import axios from 'axios';
// Fonction générale qui gère la connexion à l'API
// Harmonisation : on accepte VITE_API_URL (docker-compose) ou VITE_API_BASE_URL (ancien nom)
const rawBase =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:3001/api/v1';
// S'assurer que le préfixe /api/v1 est présent (backend Nest le fixe globalement)
const normalizedBase = rawBase.replace(/\/+$/, '');
const hasApiPrefix = /\/api(\/v1)?$/.test(normalizedBase);
const baseURL = hasApiPrefix ? normalizedBase : `${normalizedBase}/api/v1`;
const axiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Intercepteur pour ajouter le token à chaque requête
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Intercepteur pour gérer les erreurs d'authentification
//axiosInstance.interceptors.response.use(
    //(response) => response,
    //(error) => {
        // Si le token est invalide ou expiré (401)
        //if (error.response?.status === 401) {
         //   localStorage.removeItem('token');
          //  localStorage.removeItem('role');
          //  localStorage.removeItem('pseudo');
           // window.location.href = '/login';
        //}
        // return Promise.reject(error);
    //}
// );
export default axiosInstance;