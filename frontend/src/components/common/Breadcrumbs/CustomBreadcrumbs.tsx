import { Breadcrumbs, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { colors } from '../../../theme/theme';

interface BreadcrumbItem {
  label: string;
  path?: string;
  showOnMobile?: boolean;
}

interface CustomBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const CustomBreadcrumbs = ({ items }: CustomBreadcrumbsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const visibleItems = isMobile
    ? items.filter((item) => item.showOnMobile !== false)
    : items;

  return (
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
      {visibleItems.map((item, index) => {
        if (item.path) {
          return (
            <Link key={index} to={item.path}>
              {item.label}
            </Link>
          );
        }
        return <Typography key={index}>{item.label}</Typography>;
      })}
    </Breadcrumbs>
  );
};
