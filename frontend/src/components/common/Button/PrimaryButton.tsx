import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface PrimaryButtonProps {
  text: string;
  textMobile?: string;
  variant?: 'desktop' | 'mobile';
  onClick?: () => void;
  href?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const PrimaryButton = ({
  text,
  textMobile,
  variant = 'desktop',
  onClick,
  href,
  fullWidth = true,
  disabled = false,
}: PrimaryButtonProps) => {
  const navigate = useNavigate();
  const isMobile = variant === 'mobile';
  const displayText = isMobile && textMobile ? textMobile : text;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={handleClick}
      disabled={disabled}
      sx={{
        width: fullWidth ? '100%' : 'auto',
        fontSize: isMobile ? '1.3rem' : { xs: '1.2rem', md: '1.2rem' },
        padding: isMobile 
          ? '18px 35px' 
          : { xs: '0.6rem 2rem', md: '1rem 3rem' },
      }}
    >
      {displayText}
    </Button>
  );
};
