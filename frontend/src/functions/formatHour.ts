// Permet de retirer les secondes des heures affichées sur l'application
const formatHour = (hour: string) => hour.substring(0, 5);

export default formatHour;