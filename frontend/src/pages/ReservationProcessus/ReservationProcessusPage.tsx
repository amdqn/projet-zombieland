import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { CustomBreadcrumbs, BackButton, PrimaryButton } from '../../components/common';
import { Step1SelectTicket, Step2SelectDate, Step3Summary, Step4CustomerInfo, Step5CustomerAddress } from './Steps';
import { colors } from '../../theme/theme';

interface ReservationData {
  tickets: Array<{ ticketId: number; quantity: number }>;
  total: number;
  date?: string;
  time?: string;
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  customerAddress?: {
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  acceptedTerms: boolean;
}

const steps = [
  'Choix des billets',
  'Quelle date ?',
  'Récapitulatif',
  'Vos informations',
  'Adresse',
  'Paiement',
  'Réservation confirmée'
];

export const ReservationProcessusPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [reservationData, setReservationData] = useState<ReservationData>({
    tickets: [],
    total: 0,
    acceptedTerms: false,
  });
  const [step1View, setStep1View] = useState<'list' | 'quantity'>('list');

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleStep1Change = (data: { tickets: Array<{ ticketId: number; quantity: number }>; total: number }) => {
    setReservationData((prev) => ({
      ...prev,
      tickets: data.tickets,
      total: data.total,
    }));
  };

  const handleStep2Change = (data: { date: Date | null }) => {
    setReservationData((prev) => ({
      ...prev,
      date: data.date ? data.date.toISOString() : undefined,
    }));
  };

  const handleStep3Change = (data: { acceptedTerms: boolean }) => {
    setReservationData((prev) => ({
      ...prev,
      acceptedTerms: data.acceptedTerms,
    }));
  };

  const handleStep4Change = (data: { firstName: string; lastName: string; email: string; phone: string }) => {
    setReservationData((prev) => ({
      ...prev,
      customerInfo: data,
    }));
  };

  const handleStep5Change = (data: { address: string; city: string; zipCode: string; country: string }) => {
    setReservationData((prev) => ({
      ...prev,
      customerAddress: data,
    }));
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return reservationData.tickets.length > 0;
      case 1:
        return !!reservationData.date;
      case 2:
        return !!reservationData.acceptedTerms;
      case 3:
        // Vérifier que tous les champs sont remplis et valides
        if (!reservationData.customerInfo) return false;
        const { firstName, lastName, email, phone } = reservationData.customerInfo;

        // Vérifier que tous les champs sont remplis
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
          return false;
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return false;
        }

        // Validation téléphone
        const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
        const cleanPhone = phone.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          return false;
        }

        return true;
      case 4: {
        // Vérifier que tous les champs sont remplis et valides
        if (!reservationData.customerAddress) return false;
        const { address, city, zipCode, country } = reservationData.customerAddress;

        // Vérifier que tous les champs sont remplis
        if (!address.trim() || !city.trim() || !zipCode.trim() || !country.trim()) {
          return false;
        }

        return true;
      }
      default:
        return true;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Step1SelectTicket onDataChange={handleStep1Change} onViewChange={setStep1View} />;
      case 1:
        return <Step2SelectDate onDataChange={handleStep2Change} />;
      case 2:
        return (
          <Step3Summary
            tickets={reservationData.tickets}
            total={reservationData.total}
            date={reservationData.date}
            onDataChange={handleStep3Change}
          />
        );
      case 3:
        return (
          <Step4CustomerInfo onDataChange={handleStep4Change} />
        )
      case 4:
        return (
          <Step5CustomerAddress onDataChange={handleStep5Change} />
        )
      case 5:
        return <Box sx={{ padding: 4, textAlign: 'center' }}>Étape 6 - Paiement (à venir)</Box>;
      case 6:
        return <Box sx={{ padding: 4, textAlign: 'center' }}>Étape 7 - Réservation confirmée (à venir)</Box>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.secondaryDark, paddingTop: '80px' }}>
      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        {/* Breadcrumbs */}
        <CustomBreadcrumbs
          items={[
            { label: 'Accueil', path: '/' },
            { label: 'Réservation' },
          ]}
        />

        {/* Barre de progression */}
        <Box sx={{ mb: 4, mt: 3 }}>
          {/* Texte ÉTAPE X SUR Y */}
          <Typography
            sx={{
              textAlign: 'center',
              fontFamily: "'Lexend Deca', sans-serif",
              fontSize: { xs: '0.85rem', md: '1rem' },
              fontWeight: 700,
              textTransform: 'uppercase',
              color: colors.primaryGreen,
              letterSpacing: '0.1em',
              mb: 2,
            }}
          >
            ÉTAPE {activeStep + 1} SUR {steps.length}
          </Typography>

          {/* Barre de progression */}
          <Box
            sx={{
              width: '100%',
              height: '8px',
              backgroundColor: colors.secondaryGrey,
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
                height: '100%',
                backgroundColor: colors.primaryGreen,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        </Box>

        {/* Contenu de l'étape */}
        <Box sx={{ mb: { xs: 20, md: 16 } }}>{renderStepContent(activeStep)}</Box>

        {/* Boutons de navigation - masqués pendant la sélection de quantité */}
        {!(activeStep === 0 && step1View === 'quantity') && (
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexDirection: { xs: 'column', md: 'row' },
              padding: { xs: 2, md: 3 },
              backgroundColor: colors.secondaryDark,
              borderTop: `1px solid ${colors.secondaryGrey}`,
              zIndex: 1000,
              mt: 4,
            }}
          >
            <Box sx={{ width: { xs: '100%', md: activeStep === 0 ? '0%' : '50%' } }}>
              {activeStep > 0 && (
                <BackButton text="Retour" onClick={handleBack} />
              )}
            </Box>

            <Box sx={{ width: { xs: '100%', md: activeStep === 0 ? '100%' : '50%' } }}>
              <PrimaryButton
                text={activeStep === steps.length - 1 ? 'Confirmer' : 'CONTINUER →'}
                onClick={handleNext}
                fullWidth={true}
                disabled={!canProceed()}
              />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};