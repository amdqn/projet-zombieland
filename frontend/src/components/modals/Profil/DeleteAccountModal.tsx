import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useState } from 'react';
import { colors } from '../../../theme';
import { deleteAccount } from '../../../services/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LoginContext } from '../../../context/UserLoginContext';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/config';

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export const DeleteAccountModal = ({
  open,
  onClose,
}: DeleteAccountModalProps) => {
  const { t } = useTranslation();
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
    const confirmationWord = i18n.language === 'fr' ? 'SUPPRIMER' : 'DELETE';
    if (confirmation !== confirmationWord) {
      setError(t('modals.profile.deleteAccount.confirmationError'));
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteAccount();
      toast.success(t('modals.profile.deleteAccount.success'));
      logout();
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : t('modals.profile.deleteAccount.error');
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
        {t('modals.profile.deleteAccount.title')}
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
            {t('modals.profile.deleteAccount.warningTitle')}
          </Typography>
          <Typography variant="body2">
            {t('modals.profile.deleteAccount.warning1')}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {t('modals.profile.deleteAccount.warning2')}
          </Typography>
        </Alert>

        <Typography sx={{ color: colors.white, mb: 2 }}>
          {t('modals.profile.deleteAccount.confirmationText')}{' '}
          <strong style={{ color: colors.primaryRed }}>{t('modals.profile.deleteAccount.confirmationWord')}</strong> :
        </Typography>

        <TextField
          fullWidth
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={t('modals.profile.deleteAccount.confirmationPlaceholder')}
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
          {t('modals.profile.deleteAccount.cancel')}
        </Button>
        <Button
          onClick={handleConfirmDelete}
          disabled={isDeleting || confirmation !== (i18n.language === 'fr' ? 'SUPPRIMER' : 'DELETE')}
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
          {isDeleting ? t('modals.profile.deleteAccount.deleting') : t('modals.profile.deleteAccount.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
