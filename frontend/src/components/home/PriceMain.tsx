import {Box, Typography} from "@mui/material";
import PriceCard from "../cards/PriceCard.tsx";
import {pricesData} from "../../mocks/prices.ts";

export default function PriceMain(){
    const prices = pricesData.prices;

    return(
        <Box>
            <Typography variant="h2" pt={5} pb={3}>
                Billetterie
            </Typography>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 3, md: 5 },
                width: '100%'
            }}>
                {prices.map((price) => (
                    <PriceCard price={price} key={price.id} />
                ))}
            </Box>
        </Box>
    )
}