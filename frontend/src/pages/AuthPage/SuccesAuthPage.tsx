import {Box, Typography, Link} from "@mui/material";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";

export default function SuccesAuthPage() {

    const navigate = useNavigate();
    const { t } = useTranslation();

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
                {t("auth.success.title")}
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
                {t("auth.success.loginLink")}
            </Link>
        </Box>
    )
}