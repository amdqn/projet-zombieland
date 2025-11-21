import { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ActivityCard } from '../cards/ActivityCard';
import { colors } from '../../theme/theme';

interface Activity {
  id: number;
  name: string;
  category: string;
  images: string[];
}

interface ActivityCarouselProps {
  activities: Activity[];
}

export const ActivityCarousel = ({ activities }: ActivityCarouselProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (activities.length <= 1) {
      return;
    }

    const itemsPerPage = isMobile ? 1 : (window.innerWidth >= 900 ? 3 : 2);
    const totalPages = isMobile ? activities.length : Math.ceil(activities.length / itemsPerPage);

    const pageStartIndices: number[] = [];
    if (isMobile) {
      for (let i = 0; i < activities.length; i++) {
        pageStartIndices.push(i);
      }
    } else {
      const maxIndex = Math.max(0, activities.length - itemsPerPage);
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
  }, [activities.length, isMobile]);

  const itemsPerPage = isMobile ? 1 : 3;
  const totalPages = isMobile ? activities.length : Math.ceil(activities.length / itemsPerPage);
  const maxIndex = Math.max(0, activities.length - itemsPerPage);

  const pageStartIndices: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    pageStartIndices.push(i === totalPages - 1 ? maxIndex : i * itemsPerPage);
  }

  const currentPageIndex = pageStartIndices.findIndex((startIndex) => carouselIndex === startIndex);
  const currentPage = currentPageIndex >= 0 ? currentPageIndex : 0;

  return (
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
        {activities.map((activity) => (
          <Box
            key={activity.id}
            sx={{
              minWidth: {
                xs: 'calc(100vw - 40px)',
                md: 'calc(33.333% - 16px)',
              },
              flexShrink: 0,
            }}
          >
            <ActivityCard
              id={activity.id}
              name={activity.name}
              category={activity.category}
              image={activity.images?.[0]}
            />
          </Box>
        ))}
      </Box>

      {activities.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: 3,
          }}
        >
          {Array.from({ length: totalPages }).map((_, index) => {
            const isActive = index === currentPage;

            return (
              <Box
                key={index}
                onClick={() => {
                  const targetIndex = isMobile ? index : index * itemsPerPage;
                  setCarouselIndex(Math.min(targetIndex, maxIndex));
                }}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: isActive ? colors.primaryGreen : colors.secondaryGrey,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${isActive ? colors.primaryGreen : colors.secondaryGrey}`,
                  boxShadow: isActive ? `0 0 10px ${colors.primaryGreen}` : 'none',
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
  );
};
