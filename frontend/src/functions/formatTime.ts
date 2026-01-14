// Permet de formater une date en heure correcte
export const formatTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString("fr-FR", {hour: "2-digit", minute: "2-digit"});
}