
import {Card, CardContent, IconButton, Stack, Typography} from "@mui/material";
import type {Price} from "../../../@types/price";
import {colors} from "../../../theme";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {styled} from "@mui/material/styles";


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
            return "PASS 2 JOURS";
        }
        return `${price.type} - ${price.duration_days} JOUR${price.duration_days > 1 ? 'S' : ''}`;
    }

    return (
        <>
            <StyledPriceCard onClick={handleCardClick}>
                <CardContent sx={{paddingLeft: 5}}>
                    <Typography variant={"h4"}>
                        {formatPriceTitle(price)}
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                        {price.label}
                    </Typography>
                    <Typography sx={{color: "primary.main", paddingTop: 4, fontSize: 30, fontWeight: "bold"}}>
                        {price.amount} €
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                            size="small"
                            onClick={handleCardClick}
                            sx={{
                                color: colors.primaryGreen,
                                '&:hover': {
                                    backgroundColor: `${colors.primaryGreen}20`,
                                },
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleEdit}
                            sx={{
                                color: colors.primaryGreen,
                                '&:hover': {
                                    backgroundColor: `${colors.primaryGreen}20`,
                                },
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleDelete}
                            sx={{
                                color: colors.primaryRed,
                                '&:hover': {
                                    backgroundColor: `${colors.primaryRed}20`,
                                },
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </CardContent>
            </StyledPriceCard>
        </>
    )
}