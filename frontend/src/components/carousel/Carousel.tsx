import { useState, useEffect, type ReactNode } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { colors } from '../../theme/theme';

interface CarouselProps {
  items: ReactNode[];
  autoPlayInterval?: number;
  itemsPerPageDesktop?: number;
  itemsPerPageTablet?: number;
  itemsPerPageMobile?: number;
}

export const Carousel = ({
  items,
  autoPlayInterval = 4000,
  itemsPerPageDesktop = 3,
  itemsPerPageTablet = 2,
  itemsPerPageMobile = 1,
}: CarouselProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const [carouselIndex, setCarouselIndex] = useState(0);

  const itemsPerPage = isMobile
    ? itemsPerPageMobile
    : isTablet
    ? itemsPerPageTablet
    : itemsPerPageDesktop;

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const totalPages = isMobile ? items.length : Math.ceil(items.length / itemsPerPage);

    const pageStartIndices: number[] = [];
    if (isMobile) {
      for (let i = 0; i < items.length; i++) {
        pageStartIndices.push(i);
      }
    } else {
      const maxIndex = Math.max(0, items.length - itemsPerPage);
      for (let i = 0; i < totalPages; i++) {
        pageStartIndices.push(i === totalPages - 1 ? maxIndex : i * itemsPerPage);
      }
    }

    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => {
        const currentPageIndex = pageStartIndices.findIndex(
          (startIndex) => prevIndex === startIndex
        );
        const currentPage = currentPageIndex >= 0 ? currentPageIndex : 0;
        const nextPage = (currentPage + 1) % totalPages;
        return pageStartIndices[nextPage];
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [items.length, isMobile, itemsPerPage, autoPlayInterval]);

  const totalPages = isMobile ? items.length : Math.ceil(items.length / itemsPerPage);
  const maxIndex = Math.max(0, items.length - itemsPerPage);

  const pageStartIndices: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    pageStartIndices.push(i === totalPages - 1 ? maxIndex : i * itemsPerPage);
  }

  const currentPageIndex = pageStartIndices.findIndex(
    (startIndex) => carouselIndex === startIndex
  );
  const currentPage = currentPageIndex >= 0 ? currentPageIndex : 0;

  const itemWidthPercentage = 100 / itemsPerPage;

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
            md: `translateX(calc(-${carouselIndex} * (${itemWidthPercentage}% + 24px)))`,
          },
          transition: 'transform 0.5s ease-in-out',
          overflow: 'visible',
        }}
      >
        {items.map((item, index) => (
          <Box
            key={index}
            sx={{
              minWidth: {
                xs: 'calc(100vw - 40px)',
                md: `calc(${itemWidthPercentage}% - 16px)`,
              },
              flexShrink: 0,
            }}
          >
            {item}
          </Box>
        ))}
      </Box>

      {items.length > 1 && (
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
                  border: `2px solid ${
                    isActive ? colors.primaryGreen : colors.secondaryGrey
                  }`,
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
