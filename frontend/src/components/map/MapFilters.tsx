import { Box, Chip, Stack, TextField, Typography, Checkbox, FormControlLabel, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme';
import type { Category } from '../../@types/categorie';

interface MapFiltersProps {
  categories: Category[];
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  selectedCategories: number[];
  onCategoriesChange: (categories: number[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MapFilters({
  categories,
  selectedTypes,
  onTypesChange,
  selectedCategories,
  onCategoriesChange,
  searchQuery,
  onSearchChange,
}: MapFiltersProps) {
  const { t } = useTranslation();
  const types = [
    {
      value: 'attraction',
      labelKey: 'info.page.map.filters.attractions',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none', stroke: 'currentColor' }}>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
          <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
      ),
      color: colors.primaryRed
    },
    {
      value: 'activity',
      labelKey: 'info.page.map.filters.activities',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none', stroke: 'currentColor' }}>
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
        </svg>
      ),
      color: colors.primaryGreen
    },
    {
      value: 'restaurant',
      labelKey: 'info.page.map.filters.restaurants',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'currentColor' }}>
          <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill="currentColor"/>
        </svg>
      ),
      color: colors.warning
    },
    {
      value: 'poi',
      labelKey: 'info.page.map.filters.services',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'currentColor' }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
        </svg>
      ),
      color: colors.secondaryGrey
    },
  ];

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: colors.secondaryDarkAlt,
        borderRadius: 2,
        border: `1px solid ${colors.secondaryGrey}`,
      }}
    >
      {/* Recherche */}
      <TextField
        fullWidth
        placeholder={t('info.page.map.filters.searchPlaceholder')}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            color: colors.white,
            bgcolor: colors.secondaryDark,
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
          '& .MuiInputBase-input::placeholder': {
            color: colors.secondaryGrey,
            opacity: 1,
          },
        }}
      />

      {/* Types de points */}
      <Typography
        variant="h6"
        sx={{
          color: colors.white,
          mb: 2,
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {t('info.page.map.filters.placeType')}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3, gap: 1 }}>
        {types.map((type) => (
          <Chip
            key={type.value}
            icon={<Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>{type.icon}</Box>}
            label={t(type.labelKey)}
            onClick={() => handleTypeToggle(type.value)}
            sx={{
              bgcolor: selectedTypes.includes(type.value) ? type.color : colors.secondaryDark,
              color: colors.white,
              border: `1px solid ${selectedTypes.includes(type.value) ? type.color : colors.secondaryGrey}`,
              '&:hover': {
                bgcolor: selectedTypes.includes(type.value) ? type.color : colors.secondaryDark,
                opacity: 0.8,
              },
              fontWeight: selectedTypes.includes(type.value) ? 'bold' : 'normal',
              '& .MuiChip-icon': {
                color: 'inherit',
                marginLeft: '8px',
              },
            }}
          />
        ))}
      </Stack>

      <Divider sx={{ bgcolor: colors.secondaryGrey, mb: 3 }} />

      {/* Catégories (seulement si attractions/activités sont sélectionnés) */}
      {(selectedTypes.includes('attraction') || selectedTypes.includes('activity')) && (
        <>
          <Typography
            variant="h6"
            sx={{
              color: colors.white,
              mb: 2,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {t('info.page.map.filters.categories')}
          </Typography>
          <Stack spacing={1}>
            {categories
              .filter((cat) => cat.name !== 'Restauration') // On filtrera la restauration séparément si besoin
              .map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      sx={{
                        color: colors.secondaryGrey,
                        '&.Mui-checked': {
                          color: colors.primaryGreen,
                        },
                      }}
                    />
                  }
                  label={category.name}
                  sx={{
                    color: colors.white,
                    '& .MuiFormControlLabel-label': {
                      fontSize: 14,
                    },
                  }}
                />
              ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
