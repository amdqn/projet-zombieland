import { Alert, Box, Modal, Typography, TextField, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateUser, type UpdateUserDto } from '../../../services/users';
import { colors } from '../../../theme';
import type { User } from '../../../@types/users';

interface UpdateUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateSuccess: () => void;
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

export const UpdateUserModal = ({
  open,
  onClose,
  user,
  onUpdateSuccess,
}: UpdateUserModalProps) => {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'CLIENT'>('CLIENT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && open) {
      setPseudo(user.pseudo);
      setEmail(user.email);
      setRole(user.role);
      setError(null);
    }
  }, [user, open]);

  const handleClose = () => {
    setPseudo('');
    setEmail('');
    setRole('CLIENT');
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!pseudo || !email) {
      setError('Le nom et l\'email sont requis');
      return;
    }

    if (pseudo.length < 3) {
      setError('Le nom doit contenir au moins 3 caractères');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('L\'email n\'est pas valide');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dto: UpdateUserDto = {
        pseudo: pseudo !== user.pseudo ? pseudo : undefined,
        email: email !== user.email ? email : undefined,
        role: role !== user.role ? role : undefined,
      };

      await updateUser(user.id, dto);
      toast.success('Utilisateur mis à jour avec succès !');
      onUpdateSuccess();
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la modification de l\'utilisateur';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

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
          Modifier l'utilisateur
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Nom d'utilisateur"
            variant="outlined"
            fullWidth
            required
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': { color: colors.secondaryGrey },
              '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
              '& .MuiOutlinedInput-root': {
                color: colors.white,
                '& fieldset': { borderColor: colors.secondaryGrey },
                '&:hover fieldset': { borderColor: colors.primaryGreen },
                '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
              },
            }}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': { color: colors.secondaryGrey },
              '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryGreen },
              '& .MuiOutlinedInput-root': {
                color: colors.white,
                '& fieldset': { borderColor: colors.secondaryGrey },
                '&:hover fieldset': { borderColor: colors.primaryGreen },
                '&.Mui-focused fieldset': { borderColor: colors.primaryGreen },
              },
            }}
          />

          <FormControl fullWidth>
            <InputLabel sx={{ color: colors.secondaryGrey }}>Rôle</InputLabel>
            <Select
              value={role}
              label="Rôle"
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'CLIENT')}
              sx={{
                backgroundColor: colors.secondaryDark,
                color: colors.white,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.secondaryGrey,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primaryGreen,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primaryGreen,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: colors.secondaryDark,
                    '& .MuiMenuItem-root': {
                      color: colors.white,
                      '&:hover': {
                        backgroundColor: `${colors.primaryGreen}20`,
                      },
                      '&.Mui-selected': {
                        backgroundColor: `${colors.primaryGreen}40`,
                        '&:hover': {
                          backgroundColor: `${colors.primaryGreen}60`,
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="CLIENT">Client</MenuItem>
              <MenuItem value="ADMIN">Administrateur</MenuItem>
            </Select>
          </FormControl>

          {role !== user.role && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Vous êtes sur le point de modifier le rôle de cet utilisateur. Cette action nécessite une confirmation.
            </Alert>
          )}

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
              disabled={isLoading || !pseudo || !email}
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
              {isLoading ? <CircularProgress size={24} sx={{ color: colors.secondaryDark }} /> : 'Mettre à jour'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
