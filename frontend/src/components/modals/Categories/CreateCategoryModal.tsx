import { Alert, Box, Modal, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClose = () => {
    setName('');
    setNameEn('');
    setDescription('');
    setDescriptionEn('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      setError(t('admin.categories.nameDescriptionRequired'));
      return;
    }

    if (name.length > 100) {
      setError(t('admin.categories.nameMaxLength'));
      return;
    }

    if (description.length > 500) {
      setError(t('admin.categories.descriptionMaxLength'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dto: CreateCategoryDto = {
        name,
        description,
        name_en: nameEn || null,
        description_en: descriptionEn || null,
      };

      await createCategory(dto);
      toast.success(t('admin.categories.successCreate'));
      setSuccess(t('admin.categories.successCreate'));
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.categories.errorCreate');
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
          {t('admin.categories.createNew')}
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
            label={t('admin.categories.nameFr')}
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            inputProps={{ maxLength: 100 }}
            helperText={t('admin.categories.charactersCount', { current: name.length, max: 100 })}
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
            label={t('admin.categories.nameEn')}
            variant="outlined"
            fullWidth
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            inputProps={{ maxLength: 100 }}
            helperText={t('admin.categories.charactersCount', { current: nameEn.length, max: 100 })}
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
            label={t('admin.categories.descriptionFr')}
            variant="outlined"
            fullWidth
            required
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            inputProps={{ maxLength: 500 }}
            helperText={t('admin.categories.charactersCount', { current: description.length, max: 500 })}
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
            label={t('admin.categories.descriptionEn')}
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            inputProps={{ maxLength: 500 }}
            helperText={t('admin.categories.charactersCount', { current: descriptionEn.length, max: 500 })}
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
              {t('common.cancel')}
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
              {isLoading ? <CircularProgress size={24} sx={{ color: colors.secondaryDark }} /> : t('admin.categories.createLabel')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
