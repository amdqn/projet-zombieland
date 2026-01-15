import { Box, TextField, Typography } from "@mui/material";
import { colors } from "../../../theme";

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  variant = "outlined",
  fullWidth = true,
  required = false,
  error = false,
  helperText,
    disabled = false
}: InputProps) => {
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
      <TextField
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        variant={variant}
        fullWidth={fullWidth}
        required={required}
        error={error}
        helperText={helperText}
        disabled={disabled}
        sx={{
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
          '& .MuiInputBase-input': {
            color: colors.white,
          },
          '& .MuiFormHelperText-root': {
            color: error ? colors.primaryRed : colors.secondaryGrey,
          },
        }}
      />
    </Box>
  );
};