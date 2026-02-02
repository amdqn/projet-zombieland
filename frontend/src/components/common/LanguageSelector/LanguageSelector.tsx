import { FormControl, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme';
import type { SelectChangeEvent } from '@mui/material/Select';

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  };

  return (
    <FormControl
      sx={{
        minWidth: 120,
        '& .MuiOutlinedInput-root': {
          backgroundColor: colors.secondaryDarkAlt,
          color: colors.white,
          '& fieldset': {
            borderColor: colors.secondaryGrey,
          },
          '&:hover fieldset': {
            borderColor: colors.primaryGreen,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primaryGreen,
          },
        },
        '& .MuiSvgIcon-root': {
          color: colors.primaryGreen,
        },
      }}
    >
      <Select
        value={i18n.language?.split('-')[0] || 'fr'}
        onChange={handleLanguageChange}
        displayEmpty
        size="small"
      >
        <MenuItem value="fr">{t('language.french')}</MenuItem>
        <MenuItem value="en">{t('language.english')}</MenuItem>
      </Select>
    </FormControl>
  );
};
