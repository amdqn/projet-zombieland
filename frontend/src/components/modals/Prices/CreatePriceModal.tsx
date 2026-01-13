import { Alert, Box, MenuItem, Modal, Select, Typography, FormControl, InputLabel, TextField } from '@mui/material';
import { useState } from 'react';
import { colors } from '../../../theme';
import { PrimaryButton } from '../../common';
import {createPrice} from "../../../services/prices.ts";

import {PRICES_TYPES} from "../../../utils/typePrice.ts";
import type {CreatePriceDto, PriceType} from "../../../@types/price";


interface CreatePriceModalProps {
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



export const CreatePriceModal = ({
                                     open,
                                     onClose,
                                     onCreateSuccess,
                                 }: CreatePriceModalProps) => {
    const [label, setLabel] = useState<string>('');
    const [type, setType] = useState<PriceType | string>('');
    const [amount, setAmount] = useState<number | string>('');
    const [durationsDays, setDurationsDays] = useState<number | string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleClose = () => {
        setError(null);
        setSuccess(null);
        setLabel('');
        setType('');
        setAmount(0);
        setDurationsDays('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!label || !amount || !type || !durationsDays) {
            setError('Le nom, le tarif, le type de tarif et le nombre de jours sont requis');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const dto: CreatePriceDto = {
                label,
                type: type as PriceType,
                amount: typeof amount === 'string' ? parseFloat(amount) : amount,
                duration_days: typeof durationsDays === 'string' ? parseInt(durationsDays) : durationsDays,
            };

            await createPrice(dto);
            setSuccess('Prix crée avec succès');
            setTimeout(() => {
                onCreateSuccess();
                handleClose();
            }, 1500);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la création du prix';
            setError(message);
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
                    Créer un nouveau tarif
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
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
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
                        label="Prix"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        required
                        fullWidth
                        slotProps={{
                            input: {
                                inputProps: {
                                    step: 0.01,
                                    min: 0
                                }
                            }
                        }}
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

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: colors.secondaryGrey }}>Type de prix *</InputLabel>
                            <Select
                                value={type || ''}
                                onChange={(e) => setType(e.target.value as PriceType)}
                                label="Type de prix *"
                                required
                                displayEmpty
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <span style={{ color: colors.secondaryGrey }}>Sélectionner un type de tarif</span>;
                                    }
                                    return selected;
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
                                {PRICES_TYPES.map((priceType) => (
                                    <MenuItem key={priceType} value={priceType}>
                                        {priceType}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Durée du billet (jours)"
                            type="number"
                            value={durationsDays || ''}
                            onChange={(e) => setDurationsDays(e.target.value ? Number(e.target.value) : '')}
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    inputProps: {
                                        step: 1,
                                        min: 1
                                    }
                                }
                            }}
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
                        text={isLoading ? 'Enregistrement...' : 'Enregistrer'}
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
