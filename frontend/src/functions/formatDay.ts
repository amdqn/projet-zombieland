// Permet de formater une date en jour complet lisible
export const formatDay = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long", year: "numeric"});
}

