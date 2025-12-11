import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../context/UserLoginContext";
import {useNavigate } from "react-router";
import { getProfile } from "../../services/auth";
import {Alert, Box, Container, Typography, Link } from "@mui/material";
import { CustomBreadcrumbs, PrimaryButton } from "../../components/common";
import type {User} from "../../@types/users";
import {colors} from "../../theme";
import UserCard from "../../components/cards/UserCard.tsx";

export default function AccountPage() {

    const { isLogged, logout } = useContext(LoginContext);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Récupérer les données user
    const getUserAuth = async () => {
        setIsLoading(true);
        try {
            const response = await getProfile()
            console.log(`response : ${response}`);
            setUser(response)
            // Initialiser les champs avec les données user
            //setEmail(response.email || '');

        } catch (error) {
            setError(`Une erreur est survenue : ${error}`)
        } finally {
            setIsLoading(false);
        }
    }

    // Fonction de rafraîchissement pour la modale
    const handleUserUpdate = async () => {
        console.log('Rafraîchissement du profil après modification...');
        await getUserAuth();
    };

    const logoutAndNavigate = () => {
        logout();
        navigate("/");
    }

    useEffect(() => {
        if (isLogged) {
            getUserAuth();
            console.log(user);
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

                        {/* Loader pendant le chargement */}
                        {isLoading ? (
                            <Typography>Chargement du profil...</Typography>
                        ) : user ? (
                            <>
                                {/* Carte - Afficher seulement si user n'est pas null */}
                                <Box paddingBottom={5}>
                                    <UserCard user={user}  onUpdate={handleUserUpdate} />
                                </Box>

                                {user.role == "CLIENT" ? <PrimaryButton onClick={() => navigate('/')} text={"Mes réservations"} /> : ""}
                                {user.role == "ADMIN" ? <PrimaryButton onClick={() => navigate('/')}  text={"Back-Office"} /> : ""}
                                <PrimaryButton onClick={logoutAndNavigate}  text={"Se déconnecter"} />
                            </>
                        ) : (
                            <Typography>Impossible de charger les données du profil</Typography>
                        )}
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