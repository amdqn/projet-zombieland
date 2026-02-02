import {Box, Card, CardActions, CardContent, Chip, Typography} from "@mui/material";
import {PrimaryButton} from "../common/Button";
import type {ParkDate} from "../../@types/parkDate.ts";
import {formatDay} from "../../functions/formatDay.ts";
import formatHour from "../../functions/formatHour.ts";
import { useTranslation } from "react-i18next";



interface SchedulesCardProps {
    schedules: ParkDate
}

export function SchedulesCard({schedules}: SchedulesCardProps) {
    const { t } = useTranslation();

    return (
        <>
            <Card sx={{minWidth: 275, borderRadius: 5, backgroundColor: 'colors.secondaryDark', color: 'white'}}>
                <CardContent>
                    <Box sx={{
                        paddingBottom: 5,
                        textAlign: 'center'
                    }}>
                        <Typography variant="h5">
                            {t("home.schedule.todayStatus", { day: formatDay(schedules.jour) })}{' '}
                            <Box
                                component="span"
                                sx={{
                                    color: schedules.is_open ? "primary.main" : "error.main",
                                    fontWeight: 'bold'
                                }}
                            >
                                {schedules.is_open ? t("home.schedule.open") : t("home.schedule.closed")}
                            </Box>
                        </Typography>
                    </Box>
                    {schedules.notes && (
                        <Box sx={{
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 3,
                            paddingBottom: 5,
                        }}>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                                {schedules.notes}
                            </Typography>
                        </Box>
                    )}

                    {schedules.is_open ? (
                        schedules.open_hour && schedules.close_hour ? (
                            <Box sx={{
                                display: "flex",
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 4,
                                paddingBottom: 5
                            }}>
                                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3}}>
                                    <Typography variant="body1">
                                        {t("home.schedule.openingTime")}
                                    </Typography>
                                    <Chip
                                        label={formatHour(schedules.open_hour)}
                                        variant="outlined"
                                        sx={{fontWeight: 'bold', fontSize: '1.5rem', padding: 1, borderRadius: 3}}
                                    />
                                </Box>

                                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3}}>
                                    <Typography variant="body1">
                                        {t("home.schedule.closingTime")}
                                    </Typography>
                                    <Chip
                                        label={formatHour(schedules.close_hour)}
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
                                    {t("home.schedule.noSchedule")}
                                </Typography>
                            </Box>
                        )
                    ) : (
                        <Box sx={{
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '200px',
                        }}>
                            <Typography variant="body1">
                                {t("home.schedule.closedToday")}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', paddingBottom: 5 }}>
                    <PrimaryButton text={t("home.schedule.moreSchedules")} href={"/info#schedules"} fullWidth={false}/>
                </CardActions>
            </Card>
        </>
    )
}