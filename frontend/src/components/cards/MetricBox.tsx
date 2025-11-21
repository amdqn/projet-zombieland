import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../../theme/theme';
import type { ReactNode } from 'react';

const StyledMetricBox = styled(Paper)({
  backgroundColor: colors.secondaryDark,
  border: `1px solid ${colors.secondaryGrey}`,
  padding: '1.5rem',
  height: '100%',
  '& .metric-title': {
    color: colors.primaryGreen,
    fontFamily: "'Lexend Deca', sans-serif",
    fontWeight: 600,
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  '& .metric-value': {
    color: '#FFFFFF',
    fontFamily: "'Lexend Deca', sans-serif",
    fontWeight: 700,
    fontSize: '2rem',
  },
});

interface MetricBoxProps {
  title: string;
  children: ReactNode;
}

export const MetricBox = ({ title, children }: MetricBoxProps) => {
  return (
    <StyledMetricBox>
      <Typography className="metric-title">{title}</Typography>
      {children}
    </StyledMetricBox>
  );
};
