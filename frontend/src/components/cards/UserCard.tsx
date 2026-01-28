import {Box, Card, CardActions, CardContent, Typography, Button} from "@mui/material";
import type {User} from "../../@types/users";
import {formatDay} from "../../functions/formatDay.ts";
import {PrimaryButton} from "../common";
import {useContext, useState} from "react";
import UpdateProfilModal from "../modals/Profil/UpdateProfilModal.tsx";
import { DeleteAccountModal } from "../modals/Profil/DeleteAccountModal.tsx";
import { colors } from "../../theme";
import {LoginContext} from "../../context/UserLoginContext.tsx";

interface UserCardProps {
    user: User;
    // Callback pour rafraichir les données après mise a jour
    onUpdate: () => void;
}

export default function UserCard({user, onUpdate} : UserCardProps) {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState<"email" | "password">("email");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const { role } = useContext(LoginContext)

    const handleOpenEmail = () => {
        setModalType('email');
        setOpen(true);
    };

    const handleOpenPassword = () => {
        setModalType('password');
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleOpenDelete = () => {
        setDeleteModalOpen(true);
    };

    const handleCloseDelete = () => {
        setDeleteModalOpen(false);
    };

    return (
        <Card
            sx={{
                minWidth: { xs: '100%', sm: 400, md: 450 },
                maxWidth: '100%',
                width: '100%',
            }}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 1.5, sm: 2 },
                    alignItems: 'center',
                    padding: { xs: 2, sm: 3 },
                    '&:last-child': { paddingBottom: { xs: 2, sm: 3 } }
                }}
            >
                <Typography
                    gutterBottom
                    variant="h4"
                    sx={{
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                        fontWeight: 600,
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        width: '100%',
                    }}
                >
                    {user.pseudo}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 1.5, sm: 2 },
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        pb: { xs: 2, sm: 3, md: 4 },
                        width: '100%',
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            wordBreak: 'break-word',
                            textAlign: { xs: 'center', sm: 'left' },
                            width: '100%',
                        }}
                    >
                        Email : {user.email}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            textAlign: { xs: 'center', sm: 'left' },
                        }}
                    >
                        Crée le : {formatDay(user.created_at)}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            textAlign: { xs: 'center', sm: 'left' },
                        }}
                    >
                        Dernière modification : {formatDay(user.updated_at)}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2, sm: 3, md: 5 },
                    padding: { xs: 2, sm: 3 },
                    paddingTop: 0,
                }}
            >
                <PrimaryButton text={"Modifier l'email"} onClick={handleOpenEmail} fullWidth/>
                <PrimaryButton text={"Modifier le mot de passe"} onClick={handleOpenPassword} fullWidth/>
                { role === 'CLIENT' && (
                    <Button
                        variant="contained"
                        onClick={handleOpenDelete}
                        fullWidth
                        sx={{
                            backgroundColor: colors.primaryRed,
                            color: colors.white,
                            fontSize: { xs: '1.2rem', md: '1.2rem' },
                            padding: { xs: '0.6rem 2rem', md: '1rem 3rem' },
                            '&:hover': {
                                backgroundColor: colors.primaryRed,
                                opacity: 0.9,
                            },
                        }}
                    >
                        Supprimer le compte
                    </Button>
                )}

            </CardActions>
            <UpdateProfilModal
                open={open}
                onClose={handleClose}
                modalType={modalType}
                currentEmail={user.email}
                onUpdateSuccess={onUpdate}
            />
            <DeleteAccountModal
                open={deleteModalOpen}
                onClose={handleCloseDelete}
            />
        </Card>
    );
}