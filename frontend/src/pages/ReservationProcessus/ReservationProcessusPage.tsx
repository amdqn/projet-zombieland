import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { CustomBreadcrumbs, BackButton, PrimaryButton } from '../../components/common';
import { Step1SelectTicket, Step2SelectDate, Step3Summary, Step4CustomerInfo, Step5CustomerAddress, Step6PaymentInfo, Step7OrderConfirmed } from './Steps';
import { colors } from '../../theme/theme';
import { useReservationStore } from '../../stores/reservationStore';
import { createReservation } from '../../services/reservations';
import { useTranslation } from 'react-i18next';

export const ReservationProcessusPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const steps = [
    t('reservation.process.steps.selectTicket'),
    t('reservation.process.steps.selectDate'),
    t('reservation.process.steps.summary'),
    t('reservation.process.steps.customerInfo'),
    t('reservation.process.steps.address'),
    t('reservation.process.steps.payment'),
    t('reservation.process.steps.confirmation')
  ];

  const stepFromUrl = parseInt(searchParams.get('step') || '0', 10);
  const [activeStep, setActiveStep] = useState(
    stepFromUrl >= 0 && stepFromUrl < steps.length ? stepFromUrl : 0
  );
  const [step1View, setStep1View] = useState<'list' | 'quantity'>('list');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Utilisation du store Zustand
  const {
    tickets,
    total,
    date,
    dateId,
    acceptedTerms,
    customerInfo,
    customerAddress,
    paymentInfo,
    setCreatedReservations,
    reset,
  } = useReservationStore();

  // Lire l'étape depuis l'URL au montage et quand l'URL change
  // On ne dépend QUE des searchParams pour éviter un aller-retour qui provoquait un clignotement
  useEffect(() => {
    const stepFromUrl = parseInt(searchParams.get('step') || '0', 10);
    if (stepFromUrl >= 0 && stepFromUrl < steps.length && stepFromUrl !== activeStep) {
      setActiveStep(stepFromUrl);
    }
  }, [searchParams]); // activeStep volontairement omis pour éviter le flash visuel

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      const newStep = activeStep + 1;
      setActiveStep(newStep);
      setSearchParams({ step: newStep.toString() }, { replace: true });
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      const newStep = activeStep - 1;
      setActiveStep(newStep);
      setSearchParams({ step: newStep.toString() }, { replace: true });
    }
  };

  // Fonction pour créer la réservation quand on clique sur "PAYER" à l'étape 5
  const handlePayment = async () => {
    if (tickets.length === 0) {
      setPaymentError(t('reservation.process.errors.noTicketSelected'));
      return;
    }

    if (!dateId) {
      setPaymentError(t('reservation.process.errors.noDateSelected'));
      return;
    }

    // Vérifier que l'utilisateur est connecté (token présent et valide)
    const token = localStorage.getItem('token');
    if (!token) {
      setPaymentError(t('reservation.process.errors.mustBeLoggedIn'));
      window.location.href = '/login?redirect=/reservation?step=5';
      return;
    }

    // Vérifier si le token est expiré
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir en millisecondes
      const now = Date.now();
      if (exp < now) {
        setPaymentError(t('reservation.process.errors.sessionExpired'));
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('pseudo');
        window.location.href = '/login?redirect=/reservation?step=5';
        return;
      }
    } catch (error) {
      // Si on ne peut pas décoder le token, on continue quand même (le backend le rejettera)
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Créer une seule réservation avec tous les types de prices sélectionnés
      const reservationData = {
        date_id: dateId,
        tickets: tickets.map(ticket => ({
          price_id: ticket.ticketId, 
          quantity: ticket.quantity,
        })),
      };

      const createdReservation = await createReservation(reservationData);

      // Stocker le numéro de réservation pour l'affichage dans Step7OrderConfirmed
      setCreatedReservations([
        {
          reservation_number: createdReservation.reservation_number,
          price_id: 0, // Plus besoin car une seule réservation
          tickets_count: tickets.reduce((sum, t) => sum + t.quantity, 0),
        }
      ]);

      // Si tout s'est bien passé, passer à l'étape 7 (OrderConfirmed - Réservation confirmée)
      const newStep = 6; // Index 6 = étape 7 (Réservation confirmée)
      setActiveStep(newStep);
      setSearchParams({ step: newStep.toString() }, { replace: true });
      
    } catch (error) {
      let errorMessage = t('reservation.process.errors.paymentError');

      if (error instanceof Error) {
        // Si c'est une erreur 401 (Unauthorized), suggérer de se reconnecter
        if (error.message.includes('Unauthorized') || error.message.includes('401') || error.message.includes('expired')) {
          errorMessage = t('reservation.process.errors.sessionExpired');
          // Nettoyer le token expiré et rediriger vers login
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('pseudo');
          setTimeout(() => {
            window.location.href = '/login?redirect=/reservation?step=5';
          }, 2000);
        } else {
          errorMessage = error.message;
        }
      }

      setPaymentError(errorMessage);
    } finally {
      setIsProcessingPayment(false);
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
            { label: t('navigation.home'), path: '/' },
            { label: t('reservation.process.title') },
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
            {t('reservation.process.stepIndicator', { current: activeStep + 1, total: steps.length })}
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
        <Box sx={{ mb: { xs: 20, md: 16 } }}>
          {renderStepContent(activeStep)}
          
          {/* Affichage des erreurs de paiement */}
          {paymentError && activeStep === 5 && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: colors.primaryRed,
                borderRadius: '4px',
                color: colors.white,
                textAlign: 'center',
              }}
            >
              <Typography>{paymentError}</Typography>
            </Box>
          )}
        </Box>

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
                  text={activeStep === 6 ? t('reservation.process.buttons.downloadTickets') : t('reservation.process.buttons.back')}
                  onClick={activeStep === 6 ? () => alert('Téléchargement du PDF à implémenter') : handleBack}
                />
              )}
            </Box>

            <Box sx={{ width: { xs: '100%', md: activeStep === 0 ? '100%' : '50%' } }}>
              <PrimaryButton
                text={
                  activeStep === 6
                    ? t('reservation.process.buttons.backToHome')
                    : activeStep === 5
                    ? isProcessingPayment
                      ? t('reservation.process.buttons.processing')
                      : `${t('reservation.process.buttons.pay')} ${total.toFixed(2).replace('.', ',')} € →`
                    : activeStep === steps.length - 1
                    ? t('reservation.process.buttons.confirm')
                    : t('reservation.process.buttons.continue')
                }
                onClick={activeStep === 6
                  ? () => {
                      reset();
                      // replace pour éviter de revenir sur l'étape 6 avec le bouton retour navigateur
                      window.location.replace('/');
                    }
                  : activeStep === 5
                  ? handlePayment
                  : handleNext}
                fullWidth={true}
                disabled={activeStep === 6 ? false : (activeStep === 5 ? !canProceed() || isProcessingPayment : !canProceed())}
              />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};