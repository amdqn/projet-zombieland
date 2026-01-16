
import {Card, CardContent, Typography} from "@mui/material";
import {theme} from "../../../theme";
import {motion} from "framer-motion";
import {useNavigate} from "react-router";
import type {Price} from "../../../@types/price";
import { useTranslation } from 'react-i18next';
import { formatPriceName } from '../../../utils/translatePrice';

interface PriceCardProps {
    price: Price;
}

export default function PriceCard({price}: PriceCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <Card
                component={motion.div}
                initial={{ boxShadow: 'none' }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: `0 10px 40px ${theme.palette.primary.main}70, 0 0 20px ${theme.palette.primary.main}50`
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                    duration: 0.08,
                    ease: "easeOut"
                }}
                sx={{
                    minWidth: 100,
                    borderRadius: 5,
                    cursor: 'pointer'
                }}
                onClick={() => navigate(`/reservations`)}
            >
                <CardContent sx={{paddingLeft: 5}}>
                    <Typography variant={"h4"}>
                        {formatPriceName(price.type, price.duration_days, t)}
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