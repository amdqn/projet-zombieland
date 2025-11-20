import { createTheme } from '@mui/material/styles';

// Charte graphique Zombieland
export const colors = {
  primaryGreen: '#3AEF30',
  primaryRed: '#C62628',
  secondaryDark: '#10130C',
  secondaryDarkAlt: '#101010', // Variante plus sombre pour certains éléments (boutons, etc.)
  secondaryRed: '#9A3328',
  secondaryGreen: '#6B9F2A',
  secondaryGrey: '#424242',
  backButtonBg: '#101010', // Alias pour secondaryDarkAlt
  white: '#FFFFFF',
  warning: '#FFC107',
};

// Thème Material UI personnalisé
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primaryGreen,
      light: colors.secondaryGreen,
      dark: colors.secondaryGreen,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.primaryRed,
      light: colors.secondaryRed,
      dark: colors.secondaryRed,
      contrastText: colors.white,
    },
    background: {
      default: colors.secondaryDark,
      paper: colors.secondaryDark,
    },
    text: {
      primary: colors.white,
      secondary: colors.secondaryGrey,
    },
    error: {
      main: colors.primaryRed,
    },
    warning: {
      main: colors.warning,
    },
    divider: colors.secondaryGrey,
  },
  typography: {
    fontFamily: "'Lexend Deca', sans-serif",
    h1: {
      fontFamily: "'Creepster', cursive",
      fontSize: '4rem',
      fontWeight: 400,
      color: colors.primaryRed,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      textShadow: `
        2px 2px 0px ${colors.secondaryDark},
        4px 4px 0px ${colors.primaryGreen},
        6px 6px 10px rgba(0,0,0,0.8)
      `,
      '@media (max-width: 768px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontFamily: "'Creepster', cursive",
      fontSize: '2.5rem',
      color: colors.primaryRed,
      textTransform: 'uppercase',
      textShadow: `2px 2px 0px ${colors.secondaryDark}`,
    },
    h3: {
      fontFamily: "'Creepster', cursive",
      fontSize: '2rem',
      color: colors.primaryRed,
      textTransform: 'uppercase',
    },
    h4: {
      fontFamily: "'Lexend Deca', sans-serif",
      fontWeight: 700,
      fontSize: '1.5rem',
      textTransform: 'uppercase',
    },
    h5: {
      fontFamily: "'Lexend Deca', sans-serif",
      fontWeight: 600,
      fontSize: '1.2rem',
      textTransform: 'uppercase',
    },
    h6: {
      fontFamily: "'Lexend Deca', sans-serif",
      fontWeight: 600,
      fontSize: '1rem',
      textTransform: 'uppercase',
    },
    body1: {
      fontFamily: "'Lexend Deca', sans-serif",
      fontSize: '1.1rem',
      lineHeight: 1.8,
    },
    body2: {
      fontFamily: "'Lexend Deca', sans-serif",
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: "'Lexend Deca', sans-serif",
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '0.75rem 2rem',
          fontSize: '0.875rem',
          fontWeight: 700,
          color: colors.secondaryDark,
          '&.MuiButton-containedPrimary, &.MuiButton-containedSecondary': {
            borderRadius: '8px',
          },
          '&.reserve-button': {
            backgroundColor: colors.primaryRed,
            border: `2px solid ${colors.primaryGreen}`,
            color: colors.white,
            fontSize: '1.2rem',
            padding: '1rem 3rem',
            width: '100%',
            '&:hover': {
              backgroundColor: colors.secondaryRed,
              borderColor: colors.secondaryGreen,
            },
          },
          '&.back-button': {
            backgroundColor: colors.backButtonBg,
            color: colors.white,
            border: `0.5px solid #CCCCCC`,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: colors.backButtonBg,
              opacity: 0.8,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.secondaryDark,
          border: `1px solid ${colors.secondaryGrey}`,
          borderRadius: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.secondaryDark,
          border: `1px solid ${colors.secondaryGrey}`,
          borderRadius: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          border: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: colors.secondaryGrey,
          color: colors.white,
          fontFamily: "'Lexend Deca', sans-serif",
          fontWeight: 600,
          borderRadius: 0,
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          '& .MuiBreadcrumbs-li': {
            '& a': {
              color: colors.primaryGreen,
              textDecoration: 'none',
              fontFamily: "'Lexend Deca', sans-serif",
              fontSize: '0.9rem',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& .MuiTypography-root': {
              color: colors.primaryGreen,
              fontFamily: "'Lexend Deca', sans-serif",
              fontSize: '0.9rem',
            },
          },
        },
      },
    },
  },
});

export default theme;

