import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { activitiesData } from '../mocks/activities';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Breadcrumbs,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../theme/theme';

// Style pour la section hero
const HeroSection = styled(Box)({
  position: 'relative',
  height: '500px',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #000 0%, #1a0000 100%)',
  '@media (max-width: 768px)': {
    height: '300px',
  },
});

const HeroBackground = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: `
    radial-gradient(circle at 20% 50%, rgba(198, 38, 40, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(58, 239, 48, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #10130C 0%, #000 100%)
  `,
  opacity: 0.8,
  zIndex: 1,
});

const HeroImage = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  opacity: 0.3,
  zIndex: 1,
  transition: 'opacity 1s ease-in-out',
});

const HeroContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
  padding: '0 50px 40px 150px',
  '@media (max-width: 768px)': {
    padding: '25px',
  },
});


// Style pour les métriques
const MetricBox = styled(Paper)({
  backgroundColor: colors.secondaryDark,
  border: `1px solid ${colors.secondaryGrey}`,
  padding: '1.5rem',
  height: '100%',
  '& .metric-title': {
    color: colors.primaryGreen,
    fontFamily: "'Lexend Deca', sans-serif",
    fontWeight: 600,
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  '& .metric-value': {
    color: '#FFFFFF',
    fontFamily: "'Lexend Deca', sans-serif",
    fontWeight: 700,
    fontSize: '2rem',
  },
});


// Style pour les cartes d'activités similaires
const SimilarActivityCard = styled(Card)({
  backgroundColor: colors.secondaryDark,
  border: `1px solid ${colors.secondaryGrey}`,
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: colors.primaryGreen,
    transform: 'translateY(-5px)',
    boxShadow: `0 5px 20px ${colors.primaryGreen}40`,
  },
  '& .MuiCardContent-root': {
    padding: '1rem',
  },
});

