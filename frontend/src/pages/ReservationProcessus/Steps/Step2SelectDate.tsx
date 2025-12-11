import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Calendar } from "../../../components/common";
import { InformationCard } from "../../../components/cards";
import { colors } from "../../../theme/theme";
import { useReservationStore } from "../../../stores/reservationStore";
import { getParkDates, type ParkDate } from "../../../services/parkDates";

export const Step2SelectDate = () => {
  const { date, dateId, setDate } = useReservationStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    date ? new Date(date) : null
  );
  const [parkDates, setParkDates] = useState<ParkDate[]>([]);

  // Récupérer les dates disponibles du parc pour les 6 prochains mois
  useEffect(() => {
    const fetchParkDates = async () => {
      try {
        // Récupérer les dates depuis aujourd'hui jusqu'à 6 mois plus tard
        const today = new Date();
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(today.getMonth() + 6);
        
        const from = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const to = `${sixMonthsLater.getFullYear()}-${String(sixMonthsLater.getMonth() + 1).padStart(2, '0')}-${String(sixMonthsLater.getDate()).padStart(2, '0')}`;
        
        const dates = await getParkDates(from, to);
        setParkDates(dates);
      } catch (error) {
        console.error('Erreur lors de la récupération des dates:', error);
      }
    };
    fetchParkDates();
  }, []);

  // Synchroniser selectedDate avec le store
  useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date));
    }
  }, [date]);

  // Re-vérifier le dateId si une date est sélectionnée mais que dateId est undefined
  // et que les parkDates sont maintenant chargées
  useEffect(() => {
    if (date && !dateId && parkDates.length > 0) {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      const matchingParkDate = parkDates.find(
        parkDate => parkDate.jour === dateString && parkDate.is_open
      );
      
      if (matchingParkDate) {
        setDate(date, matchingParkDate.id);
      }
    }
  }, [date, dateId, parkDates, setDate]);

  const handleDateSelect = (date: Date) => {
    // Formater la date pour comparaison (YYYY-MM-DD) en utilisant la date locale
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    const matchingParkDate = parkDates.find(
      parkDate => parkDate.jour === dateString && parkDate.is_open
    );
    
    if (matchingParkDate) {
      setSelectedDate(date);
      setDate(date.toISOString(), matchingParkDate.id);
    }
    // Si la date n'est pas disponible (fermée), ne rien faire (elle est déjà désactivée)
  };

  // Créer la liste des dates fermées (is_open: false) pour les désactiver dans le calendrier
  const disabledDates = parkDates
    .filter(parkDate => !parkDate.is_open)
    .map(parkDate => {
      const [year, month, day] = parkDate.jour.split('-').map(Number);
      return new Date(year, month - 1, day);
    });

  // Créer la liste des dates disponibles (is_open: true) - seules celles-ci peuvent être sélectionnées
  const availableDates = parkDates
    .filter(parkDate => parkDate.is_open)
    .map(parkDate => {
      const [year, month, day] = parkDate.jour.split('-').map(Number);
      return new Date(year, month - 1, day);
    });

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
        disabledDates={disabledDates}
        availableDates={availableDates}
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