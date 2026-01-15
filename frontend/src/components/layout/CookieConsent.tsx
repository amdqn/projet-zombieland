// components/CookieConsent.tsx
import { Box, Button, Typography, Link } from "@mui/material";
import { useState, useEffect } from "react";
import {colors} from "../../theme";


export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Vérifier si l'utilisateur a déjà accepté/refusé les cookies
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            // Afficher la bannière après un court délai
            setTimeout(() => {
                setShowBanner(true);
            }, 1000);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('cookieConsent', 'all');
        setShowBanner(false);
        // Ici, vous pouvez activer tous les cookies (analytics, etc.)
    };

    const handleAcceptEssential = () => {
        localStorage.setItem('cookieConsent', 'essential');
        setShowBanner(false);
        // Uniquement les cookies essentiels
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Overlay sombre */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 9998,
                }}
                onClick={handleAcceptEssential}
            />

            {/* Bannière cookies */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: { xs: 0, md: 20 },
                    left: { xs: 0, md: '50%' },
                    transform: { xs: 'none', md: 'translateX(-50%)' },
                    width: { xs: '100%', md: '90%', lg: '800px' },
                    backgroundColor: '#1a1a1a',
                    border: `2px solid ${colors.primaryGreen}`,
                    borderRadius: { xs: 0, md: '12px' },
                    padding: { xs: 3, md: 4 },
                    zIndex: 9999,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        color: colors.primaryGreen,
                        mb: 2,
                        fontWeight: 'bold'
                    }}
                >
                    🍪 Ce site utilise des cookies
                </Typography>

                <Typography
                    sx={{
                        color: 'white',
                        mb: 3,
                        lineHeight: 1.6
                    }}
                >
                    Nous utilisons des cookies pour améliorer votre expérience sur ZombieLand.
                    Certains cookies sont essentiels au fonctionnement du site, tandis que d'autres
                    nous aident à analyser l'utilisation du site.
                </Typography>

                <Typography
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 3,
                        fontSize: '0.9rem'
                    }}
                >
                    En cliquant sur "Tout accepter", vous acceptez notre utilisation des cookies.
                    Pour en savoir plus, consultez notre{' '}
                    <Link
                        href="/static/gestion-cookies"
                        sx={{
                            color: colors.primaryGreen,
                            textDecoration: 'underline'
                        }}
                    >
                        politique de gestion des cookies
                    </Link>.
                </Typography>

                {/* Boutons */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleAcceptEssential}
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        Cookies essentiels uniquement
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleAcceptAll}
                        sx={{
                            backgroundColor: colors.primaryGreen,
                            color: 'black',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#45cc15'
                            }
                        }}
                    >
                        Tout accepter
                    </Button>
                </Box>
            </Box>
        </>
    );
}