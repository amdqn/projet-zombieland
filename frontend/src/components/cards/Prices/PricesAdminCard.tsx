
import {Box, Card, CardContent, IconButton, Stack, Typography} from "@mui/material";
import type {Price} from "../../../@types/price";
import {colors} from "../../../theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {styled} from "@mui/material/styles";
import { useTranslation } from 'react-i18next';


const StyledPriceCard = styled(Card)(({ theme }) => ({
    backgroundColor: colors.secondaryDark,
    border: `1px solid ${colors.secondaryGrey}`,
    height: '100%',
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        borderColor: colors.primaryGreen,
        transform: 'translateY(-3px)',
        boxShadow: `0 5px 20px ${colors.primaryGreen}40`,
    },
    '& .MuiCardContent-root': {
        padding: '1.5rem',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    [theme.breakpoints.down('sm')]: {
        minWidth: '100%',
    },
}));

interface PriceCardProps {
    price: Price;
    onEdit?: (price: Price) => void;
    onDelete?: (price: Price) => void;
    onClick?: (price: Price) => void;
}

export default function PriceAdminCard({price, onEdit, onClick, onDelete}: PriceCardProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(price);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(price);
        }
    };

    const handleCardClick = () => {
        if (onClick) {
            onClick(price);
        }
    };

    const formatPriceTitle = (price: Price) => {
        if (price.type === "PASS_2J") {
            return t('admin.prices.card.pass2d');
        }
        // Traduire les autres types si nécessaire
        switch (price.type) {
            case "ETUDIANT":
                return t('admin.prices.student');
            case "GROUPE":
                return t('admin.prices.group');
            default:
                return price.type;
        }
    }

    return (
        <StyledPriceCard
            onClick={handleCardClick}
            sx={{
                cursor: onClick ? 'pointer' : 'default',
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    {/* En-tête avec numéro de réservation, statut et actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: colors.primaryGreen,
                                    fontWeight: 700,
                                    letterSpacing: '0.05em',
                                }}
                            >
                                {price.label}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {(onEdit || onDelete) && (
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {onEdit && (
                                        <IconButton
                                            onClick={handleEdit}
                                            size="small"
                                            sx={{
                                                color: colors.primaryGreen,
                                                '&:hover': {
                                                    backgroundColor: `${colors.primaryGreen}20`,
                                                },
                                                '&.Mui-disabled': {
                                                    color: colors.secondaryGrey,
                                                },
                                            }}
                                            aria-label={t('admin.prices.card.editLabel')}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {onDelete && (
                                        <IconButton
                                            onClick={handleDelete}
                                            size="small"
                                            sx={{
                                                color: colors.primaryRed,
                                                '&:hover': {
                                                    backgroundColor: `${colors.primaryRed}20`,
                                                },
                                                '&.Mui-disabled': {
                                                    color: colors.secondaryGrey,
                                                },
                                            }}
                                            aria-label={t('admin.prices.card.deleteLabel')}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ height: '1px', backgroundColor: colors.secondaryGrey }} />

                    {/* Informations principales */}
                    <Stack spacing={1.5}>

                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: colors.secondaryGrey,
                                        textTransform: 'uppercase',
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.05em',
                                        mb: 0.5,
                                    }}
                                >
                                    {t('admin.prices.card.priceType')}
                                </Typography>
                                <Typography variant="body1" sx={{ color: colors.white, fontWeight: 600 }}>
                                    {formatPriceTitle(price)}
                                </Typography>
                            </Box>


                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: colors.secondaryGrey,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    mb: 0.5,
                                }}
                            >
                                {t('admin.prices.card.daysCount')}
                            </Typography>
                            <Typography variant="body1" sx={{ color: colors.white }}>
                                {price.duration_days}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: colors.secondaryGrey,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    mb: 0.5,
                                }}
                            >
                                {t('admin.prices.card.amount')}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: colors.primaryGreen,
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                }}
                            >
                                {locale === 'en-US' ? `€${price.amount.toFixed(2)}` : `${price.amount.toFixed(2).replace('.', ',')} €`}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </CardContent>
        </StyledPriceCard>
    )
}