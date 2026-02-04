import { Box, Container } from "@mui/material";
import ReservationUserList from "./ReservationUser/ReservationUserList.tsx";
import { colors } from "../../theme";
import { CustomBreadcrumbs } from "../../components/common";
import { HeroSection } from "../../components/hero/HeroSection";
import { Typography } from "@mui/material";
import {useTranslation} from "react-i18next";

export const UserDashboard = () => {
    const { t } = useTranslation();
    const heroImages = [
        '/activities-images/post-apocalyptic-street.webp',
        '/activities-images/zombie.webp',
        '/activities-images/abandoned-lab.webp',
        '/activities-images/haunted-hospital.webp',
    ].slice(0, 5);

    return (
        <Box sx={{ backgroundColor: colors.secondaryDark, minHeight: '100vh', color: colors.white }}>
            <HeroSection images={heroImages}>
                <Box>
                    <Box sx={{ pt: { xs: 2, md: 2 }, mb: { xs: 1, md: 1 } }}>
                        <CustomBreadcrumbs
                            items={[
                                { label: t("auth.account.reservations.breadcrumbs.home"), path: '/', showOnMobile: true },
                                { label: 'Mon compte', path: '/account',showOnMobile: true },
                                { label: t("auth.account.reservations.breadcrumbs.reservations"), showOnMobile: true },
                            ]}
                        />
                    </Box>

                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '1.8rem', md: '4rem' },
                            color: colors.white,
                            textShadow: `
                              0 0 20px rgba(198, 38, 40, 0.8),
                              0 0 40px rgba(58, 239, 48, 0.4),
                              3px 3px 0 ${colors.primaryRed}
                            `,
                            marginBottom: { xs: '8px', md: '12px' },
                            lineHeight: 1,
                            letterSpacing: '2px',
                        }}
                    >
                        {t("auth.account.reservations.title")}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: { xs: '100%', md: '560px' },
                            color: colors.white,
                            fontSize: { xs: '0.85rem', md: '1.1rem' },
                            mb: { xs: 1.5, md: 3 },
                        }}
                    >
                        {t("auth.account.reservations.description")}
                    </Typography>
                </Box>
            </HeroSection>

            <Container
                maxWidth={false}
                sx={{
                    width: '100%',
                    mt: { xs: 2, md: 3 },
                    pt: { xs: 3, md: 4 },
                    pb: { xs: 5, md: 7 },
                    pl: { xs: 2, sm: 4, md: '150px', lg: '170px' },
                    pr: { xs: 2, sm: 4, md: '60px', lg: '90px' },
                }}
            >
                <Box
                    sx={{
                        backgroundColor: colors.secondaryDarkAlt,
                        border: `1px solid ${colors.secondaryGrey}`,
                        borderRadius: '12px',
                        p: { xs: 2, md: 3 },
                        minHeight: '400px',
                    }}
                >
                    <ReservationUserList />
                </Box>
            </Container>
        </Box>
    );
};