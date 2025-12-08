import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { colors } from '../../theme/theme';

interface InformationCardProps {
  icon?: ReactNode;
  title?: string;
  text?: string | string[];
  date?: Date | null;
  borderColor?: 'green' | 'red';
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

export const InformationCard = ({
  icon,
  title,
  text,
  date,
  borderColor = 'green',
  children,
  sx,
}: InformationCardProps) => {
  const formatDate = (date: Date): string => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName} ${day} ${monthName} ${year}`;
  };

  const borderColorValue = borderColor === 'green' ? colors.primaryGreen : colors.primaryRed;

  return (
    <Box
      sx={{
        backgroundColor: `rgba(${borderColor === 'green' ? '58, 239, 48' : '198, 38, 40'}, 0.1)`,
        border: `2px solid ${borderColorValue}`,
        borderRadius: '8px',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        ...sx,
      }}
    >
      {/* En-tête avec icône et titre */}
      {(icon || title) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
          
          {title && (
            <Typography
              sx={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 600,
                color: borderColorValue,
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              {title}
            </Typography>
          )}
        </Box>
      )}

      {/* Date formatée */}
      {date && (
        <Typography
          sx={{
            fontFamily: "'Lexend Deca', sans-serif",
            fontSize: { xs: '1rem', md: '1.2rem' },
            fontWeight: 400,
            color: colors.white,
            textAlign: 'center',
          }}
        >
          {formatDate(date)}
        </Typography>
      )}

      {/* Texte personnalisé (une ou plusieurs lignes) */}
      {text && (
        <Box>
          {Array.isArray(text) ? (
            text.map((line, index) => (
              <Typography
                key={index}
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  fontWeight: 400,
                  color: colors.white,
                  textAlign: 'center',
                  mb: index < text.length - 1 ? 0.5 : 0,
                }}
              >
                {line}
              </Typography>
            ))
          ) : (
            <Typography
              sx={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontWeight: 400,
                color: colors.white,
                textAlign: 'center',
              }}
            >
              {text}
            </Typography>
          )}
        </Box>
      )}

      {/* Contenu personnalisé */}
      {children}
    </Box>
  );
};

