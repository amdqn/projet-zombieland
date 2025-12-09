import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Slider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { getActivities } from '../../services/activities';
import { getAttractions } from '../../services/attractions';
import { colors } from '../../theme';
import { CustomBreadcrumbs } from '../../components/common';
import { HeroSection } from '../../components/hero/HeroSection';
import { ActivityCard } from '../../components/cards/ActivityCard';
import type { Activity } from '../../@types/activity';
import type { Attraction } from '../../@types/attraction';

export const Activities = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [minThrill, setMinThrill] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [activitiesData, attractionsData] = await Promise.all([
          getActivities(),
          getAttractions(),
        ]);
        setActivities(Array.isArray(activitiesData) ? (activitiesData as Activity[]) : []);
        setAttractions(Array.isArray(attractionsData) ? (attractionsData as Attraction[]) : []);
        
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Impossible de charger les données.';
        setError(message);
        setActivities([]);
        setAttractions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const enrichedActivities = useMemo(() => {
    const withMeta = activities.map((activity) => {
      const apiImage = activity.image_url?.trim();
      // Accepter les URLs HTTP/HTTPS et les chemins relatifs qui commencent par /
      const isValidHttp = apiImage?.startsWith('http://') || apiImage?.startsWith('https://');
      const isValidPath = apiImage?.startsWith('/');
      const image = (isValidHttp || isValidPath) ? apiImage : undefined;
      
      // Valeurs par défaut car ces champs n'existent pas en BDD
      const thrill = 3;
      const duration = '45 min';
      const categoryLabel = activity.category?.name ?? 'Activité';
      return { ...activity, image, thrill, duration, categoryLabel };
    });

    const queryLower = searchQuery.toLowerCase().trim();
    const filtered = withMeta.filter(
      (a) =>
        (selectedCategory === 'Toutes' || a.categoryLabel === selectedCategory) &&
        (!minThrill || a.thrill >= minThrill) &&
        (!queryLower ||
          a.name.toLowerCase().includes(queryLower) ||
          a.description?.toLowerCase().includes(queryLower)),
    );

    return filtered;
  }, [activities, selectedCategory, minThrill, searchQuery]);

  const enrichedAttractions = useMemo(() => {
    const withMeta = attractions.map((attraction) => {
      const imageUrl = attraction.images?.[0]?.url?.trim();
      const isValidHttp = imageUrl?.startsWith('http://') || imageUrl?.startsWith('https://');
      const image = isValidHttp ? imageUrl : undefined;
      const thrill = 3;
      const duration = '45 min';
      const categoryLabel = attraction.category?.name ?? 'Attraction';
      return { ...attraction, image, thrill, duration, categoryLabel };
    });

    const queryLower = searchQuery.toLowerCase().trim();
    const filtered = withMeta.filter(
      (a) =>
        (selectedCategory === 'Toutes' || a.categoryLabel === selectedCategory) &&
        (!minThrill || a.thrill >= minThrill) &&
        (!queryLower ||
          a.name.toLowerCase().includes(queryLower) ||
          a.description?.toLowerCase().includes(queryLower)),
    );

    return filtered;
  }, [attractions, selectedCategory, minThrill, searchQuery]);

  const categories = useMemo(() => {
    const allLabels = [
      ...activities.map((a) => a.category?.name),
      ...attractions.map((a) => a.category?.name),
    ].filter((c): c is string => Boolean(c));
    return ['Toutes', ...Array.from(new Set(allLabels))];
  }, [activities, attractions]);

  const currentItems = tabValue === 0 ? enrichedActivities : enrichedAttractions;

  const heroImages = useMemo(() => {
    // Images par défaut car les activités n'ont pas d'images en BDD
    return [
      '/activities-images/abandoned-lab-2.jpg',
      '/activities-images/post-apocalyptic-street.jpg',
      '/activities-images/zombie.jpg',
      '/activities-images/abandoned-lab.jpg',
      '/activities-images/haunted-hospital.jpg',
    ].slice(0, 5);
  }, []);

  return (
    <Box sx={{ backgroundColor: colors.secondaryDark, minHeight: '100vh', color: colors.white }}>
      <HeroSection images={heroImages}>
        <Box>
          <Box sx={{ pt: { xs: 2, md: 2 }, mb: { xs: 1, md: 1 } }}>
            <CustomBreadcrumbs
              items={[
                { label: 'Accueil', path: '/', showOnMobile: true },
                { label: 'Activités', showOnMobile: true },
              ]}
            />
          </Box>

          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              mb: { xs: 1.5, md: 3 },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.primaryGreen,
                height: 3,
              },
              '& .MuiTab-root': {
                color: colors.white,
                opacity: 0.6,
                fontSize: { xs: '0.85rem', md: '1.1rem' },
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                minHeight: { xs: 40, md: 48 },
                padding: { xs: '8px 12px', md: '12px 24px' },
                '&.Mui-selected': {
                  color: colors.primaryGreen,
                  opacity: 1,
                },
                '&:hover': {
                  color: colors.primaryGreen,
                  opacity: 0.9,
                },
              },
            }}
          >
            <Tab label="Activités" />
            <Tab label="Attractions" />
          </Tabs>

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
            {tabValue === 0 ? 'Activités du parc' : 'Attractions du parc'}
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
            {tabValue === 0
              ? 'Frissons, immersions ou ateliers : découvre toutes les activités disponibles avant de réserver.'
              : 'Parcours immersifs, expériences à sensations fortes : explore toutes nos attractions thématiques.'}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 1.5, md: 3 } }}>
            <Box
              sx={{
                backgroundColor: `${colors.secondaryDarkAlt}90`,
                border: `1px solid ${colors.secondaryGrey}`,
                padding: { xs: '8px 12px', md: '12px 16px' },
                minWidth: { xs: 'auto', sm: '170px' },
              }}
            >
              <Typography variant="h6" sx={{ color: colors.primaryGreen }}>
                {currentItems.length} {tabValue === 0 ? 'activités' : 'attractions'}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.white }}>
                {tabValue === 0
                  ? 'Zones immersives, ateliers, spectacles'
                  : 'Parcours, expériences, sensations fortes'}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: `${colors.secondaryDarkAlt}90`,
                border: `1px solid ${colors.secondaryGrey}`,
                padding: '12px 16px',
                minWidth: '170px',
              }}
            >
              <Typography variant="h6" sx={{ color: colors.primaryRed }}>
                Frisson jusqu'à 5/5
              </Typography>
              <Typography variant="body2" sx={{ color: colors.white }}>
                Choisis ton niveau d'intensité
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: `${colors.secondaryDarkAlt}90`,
                border: `1px solid ${colors.secondaryGrey}`,
                padding: '12px 16px',
                minWidth: '170px',
              }}
            >
              <Typography variant="h6" sx={{ color: colors.primaryGreen }}>
                Réservation en ligne
              </Typography>
              <Typography variant="body2" sx={{ color: colors.white }}>
                Places limitées par session
              </Typography>
            </Box>
          </Stack>
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
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1rem', md: '2rem' } }}>
              Toutes les activités
            </Typography>
            <Typography variant="body2" sx={{ color: colors.secondaryGrey, maxWidth: { md: '720px' } }}>
              Parcours, VR, spectacles ou ateliers : découvre l'ensemble du parc et filtre par catégorie ou niveau de frisson.
            </Typography>
          </Box>

          {loading && (
            <LinearProgress
              sx={{
                backgroundColor: colors.secondaryGrey,
                '& .MuiLinearProgress-bar': { backgroundColor: colors.primaryGreen },
              }}
            />
          )}

          {error && (
            <Box
              sx={{
                border: `1px solid ${colors.primaryRed}`,
                backgroundColor: `${colors.primaryRed}10`,
                color: colors.white,
                p: 2,
                borderRadius: '8px',
              }}
            >
              <Typography variant="body2">Erreur : {error}</Typography>
            </Box>
          )}

          <Box
            sx={{
              backgroundColor: colors.secondaryDarkAlt,
              border: `1px solid ${colors.secondaryGrey}`,
              borderRadius: '12px',
              p: { xs: 2, md: 3 },
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
              >
                <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
                  Filtrer les {tabValue === 0 ? 'activités' : 'attractions'}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
                  {currentItems.length} {tabValue === 0 ? 'activité(s)' : 'attraction(s)'} affichée(s)
                </Typography>
              </Stack>

              <Divider sx={{ borderColor: colors.secondaryGrey }} />

              <Stack spacing={2}>
                <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
                  Recherche
                </Typography>
                <TextField
                  placeholder="Rechercher par nom ou description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: colors.secondaryDark,
                      color: colors.white,
                      '& fieldset': {
                        borderColor: colors.secondaryGrey,
                      },
                      '&:hover fieldset': {
                        borderColor: colors.primaryGreen,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.primaryGreen,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: colors.white,
                      '&::placeholder': {
                        color: colors.secondaryGrey,
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Stack>

              <Stack spacing={2}>
                <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
                  Catégories
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {categories.map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => setSelectedCategory(category)}
                        sx={{
                          backgroundColor: isActive ? colors.primaryGreen : colors.secondaryGrey,
                          color: colors.white,
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          borderRadius: '999px',
                          px: 0.5,
                        }}
                      />
                    );
                  })}
                </Stack>
              </Stack>

              <Stack spacing={1} sx={{ mt: 1 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
                  <Typography variant="body2" sx={{ color: colors.secondaryGrey, minWidth: 150 }}>
                    Intensité minimale
                  </Typography>
                  <Slider
                    value={minThrill}
                    onChange={(_, value) => setMinThrill(Array.isArray(value) ? 0 : value)}
                    step={1}
                    min={0}
                    max={5}
                    marks={[
                      { value: 0, label: 'Tous' },
                      { value: 1, label: '1' },
                      { value: 2, label: '2' },
                      { value: 3, label: '3' },
                      { value: 4, label: '4' },
                      { value: 5, label: '5' },
                    ]}
                    sx={{
                      color: colors.primaryGreen,
                      flex: 1,
                      width: '100%',
                      mt: 1,
                      '& .MuiSlider-markLabel': {
                        color: colors.secondaryGrey,
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {currentItems.map((item) => (
              <Box key={item.id} sx={{ display: 'flex' }}>
                <ActivityCard
                  id={item.id}
                  name={item.name}
                  category={item.categoryLabel}
                  image={item.image}
                  thrill={item.thrill}
                  duration={item.duration}
                  description={item.description}
                  isAttraction={tabValue === 1}
                />
              </Box>
            ))}
          </Box>

          {!loading && !error && enrichedActivities.length === 0 && (
            <Box
              sx={{
                border: `1px dashed ${colors.secondaryGrey}`,
                p: 4,
                textAlign: 'center',
                color: colors.secondaryGrey,
                borderRadius: '12px',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Aucune {tabValue === 0 ? 'activité' : 'attraction'} trouvée
              </Typography>
              <Typography variant="body2">
                Réessaie plus tard ou contacte le support si le problème persiste.
              </Typography>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};