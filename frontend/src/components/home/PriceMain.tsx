import { useEffect, useState } from "react";
import {Box, Typography} from "@mui/material";
import PriceCard from "../cards/PriceCard.tsx";
import { getPrices } from "../../services/prices";
import type { Price } from "../../@types/price";

export default function PriceMain(){
    const [prices, setPrices] = useState<Price[]>([]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const data = await getPrices();
                setPrices(data);
            } catch (error) {
                console.error("Impossible de récupérer les tarifs:", error);
            }
        };
        fetchPrices();
    }, []);

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