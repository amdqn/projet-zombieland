import { Button } from '@mui/material';

interface ReservationButtonProps {
  variant?: 'desktop' | 'mobile';
  onClick?: () => void;
}

export const ReservationButton = ({
  variant = 'desktop',
  onClick
}: ReservationButtonProps) => {
  const isMobile = variant === 'mobile';

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={onClick}
      sx={{
        width: '100%',
        fontSize: isMobile ? '1.3rem' : '1.2rem',
        padding: isMobile ? '18px 35px' : '1rem 3rem',
      }}
    >
      {isMobile ? 'RÉSERVER' : 'RÉSERVER MAINTENANT'}
    </Button>
  );
};
