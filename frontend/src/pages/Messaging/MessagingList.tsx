import {colors} from "../../theme";
import {HeroSection} from "../../components/hero";
import {Box, Button, Container, LinearProgress, Stack, Typography} from "@mui/material";
import {CustomBreadcrumbs} from "../../components/common";
import {getAllConvesations} from "../../services/conversations.ts";
import {useContext, useEffect, useState} from "react";
import type {Conversation} from "../../@types/messaging";
import ConversationCard from "../../components/cards/Messaging/ConversationCard.tsx";
import AddIcon from "@mui/icons-material/Add";
import {CreateMessageModal} from "../../components/modals/Message/CreateMessageModal.tsx";
import {LoginContext} from "../../context/UserLoginContext.tsx";

export default function MessagingList() {

    const heroImages = [
        '/activities-images/post-apocalyptic-street.jpg',
        '/activities-images/zombie.jpg',
        '/activities-images/abandoned-lab.jpg',
        '/activities-images/haunted-hospital.jpg',
    ].slice(0, 5);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const {role} = useContext(LoginContext);

    const fetchConversations = async () => {
        setLoading(true);
        try{
            const response = await getAllConvesations()
            setConversations(response);
        } catch (error){
            setError("Erreur lors de la récupération des conversations : " + error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreate = () => {
        setCreateModalOpen(true);
    }

    const handleCreateSuccess = () => {
        setCreateModalOpen(false);
        setRefreshTrigger((prev) => prev + 1); // Rafraîchir la liste
    };

    useEffect(() => {
        fetchConversations();
    }, [refreshTrigger])

    return(
        <Box sx={{ backgroundColor: colors.secondaryDark, minHeight: '100vh', color: colors.white }}>
            <HeroSection images={heroImages}>
                <Box>
                    <Box sx={{ pt: { xs: 2, md: 2 }, mb: { xs: 1, md: 1 } }}>
                        <CustomBreadcrumbs
                            items={[
                                { label: 'Accueil', path: '/', showOnMobile: true },
                                { label: 'Mon compte', path: '/account',showOnMobile: true },
                                { label: 'Ma messagerie', showOnMobile: true },
                            ]}
                        />
                    </Box>

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
                        Ma messagerie
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: { xs: '100%', md: '560px' },
                            color: colors.white,
                            fontSize: { xs: '0.85rem', md: '1.1rem' },
                            mb: { xs: 1.5, md: 3 },
                        }}
                    >
                        Consultez vos messages.
                    </Typography>
                </Box>
            </HeroSection>

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
                { role === 'CLIENT' && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{
                            backgroundColor: colors.primaryGreen,
                            color: colors.secondaryDark,
                            '&:hover': {
                                backgroundColor: colors.primaryGreen,
                                opacity: 0.9,
                            },
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            mb: 3,
                        }}
                    >
                        Nouveau message
                    </Button>
                )}

                <Box
                    sx={{
                        backgroundColor: colors.secondaryDarkAlt,
                        border: `1px solid ${colors.secondaryGrey}`,
                        borderRadius: '12px',
                        p: { xs: 2, md: 3 },
                        minHeight: '400px',
                    }}
                >
                    {loading && (
                        <LinearProgress
                            sx={{
                                mb: 3,
                                backgroundColor: colors.secondaryGrey,
                                '& .MuiLinearProgress-bar': { backgroundColor: colors.primaryGreen },
                            }}
                        />
                    )}
                    {error && "Erreur lors de la récupération des conversations : " + error + "."}
                    <Stack spacing={2}>
                        {conversations.map((conversation) => (
                            <ConversationCard
                                key={conversation.id}
                                conversation={conversation}
                            />
                        ))}
                    </Stack>

                </Box>
            </Container>
            {/* Modal de création de conversation */}
            <CreateMessageModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreateSuccess={handleCreateSuccess}
            />
        </Box>
    )
}