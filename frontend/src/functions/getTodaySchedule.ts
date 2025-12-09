import {scheduleData} from "../mocks/schedule.ts";


const getTodaySchedule = () => {
    const today = new Date();

    // Fonction pour comparer uniquement les dates (sans l'heure)
    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    // Chercher l'horaire correspondant au jour d'aujourd'hui
    const foundSchedule = scheduleData.horaires.find((horaire) => {
        return isSameDay(new Date(horaire.jour), today);
    });

    // Si trouvé, retourner l'horaire, sinon retourner une donnée par défaut
    if (foundSchedule) {
        return foundSchedule;
    }

    // Donnée banale pour aujourd'hui si aucun horaire n'existe
    return {
        id: 0,
        jour: today,
        open_hour: today,
        close_hour: today,
        is_open: false,
        notes: "",
        created_at: today
    };
};

export default getTodaySchedule;