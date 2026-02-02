import { useEffect, useState } from "react";
import {Box, Typography} from "@mui/material";
import PriceCard from "../cards/Prices/PriceCard.tsx";
import { getPrices } from "../../services/prices";
import type { Price } from "../../@types/price";
import { useTranslation } from "react-i18next";

export default function PriceMain(){
    const { t, i18n } = useTranslation();
    const [prices, setPrices] = useState<Price[]>([]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const data = await getPrices();
                setPrices(data);
            } catch (error) {
                console.error(t("home.ticketing.errorLoading"), error);
            }
        };
        fetchPrices();
    }, [i18n.language]);

    return(
        <Box>
            <Typography variant="h2" pt={5} pb={3}>
                {t("home.ticketing.title")}
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