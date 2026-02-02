import type {Conversation} from "../../../@types/messaging";
import {Badge, Box, Card, CardContent, Chip, IconButton, Stack, Typography} from "@mui/material";
import {colors} from "../../../theme";
import {styled} from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {formatDay} from "../../../functions/formatDay.ts";
import {useNavigate} from "react-router";
import MailIcon from "@mui/icons-material/Mail";
import {useContext} from "react";
import {LoginContext} from "../../../context/UserLoginContext.tsx";


const StyledConversationCard = styled(Card)(({ theme }) => ({
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

interface ConversationCardProps {
    conversation: Conversation;
}

export default function ConversationCard({conversation}: ConversationCardProps) {

    const navigate = useNavigate()
    const {userId, role} = useContext(LoginContext)

    const handleCardClick = () => {
        navigate(`/messagerie/${conversation.id}`)
    };

    const unreadCount = (() => {
        const filtered = conversation.messages?.filter((message) => {

            const isUnread = !message.is_read;
            const hasSender = message.sender?.id;
            const isNotMyMessage = message.sender?.id !== userId;

            const shouldCount = isUnread && hasSender && isNotMyMessage;

            return shouldCount;
        }) || [];

        return filtered.length;
    })();

    return (
        <>
            <StyledConversationCard onClick={handleCardClick}>
                <CardContent>
                    <Stack spacing={2}>
                        {/* En-tête avec objet conversation */}
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
                                    Objet : {conversation.object}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={conversation.status === 'OPEN' ? 'EN COURS' : 'CLOTURER'}
                                    size="small"
                                    sx={{
                                        backgroundColor: conversation.status === 'OPEN' ? colors.primaryGreen : colors.primaryRed,
                                        color: colors.white,
                                        fontWeight: 700,
                                        letterSpacing: '0.03em',
                                        minWidth: '100px',
                                    }}
                                />
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
                                <Badge
                                    badgeContent={unreadCount}
                                    color="error"
                                    invisible={unreadCount === 0}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: colors.primaryRed,
                                            color: colors.white,
                                            fontWeight: 700,
                                        }
                                    }}
                                >
                                    <MailIcon sx={{ color: colors.primaryGreen }} />
                                </Badge>
                            </Box>
                        </Box>

                        <Box sx={{ height: '1px', backgroundColor: colors.secondaryGrey }} />

                        {/* Informations principales */}
                        <Stack spacing={1.5}>
                            <Box>
                                <Typography variant="body1" sx={{ color: colors.white, fontWeight: 600 }}>
                                    Crée le {formatDay(conversation.created_at)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" sx={{ color: colors.white, fontWeight: 600 }}>
                                    Dernière mise à jour le {formatDay(conversation.created_at)}
                                </Typography>
                            </Box>
                            <Box>
                                { role === 'ADMIN' && (
                                    <Typography variant="overline" sx={{ color: colors.secondaryRed, fontWeight: 600}}>
                                        Conversation avec {conversation.user.pseudo}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </Stack>
                </CardContent>
            </StyledConversationCard>
        </>
    )
}