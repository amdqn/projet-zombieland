import {Navigate, useParams} from "react-router-dom";
import {Box, Container, Typography} from "@mui/material";
import {staticPagesContent} from "./StaticPageContent.tsx";

export default function StaticPage() {
    const { pageType } = useParams<{ pageType: string }>();

    // Vérifier si la page existe
    if (!pageType || !staticPagesContent[pageType]) {
        return <Navigate to="/404" replace />;
    }

    const page = staticPagesContent[pageType];

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h1" component="h1" sx={{ mb: 4, pt: 10,fontWeight: 'bold' }}>
                {page.title}
            </Typography>

            <Box sx={{
                pt: 5
            }}>
                {page.content}
            </Box>

            <Typography variant="body2" sx={{ mt: 6, color: 'text.secondary' }}>
                Dernière mise à jour : {page.lastUpdate}
            </Typography>
        </Container>
    );
}