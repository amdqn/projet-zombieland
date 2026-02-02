import { useState, useEffect, useMemo } from "react";
import ActivityCardHome from "../cards/Activity/ActivityCardHome.tsx";
import {Box, Typography} from "@mui/material";
import {Carousel} from "../carousel";
import { getActivities } from "../../services/activities";
import { getAttractions } from "../../services/attractions";
import type { Activity } from "../../@types/activity";
import type { Attraction } from "../../@types/attraction";
import { resolveImageUrl, DEFAULT_ACTIVITY_IMAGE } from "../../utils/imageUtils";
import { useTranslation } from "react-i18next";

export default function CarouselActivityMain(){
    const { t, i18n } = useTranslation();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [attractions, setAttractions] = useState<Attraction[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activitiesData, attractionsData] = await Promise.all([
                    getActivities(),
                    getAttractions()
                ]);
                setActivities(activitiesData);
                setAttractions(attractionsData);
            } catch (error) {
                console.error(t("home.carousel.errorLoading"), error);
            }
        };
        fetchData();
    }, [i18n.language]);

    // Combiner en mettant les activités en premier, puis les attractions
    const cards = useMemo(() => {
        const activityCards = activities
            .filter((activity) => (activity as any).is_published !== false) // Filtrer les activités non publiées
            .map((activity) => {
                const activityImage = resolveImageUrl(activity.image_url, DEFAULT_ACTIVITY_IMAGE);

                return (
                    <ActivityCardHome
                        key={`activity-${activity.id}`}
                        id={activity.id}
                        name={activity.name}
                        category={activity.category?.name || t("home.carousel.activityFallback")}
                        image={activityImage}
                    />
                );
            });

        const attractionCards = attractions
            .filter((attraction) => (attraction as any).is_published !== false) // Filtrer les attractions non publiées
            .map((attraction) => {
                const image = resolveImageUrl(attraction.image_url, DEFAULT_ACTIVITY_IMAGE);

                return (
                    <ActivityCardHome
                        key={`attraction-${attraction.id}`}
                        id={attraction.id}
                        name={attraction.name}
                        category={attraction.category?.name || t("home.carousel.attractionFallback")}
                        image={image}
                        type="attraction"
                    />
                );
            });

        return [...activityCards, ...attractionCards];
    }, [activities, attractions]);

    return(
        <Box>
            <Typography variant="h2" pb={3}>
                {t("home.carousel.title")}
            </Typography>

            <Carousel
                items={cards}
                autoPlayInterval={5000}
                itemsPerPageDesktop={5}
                itemsPerPageTablet={3}
                itemsPerPageMobile={1}
            />
        </Box>
    )
}