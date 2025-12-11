import {colors} from "../../theme";
import {Alert, Box, Container, Typography, Link} from "@mui/material";
import {CustomBreadcrumbs, Input, PrimaryButton} from "../../components/common";
import {LoginContext} from "../../context/UserLoginContext.tsx";
import {useContext, useState} from "react";
import {login} from "../../services/auth.ts";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {

    // On récupère le context
    const { setIsLogged, isLogged, setRole, setPseudo, setToken, logout} = useContext(LoginContext)
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    // champs du formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // état validation
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [touched, setTouched] = useState({email: false, password: false});

    const navigate = useNavigate();

    // validation email
    const validateEmail = (email: string): string => {
        if (!email) return "L'email est requis";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Email invalide";
        return "";
    };

    // validation mot de passe
    const validatePassword = (password: string): string => {
        if (!password) return "Le mot de passe est requis";
        if (password.length < 6) return "Le mot de passe doit contenir au moins 6 caractères";
        return "";
    };

    // validation formulaire
    const isFormValid = () => {
        return email && password && !validateEmail(email) && !validatePassword(password);
    };

    // soumission formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //validation finale
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);

        setEmailError(emailErr);
        setPasswordError(passwordErr);
        setTouched({email: true, password: true});

        if (emailErr || passwordErr) return;

        setIsLoading(true);
        setLoginError("");

        try {
            // Appel API
            const data = await login(email, password)

            // Stocker dans le context
            setIsLogged(true);
            setRole(data.user.role)
            setPseudo(data.user.pseudo)
            setToken(data.access_token)

            // Stocker dans localStorage pour persistance
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", data.user.role)
            localStorage.setItem("pseudo", data.user.pseudo)

            // Redirection selon le rôle
            navigate(data.user.role === "ADMIN" ? "/admin" : "/");

        } catch (error: any) {
            console.error("Erreur de connexion:", error);

            // Message d'erreur plus précis
            const errorMessage = error.response?.data?.message ||
                "Email ou mot de passe incorrect";

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
                        { label: 'Accueil', path: '/' },
                        { label: 'Se connecter'},
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
                            Vous êtes déjà connecté
                        </Typography>

                        {/* Boutons vu quand connecté */}
                        <PrimaryButton
                            text="Se déconnecter"
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
                            Aller à l'accueil
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
                            Accéder à votre compte
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
                            CONNEXION
                        </Typography>

                        {/* Message d'erreur global */}
                        {loginError && (
                            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                                {loginError}
                            </Alert>
                        )}

                        <Box sx={{ width: '100%'}}>
                            {/* Champ Email */}
                            <Input
                                label="Email"
                                type="email"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (touched.email) {
                                        setEmailError(validateEmail(e.target.value));
                                    }
                                }}
                                onBlur={() => {
                                    setTouched({ ...touched, email: true });
                                    setEmailError(validateEmail(email));
                                }}
                                error={touched.email && !!emailError}
                                helperText={touched.email ? emailError : ''}
                                required
                            />

                            {/* Champ Mot de passe */}
                            <Input
                                label="Mot de passe"
                                type="password"
                                placeholder="Votre mot de passe"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (touched.password) {
                                        setPasswordError(validatePassword(e.target.value));
                                    }
                                }}
                                onBlur={() => {
                                    setTouched({ ...touched, password: true });
                                    setPasswordError(validatePassword(password))
                                }}
                                error={touched.password && !!passwordError}
                                helperText={touched.password ? passwordError : ''}
                                required
                            />

                            {/* Bouton de soumission */}
                            <PrimaryButton
                                type="submit"
                                disabled={!isFormValid() || isLoading}
                                text={isLoading ? "Connexion en cours..." : "Se connecter"}
                            />
                        </Box>

                        {/* Lien vers inscription */}
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body1">
                                Pas encore de compte ?{' '}
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
                                    S'inscrire
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    )
}