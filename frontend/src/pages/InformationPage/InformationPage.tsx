import { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Alert, LinearProgress } from '@mui/material';
import { colors } from '../../theme';
import { HeroSection } from '../../components/hero/HeroSection';
import { CustomBreadcrumbs } from '../../components/common';
import { ParkMap, MapFilters } from '../../components/map';
import { getAllMapPoints } from '../../services/map';
import { getCategories } from '../../services/categories';
import type { MapData } from '../../@types/map';
import type { Category } from '../../@types/categorie';

export function InformationPage() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['attraction', 'activity', 'poi']);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Images du hero (carousel)
  const heroImages = [
    '/homepage-images/zombie-apocalypse.jpg',
    '/activities-images/post-apocalyptic-street.jpg',
    '/activities-images/abandoned-lab.jpg',
  ];

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [mapPoints, cats] = await Promise.all([
          getAllMapPoints(),
          getCategories(),
        ]);
        setMapData(mapPoints);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Impossible de charger les données de la carte.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ backgroundColor: colors.secondaryDark, minHeight: '100vh', color: colors.white }}>
      {/* Hero Section */}
      <HeroSection images={heroImages}>
        <Box>
          <Box sx={{ pt: { xs: 2, md: 2 }, mb: { xs: 1, md: 1 } }}>
            <CustomBreadcrumbs
              items={[
                { label: 'Accueil', path: '/', showOnMobile: true },
                { label: 'Informations', showOnMobile: true },
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
            Informations du Parc
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
            Découvrez toutes les informations pratiques et explorez la carte interactive de Zombieland.
          </Typography>
        </Box>
      </HeroSection>

      {/* Contenu principal */}
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
        {/* Section À propos */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: colors.primaryGreen,
              fontFamily: 'Creepster',
              mb: 3,
              fontSize: { xs: 24, md: 32 },
            }}
          >
            À propos de Zombieland
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.white,
              fontSize: { xs: 14, md: 16 },
              lineHeight: 1.8,
              mb: 2,
            }}
          >
            Bienvenue à <strong>Zombieland</strong>, le parc d'attractions le plus terrifiant et immersif d'Europe !
            Plongez dans un monde post-apocalyptique où vous devrez survivre aux hordes de zombies tout en profitant
            d'attractions à sensations fortes, de spectacles époustouflants et d'expériences immersives inoubliables.
          </Typography>
        </Box>

        {/* Section Informations Pratiques */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: colors.primaryGreen,
              fontFamily: 'Creepster',
              mb: 3,
              fontSize: { xs: 20, md: 28 },
            }}
          >
            Informations Pratiques
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: colors.secondaryDarkAlt,
                  borderRadius: 2,
                  border: `1px solid ${colors.secondaryGrey}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: colors.primaryGreen, mb: 2, fontWeight: 'bold', fontSize: 18 }}
                >
                  🕐 Horaires
                </Typography>
                <Typography sx={{ color: colors.white, fontSize: 14 }}>
                  Mercredi - Dimanche : 10h - 22h<br />
                  Fermé : Lundi & Mardi
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: colors.secondaryDarkAlt,
                  borderRadius: 2,
                  border: `1px solid ${colors.secondaryGrey}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: colors.primaryGreen, mb: 2, fontWeight: 'bold', fontSize: 18 }}
                >
                  📍 Adresse
                </Typography>
                <Typography sx={{ color: colors.white, fontSize: 14 }}>
                  123 Avenue de l'Apocalypse<br />
                  75000 Paris, France
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: colors.secondaryDarkAlt,
                  borderRadius: 2,
                  border: `1px solid ${colors.secondaryGrey}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: colors.primaryGreen, mb: 2, fontWeight: 'bold', fontSize: 18 }}
                >
                  📞 Contact
                </Typography>
                <Typography sx={{ color: colors.white, fontSize: 14 }}>
                  Tél : 01 23 45 67 89<br />
                  Email : contact@zombieland.fr
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Section Carte Interactive */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: colors.primaryGreen,
              fontFamily: 'Creepster',
              mb: 2,
              fontSize: { xs: 20, md: 28 },
            }}
          >
            Carte Interactive du Parc
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.white,
              fontSize: { xs: 13, md: 15 },
              mb: 4,
            }}
          >
            Explorez la carte pour découvrir toutes les attractions, activités et services disponibles dans le parc.
            Utilisez les filtres pour affiner votre recherche !
          </Typography>

          {loading && (
            <LinearProgress
              sx={{
                mb: 3,
                backgroundColor: colors.secondaryGrey,
                '& .MuiLinearProgress-bar': { backgroundColor: colors.primaryGreen },
              }}
            />
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              alignItems: 'stretch',
            }}
          >
            {/* Filtres */}
            <Box
              sx={{
                width: { xs: '100%', md: '25%', lg: '20%' },
                flexShrink: 0,
              }}
            >
              <MapFilters
                categories={categories}
                selectedTypes={selectedTypes}
                onTypesChange={setSelectedTypes}
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </Box>

            {/* Carte */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <ParkMap
                data={mapData}
                loading={loading}
                error={error}
                selectedTypes={selectedTypes}
                selectedCategories={selectedCategories}
                searchQuery={searchQuery}
              />
            </Box>
          </Box>
        </Box>

        {/* Section Légende */}
        <Box
          sx={{
            p: 3,
            bgcolor: colors.secondaryDarkAlt,
            borderRadius: 2,
            border: `1px solid ${colors.secondaryGrey}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colors.primaryGreen,
              mb: 2,
              fontWeight: 'bold',
            }}
          >
            Légende de la Carte
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: colors.primaryRed,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `3px solid ${colors.white}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: 'white' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-10h2v6h-2z"/>
                  </svg>
                </Box>
                <Typography sx={{ color: colors.white, fontSize: 14 }}>
                  Attractions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: colors.primaryGreen,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `3px solid ${colors.white}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: 'white' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </Box>
                <Typography sx={{ color: colors.white, fontSize: 14 }}>
                  Activités
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: colors.white,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `3px solid ${colors.white}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: colors.secondaryDark }}>
                    <path d="M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4zM18 22v-6h3l-2.54-7.63C18.18 7.55 17.42 7 16.56 7h-.12c-.86 0-1.63.55-1.9 1.37L12 16h3v6h3zM7.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm9 0c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z"/>
                  </svg>
                </Box>
                <Typography sx={{ color: colors.white, fontSize: 14 }}>
                  Toilettes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: colors.primaryGreen,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `3px solid ${colors.white}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: 'white' }}>
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4V8h16v11z"/>
                  </svg>
                </Box>
                <Typography sx={{ color: colors.white, fontSize: 14 }}>
                  Boutiques
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
