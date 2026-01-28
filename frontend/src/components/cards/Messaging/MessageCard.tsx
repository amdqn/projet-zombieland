import type {Message} from "../../../@types/messaging";
import {Box, Chip, Typography} from "@mui/material";
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
            {/* Contenu de message */}
            <Typography variant="body2" sx={{ color: 'white' }}>
                {message.content}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.secondaryGrey, mt: 1 }}>
                {message.sender.pseudo} - {new Date(message.created_at).toLocaleString('fr-FR')}
            </Typography>
            {!message.is_read && (
                <Chip
                    label="Non lu"
                    size="small"
                    sx={{
                        backgroundColor: colors.primaryRed,
                        color: colors.white,
                        fontSize: '0.7rem',
                        height: '20px',
                        fontWeight: 600,
                        '& .MuiChip-label': {
                            px: 1,
                        },
                    }}
                />
            )}

        </Box>
    )
}