import { Alert, Box, MenuItem, Modal, Select, Typography, FormControl, InputLabel, Switch, FormControlLabel, TextField, Chip, Button, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createActivity, type CreateActivityDto } from '../../services/activities';
import { getCategories } from '../../services/categories';
import { getActivities } from '../../services/activities';
import { uploadActivityImage } from '../../services/upload';
import { colors } from '../../theme';
import { PrimaryButton } from '../common';
import type { Category } from '../../@types/categorie';
import type { Activity } from '../../@types/activity';
import { resolveImageUrl, DEFAULT_ACTIVITY_IMAGE } from '../../utils/imageUtils';

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
    setDescription('');
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
      setError('Le nom, la description et la catégorie sont requis');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dto: CreateActivityDto = {
        name,
        description,
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
      setSuccess('Activité créée avec succès');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de l\'activité';
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
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const response = await uploadActivityImage(file);
      setImageUrl(response.url);
      setSuccess('Image uploadée avec succès');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erreur lors de l\'upload de l\'image');
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
          Créer une nouvelle activité
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
            label="Titre"
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
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={4}
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
              Image de l'activité
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
              {uploading ? 'Upload en cours...' : 'Choisir une image'}
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
                  Upload en cours...
                </Typography>
              </Box>
            )}

            {/* Aperçu de l'image */}
            {imageUrl && !uploading && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={resolveImageUrl(imageUrl, DEFAULT_ACTIVITY_IMAGE)}
                  alt="Aperçu"
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
              <InputLabel sx={{ color: colors.secondaryGrey }}>Catégorie *</InputLabel>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as number | '')}
                label="Catégorie *"
                required
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: colors.secondaryGrey }}>Sélectionner une catégorie</span>;
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
              label="Niveau de frisson (1-5)"
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
              label="Durée (minutes)"
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
              label="Âge minimum"
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
            label="Accessibilité"
            value={accessibility}
            onChange={(e) => setAccessibility(e.target.value)}
            placeholder="Ex: Accessible, Partiellement accessible..."
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
              Activités liées
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
                {isPublished ? 'Publiée' : 'Brouillon'}
              </Typography>
            }
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <PrimaryButton
            text="Annuler"
            onClick={handleClose}
            fullWidth={false}
            disabled={isLoading}
            type="button"
          />
          <PrimaryButton
            text="Créer"
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
