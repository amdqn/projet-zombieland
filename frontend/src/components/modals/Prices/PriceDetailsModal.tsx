import { Box, Modal, Typography, Chip, Stack } from '@mui/material';
import { colors } from '../../../theme';
import type {Price} from "../../../@types/price";
import {formatTime} from "../../../functions/formatTime.ts";
import {formatDay} from "../../../functions/formatDay.ts";

interface PriceDetailsModalProps {
    open: boolean;
    onClose: () => void;
    price: Price | null;
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

export const PriceDetailsModal = ({
                                         open,
                                         onClose,
                                         price,
                                     }: PriceDetailsModalProps) => {
    if (!price) return null;

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
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
                    Détails du prix
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                            label={price.label || 'Tarif'}
                            sx={{
                                backgroundColor: colors.primaryGreen,
                                color: colors.secondaryDark,
                                fontWeight: 600,
                            }}
                        />
                    </Stack>

                    <Typography
                        variant="h4"
                        sx={{
                            mb: 2,
                            color: colors.white,
                            fontWeight: 600,
                        }}
                    >
                        Type de tarif : {price.type}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            mb: 3,
                            color: colors.secondaryGrey,
                            lineHeight: 1.6,
                        }}
                    >
                        Prix : {price.amount}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        p: 2,
                        backgroundColor: colors.secondaryDarkAlt,
                        borderRadius: 2,
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            color: colors.primaryGreen,
                            fontWeight: 600,
                        }}
                    >
                        Informations
                    </Typography>

                    <Stack spacing={1}>
                        <Typography sx={{ color: colors.secondaryGrey }}>Nombre de jour:</Typography>
                        <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                            {price.duration_days}
                        </Typography>
                        <Typography sx={{ color: colors.secondaryGrey }}>Crée le:</Typography>
                        <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                             {formatDay(price.created_at)} à {formatTime(price.created_at)}
                        </Typography>
                        <Typography sx={{ color: colors.secondaryGrey }}>Mis à jour le:</Typography>
                        <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                            {formatDay(price.updated_at)} à {formatTime(price.updated_at)}
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};
