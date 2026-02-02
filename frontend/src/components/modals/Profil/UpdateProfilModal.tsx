import {Alert, Box, Modal, Typography} from "@mui/material";
import {getValidateEmail} from "../../../functions/validateEmail.ts";
import {useState} from "react";
import {getValidatePassword} from "../../../functions/validatePassword.ts";
import {updateProfile} from "../../../services/auth.ts";
import {colors} from "../../../theme";
import {Input, PrimaryButton} from "../../common";
import {useTranslation} from "react-i18next";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    modalType: 'email' | 'password';
    currentEmail: string;
    onUpdateSuccess: () => void;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: colors.secondaryDark,
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

export default function UpdateProfilModal({open, onClose, modalType, currentEmail, onUpdateSuccess}: ModalProps) {
    const { t } = useTranslation();

    // États pour l'email
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');

    // États pour le mot de passe
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // États communs
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // État validation
    const [newEmailError, setNewEmailError] = useState<string | null>(null);
    const [confirmEmailError, setConfirmEmailError] = useState<string | null>(null);

    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const [touched, setTouched] = useState({
        newEmail: false,
        confirmEmail: false,
        newPassword: false,
        confirmPassword: false
    });

    // Réinitialiser les champs à la fermeture
    const handleClose = () => {
        setNewEmail('');
        setConfirmEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setNewEmailError(null);
        setConfirmEmailError(null);
        setNewPasswordError(null);
        setConfirmPasswordError(null);
        setSuccess(null);
        setError(null);
        setTouched({
            newEmail: false,
            confirmEmail: false,
            newPassword: false,
            confirmPassword: false
        });
        onClose();
    };

    // Validation pour vérifier que les emails correspondent
    const validateEmailsMatch = () => {
        if (newEmail !== confirmEmail) {
            return t('modals.profile.updateEmail.emailsDontMatch');
        }
        return null;
    };

    // Validation pour vérifier que les mots de passe correspondent
    const validatePasswordsMatch = () => {
        if (newPassword !== confirmPassword) {
            return t('modals.profile.updatePassword.passwordsDontMatch');
        }
        return null;
    };

    // Vérifier si le formulaire est valide selon le type
    const isFormValid = () => {
        if (modalType === 'email') {
            return newEmail && confirmEmail && !newEmailError && !confirmEmailError;
        } else {
            return newPassword && confirmPassword && !newPasswordError && !confirmPasswordError;
        }
    };

    // Soumission du formulaire EMAIL
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation finale
        const newEmailErr = getValidateEmail(newEmail, t);
        const confirmEmailErr = getValidateEmail(confirmEmail, t);
        const matchError = validateEmailsMatch();

        if (newEmailErr || confirmEmailErr || matchError) {
            setError(matchError || t('modals.profile.updateEmail.fixErrors'));
            return;
        }

        if (newEmail === currentEmail) {
            setError(t('modals.profile.updateEmail.sameEmail'));
            return;
        }

        setIsLoading(true);

        try {
            await updateProfile({ email: newEmail });
            setSuccess(t('modals.profile.updateEmail.success'));
            setTimeout(() => {
                onUpdateSuccess();
                handleClose();
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || t('modals.profile.updateEmail.error');
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Soumission du formulaire MOT DE PASSE
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation finale
        const newPasswordErr = getValidatePassword(newPassword, t);
        const confirmPasswordErr = getValidatePassword(confirmPassword, t);
        const matchError = validatePasswordsMatch();

        if (newPasswordErr || confirmPasswordErr || matchError) {
            setError(matchError || t('modals.profile.updatePassword.fixErrors'));
            return;
        }

        setIsLoading(true);

        try {
            await updateProfile({ password: newPassword });
            setSuccess(t('modals.profile.updatePassword.success'));
            setTimeout(() => {
                onUpdateSuccess();
                handleClose();
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || t('modals.profile.updatePassword.error');
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
        >
            <Box sx={style}>
                <Typography
                    id="modal-modal-title"
                    variant="h5"
                    component="h2"
                    sx={{
                        mb: 3,
                        color: colors.primaryGreen,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >
                    {modalType === 'email' ? t('modals.profile.updateEmail.title') : t('modals.profile.updatePassword.title')}
                </Typography>

                {/* Message d'erreur global */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}

                {/* Message de succès */}
                {success && (
                    <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
                        {success}
                    </Alert>
                )}

                {modalType === 'email' ? (
                    // ========== FORMULAIRE EMAIL ==========
                    <Box
                        component="form"
                        onSubmit={handleEmailSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%',
                        }}
                    >
                        {/* Nouvel Email */}
                        <Input
                            label={t('modals.profile.updateEmail.newEmail')}
                            type="email"
                            placeholder={t('modals.profile.updateEmail.emailPlaceholder')}
                            value={newEmail}
                            onChange={(e) => {
                                setNewEmail(e.target.value);
                                if (touched.newEmail) {
                                    setNewEmailError(getValidateEmail(e.target.value, t));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, newEmail: true });
                                setNewEmailError(getValidateEmail(newEmail, t));
                            }}
                            error={touched.newEmail && !!newEmailError}
                            required
                        />

                        {/* Confirmer Email */}
                        <Input
                            label={t('modals.profile.updateEmail.confirmEmail')}
                            type="email"
                            placeholder={t('modals.profile.updateEmail.emailPlaceholder')}
                            value={confirmEmail}
                            onChange={(e) => {
                                setConfirmEmail(e.target.value);
                                if (touched.confirmEmail) {
                                    setConfirmEmailError(getValidateEmail(e.target.value, t));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, confirmEmail: true });
                                setConfirmEmailError(getValidateEmail(confirmEmail, t));
                            }}
                            error={touched.confirmEmail && !!confirmEmailError}
                            required
                        />

                        {/* Boutons */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <PrimaryButton
                                text="Annuler"
                                onClick={handleClose}
                                disabled={isLoading}
                                fullWidth
                            />
                            <PrimaryButton
                                text={isLoading ? "Modification..." : "Modifier"}
                                type="submit"
                                disabled={!isFormValid() || isLoading}
                                fullWidth
                            />
                        </Box>
                    </Box>
                ) : (
                    // ========== FORMULAIRE MOT DE PASSE ==========
                    <Box
                        component="form"
                        onSubmit={handlePasswordSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%',
                        }}
                    >
                        {/* Nouveau Mot de passe */}
                        <Input
                            label={t('modals.profile.updatePassword.newPassword')}
                            type="password"
                            placeholder={t('modals.profile.updatePassword.passwordPlaceholder')}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (touched.newPassword) {
                                    setNewPasswordError(getValidatePassword(e.target.value, t));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, newPassword: true });
                                setNewPasswordError(getValidatePassword(newPassword, t));
                            }}
                            error={touched.newPassword && !!newPasswordError}
                            required
                        />

                        {/* Confirmer Mot de passe */}
                        <Input
                            label={t('modals.profile.updatePassword.confirmPassword')}
                            type="password"
                            placeholder={t('modals.profile.updatePassword.passwordPlaceholder')}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (touched.confirmPassword) {
                                    setConfirmPasswordError(getValidatePassword(e.target.value, t));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, confirmPassword: true });
                                setConfirmPasswordError(getValidatePassword(confirmPassword, t));
                            }}
                            error={touched.confirmPassword && !!confirmPasswordError}
                            required
                        />

                        {/* Boutons */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <PrimaryButton
                                text={t('modals.profile.updatePassword.cancel')}
                                onClick={handleClose}
                                disabled={isLoading}
                                fullWidth
                            />
                            <PrimaryButton
                                text={isLoading ? t('modals.profile.updatePassword.saving') : t('modals.profile.updatePassword.save')}
                                type="submit"
                                disabled={!isFormValid() || isLoading}
                                fullWidth
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
}