import {Box, Card, CardActions, CardContent, Chip, Typography} from "@mui/material";
import type {IDateParc} from "../../@types/datesParc";
import {PrimaryButton} from "../common/Button";


interface SchedulesCardProps {
    horaire: IDateParc
}

export function SchedulesCard({horaire}: SchedulesCardProps) {

    const formatDay = (date: Date | string) => {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return dateObj.toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long", year: "numeric"});
    }

    const formatTime = (date: Date | string) => {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return dateObj.toLocaleTimeString("fr-FR", {hour: "2-digit", minute: "2-digit"});
    }

    return (
        <>
            <Card sx={{minWidth: 275, borderRadius: 5, backgroundColor: 'colors.secondaryDark', color: 'white'}}>
                <CardContent>
                    <Box sx={{
                        paddingBottom: 5,
                        textAlign: 'center'
                    }}>
                        <Typography variant="h5">
                            Aujourd'hui, {formatDay(horaire.jour)}, le parc est{' '}
                            <Box
                                component="span"
                                sx={{
                                    color: horaire.is_open ? "primary.main" : "error.main",
                                    fontWeight: 'bold'
                                }}
                            >
                                {horaire.is_open ? "ouvert" : "fermé"}
                            </Box>
                        </Typography>
                    </Box>

                    {horaire.is_open ? (
                        <Box sx={{
                            display: "flex",
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            paddingBottom: 5
                        }}>
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3}}>
                                <Typography variant="body1">
                                    Heure d'ouverture
                                </Typography>
                                <Chip
                                    label={formatTime(horaire.open_hour)}
                                    variant="outlined"
                                    sx={{fontWeight: 'bold', fontSize: '1.5rem', padding: 1, borderRadius: 3}}
                                />
                            </Box>

                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3}}>
                                <Typography variant="body1">
                                    Heure de fermeture
                                </Typography>
                                <Chip
                                    label={formatTime(horaire.close_hour)}
                                    variant="outlined"
                                    sx={{fontWeight: 'bold', fontSize: '1.5rem', padding: 1, borderRadius: 3}}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '200px',
                        }}>
                            <Typography variant="body1">
                                Pas d'horaires disponibles.
                            </Typography>
                        </Box>
                    )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', paddingBottom: 5 }}>
                    <PrimaryButton text={"Plus d'horaires"} href={"/informations"} fullWidth={false}/>
                </CardActions>
            </Card>
        </>
    )
}