export const ActivityDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const activity = activitiesData.activities.find(
    (act) => act.id === parseInt(id || '0')
  );

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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (!activity.images || activity.images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % activity.images.length
      );
    }, 5000); 

    return () => clearInterval(interval);
  }, [activity.images]);

  useEffect(() => {
    if (relatedActivities.length <= 1) {
      return; 
    }

    const itemsPerPage = isMobile ? 1 : (window.innerWidth >= 900 ? 3 : 2);
    const totalPages = isMobile ? relatedActivities.length : Math.ceil(relatedActivities.length / itemsPerPage);
    
    const pageStartIndices: number[] = [];
    if (isMobile) {
      for (let i = 0; i < relatedActivities.length; i++) {
        pageStartIndices.push(i);
      }
    } else {
      const maxIndex = Math.max(0, relatedActivities.length - itemsPerPage);
      for (let i = 0; i < totalPages; i++) {
        pageStartIndices.push(i === totalPages - 1 ? maxIndex : i * itemsPerPage);
      }
    }

    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => {
        const currentPageIndex = pageStartIndices.findIndex((startIndex) => prevIndex === startIndex);
        const currentPage = currentPageIndex >= 0 ? currentPageIndex : 0;
        
        const nextPage = (currentPage + 1) % totalPages;
        
        return pageStartIndices[nextPage];
      });
    }, 4000); 

    return () => clearInterval(interval);
  }, [relatedActivities.length, isMobile]);

  const renderThrillLevel = (level: number) => {
    return (
      <Box display="flex" gap={0.5} alignItems="center" mb={1}>
        {[...Array(5)].map((_, index) => (
          <Typography
            key={index}
            sx={{
              color: index < level ? '#FFFFFF' : colors.secondaryGrey,
              fontSize: { xs: '1.8rem', md: '1.5rem' },
            }}
          >
            ☠
          </Typography>
        ))}
      </Box>
    );
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
      <HeroSection>
        <HeroBackground />
        {activity.images && activity.images.length > 0 && (
          <HeroImage
            sx={{
              backgroundImage: `url(${activity.images[currentImageIndex]})`,
            }}
          />
        )}
        <HeroContent>
          <Breadcrumbs
            separator="›"
            sx={{
              mb: 2,
              '& .MuiBreadcrumbs-ol': {
                flexWrap: 'nowrap',
              },
              '& .MuiBreadcrumbs-li': {
                '& a': {
                  color: colors.secondaryGreen,
                  textDecoration: 'none',
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '0.7rem', md: '0.85rem' },
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
                '& .MuiTypography-root': {
                  color: colors.secondaryGreen,
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '0.7rem', md: '0.85rem' },
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                },
              },
            }}
          >
            <Link to="/">Accueil</Link>
            {!isMobile && <Link to="/activities">Attractions</Link>}
            {!isMobile && <Typography>{activity.category}</Typography>}
            {!isMobile && <Typography>{activity.name}</Typography>}
            {isMobile && <Typography>Détail</Typography>}
          </Breadcrumbs>

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
        </HeroContent>
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
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  width: '100%',
                  marginTop: '2rem',
                  fontSize: '1.2rem',
                  padding: '1rem 3rem',
                }}
              >
                RÉSERVER MAINTENANT
              </Button>
            </Box>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33%' } }}>
            <Stack spacing={2}>
              <MetricBox>
                <Typography className="metric-title">DURÉE</Typography>
                <Typography 
                  className="metric-value"
                  sx={{
                    fontSize: { xs: '1.4rem', md: '2rem' },
                  }}
                >
                  {activity.duration_minutes} {!isMobile ? 'minutes' : 'min'}
                </Typography>
              </MetricBox>

              <MetricBox>
                <Typography className="metric-title">
                  {!isMobile ? 'NIVEAU DE FRISSON' : 'FRISSON'}
                </Typography>
                {renderThrillLevel(activity.thrill_level)}
                <Typography 
                  className="metric-value"
                  sx={{
                    fontSize: { xs: '1.4rem', md: '2rem' },
                  }}
                >
                  {activity.thrill_level}/5
                </Typography>
              </MetricBox>

              <MetricBox>
                <Typography className="metric-title">ACCESSIBILITÉ PMR</Typography>
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

            {/* Bouton Réserver - Mobile seulement */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  width: '100%',
                  fontSize: '1.3rem',
                  padding: '18px 35px',
                }}
              >
                RÉSERVER
              </Button>
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
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingY: 2, 
                overflowX: 'hidden', 
                overflowY: 'visible', 
                '&::-webkit-scrollbar': {
                  display: 'none', 
                },
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none', 
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 2, md: 3 },
                  transform: {
                    xs: `translateX(calc(-${carouselIndex} * (100vw - 24px)))`,
                    md: `translateX(calc(-${carouselIndex} * (33.333% + 24px)))`,
                  },
                  transition: 'transform 0.5s ease-in-out',
                  overflow: 'visible', 
                }}
              >
                {relatedActivities.map((relatedActivity) => (
                    <Box
                      key={relatedActivity.id}
                      sx={{
                        minWidth: {
                          xs: 'calc(100vw - 40px)',
                          md: 'calc(33.333% - 16px)',
                        },
                        flexShrink: 0,
                      }}
                    >
                      <Link
                        to={`/activities/${relatedActivity.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <SimilarActivityCard>
                          {relatedActivity.images && relatedActivity.images[0] && (
                            <CardMedia
                              component="img"
                              height="200"
                              image={relatedActivity.images[0]}
                              alt={relatedActivity.name}
                              sx={{
                                objectFit: 'cover',
                                filter: 'brightness(0.7)',
                              }}
                            />
                          )}
                        <CardContent>
                          <Typography
                            variant="h5"
                            sx={{
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.5rem' }
                            }}
                          >
                            {relatedActivity.name}
                          </Typography>
                          <Chip
                            label={relatedActivity.category.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: colors.secondaryGrey,
                              color: '#FFFFFF',
                              fontFamily: "'Lexend Deca', sans-serif",
                              fontSize: { xs: '0.65rem', md: '0.75rem' },
                              fontWeight: 600,
                            }}
                          />
                        </CardContent>
                      </SimilarActivityCard>
                    </Link>
                  </Box>
                ))}
              </Box>

              {relatedActivities.length > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 3,
                  }}
                >
                  {Array.from({
                    length: isMobile ? relatedActivities.length : Math.ceil(relatedActivities.length / 3),
                  }).map((_, index) => {
                    const itemsPerPage = isMobile ? 1 : 3;
                    const maxIndex = Math.max(0, relatedActivities.length - itemsPerPage);
                    const totalPages = isMobile ? relatedActivities.length : Math.ceil(relatedActivities.length / itemsPerPage);
                    
                    const pageStartIndices: number[] = [];
                    for (let i = 0; i < totalPages; i++) {
                      pageStartIndices.push(i === totalPages - 1 ? maxIndex : i * itemsPerPage);
                    }
                    
                    const currentPageIndex = pageStartIndices.findIndex((startIndex) => carouselIndex === startIndex);
                    const currentPage = currentPageIndex >= 0 ? currentPageIndex : 0;
                    
                    const isActive = index === currentPage;
                    
                    return (
                      <Box
                        key={index}
                        onClick={() => {
                          const targetIndex = isMobile ? index : index * itemsPerPage;
                          const maxIndex = Math.max(0, relatedActivities.length - itemsPerPage);
                          setCarouselIndex(Math.min(targetIndex, maxIndex));
                        }}
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: isActive
                            ? colors.primaryGreen
                            : colors.secondaryGrey,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: `2px solid ${isActive ? colors.primaryGreen : colors.secondaryGrey}`,
                          boxShadow: isActive
                            ? `0 0 10px ${colors.primaryGreen}`
                            : 'none',
                          '&:hover': {
                            backgroundColor: colors.primaryRed,
                            borderColor: colors.primaryRed,
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};
