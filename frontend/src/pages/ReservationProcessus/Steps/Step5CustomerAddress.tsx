import { Box, Typography } from "@mui/material";
import { colors } from "../../../theme";
import { Input, Select } from "../../../components/common";
import { useState, useEffect } from "react";
import { countries } from "../../../utils/countries";
import { useReservationStore } from "../../../stores/reservationStore";
import { useTranslation } from 'react-i18next';

export const Step5CustomerAddress = () => {
  const { t } = useTranslation();
  const { customerAddress, setCustomerAddress } = useReservationStore();
  const [address, setAddress] = useState(customerAddress?.address || '');
  const [city, setCity] = useState(customerAddress?.city || '');
  const [zipCode, setZipCode] = useState(customerAddress?.zipCode || '');
  const [country, setCountry] = useState(customerAddress?.country || '');

  // États pour les erreurs
  const [addressError, setAddressError] = useState('');
  const [cityError, setCityError] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');
  const [countryError, setCountryError] = useState('');

  // État pour savoir si l'utilisateur a touché les champs
  const [touched, setTouched] = useState({
    address: false,
    city: false,
    zipCode: false,
    country: false,
  });

  // Fonctions de validation
  const validateAddress = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step5.validation.addressRequired');
    }
    return '';
  };

  const validateCity = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step5.validation.cityRequired');
    }
    return '';
  };

  const validateZipCode = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step5.validation.postalCodeRequired');
    }
    const zipCodeRegex = /^\d{5}$/;
    if (!zipCodeRegex.test(value)) {
      return t('reservation.step5.validation.postalCodeInvalid');
    }
    return '';
  };

  const validateCountry = (value: string) => {
    if (!value.trim()) {
      return t('reservation.step5.validation.countryRequired');
    }
    return '';
  };


  // Synchroniser avec le store à chaque changement
  useEffect(() => {
    if (address || city || zipCode || country) {
      setCustomerAddress({ address, city, zipCode, country });
    }
  }, [address, city, zipCode, country, setCustomerAddress]);

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
          {t('reservation.step5.title')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {t('reservation.step5.subtitle')}
        </Typography>
      </Box>

      {/* Formulaire des informations client */}
      <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Input
              label={t('reservation.step5.address')}
              type="text"
              placeholder={t('reservation.step5.addressPlaceholder')}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (touched.address) {
                  setAddressError(validateAddress(e.target.value));
                }
              }}
              onBlur={() => {
                setTouched({ ...touched, address: true });
                setAddressError(validateAddress(address));
              }}
              error={touched.address && !!addressError}
              helperText={touched.address ? addressError : ''}
              required
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Input
              label={t('reservation.step5.city')}
              type="text"
              placeholder={t('reservation.step5.cityPlaceholder')}
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (touched.city) {
                  setCityError(validateCity(e.target.value));
                }
              }}
              onBlur={() => {
                setTouched({ ...touched, city: true });
                setCityError(validateCity(city));
              }}
              error={touched.city && !!cityError}
              helperText={touched.city ? cityError : ''}
              required
            />
          </Box>
        </Box>

        <Input
          label={t('reservation.step5.postalCode')}
          type="text"
          placeholder={t('reservation.step5.postalCodePlaceholder')}
          value={zipCode}
          onChange={(e) => {
            setZipCode(e.target.value);
            if (touched.zipCode) {
              setZipCodeError(validateZipCode(e.target.value));
            }
          }}
          onBlur={() => {
            setTouched({ ...touched, zipCode: true });
            setZipCodeError(validateZipCode(zipCode));
          }}
          error={touched.zipCode && !!zipCodeError}
          helperText={touched.zipCode ? zipCodeError : ''}
          required
        />

        <Select
          label={t('reservation.step5.country')}
          placeholder={t('reservation.step5.countryPlaceholder')}
          value={country}
          options={countries}
          onChange={(e) => {
            setCountry(e.target.value);
            if (touched.country) {
              setCountryError(validateCountry(e.target.value));
            }
          }}
          onBlur={() => {
            setTouched({ ...touched, country: true });
            setCountryError(validateCountry(country));
          }}
          error={touched.country && !!countryError}
          helperText={touched.country ? countryError : ''}
          required
        />
      </Box>

    </Box>
  );
};
