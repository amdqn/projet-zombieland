export const getValidateEmail = (email: string): string => {
    if (!email) return "L'email est requis";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email invalide";
    return "";
};