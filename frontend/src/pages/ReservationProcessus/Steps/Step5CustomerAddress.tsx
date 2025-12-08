import { Box, Typography } from "@mui/material";
import { colors } from "../../../theme";
import { Input, Select } from "../../../components/common";
import { useState, useEffect } from "react";
import { countries } from "../../../utils/countries";

interface Step5CustomerAddressProps {
  onDataChange: (data: { address: string; city: string; zipCode: string; country: string }) => void;
}

export const Step5CustomerAddress = ({ onDataChange }: Step5CustomerAddressProps) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

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
      return 'L\'adresse est obligatoire';
    }
    return '';
  };

  const validateCity = (value: string) => {
    if (!value.trim()) {
      return 'La ville est obligatoire';
    }
    return '';
  };

  const validateZipCode = (value: string) => {
    if (!value.trim()) {
      return 'Le code postal est obligatoire';
    }
    const zipCodeRegex = /^\d{5}$/;
    if (!zipCodeRegex.test(value)) {
      return 'Code postal invalide (5 chiffres)';
    }
    return '';
  };

  const validateCountry = (value: string) => {
    if (!value.trim()) {
      return 'Le pays est obligatoire';
    }
    return '';
  };


  // Remonter les données au parent à chaque changement
  useEffect(() => {
    onDataChange({ address, city, zipCode, country });
  }, [address, city, zipCode, country, onDataChange]);

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
          ADRESSE
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          Adresse de facturation
        </Typography>
      </Box>

      {/* Formulaire des informations client */}
      <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Input
              label="Adresse"
              type="text"
              placeholder="Votre adresse"
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
              label="Ville"
              type="text"
              placeholder="Votre ville"
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
          label="Code postal"
          type="text"
          placeholder="Votre code postal"
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
          label="Pays"
          placeholder="Sélectionnez un pays"
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
