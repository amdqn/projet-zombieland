import {getParkDates} from "../services/parkDates";

const getTodaySchedule = async () => {
    // Utiliser la date locale pour éviter les problèmes de timezone
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    try {
        // Récupérer les dates du parc depuis l'API

        const parkDates = await getParkDates();

        // Chercher la date correspondant à aujourd'hui
        const todayParkDate = parkDates.find(
            (parkDate) => parkDate.jour === todayString
        );

        if (todayParkDate) {
            return todayParkDate;
        }

        // Si aucune date trouvée, retourner une donnée par défaut (fermé)
        return {
            id: 0,
            jour: todayString,
            open_hour: "",
            close_hour: "",
            is_open: false,
            notes: null,
            created_at: new Date().toISOString()
        };
    } catch (error) {
        // En cas d'erreur, afficher un message d'erreur dans la console'
        console.error("Erreur lors de la récupération des horaires:", error);
        return {
            id: 0,
            jour: todayString,
            open_hour: "",
            close_hour: "",
            is_open: false,
            notes: null,
            created_at: new Date().toISOString()
        };
    }
};

export default getTodaySchedule;