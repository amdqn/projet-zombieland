import { Box, Typography } from "@mui/material";
import { colors } from "../../../theme";
import { Input } from "../../../components/common";
import { useState, useEffect } from "react";
import { InformationCard } from "../../../components/cards";
import LockIcon from "@mui/icons-material/Lock";
import { useReservationStore } from "../../../stores/reservationStore";
import { useTranslation } from 'react-i18next';

export const Step6PaymentInfo = () => {
  const { t } = useTranslation();
  const { paymentInfo, setPaymentInfo, total } = useReservationStore();
  const [cardNumber, setCardNumber] = useState(paymentInfo?.cardNumber || "");
  const [month, setMonth] = useState(paymentInfo?.month || "");
  const [year, setYear] = useState(paymentInfo?.year || "");
  const [cvv, setCvv] = useState(paymentInfo?.cvv || "");

  // États pour les erreurs
  const [cardNumberError, setCardNumberError] = useState("");
  const [monthError, setMonthError] = useState("");
  const [yearError, setYearError] = useState("");
  const [cvvError, setCvvError] = useState("");

  // État pour savoir si l'utilisateur a touché les champs
  const [touched, setTouched] = useState({
    cardNumber: false,
    month: false,
    year: false,
    cvv: false,
  });

  // Fonctions de validation
  const validateCardNumber = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step6.validation.cardNumberRequired');
    }
    const cleanValue = value.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cleanValue)) {
      return t('reservation.step6.validation.cardNumberInvalid');
    }
    return "";
  };

  const validateMonth = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step6.validation.monthRequired');
    }
    const monthNum = parseInt(value);
    if (!/^\d{2}$/.test(value) || monthNum < 1 || monthNum > 12) {
      return t('reservation.step6.validation.monthInvalid');
    }
    return "";
  };

  const validateYear = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step6.validation.yearRequired');
    }
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(value);
    if (!/^\d{4}$/.test(value) || yearNum < currentYear) {
      return t('reservation.step6.validation.yearInvalid');
    }
    return "";
  };

  const validateCvv = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step6.validation.cvvRequired');
    }
    if (!/^\d{3}$/.test(value)) {
      return t('reservation.step6.validation.cvvInvalid');
    }
    return "";
  };

  // Synchroniser avec le store à chaque changement
  useEffect(() => {
    if (cardNumber || month || year || cvv) {
      setPaymentInfo({ cardNumber, month, year, cvv });
    }
  }, [cardNumber, month, year, cvv, setPaymentInfo]);

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
          {t('reservation.step6.title')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {t('reservation.step6.subtitle')}
        </Typography>
      </Box>

      <Box sx={{ mt: 4, mb: 4, width: "100%" }}>
        <Input
          label={t('reservation.step6.cardNumber')}
          type="text"
          placeholder={t('reservation.step6.cardNumberPlaceholder')}
          value={cardNumber}
          onChange={(e) => {
            setCardNumber(e.target.value);
            if (touched.cardNumber) {
              setCardNumberError(validateCardNumber(e.target.value));
            }
          }}
          onBlur={() => {
            setTouched({ ...touched, cardNumber: true });
            setCardNumberError(validateCardNumber(cardNumber));
          }}
          error={touched.cardNumber && !!cardNumberError}
          helperText={touched.cardNumber ? cardNumberError : ""}
          required
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Input
              label={t('reservation.step6.month')}
              type="text"
              placeholder={t('reservation.step6.monthPlaceholder')}
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                if (touched.month) {
                  setMonthError(validateMonth(e.target.value));
                }
              }}
              onBlur={() => {
                setTouched({ ...touched, month: true });
                setMonthError(validateMonth(month));
              }}
              error={touched.month && !!monthError}
              helperText={touched.month ? monthError : ""}
              required
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Input
              label={t('reservation.step6.year')}
              type="text"
              placeholder={t('reservation.step6.yearPlaceholder')}
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                if (touched.year) {
                  setYearError(validateYear(e.target.value));
                }
              }}
              onBlur={() => {
                setTouched({ ...touched, year: true });
                setYearError(validateYear(year));
              }}
              error={touched.year && !!yearError}
              helperText={touched.year ? yearError : ""}
              required
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Input
              label={t('reservation.step6.cvv')}
              type="text"
              placeholder={t('reservation.step6.cvvPlaceholder')}
              value={cvv}
              onChange={(e) => {
                setCvv(e.target.value);
                if (touched.cvv) {
                  setCvvError(validateCvv(e.target.value));
                }
              }}
              onBlur={() => {
                setTouched({ ...touched, cvv: true });
                setCvvError(validateCvv(cvv));
              }}
              error={touched.cvv && !!cvvError}
              helperText={touched.cvv ? cvvError : ""}
              required
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Card : Paiement 100% sécurisé */}
        <InformationCard borderColor="green">
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <LockIcon
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
                {t('reservation.step6.securePayment')}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  color: colors.white,
                }}
              >
                {t('reservation.step6.securePaymentText')}
              </Typography>
            </Box>
          </Box>
        </InformationCard>

        {/* Card : Montant à payer */}
        <InformationCard borderColor="red">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
              sx={{
                borderTop: `2px solid ${colors.primaryGreen}`,
                my: 1,
              }}
            />
          {/* Ligne total */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                fontWeight: 700,
                color: colors.primaryGreen,
                textTransform: "uppercase",
              }}
            >
              MONTANT À PAYER
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: { xs: "1.3rem", md: "1.5rem" },
                fontWeight: 700,
                color: colors.primaryGreen,
              }}
            >
              {total.toFixed(2).replace('.', ',')} €
            </Typography>
          </Box>
        </Box>
      </InformationCard>
      </Box>
    </Box>
  );
};
