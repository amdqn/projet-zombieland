import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { activitiesData } from '../../mocks';
import { ActivityCard } from '../../components/cards/ActivityCard';
import { HeroSection } from '../../components/hero/HeroSection';
import { CustomBreadcrumbs, PrimaryButton } from '../../components/common';
import { colors } from '../../theme';

export const Activities = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [minThrill, setMinThrill] = useState<number>(0);

  const heroImages = useMemo(
    () =>
      activitiesData.activities
        .map((activity) => activity.images?.[0])
        .filter(Boolean)
        .slice(0, 5) as string[],
    []
  );

  const categories = useMemo(
    () => ['Toutes', ...Array.from(new Set(activitiesData.activities.map((a) => a.category)))],
    []
  );

  const filteredActivities = useMemo(
    () =>
      activitiesData.activities.filter(
        (activity) =>
          (selectedCategory === 'Toutes' || activity.category === selectedCategory) &&
          (!minThrill || activity.thrill_level >= minThrill)
      ),
    [selectedCategory, minThrill]
  );

  return (
    <Box
      sx={{
        backgroundColor: colors.secondaryDark,
        minHeight: '100vh',
        color: colors.white,
      }}
    >
      <HeroSection images={heroImages}>
        <Box sx={{ pt: { xs: 5, md: 8 } }}>
          <CustomBreadcrumbs
            items={[
              { label: 'Accueil', path: '/', showOnMobile: true },
              { label: 'Attractions', showOnMobile: true },
            ]}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.6rem', md: '4rem' },
              color: colors.white,
              textShadow: `
              0 0 20px rgba(198, 38, 40, 0.8),
              0 0 40px rgba(58, 239, 48, 0.4),
              3px 3px 0 ${colors.primaryRed}
            `,
              marginBottom: '12px',
              lineHeight: 1,
              letterSpacing: '2px',
            }}
          >
            Attractions & expériences
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: { xs: '100%', md: '560px' },
              color: colors.white,
              fontSize: { xs: '1rem', md: '1.1rem' },
              mb: 3,
            }}
          >
            Frissons, immersions ou défis en équipe : explore toutes nos expériences
            thématiques avant de réserver ta place pour survivre à Zombieland.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box
              sx={{
                backgroundColor: `${colors.secondaryDarkAlt}90`,
                border: `1px solid ${colors.secondaryGrey}`,
                padding: '12px 16px',
                minWidth: '170px',
              }}
            >
              <Typography variant="h6" sx={{ color: colors.primaryGreen }}>
                {activitiesData.activities.length} activités
              </Typography>
              <Typography variant="body2" sx={{ color: colors.white }}>
                Zones immersives, attractions, VR, ateliers
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
                Réserve en ligne
              </Typography>
              <Typography variant="body2" sx={{ color: colors.white }}>
                Places limitées par session
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ maxWidth: { xs: '100%', md: '300px' } }}>
            <PrimaryButton text="RÉSERVER MAINTENANT" href="/reservations" />
          </Box>
        </Box>
      </HeroSection>

      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          mt: { xs: 4, md: 6 },
          pt: { xs: 5, md: 7 },
          pb: { xs: 5, md: 7 },
          pl: { xs: 2, sm: 4, md: '150px', lg: '170px' },
          pr: { xs: 2, sm: 4, md: '60px', lg: '90px' },
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.6rem' } }}>
              Toutes les attractions
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.secondaryGrey, maxWidth: { md: '720px' } }}
            >
              Parcours, VR, spectacles ou ateliers : découvre l'ensemble du parc et filtre par
              catégorie ou niveau de frisson pour trouver l'expérience parfaite.
            </Typography>
          </Box>

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
                  Filtrer les expériences
                </Typography>
                <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
                  {filteredActivities.length} expérience(s) affichée(s)
                </Typography>
              </Stack>

              <Divider sx={{ borderColor: colors.secondaryGrey }} />

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
                      maxWidth: 420,
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

          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {filteredActivities.map((activity) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={activity.id} sx={{ display: 'flex' }}>
                <ActivityCard
                  id={activity.id}
                  name={activity.name}
                  category={activity.category}
                  image={activity.images?.[0]}
                />
              </Grid>
            ))}
          </Grid>

          {filteredActivities.length === 0 && (
            <Box
              sx={{
                border: `1px dashed ${colors.secondaryGrey}`,
                p: 4,
                textAlign: 'center',
                color: colors.secondaryGrey,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Aucune attraction ne correspond à ces filtres
              </Typography>
              <Typography variant="body2">
                Essaye une autre catégorie ou réduis l'intensité minimale.
              </Typography>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};