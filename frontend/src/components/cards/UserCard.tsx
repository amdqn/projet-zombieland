import {Box, Card, CardActions, CardContent, Typography} from "@mui/material";
import type {User} from "../../@types/users";
import {formatDay} from "../../functions/formatDay.ts";
import {PrimaryButton} from "../common";

interface UserCardProps {
    user: User
}

export default function UserCard({user} : UserCardProps) {
    return (
        <Card sx={{ minWidth: 450 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Typography gutterBottom variant="h4">
                    {user.pseudo}
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', pb: 4}}>
                    <Typography variant={"body1"}>
                        Email : {user.email}
                    </Typography>
                    <Typography variant="body2">
                        Crée le : {formatDay(user.created_at)}
                    </Typography><Typography variant="body2">
                    Dernière modification : {formatDay(user.updated_at)}
                </Typography>
                </Box>

            </CardContent>
            <CardActions sx={{display: 'flex', flexDirection: 'column', gap: 5}}>
                <PrimaryButton text={"Modifier l'email"} />
                <PrimaryButton text={"Modifier le mot de passe"} />
            </CardActions>
        </Card>
    );
}