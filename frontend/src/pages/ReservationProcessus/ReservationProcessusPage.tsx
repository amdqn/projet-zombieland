import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { CustomBreadcrumbs, BackButton, PrimaryButton } from '../../components/common';
import { Step1SelectTicket, Step2SelectDate, Step3Summary, Step4CustomerInfo, Step5CustomerAddress, Step6PaymentInfo, Step7OrderConfirmed } from './Steps';
import { colors } from '../../theme/theme';
import { useReservationStore } from '../../stores/reservationStore';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const stepFromUrl = parseInt(searchParams.get('step') || '0', 10);
  const [activeStep, setActiveStep] = useState(
    stepFromUrl >= 0 && stepFromUrl < steps.length ? stepFromUrl : 0
  );
  const [step1View, setStep1View] = useState<'list' | 'quantity'>('list');
  
  // Utilisation du store Zustand
  const {
    tickets,
    total,
    date,
    acceptedTerms,
    customerInfo,
    customerAddress,
    paymentInfo,
    reset,
  } = useReservationStore();

  // Lire l'étape depuis l'URL au montage et quand l'URL change
  useEffect(() => {
    const stepFromUrl = parseInt(searchParams.get('step') || '0', 10);
    if (stepFromUrl >= 0 && stepFromUrl < steps.length && stepFromUrl !== activeStep) {
      setActiveStep(stepFromUrl);
    }
  }, [searchParams, activeStep]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      const newStep = activeStep + 1;
      setActiveStep(newStep);
      setSearchParams({ step: newStep.toString() }, { replace: true });
      // Scroll vers le haut de la page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      const newStep = activeStep - 1;
      setActiveStep(newStep);
      setSearchParams({ step: newStep.toString() }, { replace: true });
      // Scroll vers le haut de la page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return tickets.length > 0;
      case 1:
        return !!date;
      case 2:
        return acceptedTerms;
      case 3:
        // Vérifier que tous les champs sont remplis et valides
        if (!customerInfo) return false;
        const { firstName, lastName, email, phone } = customerInfo;

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
        if (!customerAddress) return false;
        const { address, city, zipCode, country } = customerAddress;

        // Vérifier que tous les champs sont remplis
        if (!address.trim() || !city.trim() || !zipCode.trim() || !country.trim()) {
          return false;
        }

        // Validation code postal (5 chiffres)
        if (!/^\d{5}$/.test(zipCode)) {
          return false;
        }

        return true;
      }
      case 5: {
        // Vérifier que tous les champs sont remplis et valides
        if (!paymentInfo) return false;
        const { cardNumber, month, year, cvv } = paymentInfo;

        // Vérifier que tous les champs sont remplis
        if (!cardNumber.trim() || !month.trim() || !year.trim() || !cvv.trim()) {
          return false;
        }

        // Validation numéro de carte (16 chiffres)
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cleanCardNumber)) {
          return false;
        }

        // Validation mois (01-12)
        const monthNum = parseInt(month);
        if (!/^\d{2}$/.test(month) || monthNum < 1 || monthNum > 12) {
          return false;
        }

        // Validation année (4 chiffres, >= année actuelle)
        const currentYear = new Date().getFullYear();
        const yearNum = parseInt(year);
        if (!/^\d{4}$/.test(year) || yearNum < currentYear) {
          return false;
        }

        // Validation CVV (3 chiffres)
        if (!/^\d{3}$/.test(cvv)) {
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
        return <Step1SelectTicket onViewChange={setStep1View} />;
      case 1:
        return <Step2SelectDate />;
      case 2:
        return <Step3Summary />;
      case 3:
        return <Step4CustomerInfo />;
      case 4:
        return <Step5CustomerAddress />;
      case 5:
        return <Step6PaymentInfo />;
      case 6:
        return <Step7OrderConfirmed />;
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
                <BackButton
                  text={activeStep === 6 ? "TÉLÉCHARGER BILLETS (PDF)" : "Retour"}
                  onClick={activeStep === 6 ? () => alert('Téléchargement du PDF à implémenter') : handleBack}
                />
              )}
            </Box>

            <Box sx={{ width: { xs: '100%', md: activeStep === 0 ? '100%' : '50%' } }}>
              <PrimaryButton
                text={
                  activeStep === 6
                    ? "RETOUR À L'ACCUEIL →"
                    : activeStep === 5
                    ? `PAYER ${total.toFixed(2).replace('.', ',')} € →`
                    : activeStep === steps.length - 1
                    ? 'Confirmer'
                    : 'CONTINUER →'
                }
                onClick={activeStep === 6 ? () => {
                  reset();
                  window.location.href = '/';
                } : handleNext}
                fullWidth={true}
                disabled={activeStep === 6 ? false : !canProceed()}
              />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};