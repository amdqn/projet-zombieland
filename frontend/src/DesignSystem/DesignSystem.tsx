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
  Divider,
  Link,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { colors } from '../theme/theme';

export const DesignSystem = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        color: theme.palette.text.primary,
        paddingTop: '2rem',
        paddingBottom: '4rem',
      }}
    >
      <Container maxWidth="lg">
        {/* Titre principal */}
        <Typography variant="h1" sx={{ mb: 4 }}>
          Charte Graphique
        </Typography>

        {/* Section Couleurs */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Couleurs
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            <Box>
              <Paper sx={{ p: 3, border: `2px solid ${colors.primaryGreen}` }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 100,
                    backgroundColor: colors.primaryGreen,
                    mb: 2,
                    border: `1px solid ${colors.secondaryDark}`,
                  }}
                />
                <Typography variant="h6">Primary Green</Typography>
                <Typography variant="body2" color="text.secondary">
                  {colors.primaryGreen}
                </Typography>
              </Paper>
            </Box>
            <Box>
              <Paper sx={{ p: 3, border: `2px solid ${colors.primaryRed}` }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 100,
                    backgroundColor: colors.primaryRed,
                    mb: 2,
                    border: `1px solid ${colors.secondaryDark}`,
                  }}
                />
                <Typography variant="h6">Primary Red</Typography>
                <Typography variant="body2" color="text.secondary">
                  {colors.primaryRed}
                </Typography>
              </Paper>
            </Box>
            <Box>
              <Paper sx={{ p: 3, border: `1px solid ${colors.secondaryGrey}` }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 100,
                    backgroundColor: colors.secondaryDark,
                    mb: 2,
                    border: `1px solid ${colors.secondaryGrey}`,
                  }}
                />
                <Typography variant="h6">Secondary Dark</Typography>
                <Typography variant="body2" color="text.secondary">
                  {colors.secondaryDark}
                </Typography>
              </Paper>
            </Box>
            <Box>
              <Paper sx={{ p: 3, border: `1px solid ${colors.secondaryGrey}` }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 100,
                    backgroundColor: colors.secondaryRed,
                    mb: 2,
                    border: `1px solid ${colors.secondaryDark}`,
                  }}
                />
                <Typography variant="h6">Secondary Red</Typography>
                <Typography variant="body2" color="text.secondary">
                  {colors.secondaryRed}
                </Typography>
              </Paper>
            </Box>
            <Box>
              <Paper sx={{ p: 3, border: `1px solid ${colors.secondaryGrey}` }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 100,
                    backgroundColor: colors.secondaryGreen,
                    mb: 2,
                    border: `1px solid ${colors.secondaryDark}`,
                  }}
                />
                <Typography variant="h6">Secondary Green</Typography>
                <Typography variant="body2" color="text.secondary">
                  {colors.secondaryGreen}
                </Typography>
              </Paper>
            </Box>
            <Box>
              <Paper sx={{ p: 3, border: `1px solid ${colors.secondaryGrey}` }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 100,
                    backgroundColor: colors.secondaryGrey,
                    mb: 2,
                    border: `1px solid ${colors.secondaryDark}`,
                  }}
                />
                <Typography variant="h6">Secondary Grey</Typography>
                <Typography variant="body2" color="text.secondary">
                  {colors.secondaryGrey}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: colors.secondaryGrey }} />

        {/* Section Typographie */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Typographie
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h1" sx={{ mb: 1 }}>
                Titre H1 - Creepster
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Font: Creepster | Size: 4rem (responsive: 2.5rem mobile)
              </Typography>
            </Box>
            <Box>
              <Typography variant="h2" sx={{ mb: 1 }}>
                Titre H2 - Creepster
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Font: Creepster | Size: 2.5rem
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ mb: 1 }}>
                Titre H3 - Creepster
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Font: Creepster | Size: 2rem
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Titre H4 - Lexend Deca
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Font: Lexend Deca | Size: 1.5rem | Weight: 700
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Titre H5 - Lexend Deca
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Font: Lexend Deca | Size: 1.2rem | Weight: 600
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Titre H6 - Lexend Deca
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Font: Lexend Deca | Size: 1rem | Weight: 600
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Font: Lexend Deca | Size: 1.1rem | Line Height: 1.8
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Body 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Font: Lexend Deca | Size: 1rem | Line Height: 1.6
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ my: 4, borderColor: colors.secondaryGrey }} />

        {/* Section Boutons */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Boutons
          </Typography>
          <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap">
            <Button variant="contained" color="primary">
              Bouton Primary
            </Button>
            <Button variant="contained" color="secondary">
              Bouton Secondary
            </Button>
            {/* <Button variant="contained" className="reserve-button">
              Bouton Réserver
            </Button> */}
            <Button variant="contained" className="back-button">
              Retour
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 4, borderColor: colors.secondaryGrey }} />

        {/* Section Cartes */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Cartes
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            <Box>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://via.placeholder.com/400x200/424242/FFFFFF?text=Image"
                  alt="Placeholder"
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Carte Simple
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Exemple de carte avec image et contenu. Parfait pour afficher
                    des activités ou des produits.
                  </Typography>
                  <Chip label="CATÉGORIE" sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Box>
            <Box>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 1, color: colors.primaryGreen }}>
                  Métrique Titre
                </Typography>
                <Typography variant="h3" sx={{ color: colors.white }}>
                  120 minutes
                </Typography>
              </Paper>
            </Box>
            <Box>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, color: colors.primaryGreen }}>
                  Carte de Contenu
                </Typography>
                <Typography variant="body1">
                  Contenu de la carte avec du texte. Cette carte peut contenir
                  toutes sortes d'informations importantes.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: colors.secondaryGrey }} />

        {/* Section Chips */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Chips / Badges
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label="ATTRACTION" />
            <Chip label="EXPERIENCE" />
            <Chip label="RESTAURANT" />
            <Chip label="HORREUR" />
            <Chip label="AVENTURE" color="primary" />
            <Chip label="FAMILLE" color="secondary" />
          </Stack>
        </Box>

        <Divider sx={{ my: 4, borderColor: colors.secondaryGrey }} />

        {/* Section Breadcrumbs */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Breadcrumbs (Fil d'Ariane)
          </Typography>
          <Breadcrumbs separator="›">
            <Link href="#" underline="hover">
              ACCUEIL
            </Link>
            <Link href="#" underline="hover">
              ATTRACTIONS
            </Link>
            <Typography>CATÉGORIE</Typography>
            <Typography>ACTIVITÉ</Typography>
          </Breadcrumbs>
        </Box>

        <Divider sx={{ my: 4, borderColor: colors.secondaryGrey }} />

        {/* Section Exemples de Composants Combinés */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Exemples de Composants Combinés
          </Typography>
          
          {/* Exemple de métrique */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Métrique
            </Typography>
            <Paper sx={{ p: 3, maxWidth: 300 }}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.primaryGreen,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                DURÉE
              </Typography>
              <Typography variant="h4" sx={{ color: colors.white, fontWeight: 700 }}>
                120 minutes
              </Typography>
            </Paper>
          </Box>

          {/* Exemple de bandeau catégorie */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Bandeau Catégorie
            </Typography>
            <Box
              sx={{
                backgroundColor: colors.primaryRed,
                border: `2px solid ${colors.primaryGreen}`,
                padding: '0.5rem 1.5rem',
                display: 'inline-block',
              }}
            >
              <Typography
                sx={{
                  color: colors.white,
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                HORREUR
              </Typography>
            </Box>
          </Box>

          {/* Exemple d'avertissement */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Avertissement
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 2,
                backgroundColor: `${colors.secondaryRed}40`,
                borderLeft: `4px solid ${colors.primaryRed}`,
                maxWidth: 600,
              }}
            >
              <Typography sx={{ fontSize: '1.5rem' }}>⚠</Typography>
              <Typography variant="body2">
                Déconseillé aux âmes sensibles et aux moins de 18 ans.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: colors.secondaryGrey }} />

        {/* Section Icônes Réseaux Sociaux */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Icônes Réseaux Sociaux
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
            <IconButton
              aria-label="Facebook"
              sx={{
                color: colors.primaryGreen,
                '&:hover': {
                  color: colors.secondaryGreen,
                  backgroundColor: `${colors.primaryGreen}20`,
                },
              }}
            >
              <Facebook fontSize="large" />
            </IconButton>
            <IconButton
              aria-label="Twitter"
              sx={{
                color: colors.primaryGreen,
                '&:hover': {
                  color: colors.secondaryGreen,
                  backgroundColor: `${colors.primaryGreen}20`,
                },
              }}
            >
              <Twitter fontSize="large" />
            </IconButton>
            <IconButton
              aria-label="Instagram"
              sx={{
                color: colors.primaryGreen,
                '&:hover': {
                  color: colors.secondaryGreen,
                  backgroundColor: `${colors.primaryGreen}20`,
                },
              }}
            >
              <Instagram fontSize="large" />
            </IconButton>
            <IconButton
              aria-label="LinkedIn"
              sx={{
                color: colors.primaryGreen,
                '&:hover': {
                  color: colors.secondaryGreen,
                  backgroundColor: `${colors.primaryGreen}20`,
                },
              }}
            >
              <LinkedIn fontSize="large" />
            </IconButton>
            <IconButton
              aria-label="YouTube"
              sx={{
                color: colors.primaryGreen,
                '&:hover': {
                  color: colors.secondaryGreen,
                  backgroundColor: `${colors.primaryGreen}20`,
                },
              }}
            >
              <YouTube fontSize="large" />
            </IconButton>
            <IconButton
              aria-label="Email"
              sx={{
                color: colors.primaryGreen,
                '&:hover': {
                  color: colors.secondaryGreen,
                  backgroundColor: `${colors.primaryGreen}20`,
                },
              }}
            >
              <Email fontSize="large" />
            </IconButton>
          </Stack>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Exemples avec liens
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: colors.primaryGreen,
                  textDecoration: 'none',
                  '&:hover': {
                    color: colors.secondaryGreen,
                  },
                }}
              >
                <IconButton
                  sx={{
                    color: colors.primaryGreen,
                    '&:hover': {
                      color: colors.secondaryGreen,
                    },
                  }}
                >
                  <Facebook />
                </IconButton>
                <Typography variant="body2">Facebook</Typography>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: colors.primaryGreen,
                  textDecoration: 'none',
                  '&:hover': {
                    color: colors.secondaryGreen,
                  },
                }}
              >
                <IconButton
                  sx={{
                    color: colors.primaryGreen,
                    '&:hover': {
                      color: colors.secondaryGreen,
                    },
                  }}
                >
                  <Twitter />
                </IconButton>
                <Typography variant="body2">Twitter</Typography>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: colors.primaryGreen,
                  textDecoration: 'none',
                  '&:hover': {
                    color: colors.secondaryGreen,
                  },
                }}
              >
                <IconButton
                  sx={{
                    color: colors.primaryGreen,
                    '&:hover': {
                      color: colors.secondaryGreen,
                    },
                  }}
                >
                  <Instagram />
                </IconButton>
                <Typography variant="body2">Instagram</Typography>
              </Link>
              <Link
                href="mailto:contact@zombieland.com"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: colors.primaryGreen,
                  textDecoration: 'none',
                  '&:hover': {
                    color: colors.secondaryGreen,
                  },
                }}
              >
                <IconButton
                  sx={{
                    color: colors.primaryGreen,
                    '&:hover': {
                      color: colors.secondaryGreen,
                    },
                  }}
                >
                  <Email />
                </IconButton>
                <Typography variant="body2">Email</Typography>
              </Link>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

