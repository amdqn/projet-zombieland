import {Box, Card, CardActions, CardContent, Typography} from "@mui/material";
import {PrimaryButton} from "../common/Button";
import type {DateParc} from "../../@types/dateParc";



interface SchedulesCardProps {
    horaire: DateParc
}

export function SchedulesCard({horaire}: SchedulesCardProps) {

    const formatDay = (date: Date | string) => {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return dateObj.toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long", year: "numeric"});
    }

    console.log(horaire.notes);


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
                                    color: horaire.isOpen ? "primary.main" : "error.main",
                                    fontWeight: 'bold'
                                }}
                            >
                                {horaire.isOpen ? "ouvert" : "fermé"}
                            </Box>
                        </Typography>
                    </Box>

                    {horaire.notes && (
                        <Box sx={{
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 3,
                            paddingBottom: 5,
                        }}>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                                {horaire.notes}
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