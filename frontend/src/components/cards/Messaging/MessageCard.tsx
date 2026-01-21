import type {Message} from "../../../@types/messaging";
import {Box, Typography} from "@mui/material";
import {colors} from "../../../theme";

interface MessageCardProps {
    message: Message;
    isOwn?: boolean;
}

export default function MessageCard({message, isOwn}: MessageCardProps) {
    return(
        <Box
            sx={{
                maxWidth: '70%',
                backgroundColor: isOwn ? colors.secondaryGreen: colors.secondaryDarkAlt,
                border: `1px solid ${isOwn ? colors.secondaryGreen : colors.secondaryGrey}`,
                borderRadius: '12px',
                p: 2,
            }}
        >
            {/* Votre contenu de message */}
            <Typography variant="body2" sx={{ color: 'white' }}>
                {message.content}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.secondaryGrey, mt: 1 }}>
                {message.sender.pseudo} - {new Date(message.created_at).toLocaleString('fr-FR')}
            </Typography>
        </Box>
    )
}