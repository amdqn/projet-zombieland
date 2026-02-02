import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import type {Conversation, Message} from "../../@types/messaging";
import {getOneConversation, updateConversationStatus} from "../../services/conversations.ts";
import {colors} from "../../theme";
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    IconButton,
    LinearProgress,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {CustomBreadcrumbs} from "../../components/common";
import MessageCard from "../../components/cards/Messaging/MessageCard.tsx";
import {LoginContext} from "../../context/UserLoginContext.tsx";
import {styled} from "@mui/material/styles";
import SendIcon from '@mui/icons-material/Send';
import {createMessage, deleteMessage, markMessageAsRead} from "../../services/messages.ts";
import {toast} from "react-toastify";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const BoxMessageStyle = styled(Box)(({ theme }) => ({
    backgroundColor: colors.secondaryDarkAlt,
    border: `1px solid ${colors.secondaryGrey}`,
    borderRadius: '12px',
    padding: theme.spacing(2),
    height: '500px',
    maxHeight: '70vh',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: colors.secondaryDark,
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: colors.primaryGreen,
        borderRadius: '4px',
        '&:hover': {
            backgroundColor: colors.primaryRed,
        },
    },
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(3),
        height: '600px',
    },
}));

export default function MessagingDetails() {

    const { id } = useParams();
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sendError, setSendError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { role, userId } = useContext(LoginContext)
    const [newMessage, setNewMessage] = useState<string>("");
    const [sending, setSending] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [readingError, setReadingError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [successDelete, setSuccessDelete] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const fetchConversation = async (id: number) => {
        setLoading(true);
        try {
            const response = await getOneConversation(id);
            setConversation(response);

            // Marquer tous les messages comme lu
            const unreadMessages = response.messages.filter(
                (msg: Message) => !msg.is_read && msg.sender.id !== userId
            );

            if(unreadMessages.length > 0) {
                // Marquer chaque message non lu en parallèle
                await Promise.all(
                    unreadMessages.map((msg: Message) =>
                        markMessageAsRead(msg.id).catch(err =>
                            setReadingError(`Impossible de marquer le message ${msg.id} comme lu : ${err}`)
                        )
                    )
                );
            }
        } catch (error) {
            setError(`Une erreur est survenue lors de la récupération des données : ${error}`);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        if (!newMessage.trim() || !id) return;

        setSending(true);
        setSendError(null);

        try {
            // 1. Envoyer le message avec la nouvelle signature
            await createMessage({
                conversationId: Number(id),
                content: newMessage.trim(),
            });

            // 2. Recharger la conversation complète
            await fetchConversation(Number(id));

            // 3. Réinitialiser le champ
            setNewMessage('');

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'envoi du message';
            setSendError(errorMessage);
        } finally {
            setSending(false);
        }
    }

    const handleCloture = async () => {
        if (!conversation) return;
        try {
            await updateConversationStatus(conversation.id, "CLOSED");
            toast.success("La conversation est bien clôturée.")
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            setUpdateError(`Une erreur est survenue : ${error}`)
        }
    }

    const handleDeleteMessage = async (messageId: number) => {
        if (!messageId || !conversation) return;
        try {
            const res = await deleteMessage(messageId)
            setSuccessDelete(res.message)
            setDeleteError(null)
        } catch (error) {
            setDeleteError("Une erreur est survenue lors de la suppression du message : " + error + ".")
        }
    }

    useEffect(() => {
        fetchConversation(Number(id));
    }, [id, refreshTrigger]);

    return (
        <>
            <Box sx={{ minHeight: '100vh', backgroundColor: colors.secondaryDark, paddingTop: '80px' }}>
                <Container maxWidth="lg" sx={{ paddingY: 4 }}>
                    <CustomBreadcrumbs
                        items={[
                            { label: 'Accueil', path: '/', showOnMobile: true },
                            { label: 'Mon compte', path: '/account',showOnMobile: true },
                            { label: 'Ma messagerie', path: '/messagerie', showOnMobile: true },
                            { label: 'Ma conversation', showOnMobile: true },
                        ]}
                    />

                    {loading && (
                        <LinearProgress
                            sx={{
                                mb: 3,
                                backgroundColor: colors.secondaryGrey,
                                '& .MuiLinearProgress-bar': { backgroundColor: colors.primaryGreen },
                            }}
                        />
                    )}

                    {conversation && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap'
                        }}>
                            <Box>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '1.8rem', md: '4rem' },
                                        color: colors.white,
                                        textShadow: `
                                      0 0 20px rgba(198, 38, 40, 0.8),
                                      0 0 40px rgba(58, 239, 48, 0.4),
                                      3px 3px 0 ${colors.primaryRed}
                                    `,
                                        marginBottom: { xs: '8px', md: '12px' },
                                        lineHeight: 1,
                                        letterSpacing: '2px',
                                    }}
                                >
                                    Objet : {conversation.object}
                                </Typography>
                                <Chip
                                    label={conversation.status === 'OPEN' ? 'EN COURS' : 'CLOTURER'}
                                    size="medium"
                                    sx={{
                                        backgroundColor: conversation.status === 'OPEN' ? colors.primaryGreen : colors.primaryRed,
                                        color: colors.white,
                                        fontWeight: 700,
                                        letterSpacing: '0.03em',
                                        minWidth: '100px',
                                    }}
                                />
                            </Box>

                            {role == 'ADMIN' && conversation.status == 'OPEN' && (
                                <Button
                                    variant="contained"
                                    onClick={handleCloture}
                                    sx={{
                                        backgroundColor: colors.primaryRed,
                                        color: colors.white,
                                        fontSize: { xs: '1rem', md: '1rem' },
                                        padding: { xs: '0.6rem 2rem', md: '1rem 3rem' },
                                        '&:hover': {
                                            backgroundColor: colors.primaryRed,
                                            opacity: 0.9,
                                        },
                                    }}
                                >
                                    Clôturer la conversation
                                </Button>

                            )}
                        </Box>
                    )}

                    { updateError && <Alert severity="error">{updateError}</Alert>}

                    <Container
                        maxWidth={false}
                        sx={{
                            width: '100%',
                            mt: { xs: 2, md: 3 },
                            pt: { xs: 3, md: 4 },
                            pb: { xs: 5, md: 7 },
                            pl: { xs: 2, sm: 4, md: '150px', lg: '170px' },
                            pr: { xs: 2, sm: 4, md: '60px', lg: '90px' },
                        }}
                    >
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                Update ? {error}
                            </Alert>
                        )}

                        {conversation && (
                            <BoxMessageStyle>
                                <Stack spacing={2}>
                                    {conversation.messages.map((message) => {
                                        const isOwnMessage = role === 'CLIENT'
                                            ? message.sender.role === 'CLIENT'
                                            : message.sender.role === 'ADMIN';

                                        return (
                                            <Box
                                                key={message.id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                                }}
                                            >
                                                {isOwnMessage && (
                                                    <IconButton
                                                        onClick={() => handleDeleteMessage(message.id)}
                                                        size="small"
                                                        sx={{
                                                            color: colors.primaryRed,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                                            },
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                                <MessageCard message={message} isOwn={isOwnMessage} readingError={readingError}/>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </BoxMessageStyle>
                        )}
                        {deleteError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {deleteError}
                            </Alert>
                        )}
                        {successDelete && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {successDelete}
                            </Alert>
                        )}

                        {/* Répondre au message */}
                        {sendError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {sendError}
                            </Alert>
                        )}

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mt: 2 }}>
                            <TextField
                                multiline
                                rows={2}
                                placeholder={conversation?.status == 'OPEN' ? "Écrivez votre message..." : "Vous ne pouvez plus rédiger de message car la conversation est clôturée."}
                                variant="outlined"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e : React.KeyboardEvent<HTMLDivElement>) => {
                                    if (e.key == 'Enter' && !e.shiftKey){
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                                fullWidth
                                disabled={conversation?.status !== 'OPEN'}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: colors.secondaryDark,
                                        color: colors.white,
                                        '& fieldset': {
                                            borderColor: colors.secondaryGrey,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.primaryGreen,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: colors.primaryGreen,
                                        },
                                    },
                                }}
                            />
                            { conversation?.status === 'OPEN' && (
                                <Button
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    onClick={handleSubmit}
                                    disabled={!newMessage.trim() || sending}

                                    sx={{
                                        backgroundColor: colors.primaryGreen,
                                        color: colors.white,
                                        '&:hover': {
                                            backgroundColor: colors.primaryRed,
                                        },
                                        minWidth: { xs: '100%', sm: '120px' },
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {sending ? 'Envoi...' : 'Envoyer'}
                                </Button>
                            )}

                        </Stack>
                    </Container>
                </Container>
            </Box>
        </>
    )
}