type TranslationFunction = (key: string) => string;

export const getValidateEmail = (email: string, t?: TranslationFunction): string => {
    if (!email) return t ? t("auth.login.emailRequired") : "L'email est requis";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return t ? t("auth.login.emailInvalid") : "Email invalide";
    return "";
};