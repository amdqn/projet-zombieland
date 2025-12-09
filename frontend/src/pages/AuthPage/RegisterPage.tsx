import {colors} from "../../theme";
import {Alert, Box, Container, Typography, Link} from "@mui/material";
import {CustomBreadcrumbs, Input, PrimaryButton} from "../../components/common";
import {type FormEvent, useState} from "react";
import {register} from "../../services/auth.ts";
import {useNavigate} from "react-router-dom";

export default function RegisterPage() {

    const [isLoading, setIsLoading] = useState(false);
    const [registerError, setRegisterError] = useState("");

    // champs du formulaire
    const [email, setEmail] = useState('');
    const [newPseudo, setNewPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // état validation
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [newPseudoError, setNewPseudoError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [touched, setTouched] = useState({
        email: false,
        password: false,
        confirmPassword: false,
        newPseudo: false
    });

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

    // validation second mot de passe
    const validateConfirmPassword = (confirmPassword: string): string => {
        if (!confirmPassword) return "La confirmation du mot de passe est requise";
        if (confirmPassword !== password) return "Les mots de passe ne correspondent pas";
        return "";
    }

    // validation nouveau pseudo
    const validateNewPseudo = (newPseudo: string): string => {
        if(!newPseudo) return "Le pseudo est requis";
        if (newPseudo.length < 3) return "Le pseudo doit contenir au moins 3 caractères";
        if (newPseudo.length > 10) return "Le pseudo est trop long (max 10 caractères)";
        const pseudoRegex = /^[a-zA-Z0-9]+$/;
        if (!pseudoRegex.test(newPseudo)) return "Le pseudo ne peut contenir que des lettres et des chiffres";
        return "";
    }

    // validation formulaire
    const isFormValid = () => {
        return email &&
            password &&
            confirmPassword &&
            newPseudo &&
            !validateEmail(email) &&
            !validatePassword(password) &&
            !validateConfirmPassword(confirmPassword) &&
            !validateNewPseudo(newPseudo);
    };

    // soumission formulaire
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        //validation finale
        const emailErr = validateEmail(email);
        const newPseudoErr = validateNewPseudo(newPseudo);
        const passwordErr = validatePassword(password);
        const confirmPasswordErr = validateConfirmPassword(confirmPassword);

        setEmailError(emailErr);
        setPasswordError(passwordErr);
        setConfirmPasswordError(confirmPasswordErr);
        setNewPseudoError(newPseudoErr);
        setTouched({
            email: true,
            password: true,
            confirmPassword: true,
            newPseudo: true
        });

        if (emailErr || passwordErr || confirmPasswordErr || newPseudoErr) return;

        setIsLoading(true);
        setRegisterError("");

        try {
            // Appel API - Le backend retourne status 201 si succès
            await register(email, newPseudo, password, confirmPassword);

            // ✅ Inscription réussie (status 201) → Redirection vers page de succès
            navigate('/register/success');

        } catch (error: any) {
            console.error("Erreur d'inscription:", error);

            // Afficher le message d'erreur du backend
            const errorMessage = error.response?.data?.message ||
                "Erreur lors de l'inscription. Email déjà utilisé ?";

            setRegisterError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <Box sx={{ minHeight: '100vh', backgroundColor: colors.secondaryDark, paddingTop: '80px' }}>
            <Container maxWidth="lg" sx={{ paddingY: 4 }}>
                {/* Breadcrumbs */}
                <CustomBreadcrumbs
                    items={[
                        { label: 'Accueil', path: '/' },
                        { label: 'Se connecter', path: '/login'},
                        { label: "S'inscrire"},
                    ]}
                />

                {/* Formulaire d'inscription */}
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
                        INSCRIPTION
                    </Typography>

                    {/* Message d'erreur global */}
                    {registerError && (
                        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                            {registerError}
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

                        {/* Champ Pseudo */}
                        <Input
                            label="Pseudo"
                            type="text"
                            placeholder="Votre pseudo"
                            value={newPseudo}
                            onChange={(e) => {
                                setNewPseudo(e.target.value);
                                if (touched.newPseudo) {
                                    setNewPseudoError(validateNewPseudo(e.target.value));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, newPseudo: true });
                                setNewPseudoError(validateNewPseudo(newPseudo));
                            }}
                            error={touched.newPseudo && !!newPseudoError}
                            helperText={touched.newPseudo ? newPseudoError : ''}
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
                                if (touched.confirmPassword && confirmPassword) {
                                    setConfirmPasswordError(validateConfirmPassword(confirmPassword));
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

                        {/* Champ confirmation de Mot de passe */}
                        <Input
                            label="Confirmation du mot de passe"
                            type="password"
                            placeholder="Confirmer votre mot de passe"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (touched.confirmPassword) {
                                    setConfirmPasswordError(validateConfirmPassword(e.target.value));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, confirmPassword: true });
                                setConfirmPasswordError(validateConfirmPassword(confirmPassword))
                            }}
                            error={touched.confirmPassword && !!confirmPasswordError}
                            helperText={touched.confirmPassword ? confirmPasswordError : ''}
                            required
                        />

                        {/* Bouton de soumission */}
                        <PrimaryButton
                            type="submit"
                            disabled={!isFormValid() || isLoading}
                            text={isLoading ? "Inscription en cours..." : "S'inscrire"}
                        />
                    </Box>

                    {/* Lien vers connexion */}
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body1">
                            Déjà un compte ?{' '}
                            <Link
                                onClick={() => navigate('/login')   }
                                  style={{
                                      fontWeight: 'bold',
                                      color: colors.primaryGreen,
                                      textDecoration: 'none'
                                  }}>
                                Se connecter
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}