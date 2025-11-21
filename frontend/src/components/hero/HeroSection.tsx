import { useState, useEffect, type ReactNode } from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroWrapper = styled(Box)({
  position: 'relative',
  height: '500px',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #000 0%, #1a0000 100%)',
  '@media (max-width: 768px)': {
    height: '300px',
  },
});

const HeroBackground = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: `
    radial-gradient(circle at 20% 50%, rgba(198, 38, 40, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(58, 239, 48, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #10130C 0%, #000 100%)
  `,
  opacity: 0.8,
  zIndex: 1,
});

const HeroImage = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  opacity: 0.3,
  zIndex: 1,
  transition: 'opacity 1s ease-in-out',
});

const HeroContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
  padding: '0 50px 40px 150px',
  '@media (max-width: 768px)': {
    padding: '25px',
  },
});

interface HeroSectionProps {
  images?: string[];
  children: ReactNode;
}

export const HeroSection = ({ images = [], children }: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <HeroWrapper>
      <HeroBackground />
      {images && images.length > 0 && (
        <HeroImage
          sx={{
            backgroundImage: `url(${images[currentImageIndex]})`,
          }}
        />
      )}
      <HeroContent>{children}</HeroContent>
    </HeroWrapper>
  );
};
