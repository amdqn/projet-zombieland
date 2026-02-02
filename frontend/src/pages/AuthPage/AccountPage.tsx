import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../context/UserLoginContext";
import {useNavigate } from "react-router";
import { getProfile } from "../../services/auth";
import {Alert, Box, Container, Typography, Link } from "@mui/material";
import { CustomBreadcrumbs, PrimaryButton } from "../../components/common";
import type {User} from "../../@types/users";
import {colors} from "../../theme";
import UserCard from "../../components/cards/UserCard.tsx";
import {useTranslation} from "react-i18next";

export default function AccountPage() {

    const { t } = useTranslation();
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
            setUser(response)
            // Initialiser les champs avec les données user
            //setEmail(response.email || '');

        } catch (error) {
            setError(`${t("auth.account.page.error")} ${error}`)
        } finally {
            setIsLoading(false);
        }
    }

    // Fonction de rafraîchissement pour la modale
    const handleUserUpdate = async () => {
        await getUserAuth();
    };

    const logoutAndNavigate = () => {
        logout();
        navigate("/");
    }

    useEffect(() => {
        if (isLogged) {
            getUserAuth();
        }
    }, [isLogged]);

    return (
        <Box sx={{ minHeight: '100vh'}}>
            <Container maxWidth="lg">
                <CustomBreadcrumbs
                    items={[
                        { label: t("auth.account.page.breadcrumbs.home"), path: '/' },
                        { label: t("auth.account.page.breadcrumbs.account")}
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
                            {t("auth.account.page.title")}
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                                {error}
                            </Alert>
                        )}

                        {/* Loader pendant le chargement */}
                        {isLoading ? (
                            <Typography>{t("auth.account.page.loading")}</Typography>
                        ) : user ? (
                            <>
                                {/* Carte - Afficher seulement si user n'est pas null */}
                                <Box paddingBottom={5}>
                                    <UserCard user={user}  onUpdate={handleUserUpdate} />
                                </Box>
                                <PrimaryButton onClick={() => navigate('/messagerie')} text={"Ma messagerie"} />
                                {user.role == "CLIENT" ? <PrimaryButton onClick={() => navigate('/client')} text={"Mes réservations"} /> : ""}
                                {user.role == "ADMIN" ? <PrimaryButton onClick={() => navigate('/admin')}  text={"Dashboard"} /> : ""}
                                <PrimaryButton onClick={logoutAndNavigate}  text={t("auth.account.logout")} />
                            </>
                        ) : (
                            <Typography>{t("auth.account.page.errorLoading")}</Typography>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', mt: 10 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t("auth.account.page.notConnected")}
                        </Typography>
                        <Link
                            onClick={() => navigate('/login')}
                        >
                            {t("auth.account.page.loginLink")}
                        </Link>
                    </Box>
                )}
            </Container>
        </Box>
    )
}