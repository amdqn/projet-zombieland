import {Alert, Box, Modal, Typography} from "@mui/material";
import {getValidateEmail} from "../../../functions/validateEmail.ts";
import {useState} from "react";
import {getValidatePassword} from "../../../functions/validatePassword.ts";
import {updateProfile} from "../../../services/auth.ts";
import {colors} from "../../../theme";
import {Input, PrimaryButton} from "../../common";

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
            return "Les emails ne correspondent pas";
        }
        return null;
    };

    // Validation pour vérifier que les mots de passe correspondent
    const validatePasswordsMatch = () => {
        if (newPassword !== confirmPassword) {
            return "Les mots de passe ne correspondent pas";
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
        const newEmailErr = getValidateEmail(newEmail);
        const confirmEmailErr = getValidateEmail(confirmEmail);
        const matchError = validateEmailsMatch();

        if (newEmailErr || confirmEmailErr || matchError) {
            setError(matchError || "Veuillez corriger les erreurs");
            return;
        }

        if (newEmail === currentEmail) {
            setError("Le nouvel email est identique à l'ancien");
            return;
        }

        setIsLoading(true);

        try {
            await updateProfile({ email: newEmail });
            setSuccess("Email modifié avec succès !");
            setTimeout(() => {
                onUpdateSuccess();
                handleClose();
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour de l\'email';
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
        const newPasswordErr = getValidatePassword(newPassword);
        const confirmPasswordErr = getValidatePassword(confirmPassword);
        const matchError = validatePasswordsMatch();

        if (newPasswordErr || confirmPasswordErr || matchError) {
            setError(matchError || "Veuillez corriger les erreurs");
            return;
        }

        setIsLoading(true);

        try {
            await updateProfile({ password: newPassword });
            setSuccess("Mot de passe modifié avec succès !");
            setTimeout(() => {
                onUpdateSuccess();
                handleClose();
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe';
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
                    {modalType === 'email' ? 'Modifier l\'email' : 'Modifier le mot de passe'}
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
                            label="Nouvel email"
                            type="email"
                            placeholder="nouveau@email.com"
                            value={newEmail}
                            onChange={(e) => {
                                setNewEmail(e.target.value);
                                if (touched.newEmail) {
                                    setNewEmailError(getValidateEmail(e.target.value));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, newEmail: true });
                                setNewEmailError(getValidateEmail(newEmail));
                            }}
                            error={touched.newEmail && !!newEmailError}
                            required
                        />

                        {/* Confirmer Email */}
                        <Input
                            label="Confirmer le nouvel email"
                            type="email"
                            placeholder="nouveau@email.com"
                            value={confirmEmail}
                            onChange={(e) => {
                                setConfirmEmail(e.target.value);
                                if (touched.confirmEmail) {
                                    setConfirmEmailError(getValidateEmail(e.target.value));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, confirmEmail: true });
                                setConfirmEmailError(getValidateEmail(confirmEmail));
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
                            label="Nouveau mot de passe"
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (touched.newPassword) {
                                    setNewPasswordError(getValidatePassword(e.target.value));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, newPassword: true });
                                setNewPasswordError(getValidatePassword(newPassword));
                            }}
                            error={touched.newPassword && !!newPasswordError}
                            required
                        />

                        {/* Confirmer Mot de passe */}
                        <Input
                            label="Confirmer le nouveau mot de passe"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (touched.confirmPassword) {
                                    setConfirmPasswordError(getValidatePassword(e.target.value));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, confirmPassword: true });
                                setConfirmPasswordError(getValidatePassword(confirmPassword));
                            }}
                            error={touched.confirmPassword && !!confirmPasswordError}
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
                )}
            </Box>
        </Modal>
    );
}