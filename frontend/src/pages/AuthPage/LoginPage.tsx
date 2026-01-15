import {colors} from "../../theme";
import {Alert, Box, Container, Typography, Link} from "@mui/material";
import {CustomBreadcrumbs, Input, PrimaryButton} from "../../components/common";
import {LoginContext} from "../../context/UserLoginContext.tsx";
import {useContext, useState} from "react";
import {login} from "../../services/auth.ts";
import {useNavigate, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {getValidateEmail} from "../../functions/validateEmail.ts";
import {getValidatePassword} from "../../functions/validatePassword.ts";

export default function LoginPage() {

    // On récupère le context
    const { setIsLogged, isLogged, setRole, setPseudo, setEmail, setToken, logout} = useContext(LoginContext)
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const { t } = useTranslation();

    // champs du formulaire
    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');

    // état validation
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [touched, setTouched] = useState({email: false, password: false});

    const navigate = useNavigate();
    const location = useLocation();
    const redirectMessage = (location.state as { message?: string } | null)?.message;

    // validation email
    const validateEmail = getValidateEmail(emailInput, t);

    // validation mot de passe
    const validatePassword = getValidatePassword(password, t);

    // validation formulaire
    const isFormValid = () => {
        return emailInput && password && !validateEmail && !validatePassword;
    };

    // soumission formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //validation finale
        const emailErr = validateEmail;
        const passwordErr = validatePassword;

        setEmailError(emailErr);
        setPasswordError(passwordErr);
        setTouched({email: true, password: true});

        if (emailErr || passwordErr) return;

        setIsLoading(true);
        setLoginError("");

        try {
            // Appel API
            const data = await login(emailInput, password)

            // Stocker dans le context
            setIsLogged(true);
            setRole(data.user.role)
            setPseudo(data.user.pseudo)
            setEmail(data.user.email)
            setToken(data.access_token)

            // Stocker dans localStorage pour persistance
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", data.user.role)
            localStorage.setItem("pseudo", data.user.pseudo)
            localStorage.setItem("email", data.user.email)

            // Redirection selon le rôle ou retour à la page précédente
            //const from = (location.state as { from?: string } | null)?.from;
            //navigate(from || (data.user.role === "ADMIN" ? "/admin" : "/"));
            // Redirection selon le rôle
            navigate("/account");

        } catch (error: any) {

            const errorMessage = error.response?.data?.message ||
                t("auth.login.incorrectCredentials");

            setLoginError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    // Fonction de déconnexion corrigée
    const logoutAndNavigate = () => {
        logout();
        navigate("/");
    }

    return(
        <Box sx={{ minHeight: '100vh', backgroundColor: colors.secondaryDark, paddingTop: '80px' }}>
            <Container maxWidth="lg" sx={{ paddingY: 4 }}>
                {/* Breadcrumbs */}
                <CustomBreadcrumbs
                    items={[
                        { label: t("auth.breadcrumbs.home"), path: '/' },
                        { label: t("auth.breadcrumbs.login")},
                    ]}
                />

                {/* Si déjà connecté */}
                {isLogged ? (
                    <Box
                        sx={{
                            mt: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '600px',
                            mx: 'auto',
                            px: 3,
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: "'Lexend Deca', sans-serif",
                                fontWeight: 700,
                                textAlign: 'center',
                                mb: 2,
                            }}
                        >
                            {t("auth.login.alreadyConnected")}
                        </Typography>

                        {/* Boutons vu quand connecté */}
                        <PrimaryButton
                            text={t("auth.login.logout")}
                            onClick={logoutAndNavigate}
                            fullWidth
                        />

                        <Link
                            onClick={() => navigate('/')}
                            underline="none"
                            sx={{
                                fontWeight: 'bold',
                                color: colors.primaryGreen,
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            {t("auth.login.goToHome")}
                        </Link>

                        <Link
                            onClick={() => navigate('/account')}
                            underline="none"
                            sx={{
                                fontWeight: 'bold',
                                color: colors.primaryGreen,
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            {t("auth.login.accessAccount")}
                        </Link>
                    </Box>
                ) : (
                    /* Formulaire de connexion */
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            mt: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '800px',
                            mx: 'auto',
                            px: 3,
                        }}
                    >
                        <Typography
                            sx={{
                                textAlign: 'center',
                                fontFamily: "'Lexend Deca', sans-serif",
                                fontSize: { xs: '0.85rem', md: '1rem' },
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: colors.primaryGreen,
                                letterSpacing: '0.1em',
                                mb: 2,
                            }}
                        >
                            {t("auth.login.title")}
                        </Typography>

                        {/* Message d'erreur global */}
                        {redirectMessage && (
                            <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
                                {t("auth.login.pleaseLogin")}
                            </Alert>
                        )}
                        {loginError && (
                            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                                {loginError}
                            </Alert>
                        )}

                        <Box sx={{ width: '100%'}}>
                            {/* Champ Email */}
                            <Input
                                label={t("auth.login.email")}
                                type="email"
                                placeholder={t("auth.login.emailPlaceholder")}
                                value={emailInput}
                                onChange={(e) => {
                                    setEmailInput(e.target.value);
                                    if (touched.email) {
                                        setEmailError(getValidateEmail(e.target.value, t));
                                    }
                                }}
                                onBlur={() => {
                                    setTouched({ ...touched, email: true });
                                    setEmailError(getValidateEmail(emailInput, t));
                                }}
                                error={touched.email && !!emailError}
                                helperText={touched.email ? emailError : ''}
                                required
                            />

                            {/* Champ Mot de passe */}
                            <Input
                                label={t("auth.login.password")}
                                type="password"
                                placeholder={t("auth.login.passwordPlaceholder")}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (touched.password) {
                                        setPasswordError(getValidatePassword(e.target.value, t));
                                    }
                                }}
                                onBlur={() => {
                                    setTouched({ ...touched, password: true });
                                    setPasswordError(getValidatePassword(password, t))
                                }}
                                error={touched.password && !!passwordError}
                                helperText={touched.password ? passwordError : ''}
                                required
                            />

                            {/* Bouton de soumission */}
                            <PrimaryButton
                                type="submit"
                                disabled={!isFormValid() || isLoading}
                                text={isLoading ? t("auth.login.loginButtonLoading") : t("auth.login.loginButton")}
                            />
                        </Box>

                        {/* Lien vers inscription */}
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body1">
                                {t("auth.login.noAccount")}{' '}
                                <Link
                                    onClick={() => navigate('/register')}
                                    underline="none"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: colors.primaryGreen,
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    {t("auth.login.registerLink")}
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    )
}