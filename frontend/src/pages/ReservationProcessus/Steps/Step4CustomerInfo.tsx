import { Box, Typography } from "@mui/material";
import { colors } from "../../../theme";
import { InformationCard } from "../../../components/cards";
import EmailIcon from '@mui/icons-material/Email';
import { useState, useEffect, useContext } from "react";
import { Input } from "../../../components/common";
import { useReservationStore } from "../../../stores/reservationStore";
import { LoginContext } from "../../../context/UserLoginContext";
import { useTranslation } from 'react-i18next';

export const Step4CustomerInfo = () => {
  const { t } = useTranslation();
  const { customerInfo, setCustomerInfo } = useReservationStore();
  const { email: loginEmail } = useContext(LoginContext);
  const [firstName, setFirstName] = useState(customerInfo?.firstName || '');
  const [lastName, setLastName] = useState(customerInfo?.lastName || '');
  const [email, setEmail] = useState(customerInfo?.email || loginEmail || '');
  const [phone, setPhone] = useState(customerInfo?.phone || '');

  // États pour les erreurs
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // État pour savoir si l'utilisateur a touché les champs
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  });

    // Charger/Réinitialiser depuis le store
    useEffect(() => {
        if (customerInfo === undefined) {
            // Nouvelle réservation → réinitialiser les champs
            setFirstName('');
            setLastName('');
            setEmail(loginEmail || '');
            setPhone('');
            setFirstNameError('');
            setLastNameError('');
            setEmailError('');
            setPhoneError('');
            setTouched({
                firstName: false,
                lastName: false,
                email: false,
                phone: false,
            });
        } else if (customerInfo) {
            setFirstName(customerInfo.firstName || '');
            setLastName(customerInfo.lastName || '');
            setEmail(customerInfo.email || loginEmail || '');
            setPhone(customerInfo.phone || '');
        }
    }, [customerInfo, loginEmail]);

    // Sauvegarder dans le store
    useEffect(() => {
        if (firstName || lastName || email || phone) {
            setCustomerInfo({ firstName, lastName, email, phone });
        }
    }, [firstName, lastName, email, phone, setCustomerInfo]);
  // Fonctions de validation
  const validateFirstName = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step4.validation.firstNameRequired');
    }
    return '';
  };

  const validateLastName = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step4.validation.lastNameRequired');
    }
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step4.validation.emailRequired');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return t('reservation.step4.validation.emailInvalid');
    }
    return '';
  };

  const validatePhone = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step4.validation.phoneRequired');
    }
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    const cleanPhone = value.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return t('reservation.step4.validation.phoneInvalid');
    }
    return '';
  };

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontFamily: "'Creepster', cursive",
            color: colors.primaryRed,
          }}
        >
          {t('reservation.step4.title')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {t('reservation.step4.subtitle')}
        </Typography>
      </Box>

      {/* Formulaire des informations client */}
      <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Input
              label={t('reservation.step4.firstName')}
              type="text"
              placeholder={t('reservation.step4.firstNamePlaceholder')}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (touched.firstName) {
                  setFirstNameError(validateFirstName(e.target.value));
                }
              }}
              onBlur={() => {
                setTouched({ ...touched, firstName: true });
                setFirstNameError(validateFirstName(firstName));
              }}
              error={touched.firstName && !!firstNameError}
              helperText={touched.firstName ? firstNameError : ''}
              required
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Input
              label={t('reservation.step4.lastName')}
              type="text"
              placeholder={t('reservation.step4.lastNamePlaceholder')}
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (touched.lastName) {
                  setLastNameError(validateLastName(e.target.value));
                }
              }}
              onBlur={() => {
                setTouched({ ...touched, lastName: true });
                setLastNameError(validateLastName(lastName));
              }}
              error={touched.lastName && !!lastNameError}
              helperText={touched.lastName ? lastNameError : ''}
              required
            />
          </Box>
        </Box>

        <Input
          label={t('reservation.step4.email')}
          type="email"
          placeholder={t('reservation.step4.emailPlaceholder')}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (touched.email) {
              setEmailError(validateEmail(e.target.value));
            }
          }}
          onBlur={() => {
            setTouched({ ...touched, email: true });
            setEmailError(validateEmail(email));
          }}
          error={touched.email && !!emailError}
          helperText={touched.email ? emailError : ''}
          required
        />

        <Input
          label={t('reservation.step4.phone')}
          type="tel"
          placeholder={t('reservation.step4.phonePlaceholder')}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (touched.phone) {
              setPhoneError(validatePhone(e.target.value));
            }
          }}
          onBlur={() => {
            setTouched({ ...touched, phone: true });
            setPhoneError(validatePhone(phone));
          }}
          error={touched.phone && !!phoneError}
          helperText={touched.phone ? phoneError : ''}
          required
        />
      </Box>

      {/* Card : Confirmation par email */}
      <InformationCard borderColor="green">
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <EmailIcon
            sx={{
              color: colors.white,
              fontSize: "2rem",
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography
              sx={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: { xs: "1rem", md: "1.1rem" },
                fontWeight: 700,
                color: colors.primaryGreen,
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              {t('reservation.step4.emailConfirmation')}
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
                color: colors.white,
              }}
            >
              {t('reservation.step4.emailConfirmationText')}
            </Typography>
          </Box>
        </Box>
      </InformationCard>

    </Box>
  );
};
