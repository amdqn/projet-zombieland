import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../theme/theme';

interface BackButtonProps {
  text?: string;
  onClick?: () => void;
  href?: string;
}

export const BackButton = ({
  text = 'Retour',
  onClick,
  href,
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="outlined"
      size="large"
      onClick={handleClick}
      className="back-button"
      fullWidth
      sx={{
        backgroundColor: colors.backButtonBg,
        color: colors.white,
        border: `0.5px solid #CCCCCC`,
        borderRadius: '8px',
        padding: { xs: '0.6rem 2rem', md: '1rem 3rem' },
        fontSize: { xs: '1.2rem', md: '1.2rem' },
        fontWeight: 600,
        textTransform: 'uppercase',
        fontFamily: "'Lexend Deca', sans-serif",
        '&:hover': {
          backgroundColor: colors.backButtonBg,
          opacity: 0.8,
          border: `0.5px solid ${colors.primaryGreen}`,
        },
      }}
    >
      ← {text}
    </Button>
  );
};
