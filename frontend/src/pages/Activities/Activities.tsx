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
import { ActivityCardPublic } from '../../components/cards/Activity/ActivityCardPublic.tsx';
import type { Activity } from '../../@types/activity';
import type { Attraction } from '../../@types/attraction';
import { resolveImageUrl, DEFAULT_ACTIVITY_IMAGE, DEFAULT_RESTAURANT_IMAGE } from '../../utils/imageUtils';
import { useTranslation } from 'react-i18next';
import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router";

const ALL_CATEGORIES_KEY = '__ALL__';

export const Activities = () => {
  const { t, i18n } = useTranslation();
  const [tabValue, setTabValue] = useState<number>(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES_KEY);
  const [minThrill, setMinThrill] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // gestion des anchors
  const location = useLocation();
  const navigate = useNavigate();

  // Mapper les ancres vers les indices de tabs
  const hashToTabIndex: Record<string, number> = {
        '#activities': 0,
        '#attractions': 1,
        '#restaurants': 2,
  };

  const tabIndexToHash: Record<number, string> = {
        0: '#activities',
        1: '#attractions',
        2: '#restaurants',
  };

  // Synchroniser le tab avec l'ancre URL au chargement
  useEffect(() => {
      if (location.hash) {
          const tabIndex = hashToTabIndex[location.hash];
          if (tabIndex !== undefined) {
              setTabValue(tabIndex);
          }
      }
  }, [location.hash]);

    // Gérer le changement de tab
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
      // Mettre à jour l'URL avec l'ancre correspondante
      const hash = tabIndexToHash[newValue];
      navigate(`${location.pathname}${hash}`, { replace: true });
    };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [activitiesData, attractionsData] = await Promise.all([
          getActivities(),
          getAttractions(),
        ]);
        // Filtrer pour n'afficher que les éléments publiés sur la page publique
        const publishedActivities = Array.isArray(activitiesData)
          ? (activitiesData as Activity[]).filter((a: any) => a.is_published !== false)
          : [];
        const publishedAttractions = Array.isArray(attractionsData)
          ? (attractionsData as Attraction[]).filter((a: any) => a.is_published !== false)
          : [];
        setActivities(publishedActivities);
        setAttractions(publishedAttractions);
        
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t('activities.page.errorLoading');
        setError(message);
        setActivities([]);
        setAttractions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  const enrichedActivities = useMemo(() => {
    const withMeta = activities
      .filter((activity) => (activity as any).is_published !== false) // Filtrer les activités non publiées
      .map((activity) => {
        const image = resolveImageUrl(activity.image_url, DEFAULT_ACTIVITY_IMAGE);

        // Valeurs par défaut car ces champs n'existent pas en BDD
        const thrill = activity.thrill_level ?? 3;
        const durationMinutes = activity.duration ?? 45;
        const duration = `${durationMinutes} min`;
        const categoryLabel = activity.category?.name ?? t('activities.page.tabs.activities');
        const waitTime = (activity as any).wait_time;
        return { ...activity, image, thrill, duration, categoryLabel, waitTime };
      });

    const queryLower = searchQuery.toLowerCase().trim();
    const filtered = withMeta.filter(
      (a) =>
        (selectedCategory === ALL_CATEGORIES_KEY || a.categoryLabel === selectedCategory) &&
        (!minThrill || a.thrill >= minThrill) &&
        (!queryLower ||
          a.name.toLowerCase().includes(queryLower) ||
          a.description?.toLowerCase().includes(queryLower)),
    );

    return filtered;
  }, [activities, selectedCategory, minThrill, searchQuery]);

  const enrichedAttractions = useMemo(() => {
    const withMeta = attractions
      .filter((attraction) => attraction.category?.name !== 'Restauration' && (attraction as any).is_published !== false) // Filtrer les attractions non publiées
      .map((attraction) => {
        const image = resolveImageUrl(attraction.image_url, DEFAULT_ACTIVITY_IMAGE);
        const thrill = attraction.thrill_level ?? 3;
        const durationMinutes = attraction.duration ?? 45;
        const duration = `${durationMinutes} min`;
        const categoryLabel = attraction.category?.name ?? t('activities.page.tabs.attractions');
        const waitTime = (attraction as any).wait_time;
        return { ...attraction, image, thrill, duration, categoryLabel, waitTime };
      });

    const queryLower = searchQuery.toLowerCase().trim();
    const filtered = withMeta.filter(
      (a) =>
        (selectedCategory === ALL_CATEGORIES_KEY || a.categoryLabel === selectedCategory) &&
        (!minThrill || a.thrill >= minThrill) &&
        (!queryLower ||
          a.name.toLowerCase().includes(queryLower) ||
          a.description?.toLowerCase().includes(queryLower)),
    );

    return filtered;
  }, [attractions, selectedCategory, minThrill, searchQuery]);

  const enrichedRestaurants = useMemo(() => {
    const withMeta = attractions
      .filter((attraction) => attraction.category?.name === 'Restauration')
      .map((restaurant) => {
        const image = resolveImageUrl(restaurant.image_url, DEFAULT_RESTAURANT_IMAGE);
        const thrill = undefined; // Pas de niveau de frisson pour la restauration
        const duration = undefined; // Pas de durée pour la restauration
        const categoryLabel = restaurant.category?.name ?? t('activities.page.tabs.restaurants');
        return { ...restaurant, image, thrill, duration, categoryLabel };
      });

    const queryLower = searchQuery.toLowerCase().trim();
    const filtered = withMeta.filter(
      (r) =>
        !queryLower ||
        r.name.toLowerCase().includes(queryLower) ||
        r.description?.toLowerCase().includes(queryLower),
    );

    return filtered;
  }, [attractions, searchQuery]);

  const categories = useMemo(() => {
    const allLabels = [
      ...activities.map((a) => a.category?.name),
      ...attractions.map((a) => a.category?.name),
    ].filter((c): c is string => Boolean(c) && c !== 'Restauration');
    return [ALL_CATEGORIES_KEY, ...Array.from(new Set(allLabels))];
  }, [activities, attractions]);

  const getCategoryLabel = (category: string) => {
    return category === ALL_CATEGORIES_KEY ? t('activities.all') : category;
  };

  const currentItems = useMemo(() => {
    if (tabValue === 0) return enrichedActivities;
    if (tabValue === 1) return enrichedAttractions;
    return enrichedRestaurants;
  }, [tabValue, enrichedActivities, enrichedAttractions, enrichedRestaurants]);

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
                { label: t('activities.page.breadcrumbs.home'), path: '/', showOnMobile: true },
                { label: t('activities.page.breadcrumbs.activities'), showOnMobile: true },
              ]}
            />
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
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
            <Tab label={t('activities.page.tabs.activities')} />
            <Tab label={t('activities.page.tabs.attractions')} />
            <Tab label={t('activities.page.tabs.restaurants')} />
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
            {tabValue === 0 && t('activities.page.titles.activities')}
            {tabValue === 1 && t('activities.page.titles.attractions')}
            {tabValue === 2 && t('activities.page.titles.restaurants')}
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
            {tabValue === 0 && t('activities.page.descriptions.activities')}
            {tabValue === 1 && t('activities.page.descriptions.attractions')}
            {tabValue === 2 && t('activities.page.descriptions.restaurants')}
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
                {currentItems.length} {tabValue === 0 ? t('activities.page.counters.activities') : tabValue === 1 ? t('activities.page.counters.attractions') : t('activities.page.counters.restaurants')}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.white }}>
                {tabValue === 0 && t('activities.page.counterDescriptions.activities')}
                {tabValue === 1 && t('activities.page.counterDescriptions.attractions')}
                {tabValue === 2 && t('activities.page.counterDescriptions.restaurants')}
              </Typography>
            </Box>
            {tabValue !== 2 && (
              <Box
                sx={{
                  backgroundColor: `${colors.secondaryDarkAlt}90`,
                  border: `1px solid ${colors.secondaryGrey}`,
                  padding: '12px 16px',
                  minWidth: '170px',
                }}
              >
                <Typography variant="h6" sx={{ color: colors.primaryRed }}>
                  {t('activities.page.features.thrillUpTo')}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.white }}>
                  {t('activities.page.features.chooseIntensity')}
                </Typography>
              </Box>
            )}
            {tabValue === 2 && (
              <Box
                sx={{
                  backgroundColor: `${colors.secondaryDarkAlt}90`,
                  border: `1px solid ${colors.secondaryGrey}`,
                  padding: '12px 16px',
                  minWidth: '170px',
                }}
              >
                <Typography variant="h6" sx={{ color: colors.primaryGreen }}>
                  {t('activities.page.features.thematicCuisine')}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.white }}>
                  {t('activities.page.features.foodForAll')}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                backgroundColor: `${colors.secondaryDarkAlt}90`,
                border: `1px solid ${colors.secondaryGrey}`,
                padding: '12px 16px',
                minWidth: '170px',
              }}
            >
              <Typography variant="h6" sx={{ color: colors.primaryGreen }}>
                {tabValue === 2 ? t('activities.page.features.freeAccess') : t('activities.page.features.onlineBooking')}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.white }}>
                {tabValue === 2 ? t('activities.page.features.payOnSite') : t('activities.page.features.limitedPlaces')}
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
              {tabValue === 0 && t('activities.page.sections.allActivities')}
              {tabValue === 1 && t('activities.page.sections.allAttractions')}
              {tabValue === 2 && t('activities.page.sections.allRestaurants')}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.secondaryGrey, maxWidth: { md: '720px' } }}>
              {tabValue === 0 && t('activities.page.sectionDescriptions.activities')}
              {tabValue === 1 && t('activities.page.sectionDescriptions.attractions')}
              {tabValue === 2 && t('activities.page.sectionDescriptions.restaurants')}
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
                  {t('activities.page.filter.title')} {tabValue === 0 ? t('activities.page.filter.activities') : tabValue === 1 ? t('activities.page.filter.attractions') : t('activities.page.filter.restaurants')}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
                  {currentItems.length} {tabValue === 0 ? t('activities.page.filter.displayed.activities') : tabValue === 1 ? t('activities.page.filter.displayed.attractions') : t('activities.page.filter.displayed.restaurants')}
                </Typography>
              </Stack>

              <Divider sx={{ borderColor: colors.secondaryGrey }} />

              <Stack spacing={2}>
                <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
                  {t('activities.page.filter.search.label')}
                </Typography>
                <TextField
                  placeholder={t('activities.page.filter.search.placeholder')}
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

              {tabValue !== 2 && (
                <Stack spacing={2}>
                  <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
                    {t('activities.page.filter.categories')}
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {categories.map((category) => {
                      const isActive = selectedCategory === category;
                      return (
                        <Chip
                          key={category}
                          label={getCategoryLabel(category)}
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
              )}

              {tabValue !== 2 && (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
                    <Typography variant="body2" sx={{ color: colors.secondaryGrey, minWidth: 150 }}>
                      {t('activities.page.filter.intensity.label')}
                    </Typography>
                    <Slider
                      value={minThrill}
                      onChange={(_, value) => setMinThrill(Array.isArray(value) ? 0 : value)}
                      step={1}
                      min={0}
                      max={5}
                      marks={[
                        { value: 0, label: t('activities.page.filter.intensity.all') },
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
              )}
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
                <ActivityCardPublic
                  id={item.id}
                  name={item.name}
                  category={item.categoryLabel}
                  image={item.image}
                  thrill={item.thrill}
                  duration={item.duration}
                  description={item.description}
                  isAttraction={tabValue === 1}
                  isRestaurant={tabValue === 2}
                  waitTime={item.wait_time}
                />
              </Box>
            ))}
          </Box>

          {!loading && !error && currentItems.length === 0 && (
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
                {tabValue === 0 ? t('activities.page.empty.title.activities') : tabValue === 1 ? t('activities.page.empty.title.attractions') : t('activities.page.empty.title.restaurants')}
              </Typography>
              <Typography variant="body2">
                {t('activities.page.empty.message')}
              </Typography>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};