import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../context/UserLoginContext";
import {useNavigate } from "react-router";
import { getProfile } from "../../services/auth";
import {Alert, Box, Container, Typography, Link } from "@mui/material";
import { CustomBreadcrumbs, Input, PrimaryButton } from "../../components/common";
import type {User} from "../../@types/users";
import {colors} from "../../theme";

export default function AccountPage() {

    const { isLogged } = useContext(LoginContext);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // États pour les champs modifiables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');

    const navigate = useNavigate();

    // Récupérer les données user
    const getUserAuth = async () => {
        setIsLoading(true);
        try {
            const response = await getProfile()
            setUser(response)
            // Initialiser les champs avec les données user
            setEmail(response.email || '');

        } catch (error) {
            setError(`Une erreur est survenue : ${error}`)
        } finally {
            setIsLoading(false);
        }
    }

    // Soumettre le formulaire de modification
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            // TODO: Appel API pour mettre à jour le profil
            // await updateProfile({ email, pseudo, password });
            return;
        } catch (error) {
            setError(`Erreur lors de la mise à jour : ${error}`);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isLogged) {
            getUserAuth();
        }
    }, [isLogged]);

    return (
        <Box sx={{ minHeight: '100vh', paddingTop: '80px' }}>
            <Container maxWidth="lg" sx={{ paddingY: 4 }}>
                <CustomBreadcrumbs
                    items={[
                        { label: 'Accueil', path: '/' },
                        { label: 'Mon compte'}
                    ]}
                />

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
                            MON PROFIL
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                                {error}
                            </Alert>
                        )}

                        {/* Champ Pseudo */}
                        <Input
                            label="Pseudo"
                            type="text"
                            placeholder={user?.pseudo}
                            value={user?.pseudo}
                        />

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ width: '100%'}}
                        >
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

                            {/* Bouton de soumission */}
                            <PrimaryButton
                                type="submit"
                                disabled={isLoading}
                                text={isLoading ? "Modification en cours..." : "Sauvegarder les modifications"}
                            />
                        </Box>

                        {/* Bouton retour accueil */}
                        <PrimaryButton
                            onClick={() => navigate('/')}
                            text="Retour à l'accueil"
                        />
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', mt: 10 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Vous n'avez pas accès à cette page si vous n'êtes pas connecté
                        </Typography>
                        <Link
                            onClick={() => navigate('/login')}
                        >
                            Se connecter
                        </Link>
                    </Box>
                )}
            </Container>
        </Box>
    )
}