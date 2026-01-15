import { Box, Chip, Stack, TextField, Typography, Checkbox, FormControlLabel, Divider } from '@mui/material';
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
  const types = [
    {
      value: 'attraction',
      label: 'Attractions',
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
      label: 'Activités',
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
      value: 'poi',
      label: 'Services',
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
        placeholder="Rechercher un lieu..."
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
        Type de lieu
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3, gap: 1 }}>
        {types.map((type) => (
          <Chip
            key={type.value}
            icon={<Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>{type.icon}</Box>}
            label={type.label}
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
            Catégories
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
