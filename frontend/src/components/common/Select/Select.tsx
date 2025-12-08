import { Box, Select as MuiSelect, MenuItem, FormControl, FormHelperText, Typography } from "@mui/material";
import { colors } from "../../../theme";

interface SelectProps {
  label: string;
  value?: string;
  onChange?: (e: any) => void;
  onBlur?: () => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export const Select = ({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Sélectionnez une option",
  required = false,
  error = false,
  helperText,
  fullWidth = true,
}: SelectProps) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        component="label"
        sx={{
          display: "block",
          mb: 1,
          fontFamily: "'Lexend Deca', sans-serif",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: colors.primaryGreen,
          textTransform: "uppercase",
        }}
      >
        {label}
        {required && <span style={{ color: colors.primaryGreen, marginLeft: '4px' }}>*</span>}
      </Typography>
      <FormControl fullWidth={fullWidth} error={error}>
        <MuiSelect
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          displayEmpty
          sx={{
            backgroundColor: colors.secondaryDarkAlt,
            color: value ? colors.white : colors.secondaryGrey,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.secondaryGrey,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primaryGreen,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primaryGreen,
            },
            '& .MuiSvgIcon-root': {
              color: colors.primaryGreen,
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: colors.secondaryDarkAlt,
                '& .MuiMenuItem-root': {
                  color: colors.white,
                  '&:hover': {
                    backgroundColor: colors.secondaryGrey,
                  },
                  '&.Mui-selected': {
                    backgroundColor: colors.secondaryGrey,
                    '&:hover': {
                      backgroundColor: colors.secondaryGrey,
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="" disabled sx={{ color: colors.secondaryGrey }}>
            {placeholder}
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MuiSelect>
        {helperText && (
          <FormHelperText sx={{ color: error ? colors.primaryRed : colors.secondaryGrey }}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};
