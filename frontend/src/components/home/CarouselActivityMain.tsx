
import ActivityCardHome from "../cards/ActivityCardHome.tsx";
import {activitiesData} from "../../mocks/activities.ts";
import {Box, Typography} from "@mui/material";
import {Carousel} from "../carousel";

export default function CarouselActivityMain(){
    const activities = activitiesData.activities;

    const activityCards = activities.map((activite) => (
        <ActivityCardHome
            key={activite.id}
            id={activite.id}
            name={activite.name}
            category={activite.category}
            image={activite.images?.[0]}
        />
    ));

    return(
        <Box>
            <Typography variant="h2" pb={3}>
                Activités
            </Typography>

            <Carousel
                items={activityCards}
                autoPlayInterval={5000}
                itemsPerPageDesktop={5}
                itemsPerPageTablet={3}
                itemsPerPageMobile={1}
            />
        </Box>

    )
}