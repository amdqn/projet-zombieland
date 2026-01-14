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
        <svg viewBox="0 0 24 24" width="16" height="16" style={{ fill: 'currentColor' }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-10h2v6h-2z"/>
        </svg>
      ),
      color: colors.primaryRed
    },
    {
      value: 'activity',
      label: 'Activités',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" style={{ fill: 'currentColor' }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      ),
      color: colors.primaryGreen
    },
    {
      value: 'poi',
      label: 'Services',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" style={{ fill: 'currentColor' }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
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
