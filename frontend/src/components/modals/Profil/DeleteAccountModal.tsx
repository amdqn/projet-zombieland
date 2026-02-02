import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useState } from 'react';
import { colors } from '../../../theme';
import { deleteAccount } from '../../../services/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LoginContext } from '../../../context/UserLoginContext';

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export const DeleteAccountModal = ({
  open,
  onClose,
}: DeleteAccountModalProps) => {
  const [confirmation, setConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useContext(LoginContext);

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmation('');
      setError(null);
      onClose();
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmation !== 'SUPPRIMER') {
      setError('Veuillez taper "SUPPRIMER" pour confirmer');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteAccount();
      toast.success('Votre compte a été supprimé avec succès');
      logout();
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression du compte";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: colors.secondaryDark,
          border: `1px solid ${colors.secondaryGrey}`,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ color: colors.primaryRed, fontWeight: 600 }}>
        Supprimer mon compte
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{
            mb: 2,
            backgroundColor: `${colors.primaryGold}20`,
            color: colors.white,
            '& .MuiAlert-icon': {
              color: colors.primaryGold,
            },
          }}
        >
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            Attention : Cette action est irréversible
          </Typography>
          <Typography variant="body2">
            Toutes vos données personnelles seront définitivement supprimées conformément au RGPD.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Si vous avez des réservations ainsi que des conversations en cours, elles seront également supprimées.
          </Typography>
        </Alert>

        <Typography sx={{ color: colors.white, mb: 2 }}>
          Pour confirmer la suppression de votre compte, veuillez taper{' '}
          <strong style={{ color: colors.primaryRed }}>SUPPRIMER</strong> dans le champ ci-dessous :
        </Typography>

        <TextField
          fullWidth
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="SUPPRIMER"
          disabled={isDeleting}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: colors.white,
              '& fieldset': { borderColor: colors.secondaryGrey },
              '&:hover fieldset': { borderColor: colors.primaryRed },
              '&.Mui-focused fieldset': { borderColor: colors.primaryRed },
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isDeleting}
          sx={{
            color: colors.white,
            borderColor: colors.secondaryGrey,
            '&:hover': {
              backgroundColor: `${colors.secondaryGrey}20`,
            },
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleConfirmDelete}
          disabled={isDeleting || confirmation !== 'SUPPRIMER'}
          variant="contained"
          sx={{
            backgroundColor: colors.primaryRed,
            '&:hover': {
              backgroundColor: colors.primaryRed,
              opacity: 0.9,
            },
            '&:disabled': {
              backgroundColor: colors.secondaryGrey,
            },
          }}
        >
          {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
