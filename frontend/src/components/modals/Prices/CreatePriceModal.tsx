import { Alert, Box, MenuItem, Modal, Select, Typography, FormControl, InputLabel, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme';
import { PrimaryButton } from '../../common';
import {createPrice} from "../../../services/prices.ts";

import {PRICES_TYPES} from "../../../utils/typePrice.ts";
import type {CreatePriceDto, PriceType} from "../../../@types/price";
import {toast} from "react-toastify";


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



const PRICE_TYPE_KEYS: Record<string, string> = {
    ETUDIANT: 'admin.prices.typeEtudiant',
    ADULTE: 'admin.prices.typeAdulte',
    GROUPE: 'admin.prices.typeGroupe',
    PASS_2J: 'admin.prices.typePass2J',
};

export const CreatePriceModal = ({
                                     open,
                                     onClose,
                                     onCreateSuccess,
                                 }: CreatePriceModalProps) => {
    const { t } = useTranslation();
    const [label, setLabel] = useState<string>('');
    const [labelEn, setLabelEn] = useState<string>('');
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
        setLabelEn('');
        setType('');
        setAmount(0);
        setDurationsDays('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!label || !amount || !type || !durationsDays) {
            setError(t('admin.prices.namePriceTypeDaysRequired'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const dto: CreatePriceDto = {
                label,
                label_en: labelEn || null,
                type: type as PriceType,
                amount: typeof amount === 'string' ? parseFloat(amount) : amount,
                duration_days: typeof durationsDays === 'string' ? parseInt(durationsDays) : durationsDays,
            };

            await createPrice(dto);
            toast.success(t('admin.prices.successCreate'));
            onCreateSuccess();
            handleClose();
        } catch (err) {
            const message = err instanceof Error ? err.message : t('admin.prices.errorCreate');
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
                    {t('admin.prices.createNew')}
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
                        label={t('admin.prices.labelFr')}
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
                        label={t('admin.prices.labelEn')}
                        value={labelEn}
                        onChange={(e) => setLabelEn(e.target.value)}
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
                        label={t('admin.prices.amount')}
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
                            <InputLabel sx={{ color: colors.secondaryGrey }}>{t('admin.prices.priceType')}</InputLabel>
                            <Select
                                value={type || ''}
                                onChange={(e) => setType(e.target.value as PriceType)}
                                label={t('admin.prices.priceType')}
                                required
                                displayEmpty
                                renderValue={(selected) => {
                                    return selected ? t(PRICE_TYPE_KEYS[selected] || selected) : '';
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
                                        {t(PRICE_TYPE_KEYS[priceType] || priceType)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label={t('admin.prices.ticketDurationDays')}
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
                        text={t('common.cancel')}
                        onClick={handleClose}
                        fullWidth={false}
                        disabled={isLoading}
                        type="button"
                    />
                    <PrimaryButton
                        text={isLoading ? t('admin.prices.saving') : t('admin.prices.save')}
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
