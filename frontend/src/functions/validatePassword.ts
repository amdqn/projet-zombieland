type TranslationFunction = (key: string) => string;

export const getValidatePassword = (password: string, t?: TranslationFunction): string => {
    if (!password) return t ? t("auth.login.passwordRequired") : "Le mot de passe est requis";
    if (password.length < 6) return t ? t("auth.login.passwordMinLength") : "Le mot de passe doit contenir au moins 6 caractères";
    return "";
};