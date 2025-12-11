import { useState, useEffect, useMemo } from "react";
import ActivityCardHome from "../cards/ActivityCardHome.tsx";
import {Box, Typography} from "@mui/material";
import {Carousel} from "../carousel";
import { getActivities } from "../../services/activities";
import { getAttractions } from "../../services/attractions";
import type { Activity } from "../../@types/activity";
import type { Attraction } from "../../@types/attraction";

export default function CarouselActivityMain(){
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
                console.error("Erreur lors de la récupération des activités et attractions:", error);
            }
        };
        fetchData();
    }, []);

    // Combiner en mettant les activités en premier, puis les attractions
    const cards = useMemo(() => {
        const defaultAttractionImage = '/activities-images/zombie.jpg';
        
        const activityCards = activities.map((activity) => (
            <ActivityCardHome
                key={`activity-${activity.id}`}
                id={activity.id}
                name={activity.name}
                category={activity.category?.name || 'Activité'}
                image={activity.image_url || undefined}
            />
        ));

        const attractionCards = attractions.map((attraction) => {
            // Vérifier si l'image_url existe et est valide
            let image: string | undefined = defaultAttractionImage;
            if (attraction.image_url) {
                const apiImage = attraction.image_url.trim();
                const isValidHttp = apiImage.startsWith('http://') || apiImage.startsWith('https://');
                const isValidPath = apiImage.startsWith('/');
                if (isValidHttp || isValidPath) {
                    image = apiImage;
                }
            }
            
            return (
                <ActivityCardHome
                    key={`attraction-${attraction.id}`}
                    id={attraction.id}
                    name={attraction.name}
                    category={attraction.category?.name || 'Attraction'}
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
                Activités & Attractions
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