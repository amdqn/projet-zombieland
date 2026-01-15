import type {WeatherCondition} from "../types/weatherTypes.ts";
import CloudAnimation from "../animations/CloudAnimation.tsx";
import SunnyAnimation from "../animations/SunnyAnimation.tsx";
import RainAnimation from "../animations/RainAnimation.tsx";
import SnowAnimation from "../animations/SnowAnimation.tsx";
import LightningAnimation from "../animations/ThunderstormAnimation.tsx";
import MistAnimation from "../animations/MistAnimation.tsx";
import DrizzleAnimation from "../animations/DrizzleAnimation.tsx";


export default function renderWeatherAnimation(conditions: WeatherCondition) {
    switch (conditions) {

        case 'Rain':
            return (
                <>
                    <CloudAnimation position={{ top: '10%', left: '-20%' }} size="large" speed={20} />
                    <CloudAnimation position={{ top: '25%', right: '-15%' }} size="medium" speed={25} direction="right-to-left" />
                    <RainAnimation intensity="medium" />
                </>
            );

        case 'Clouds':
            return (
                <>
                    <CloudAnimation position={{ top: '10%', left: '-20%' }} size="large" speed={20} />
                    <CloudAnimation position={{ top: '25%', right: '-15%' }} size="medium" speed={25} direction="right-to-left" />
                </>
            )

        case 'Clear':
            return <SunnyAnimation includesClouds={false} />;

        case 'Snow':
            return (
                <>
                    <CloudAnimation position={{ top: '10%', left: '-20%' }} size="large" speed={20} />
                    <CloudAnimation position={{ top: '25%', right: '-15%' }} size="medium" speed={25} direction="right-to-left" />
                    <SnowAnimation intensity="medium" />
                </>
            )


        case 'Thunderstorm':
            return(
                <>
                    <CloudAnimation position={{ top: '10%', left: '-20%' }} size="large" speed={20} />
                    <CloudAnimation position={{ top: '25%', right: '-15%' }} size="medium" speed={25} direction="right-to-left" />
                    <RainAnimation intensity="medium" />
                    <LightningAnimation/>
                </>
            )

        case 'Drizzle':
            return (
                <>
                    <CloudAnimation position={{ top: '10%', left: '-20%' }} size="large" speed={20} />
                    <CloudAnimation position={{ top: '25%', right: '-15%' }} size="medium" speed={25} direction="right-to-left" />
                    <DrizzleAnimation />
                </>
            );

        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
            return <MistAnimation intensity="medium" />;

        default:
            return null;
    }
}