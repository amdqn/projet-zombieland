import {Box, Typography} from "@mui/material";
import {PrimaryButton} from "../common/Button";
import {useNavigate} from "react-router";
import {colors} from "../../theme";

export default function VideoBanniere() {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '650px',
                backgroundColor: 'black'
            }}
        >
            <Box
                component="video"
                autoPlay
                loop
                muted
                playsInline
                src="/zombie.mp4"
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    top: '85%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    textAlign: 'center',
                    zIndex: 1
                }}
            >
                <Typography variant="h3" sx={{pb: 3, color: colors.secondaryGreen}}>
                    Oserez-vous franchir les portes ?
                </Typography>
                <PrimaryButton
                    text={"Réserve ton billet"}
                    textMobile={"Réserve ton billet"}
                    onClick={() => navigate("/reservations")}
                    href={"/reservations"}
                    fullWidth={false}
                />
            </Box>
        </Box>
    );
}