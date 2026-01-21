import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import type {Conversation} from "../../@types/messaging";
import {getOneConversation} from "../../services/conversations.ts";
import {colors} from "../../theme";
import {Alert, Box, Button, Container, LinearProgress, Stack, TextField, Typography} from "@mui/material";
import {CustomBreadcrumbs} from "../../components/common";
import MessageCard from "../../components/cards/Messaging/MessageCard.tsx";
import {LoginContext} from "../../context/UserLoginContext.tsx";
import {styled} from "@mui/material/styles";
import SendIcon from '@mui/icons-material/Send';
import {createMessage} from "../../services/messages.ts";

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
    const { role } = useContext(LoginContext)
    const [newMessage, setNewMessage] = useState<string>("");
    const [seding, setSeding] = useState<boolean>(false);

    const fetchConversation = async (id: number) => {
        setLoading(true);
        try {
            const response = await getOneConversation(id);
            console.log(response);
            setConversation(response);
        } catch (error) {
            setError(`Une erreur est survenue : ${error}`)
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        if (newMessage.trim() === '' || !id) return;
        setSeding(true);
        try {
            // 1. Envoyer le message
            await createMessage(Number(id), newMessage.trim());

            // 2. Recharger la conversation complète (avec tous les messages et leurs senders)
            await fetchConversation(Number(id));

            // 3. Réinitialiser le champ
            setNewMessage('');

        } catch (error) {
            setSendError(`Une erreur est survenue lors de l'envoi du message : ${error}`)
        } finally {
            setSeding(false);
        }
    }

    useEffect(() => {
        fetchConversation(Number(id));
    }, [id])

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
                    )}

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
                        {error && "Erreur lors de la récupération des messages : " + error + "."}
                        {conversation && (
                            <BoxMessageStyle>
                                <Stack spacing={2}>
                                    {conversation && (
                                        <Box>
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
                                                            <MessageCard message={message} isOwn={isOwnMessage} />
                                                        </Box>
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    )}
                                </Stack>
                            </BoxMessageStyle>
                        )}
                        {/* Répondre au message */}
                        {sendError && (<Alert severity="error">{sendError}</Alert>)}
                        <Stack>
                            <TextField
                                multiline
                                rows={2}
                                placeholder="Écrivez votre message..."
                                variant="outlined"
                                fullWidth
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
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
                            <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={handleSubmit}
                                sx={{
                                    backgroundColor: colors.primaryGreen,
                                    color: colors.white,
                                    '&:hover': {
                                        backgroundColor: colors.primaryRed,
                                    },
                                    alignSelf: 'flex-end',
                                }}
                            >
                                {seding ? 'Envoi en cours...' : 'Envoyer'}
                            </Button>
                        </Stack>
                    </Container>
                </Container>
            </Box>
        </>
    )
}