import { Box, Typography } from '@mui/material';
import { colors } from '../../../theme/theme';

interface ThrillLevelProps {
  level: number;
}

export const ThrillLevel = ({ level }: ThrillLevelProps) => {
  return (
    <Box display="flex" gap={0.5} alignItems="center" mb={1}>
      {[...Array(5)].map((_, index) => (
        <Typography
          key={index}
          sx={{
            color: index < level ? '#FFFFFF' : colors.secondaryGrey,
            fontSize: { xs: '1.8rem', md: '1.5rem' },
          }}
        >
          ☠
        </Typography>
      ))}
    </Box>
  );
};
