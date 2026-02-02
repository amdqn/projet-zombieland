import { Alert, Box, MenuItem, Modal, Select, Typography, FormControl, InputLabel, Switch, FormControlLabel, TextField, Chip, Button, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createActivity, type CreateActivityDto } from '../../../services/activities.ts';
import { getCategories } from '../../../services/categories.ts';
import { getActivities } from '../../../services/activities.ts';
import { uploadActivityImage } from '../../../services/upload.ts';
import { colors } from '../../../theme';
import { PrimaryButton } from '../../common';
import type { Category } from '../../../@types/categorie';
import type { Activity } from '../../../@types/activity';
import { resolveImageUrl, DEFAULT_ACTIVITY_IMAGE } from '../../../utils/imageUtils.ts';
import {toast} from "react-toastify";

interface CreateActivityModalProps {
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

export const CreateActivityModal = ({
  open,
  onClose,
  onSuccess,
}: CreateActivityModalProps) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [attractionId, setAttractionId] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [thrillLevel, setThrillLevel] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [minAge, setMinAge] = useState<number | ''>('');
  const [accessibility, setAccessibility] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [relatedActivityIds, setRelatedActivityIds] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [cats, acts] = await Promise.all([
            getCategories(),
            getActivities(),
          ]);
          setCategories(cats);
          setAllActivities(acts);
        } catch (err) {
          console.error('Erreur lors du chargement des données:', err);
        }
      };
      fetchData();
    }
  }, [open]);

  const handleClose = () => {
    setName('');
    setNameEn('');
    setDescription('');
    setDescriptionEn('');
    setCategoryId('');
    setAttractionId('');
    setImageUrl('');
    setThrillLevel('');
    setDuration('');
    setMinAge('');
    setAccessibility('');
    setIsPublished(true);
    setRelatedActivityIds([]);
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!name || !description || !categoryId) {
      setError(t('admin.activities.nameDescriptionCategoryRequired'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dto: CreateActivityDto = {
        name,
        description,
        name_en: nameEn || null,
        description_en: descriptionEn || null,
        category_id: Number(categoryId),
        attraction_id: attractionId ? Number(attractionId) : null,
        image_url: imageUrl || null,
        thrill_level: thrillLevel ? Number(thrillLevel) : null,
        duration: duration ? Number(duration) : null,
        min_age: minAge ? Number(minAge) : null,
        accessibility: accessibility || null,
        is_published: isPublished,
        related_activity_ids: relatedActivityIds.length > 0 ? relatedActivityIds : undefined,
      };

      await createActivity(dto);
      toast.success(t('admin.activities.successCreate'));
      onSuccess();
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.activities.errorCreate');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('admin.activities.imageMaxSize'));
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const response = await uploadActivityImage(file);
      setImageUrl(response.url);
      setSuccess(t('admin.activities.imageUploaded'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('admin.activities.imageUploadError'));
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const toggleRelatedActivity = (activityId: number) => {
    setRelatedActivityIds((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            color: colors.primaryGreen,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {t('admin.activities.createNew')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('admin.activities.nameFr')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                '& fieldset': { borderColor: colors.secondaryGrey },
                '&:hover fieldset': { borderColor: colors.primaryGreen },
                '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
              },
              '& .MuiInputLabel-root': { color: colors.secondaryGrey },
              '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
            }}
          />
          <TextField
            label={t('admin.activities.nameEn')}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                '& fieldset': { borderColor: colors.secondaryGrey },
                '&:hover fieldset': { borderColor: colors.primaryGreen },
                '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
              },
              '& .MuiInputLabel-root': { color: colors.secondaryGrey },
              '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
            }}
          />

          <TextField
            label={t('admin.activities.descriptionFr')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={3}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                '& fieldset': { borderColor: colors.secondaryGrey },
                '&:hover fieldset': { borderColor: colors.primaryGreen },
                '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
              },
              '& .MuiInputLabel-root': { color: colors.secondaryGrey },
              '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
            }}
          />
          <TextField
            label={t('admin.activities.descriptionEn')}
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                '& fieldset': { borderColor: colors.secondaryGrey },
                '&:hover fieldset': { borderColor: colors.primaryGreen },
                '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
              },
              '& .MuiInputLabel-root': { color: colors.secondaryGrey },
              '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
            }}
          />

          {/* Upload d'image */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: colors.primaryGold }}>
              {t('admin.activities.imageLabel')}
            </Typography>

            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
              fullWidth
              sx={{
                borderColor: colors.secondaryGrey,
                color: colors.white,
                '&:hover': {
                  borderColor: colors.primaryGreen,
                  backgroundColor: 'rgba(118, 255, 122, 0.1)',
                },
              }}
            >
              {uploading ? t('admin.activities.uploading') : t('admin.activities.chooseImage')}
              <input
                type="file"
                hidden
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </Button>

            {/* Indicateur de chargement */}
            {uploading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CircularProgress size={20} sx={{ color: colors.primaryGreen }} />
                <Typography variant="body2" sx={{ color: colors.white }}>
                  {t('admin.activities.uploading')}
                </Typography>
              </Box>
            )}

            {/* Aperçu de l'image */}
            {imageUrl && !uploading && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={resolveImageUrl(imageUrl, DEFAULT_ACTIVITY_IMAGE)}
                  alt={t('admin.activities.preview')}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    border: `2px solid ${colors.primaryGreen}`,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mt: 1, color: colors.primaryGold }}
                >
                  {imageUrl}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: colors.secondaryGrey }}>{t('admin.activities.category')} *</InputLabel>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as number | '')}
                label={`${t('admin.activities.category')} *`}
                required
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: colors.secondaryGrey }}>{t('admin.activities.selectCategory')}</span>;
                  }
                  return categories.find(c => c.id === selected)?.name || '';
                }}
                sx={{
                  backgroundColor: colors.secondaryDarkAlt,
                  color: colors.white,
                  minWidth: '200px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.secondaryGrey },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primaryGreen },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primaryGreen },
                  '& .MuiSvgIcon-root': { color: colors.white },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t('admin.activities.thrillLevelLabel')}
              type="number"
              value={thrillLevel}
              onChange={(e) => setThrillLevel(e.target.value ? Number(e.target.value) : '')}
              inputProps={{ min: 1, max: 5 }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: colors.secondaryDarkAlt,
                  color: colors.white,
                  '& fieldset': { borderColor: colors.secondaryGrey },
                  '&:hover fieldset': { borderColor: colors.primaryGreen },
                  '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
                },
                '& .MuiInputLabel-root': { color: colors.secondaryGrey },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('admin.activities.durationMinutes')}
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
              inputProps={{ min: 1 }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: colors.secondaryDarkAlt,
                  color: colors.white,
                  '& fieldset': { borderColor: colors.secondaryGrey },
                  '&:hover fieldset': { borderColor: colors.primaryGreen },
                  '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
                },
                '& .MuiInputLabel-root': { color: colors.secondaryGrey },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
              }}
            />

            <TextField
              label={t('admin.activities.minAge')}
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value ? Number(e.target.value) : '')}
              inputProps={{ min: 0 }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: colors.secondaryDarkAlt,
                  color: colors.white,
                  '& fieldset': { borderColor: colors.secondaryGrey },
                  '&:hover fieldset': { borderColor: colors.primaryGreen },
                  '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
                },
                '& .MuiInputLabel-root': { color: colors.secondaryGrey },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
              }}
            />
          </Box>

          <TextField
            label={t('admin.activities.accessibility')}
            value={accessibility}
            onChange={(e) => setAccessibility(e.target.value)}
            placeholder={t('admin.activities.accessibilityPlaceholder')}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                '& fieldset': { borderColor: colors.secondaryGrey },
                '&:hover fieldset': { borderColor: colors.primaryGreen },
                '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
              },
              '& .MuiInputLabel-root': { color: colors.secondaryGrey },
              '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
            }}
          />

          <Box>
            <Typography sx={{ mb: 1, color: colors.secondaryGrey, fontSize: '0.9rem' }}>
              {t('admin.activities.relatedActivities')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: '150px', overflow: 'auto', p: 1, border: `1px solid ${colors.secondaryGrey}`, borderRadius: 1 }}>
              {allActivities.map((activity) => (
                <Chip
                  key={activity.id}
                  label={activity.name}
                  onClick={() => toggleRelatedActivity(activity.id)}
                  color={relatedActivityIds.includes(activity.id) ? 'primary' : 'default'}
                  sx={{
                    backgroundColor: relatedActivityIds.includes(activity.id) ? colors.primaryGreen : colors.secondaryDarkAlt,
                    color: colors.white,
                    '&:hover': {
                      backgroundColor: relatedActivityIds.includes(activity.id) ? colors.primaryGreen : colors.secondaryGrey,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: colors.primaryGreen,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: colors.primaryGreen,
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: colors.white }}>
                {isPublished ? t('admin.activities.published') : t('admin.activities.draft')}
              </Typography>
            }
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <PrimaryButton
            text={t('common.cancel')}
            onClick={handleClose}
            fullWidth={false}
            disabled={isLoading}
            type="button"
          />
          <PrimaryButton
            text={t('admin.activities.createLabel')}
            onClick={handleSubmit}
            fullWidth={false}
            disabled={isLoading}
            type="button"
          />
        </Box>
      </Box>
    </Modal>
  );
};
