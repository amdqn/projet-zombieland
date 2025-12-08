
import {Card, CardContent, Typography} from "@mui/material";
import type {IPrice} from "../../@types/price";

interface PriceCardProps {
    price: IPrice;

}

export default function PriceCard({price}: PriceCardProps) {

    const formatPriceTitle = (price: IPrice) => {
        if (price.type === "PASS_2J") {
            return "PASS 2 JOURS";
        }
        return `${price.type} - ${price.duration_days} JOUR${price.duration_days > 1 ? 'S' : ''}`;
    }

    return (
        <>
            <Card sx={{ minWidth: 100,  borderRadius: 5}}>
                <CardContent sx={{paddingLeft: 5}}>
                    <Typography variant={"h4"}>
                        {formatPriceTitle(price)}
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                        {price.label}
                    </Typography>
                    <Typography sx={{color: "primary.main", paddingTop: 4, fontSize: 30, fontWeight: "bold"}}>
                        {price.amount} €
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}