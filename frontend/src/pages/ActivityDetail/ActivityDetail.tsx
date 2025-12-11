import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
  LinearProgress,
} from '@mui/material';
import { colors } from '../../theme/theme';
import { HeroSection } from '../../components/hero/HeroSection';
import { CustomBreadcrumbs } from '../../components/common/Breadcrumbs/CustomBreadcrumbs';
import { MetricBox } from '../../components/cards/MetricBox';
import { ThrillLevel } from '../../components/common/ThrillLevel/ThrillLevel';
import { ReservationButton } from '../../components/common/Button/ReservationButton';
import { ActivityCarousel } from '../../components/carousel/ActivityCarousel';
import { getActivityById, getActivities } from '../../services/activities';
import { getAttractionById, getAttractions } from '../../services/attractions';
import type { Activity } from '../../@types/activity';
import type { Attraction } from '../../@types/attraction';

export const ActivityDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isAttraction, setIsAttraction] = useState<boolean>(false);
  const [entity, setEntity] = useState<Activity | Attraction | null>(null);
  const [relatedActivities, setRelatedActivities] = useState<Activity[]>([]);
  const [relatedAttractions, setRelatedAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Remonter en haut de page à chaque navigation vers une activité
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) {
        setError("ID d'activité manquant");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const isAttr = location.pathname.includes('/attractions/');
        setIsAttraction(isAttr);

        if (isAttr) {
          const data = await getAttractionById(parseInt(id));
          if (data) {
            setEntity(data);
            try {
              const allAttractions = await getAttractions();
              const others = allAttractions.filter((att) => att.id !== data.id);
              setRelatedAttractions(others);
            } catch {
              setRelatedAttractions([]);
            }
          } else {
            setError("Attraction non trouvée");
          }
        } else {
          const data = await getActivityById(parseInt(id));
          if (data) {
            setEntity(data);
            // Charger toutes les autres activités (excluant l'activité actuelle)
            try {
              const allActivities = await getActivities();
              const others = allActivities.filter((act) => act.id !== data.id);
              setRelatedActivities(others);
            } catch {
              setRelatedActivities([]);
            }
          } else {
            setError("Activité non trouvée");
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Impossible de charger la fiche";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id, location.pathname]);

  if (loading) {
    return (
      <Box sx={{ backgroundColor: colors.secondaryDark, minHeight: '100vh', pt: 4 }}>
        <Container>
          <LinearProgress
            sx={{
              backgroundColor: colors.secondaryGrey,
              '& .MuiLinearProgress-bar': { backgroundColor: colors.primaryGreen },
            }}
          />
        </Container>
      </Box>
    );
  }

  if (error || !entity) {
    return (
      <Box sx={{ backgroundColor: colors.secondaryDark, minHeight: '100vh', pt: 4 }}>
        <Container>
          <Typography variant="h4" sx={{ color: colors.white }}>
            {error || "Fiche non trouvée"}
          </Typography>
        </Container>
      </Box>
    );
  }

  // Valeurs par défaut
  const thrillLevel = 'thrill_level' in entity ? entity.thrill_level : 3;
  const durationMinutes = 'duration' in entity ? entity.duration : 45;
  const minAge = 12;
  const accessibility = "Accessible PMR";
  const defaultHeroImages = [
    '/activities-images/abandoned-lab.jpg',
    '/activities-images/zombie.jpg',
    '/activities-images/post-apocalyptic-street.jpg',
  ];

  const entityName = 'name' in entity ? entity.name : '';
  const entityCategory = 'category' in entity ? entity.category?.name : undefined;

  // Hero images : priorité aux images attraction, sinon image_url activité, sinon défaut
  const heroImages =
    isAttraction && 'images' in entity && entity.images?.[0]?.url
      ? [entity.images[0].url]
      : 'image_url' in entity && entity.image_url
        ? [entity.image_url]
        : defaultHeroImages;

  // Transformer les éléments pour le carousel selon le type
  const carouselItems = isAttraction
    ? relatedAttractions.map((att) => ({
        id: att.id,
        name: att.name,
        category: att.category?.name || 'Attraction',
        images: att.image_url ? [att.image_url] : [],
      }))
    : relatedActivities.map((act) => ({
        id: act.id,
        name: act.name,
        category: act.category?.name || 'Activité',
        images: act.image_url ? [act.image_url] : [],
      }));

  const breadcrumbItems = [
    { label: 'Accueil', path: '/', showOnMobile: true },
    { label: isAttraction ? 'Attractions' : 'Activités', path: isAttraction ? '/attractions' : '/activities', showOnMobile: false },
    { label: entityCategory || (isAttraction ? 'Attraction' : 'Activité'), showOnMobile: false },
    { label: isMobile ? 'Détail' : entityName, showOnMobile: true },
  ];

  const handleReservationClick = () => {
    navigate('/reservations');
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.secondaryDark,
        minHeight: '100vh',
        color: '#FFFFFF',
        position: 'relative',
      }}
    >
      <HeroSection images={heroImages}>
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
          {entityName}
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
            {entityCategory || (isAttraction ? 'Attraction' : 'Activité')}
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
                {'description' in entity ? entity.description : ''}
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
                  Déconseillé aux âmes sensibles et aux moins de {minAge} ans.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ marginTop: '2rem' }}>
                <ReservationButton variant="desktop" onClick={handleReservationClick} />
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
                {durationMinutes} {!isMobile ? 'minutes' : 'min'}
              </Typography>
            </MetricBox>

            <MetricBox title={!isMobile ? 'NIVEAU DE FRISSON' : 'FRISSON'}>
              <ThrillLevel level={thrillLevel} />
              <Typography
                className="metric-value"
                sx={{
                  fontSize: { xs: '1.4rem', md: '2rem' },
                }}
              >
                {thrillLevel}/5
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
                {accessibility}
              </Typography>
            </MetricBox>
            </Stack>

            <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2 }}>
              <ReservationButton variant="mobile" onClick={handleReservationClick} />
            </Box>
          </Box>
        </Box>

        {carouselItems.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                {isAttraction ? 'ATTRACTIONS SIMILAIRES' : 'ACTIVITÉS SIMILAIRES'}
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                SIMILAIRES
              </Box>
            </Typography>
            <ActivityCarousel activities={carouselItems} />
          </Box>
        )}
      </Container>
    </Box>
  );
};
