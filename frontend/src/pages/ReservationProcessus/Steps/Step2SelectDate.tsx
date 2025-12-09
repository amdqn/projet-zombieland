import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Calendar } from "../../../components/common";
import { InformationCard } from "../../../components/cards";
import { colors } from "../../../theme/theme";
import { useReservationStore } from "../../../stores/reservationStore";

export const Step2SelectDate = () => {
  const { date, setDate } = useReservationStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    date ? new Date(date) : null
  );

  // Synchroniser selectedDate avec le store
  useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date));
    }
  }, [date]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDate(date.toISOString());
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