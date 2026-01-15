import { Alert, Box, Modal, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { createCategory, type CreateCategoryDto } from '../../../services/categories';
import { colors } from '../../../theme';

interface CreateCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: colors.secondaryDark,
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export const CreateCategoryModal = ({
  open,
  onClose,
  onSuccess,
}: CreateCategoryModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClose = () => {
    setName('');
    setDescription('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      setError('Le nom et la description sont requis');
      return;
    }

    if (name.length > 100) {
      setError('Le nom ne doit pas dépasser 100 caractères');
      return;
    }

    if (description.length > 500) {
      setError('La description ne doit pas dépasser 500 caractères');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dto: CreateCategoryDto = {
        name,
        description,
      };

      await createCategory(dto);
      toast.success('Catégorie créée avec succès !');
      setSuccess('Catégorie créée avec succès');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de la catégorie';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={isLoading ? undefined : handleClose}>
      <Box sx={style}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: colors.primaryGreen,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Créer une nouvelle catégorie
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Nom de la catégorie"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            inputProps={{ maxLength: 100 }}
            helperText={`${name.length}/100 caractères`}
            sx={{
              '& .MuiInputLabel-root': { color: colors.secondaryGrey },
              '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
              '& .MuiOutlinedInput-root': {
                color: colors.white,
                '& fieldset': { borderColor: colors.secondaryGrey },
                '&:hover fieldset': { borderColor: colors.primaryGreen },
                '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
              },
              '& .MuiFormHelperText-root': { color: colors.secondaryGrey },
            }}
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            inputProps={{ maxLength: 500 }}
            helperText={`${description.length}/500 caractères`}
            sx={{
              '& .MuiInputLabel-root': { color: colors.secondaryGrey },
              '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
              '& .MuiOutlinedInput-root': {
                color: colors.white,
                '& fieldset': { borderColor: colors.secondaryGrey },
                '&:hover fieldset': { borderColor: colors.primaryGreen },
                '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
              },
              '& .MuiFormHelperText-root': { color: colors.secondaryGrey },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={handleClose}
              disabled={isLoading}
              sx={{
                color: colors.white,
                borderColor: colors.secondaryGrey,
                '&:hover': {
                  borderColor: colors.primaryGreen,
                  backgroundColor: `${colors.primaryGreen}20`,
                },
              }}
              variant="outlined"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !name || !description}
              variant="contained"
              sx={{
                backgroundColor: colors.primaryGreen,
                color: colors.secondaryDark,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: colors.primaryGreen,
                  opacity: 0.9,
                },
                '&:disabled': {
                  backgroundColor: colors.secondaryGrey,
                  color: colors.secondaryDark,
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: colors.secondaryDark }} /> : 'Créer'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
