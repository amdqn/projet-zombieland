import { useState } from "react";
import { Box, Typography } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Calendar } from "../../../components/common";
import { InformationCard } from "../../../components/cards";
import { colors } from "../../../theme/theme";

interface Step2SelectDateProps {
  onDataChange?: (data: { date: Date | null }) => void;
}

export const Step2SelectDate = ({ onDataChange }: Step2SelectDateProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (onDataChange) {
      onDataChange({ date });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontFamily: "'Creepster', cursive",
            color: colors.primaryRed,
          }}
        >
          QUELLE DATE ?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          Choisissez votre jour de visite
        </Typography>
      </Box>
      <Calendar 
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
      
      {selectedDate && (
        <Box sx={{ mt: 4 }}>
          <InformationCard
            icon={<CalendarTodayIcon sx={{ color: colors.primaryGreen }} />}
            title="DATE SÉLECTIONNÉE"
            date={selectedDate}
            borderColor="green"
          />
        </Box>
      )}
    </Box>
  );
};  