import {Card, CardContent, Typography} from "@mui/material";
import {motion} from "framer-motion";

interface SocialNetworkItemProps {
    name: string;
    link: string;
    logo: any;
}

export default function SocialCard({ name, link, logo: LogoComponent }: SocialNetworkItemProps) {
    return (
        <Card
            component={motion.div}
            sx={{
                minWidth: 100,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #101010, #6B9F2A, #101010, #6B9F2A)',
                backgroundSize: '400% 400%',
                color: 'white',
                cursor: 'pointer',
                '@keyframes rotateGradient': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                },
                '&:hover': {
                    animation: 'rotateGradient 3s ease infinite'
                }
            }}
            onClick={() => window.open(link, '_blank')}
        >
            <CardContent>
                <LogoComponent sx={{ fontSize: 70 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                    {name}
                </Typography>
            </CardContent>
        </Card>
    );
}