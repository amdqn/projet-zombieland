import {Box, Card, CardContent, Typography} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useTranslation } from "react-i18next";

export default function AccessCard() {
    const { t } = useTranslation();
    return (
    <Card sx={{minWidth: 275, borderRadius: 5, backgroundColor: 'colors.secondaryDark', color: 'white'}}>
        <CardContent>
            <Box sx={{
                paddingBottom: 3,
                textAlign: 'center'
            }}>
                <Typography variant="h5">
                    {t("home.access.title")}
                </Typography>
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                paddingBottom: 3
            }}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center', paddingTop: 7}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <LocationOnIcon color="primary" />
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            {t("home.access.parkName")}
                        </Typography>
                    </Box>
                    <Typography variant="body1">
                        {t("home.access.address.line1")}
                    </Typography>
                    <Typography variant="body1">
                        {t("home.access.address.line2")}
                    </Typography>
                    <Typography variant="body1">
                        {t("home.access.address.line3")}
                    </Typography>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 2}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <DirectionsCarIcon />
                        <Typography variant="subtitle1">
                            {t("home.access.byCar")}
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <DirectionsBusIcon />
                        <Typography variant="subtitle1">
                            {t("home.access.byBus")}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CardContent>
    </Card>
    )
}