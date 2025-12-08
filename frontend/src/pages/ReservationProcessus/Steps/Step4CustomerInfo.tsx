import { Box, Typography } from "@mui/material";
import { colors } from "../../../theme";
import { InformationCard } from "../../../components/cards";
import EmailIcon from '@mui/icons-material/Email';
import { useState, useEffect } from "react";
import { Input } from "../../../components/common";

interface Step4CustomerInfoProps {
  onDataChange: (data: { firstName: string; lastName: string; email: string; phone: string }) => void;
}

export const Step4CustomerInfo = ({ onDataChange }: Step4CustomerInfoProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

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

  // Fonctions de validation
  const validateFirstName = (value: string) => {
    if (!value.trim()) {
      return 'Le prénom est obligatoire';
    }
    return '';
  };

  const validateLastName = (value: string) => {
    if (!value.trim()) {
      return 'Le nom est obligatoire';
    }
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return 'L\'email est obligatoire';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email invalide';
    }
    return '';
  };

  const validatePhone = (value: string) => {
    if (!value.trim()) {
      return 'Le téléphone est obligatoire';
    }
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    const cleanPhone = value.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return 'Numéro de téléphone invalide';
    }
    return '';
  };

  // Remonter les données au parent à chaque changement
  useEffect(() => {
    onDataChange({ firstName, lastName, email, phone });
  }, [firstName, lastName, email, phone, onDataChange]);

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
          VOS INFORMATIONS
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          Pour la confirmation de réservation.
        </Typography>
      </Box>

      {/* Formulaire des informations client */}
      <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Input
              label="Prénom"
              type="text"
              placeholder="Votre prénom"
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
              label="Nom"
              type="text"
              placeholder="Votre nom"
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
          label="Email"
          type="email"
          placeholder="votre@email.com"
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
          label="Téléphone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
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
              CONFIRMATION PAR EMAIL
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
                color: colors.white,
              }}
            >
              Vos billets seront envoyés à l'adresse email fournie
            </Typography>
          </Box>
        </Box>
      </InformationCard>

    </Box>
  );
};
