import { Box, Typography } from "@mui/material";
import { colors } from "../../../theme";
import { Input } from "../../../components/common";
import { useState, useEffect } from "react";
import { InformationCard } from "../../../components/cards";
import LockIcon from "@mui/icons-material/Lock";
import { useReservationStore } from "../../../stores/reservationStore";

export const Step6PaymentInfo = () => {
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
      return "Le numéro de carte est obligatoire";
    }
    const cleanValue = value.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cleanValue)) {
      return "Numéro de carte invalide (16 chiffres)";
    }
    return "";
  };

  const validateMonth = (value: string) => {
    if (!value.trim()) {
      return "Le mois est obligatoire";
    }
    const monthNum = parseInt(value);
    if (!/^\d{2}$/.test(value) || monthNum < 1 || monthNum > 12) {
      return "Mois invalide (01-12)";
    }
    return "";
  };

  const validateYear = (value: string) => {
    if (!value.trim()) {
      return "L'année est obligatoire";
    }
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(value);
    if (!/^\d{4}$/.test(value) || yearNum < currentYear) {
      return "Année invalide";
    }
    return "";
  };

  const validateCvv = (value: string) => {
    if (!value.trim()) {
      return "Le CVV est obligatoire";
    }
    if (!/^\d{3}$/.test(value)) {
      return "CVV invalide (3 chiffres)";
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
          PAIEMENT
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          Comment souhaitez-vous payer ?
        </Typography>
      </Box>

      <Box sx={{ mt: 4, mb: 4, width: "100%" }}>
        <Input
          label="Numéro de carte"
          type="text"
          placeholder="1234 5678 9123 4567"
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
              label="Mois"
              type="text"
              placeholder="MM"
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
              label="Année"
              type="text"
              placeholder="AAAA"
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
              label="CVV"
              type="text"
              placeholder="123"
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
                PAIEMENT 100% SÉCURISÉ
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  color: colors.white,
                }}
              >
                Vos données sont entièrement protégées et chiffrées
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
