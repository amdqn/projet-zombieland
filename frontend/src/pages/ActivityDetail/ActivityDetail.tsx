import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { activitiesData } from '../../mocks';
import {
  Box,
  Container,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { colors } from '../../theme/theme';
import { HeroSection } from '../../components/hero/HeroSection';
import { CustomBreadcrumbs } from '../../components/common/Breadcrumbs/CustomBreadcrumbs';
import { MetricBox } from '../../components/cards/MetricBox';
import { ThrillLevel } from '../../components/common/ThrillLevel/ThrillLevel';
import { ReservationButton } from '../../components/common/Button/ReservationButton';
import { ActivityCarousel } from '../../components/carousel/ActivityCarousel';

export const ActivityDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const activity = activitiesData.activities.find(
    (act) => act.id === parseInt(id || '0')
  );

  // Remonter en haut de page à chaque navigation vers une activité
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!activity) {
    return (
      <Container>
        <Typography>Activité non trouvée</Typography>
      </Container>
    );
  }

  const relatedActivities = activitiesData.activities.filter((act) =>
    activity.related_activities.includes(act.id)
  );

  const breadcrumbItems = [
    { label: 'Accueil', path: '/', showOnMobile: true },
    { label: 'Attractions', path: '/activities', showOnMobile: false },
    { label: activity.category, showOnMobile: false },
    { label: isMobile ? 'Détail' : activity.name, showOnMobile: true },
  ];

  return (
    <Box
      sx={{
        backgroundColor: colors.secondaryDark,
        minHeight: '100vh',
        color: '#FFFFFF',
        position: 'relative',
      }}
    >
      <HeroSection images={activity.images}>
        <CustomBreadcrumbs items={breadcrumbItems} />

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4.5rem' },
            color: '#fff',
            textShadow: `
              0 0 20px rgba(198, 38, 40, 0.8),
              0 0 40px rgba(58, 239, 48, 0.4),
              3px 3px 0 #C62628
            `,
            marginBottom: '15px',
            lineHeight: 1,
            letterSpacing: '2px',
          }}
        >
          {activity.name}
        </Typography>

        <Box
          sx={{
            backgroundColor: colors.primaryRed,
            border: `2px solid ${colors.primaryGreen}`,
            padding: { xs: '6px 15px', md: '0.5rem 1.5rem' },
            display: 'inline-block',
            width: 'fit-content',
          }}
        >
          <Typography
            sx={{
              color: colors.white,
              fontFamily: "'Lexend Deca', sans-serif",
              fontWeight: 700,
              fontSize: { xs: '0.75rem', md: '1.1rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
            }}
          >
            {activity.category}
          </Typography>
        </Box>
      </HeroSection>

      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          padding: { xs: '30px 20px', md: '0 50px 2rem 150px' },
          paddingBottom: '4rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            mt: 2,
          }}
        >
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 66%' } }}>
            <Box sx={{ mb: 4, position: 'relative' }}>
              <Typography
                variant="h2"
                sx={{
                  mb: 3,
                  fontSize: { xs: '1.6rem', md: '2.5rem' },
                }}
              >
                L'EXPÉRIENCE
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  lineHeight: { xs: 1.7, md: 1.8 },
                }}
              >
                {activity.description}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  lineHeight: { xs: 1.7, md: 1.8 },
                }}
              >
                Plongez dans une expérience immersive totale où l'horreur prend vie.
                Effets spéciaux saisissants, acteurs professionnels et atmosphère
                oppressante vous attendent. Cris, odeurs de putréfaction, bruits de
                chaînes... tout est conçu pour créer un cauchemar éveillé.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 3,
                  p: 2,
                  backgroundColor: `${colors.secondaryRed}40`,
                  borderLeft: `4px solid ${colors.primaryRed}`,
                }}
              >
                <Box
                  sx={{
                    color: '#FFC107',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  ⚠
                </Box>
                <Typography variant="body2">
                  Déconseillé aux âmes sensibles et aux moins de {activity.min_age}{' '}
                  ans.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ marginTop: '2rem' }}>
                <ReservationButton variant="desktop" />
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33%' } }}>
            <Stack spacing={2}>
              <MetricBox title="DURÉE">
                <Typography
                  className="metric-value"
                  sx={{
                    fontSize: { xs: '1.4rem', md: '2rem' },
                  }}
                >
                  {activity.duration_minutes} {!isMobile ? 'minutes' : 'min'}
                </Typography>
              </MetricBox>

              <MetricBox title={!isMobile ? 'NIVEAU DE FRISSON' : 'FRISSON'}>
                <ThrillLevel level={activity.thrill_level} />
                <Typography
                  className="metric-value"
                  sx={{
                    fontSize: { xs: '1.4rem', md: '2rem' },
                  }}
                >
                  {activity.thrill_level}/5
                </Typography>
              </MetricBox>

              <MetricBox title="ACCESSIBILITÉ PMR">
                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontFamily: "'Lexend Deca', sans-serif",
                    fontSize: '1rem',
                    mt: 1,
                  }}
                >
                  {activity.accessibility}
                </Typography>
              </MetricBox>
            </Stack>

            <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2 }}>
              <ReservationButton variant="mobile" />
            </Box>
          </Box>
        </Box>

        {relatedActivities.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                ATTRACTIONS SIMILAIRES
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                SIMILAIRES
              </Box>
            </Typography>
            <ActivityCarousel activities={relatedActivities} />
          </Box>
        )}
      </Container>
    </Box>
  );
};
