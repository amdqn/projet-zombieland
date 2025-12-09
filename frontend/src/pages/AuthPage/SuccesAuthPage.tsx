import {Box, Typography, Link} from "@mui/material";
import {useNavigate} from "react-router";

export default function SuccesAuthPage() {

    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
            }}
        >
            <Typography
                variant="h2"
                sx={{
                    mb: 3,
                    textAlign: 'center',
                }}
            >
                Création de compte réussis !
            </Typography>

            <Link
                onClick={() => navigate('/login')}
                sx={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    textDecoration: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                    }
                }}
            >
                Se connecter
            </Link>
        </Box>
    )
}