import { Alert, Box, Modal, Typography, TextField } from '@mui/material';
import { useState } from 'react';
import { colors } from '../../../theme';
import { PrimaryButton } from '../../common';
import { toast } from "react-toastify";
import { createMessage } from "../../../services/messages.ts";

interface CreateMessageModalProps {
    open: boolean;
    onClose: () => void;
    onCreateSuccess: () => void;
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

export const CreateMessageModal = ({
                                       open,
                                       onClose,
                                       onCreateSuccess,
                                   }: CreateMessageModalProps) => {
    const [content, setContent] = useState<string>('');
    const [object, setObject] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleClose = () => {
        setContent('');
        setObject('');
        setError(null);
        setSuccess(null);
        onClose();
    };

    const handleSubmit = async () => {
        // Validation
        if (!object.trim()) {
            setError('L\'objet du message est requis');
            return;
        }

        if (!content.trim()) {
            setError('Le contenu du message est requis');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await createMessage({
                content: content.trim(),
                object: object.trim(),
            });

            toast.success('Message envoyé avec succès !');
            onCreateSuccess();
            handleClose();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de l\'envoi du message';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
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
                    Créer une nouvelle conversation
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
                        label="Objet du message"
                        value={object}
                        onChange={(e) => setObject(e.target.value)}
                        required
                        fullWidth
                        placeholder="Ex: Question sur les horaires"
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
                        label="Contenu du message"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Écrivez votre message ici..."
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

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <PrimaryButton
                        text="Annuler"
                        onClick={handleClose}
                        fullWidth={false}
                        disabled={isLoading}
                        type="button"
                    />
                    <PrimaryButton
                        text={isLoading ? 'Envoi en cours...' : 'Envoyer'}
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