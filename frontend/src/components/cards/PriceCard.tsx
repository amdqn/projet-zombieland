
import {Card, CardContent, Typography} from "@mui/material";
import type {IPrice} from "../../@types/price";
import {theme} from "../../theme";
import {motion} from "framer-motion";

interface PriceCardProps {
    price: IPrice;

}
// TODO Ajouter le lien vers la reservation au passage de la souris sur le card
export default function PriceCard({price}: PriceCardProps) {

    const formatPriceTitle = (price: IPrice) => {
        if (price.type === "PASS_2J") {
            return "PASS 2 JOURS";
        }
        return `${price.type} - ${price.duration_days} JOUR${price.duration_days > 1 ? 'S' : ''}`;
    }

    return (
        <>
            <Card
                component={motion.div}
                initial={{ boxShadow: 'none' }}
                whileHover={{
                    scale: 1.05,
                    boxShadow: `0 10px 40px ${theme.palette.primary.main}70, 0 0 20px ${theme.palette.primary.main}50`
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut"
                }}
                sx={{
                    minWidth: 100,
                    borderRadius: 5,
                    cursor: 'pointer'
                }}
            >
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