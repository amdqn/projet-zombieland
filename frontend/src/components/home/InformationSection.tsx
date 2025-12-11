import {SchedulesCard} from "../cards/SchedulesCard.tsx";
import {Box, Typography} from "@mui/material";
import AccessCard from "../cards/AccessCard.tsx";
import getTodaySchedule from "../../functions/getTodaySchedule.ts";
import {useEffect, useState} from "react";
import type {DateParc} from "../../@types/dateParc";


export default function InformationSection() {

    const [todaySchedule, setTodaySchedule] = useState<DateParc | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On récupère les horaires avec await
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const schedule = await getTodaySchedule();
                setTodaySchedule(schedule);
            } catch (error) {
                console.error('Erreur lors de la récupération des horaires:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    return (
        <Box sx={{
            paddingBottom: { xs: 10, md: 20 },
            paddingTop: { xs: 5, md: 10 },
            paddingX: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            maxWidth: '100vw',
            overflowX: 'hidden',
            boxSizing: 'border-box'
        }}>
            <Typography
                variant="h2"
                paddingBottom={3}
            >
                Informations générales
            </Typography>

            <Box sx={{
                width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
                maxWidth: '1200px',
                margin: '0 auto',
                padding: { xs: 0, sm: 2, md: 3 },
                boxSizing: 'border-box'
            }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                    gap: { xs: 2, sm: 3, md: 4 },
                    width: '100%'
                }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                            <Typography>Chargement des horaires...</Typography>
                        </Box>
                    ) : todaySchedule ? (
                        <SchedulesCard horaire={todaySchedule} />
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                            <Typography>Aucun horaire disponible pour aujourd'hui</Typography>
                        </Box>
                    )}
                    <AccessCard />
                </Box>
            </Box>
        </Box>
    )
}