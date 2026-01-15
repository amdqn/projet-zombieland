import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../../theme/theme';

interface CalendarProps {
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
  disabledDates?: Date[];
  availableDates?: Date[]; // Dates disponibles (seules celles-ci peuvent être sélectionnées)
  minDate?: Date;
  maxDate?: Date;
}

export const Calendar = ({
  selectedDate,
  onDateSelect,
  disabledDates = [],
  availableDates,
  minDate,
  maxDate,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateDisabled = (date: Date): boolean => {
    const dateStr = date.toDateString();
    
    // Vérifier les dates désactivées
    if (disabledDates.some(d => d.toDateString() === dateStr)) {
      return true;
    }

    // Si availableDates est défini, désactiver toutes les dates qui ne sont pas dans cette liste
    if (availableDates && availableDates.length > 0) {
      const isAvailable = availableDates.some(d => {
        const dStr = d.toDateString();
        return dStr === dateStr;
      });
      if (!isAvailable) return true;
    }

    // Vérifier minDate
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }

    // Vérifier maxDate
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (date > max) return true;
    }

    // Désactiver les dates passées
    if (date < today) return true;

    return false;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date) && onDateSelect) {
      onDateSelect(date);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    // Ajouter les jours du mois précédent pour compléter la première semaine
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonth.getDate() - i));
    }

    // Ajouter les jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Ajouter les jours du mois suivant pour compléter la dernière semaine
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  };

  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const days = getDaysInMonth(currentMonth);
  const currentMonthIndex = currentMonth.getMonth();
  const currentYear = currentMonth.getFullYear();

  return (
    <Box
      sx={{
        backgroundColor: colors.secondaryDark,
        borderRadius: 2,
        padding: 2,
        border: `1px solid ${colors.secondaryGrey}`,
        maxWidth: '500px',
        mx: 'auto',
      }}
    >
      {/* En-tête avec navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 1.5,
        }}
      >
        <Box
          onClick={handlePreviousMonth}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `2px solid ${colors.primaryGreen}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primaryGreen,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'Lexend Deca', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: colors.primaryGreen,
              color: colors.secondaryDark,
            },
          }}
        >
          ←
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontFamily: "'Lexend Deca', sans-serif",
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {monthNames[currentMonthIndex]} {currentYear}
        </Typography>

        <Box
          onClick={handleNextMonth}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `2px solid ${colors.primaryGreen}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primaryGreen,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'Lexend Deca', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: colors.primaryGreen,
              color: colors.secondaryDark,
            },
          }}
        >
          →
        </Box>
      </Box>

      {/* Noms des jours */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0.5,
          marginBottom: 0.5,
        }}
      >
        {dayNames.map((day) => (
          <Typography
            key={day}
            sx={{
              textAlign: 'center',
              color: colors.secondaryGrey,
              fontFamily: "'Lexend Deca', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Grille du calendrier */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0.5,
        }}
      >
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonthIndex;
          const isDisabled = isDateDisabled(date);
          const isSelected = isDateSelected(date);
          const isToday = date.toDateString() === today.toDateString();

          return (
            <Box
              key={index}
              onClick={() => handleDateClick(date)}
              sx={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                backgroundColor: isSelected
                  ? colors.primaryGreen
                  : isToday && !isSelected
                  ? colors.secondaryGrey
                  : isDisabled
                  ? 'rgba(128, 128, 128, 0.2)'
                  : 'transparent',
                color: isDisabled
                  ? colors.secondaryGrey
                  : isSelected
                  ? colors.secondaryDark
                  : isCurrentMonth
                  ? colors.white
                  : colors.secondaryGrey,
                opacity: isDisabled ? 0.4 : 1,
                fontFamily: "'Lexend Deca', sans-serif",
                fontWeight: isSelected || isToday ? 700 : 400,
                fontSize: '0.75rem',
                transition: 'all 0.2s ease',
                border: isSelected
                  ? `1px solid ${colors.primaryGreen}`
                  : isToday && !isSelected 
                  ? `1px solid ${colors.primaryGreen}` 
                  : `1px solid rgba(255, 255, 255, 0.3)`,
                '&:hover': {
                  backgroundColor: isSelected
                    ? colors.primaryGreen
                    : !isDisabled && !isSelected
                    ? isCurrentMonth
                      ? colors.secondaryGrey
                      : 'transparent'
                    : undefined,
                  transform: !isDisabled && !isSelected ? 'scale(1.1)' : undefined,
                },
              }}
            >
              {date.getDate()}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

