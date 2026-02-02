import { useEffect, useState } from 'react';
import { Box, Container, Typography, Alert, LinearProgress, Stack } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { colors } from '../../theme';
import { HeroSection } from '../../components/hero/HeroSection';
import { CustomBreadcrumbs } from '../../components/common';
import { ParkMap, MapFilters } from '../../components/map';
import { getAllMapPoints } from '../../services/map';
import { getCategories } from '../../services/categories';
import { getPrices } from '../../services/prices';
import getTodaySchedule from '../../functions/getTodaySchedule';
import getWeather from '../../services/getApiWeather';
import WeatherBackground from '../../components/home/weather/functions/WeatherBackground';
import { getWeatherIcon } from '../../components/home/weather/functions/GetWeatherIcon';
import { formatWeather } from '../../functions/formatWeather';
import type { MapData } from '../../@types/map';
import type { Category } from '../../@types/categorie';
import type { WeatherCondition } from '../../components/home/weather/types/weatherTypes';
import type { ParkDate } from '../../@types/parkDate';
import type { Price } from '../../@types/price';
import { useTranslation } from 'react-i18next';

export function InformationPage() {
  const { t, i18n } = useTranslation();
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Horaires et météo
  const [schedule, setSchedule] = useState<ParkDate | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [prices, setPrices] = useState<Price[]>([]);

  // Filtres
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['attraction', 'activity', 'restaurant', 'poi']);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Images du hero (carousel)
  const heroImages = [
    '/homepage-images/zombie-apocalypse.jpg',
    '/activities-images/post-apocalyptic-street.jpg',
    '/activities-images/abandoned-lab.jpg',
  ];

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [mapPoints, cats, scheduleData, weatherData, pricesData] = await Promise.all([
          getAllMapPoints(),
          getCategories(),
          getTodaySchedule(),
          getWeather('Paris').catch(() => null),
          getPrices().catch(() => []),
        ]);
        setMapData(mapPoints);
        setCategories(Array.isArray(cats) ? cats : []);
        setSchedule(scheduleData);
        setWeather(weatherData);
        setPrices(Array.isArray(pricesData) ? pricesData : []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t('info.page.map.error');
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  return (
    <Box sx={{ backgroundColor: colors.secondaryDark, minHeight: '100vh', color: colors.white }}>
      {/* Hero Section */}
      <HeroSection images={heroImages}>
        <CustomBreadcrumbs
          items={[
            { label: t('info.page.breadcrumbs.home'), path: '/', showOnMobile: true },
            { label: t('info.page.breadcrumbs.info'), showOnMobile: true },
          ]}
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4.5rem' },
            color: colors.white,
            textShadow: `
              0 0 20px rgba(198, 38, 40, 0.8),
              0 0 40px rgba(58, 239, 48, 0.4),
              3px 3px 0 ${colors.primaryRed}
            `,
            marginBottom: { xs: '12px', md: '16px' },
            marginTop: { xs: '16px', md: '24px' },
            lineHeight: 1,
            letterSpacing: '2px',
          }}
        >
          {t('info.page.hero.title')}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: { xs: '100%', md: '560px' },
            color: colors.white,
            fontSize: { xs: '0.9rem', md: '1.1rem' },
            lineHeight: 1.6,
            mb: 3,
          }}
        >
          {t('info.page.hero.description')}
        </Typography>

        {/* Horaires et Météo */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            maxWidth: { xs: '100%', md: '720px' },
          }}
        >
          {/* Horaires du jour */}
          {schedule && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'rgba(0, 0, 0, 0.3)',
                padding: { xs: '12px 16px', md: '14px 20px' },
                borderRadius: '8px',
                backdropFilter: 'blur(4px)',
                border: `1px solid ${schedule.is_open ? colors.primaryGreen : colors.primaryRed}40`,
              }}
            >
              <CircleIcon
                sx={{
                  color: schedule.is_open ? colors.primaryGreen : colors.primaryRed,
                  fontSize: '1rem',
                }}
              />
              <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                {schedule.is_open ? (
                  <>
                    {t('info.page.schedule.openToday')}
                    {schedule.open_hour && schedule.close_hour && (
                      <> : {schedule.open_hour.slice(0, 5)} - {schedule.close_hour.slice(0, 5)}</>
                    )}
                  </>
                ) : (
                  t('info.page.schedule.closedToday')
                )}
              </Typography>
            </Box>
          )}

          {/* Météo */}
          {weather && (
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'rgba(0, 0, 0, 0.3)',
                padding: { xs: '12px 16px', md: '14px 20px' },
                borderRadius: '8px',
                backdropFilter: 'blur(4px)',
                overflow: 'hidden',
                border: `1px solid rgba(255, 255, 255, 0.1)`,
              }}
            >
              <WeatherBackground weather={weather} />
              <Box sx={{ zIndex: 2, position: 'relative', display: 'flex', alignItems: 'center' }}>
                {getWeatherIcon(weather.weather[0].main as WeatherCondition)}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  zIndex: 2,
                  position: 'relative',
                }}
              >
                {formatWeather(weather?.main.temp)}°C, {weather?.weather[0].description}
              </Typography>
            </Box>
          )}
        </Stack>
      </HeroSection>

      {/* Contenu principal */}
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          mt: { xs: 2, md: 3 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 5, md: 7 },
          pl: { xs: 2, sm: 4, md: '150px', lg: '170px' },
          pr: { xs: 2, sm: 4, md: '60px', lg: '90px' },
        }}
      >
        {/* Section À propos */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: colors.primaryRed,
              fontFamily: 'Creepster',
              mb: 3,
              fontSize: { xs: 24, md: 32 },
            }}
          >
            {t('info.page.about.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.white,
              fontSize: { xs: 14, md: 16 },
              lineHeight: 1.8,
              mb: 2,
            }}
            dangerouslySetInnerHTML={{ __html: t('info.page.about.description') }}
          />
        </Box>

        {/* Section Carte Interactive */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: colors.primaryRed,
              fontFamily: 'Creepster',
              mb: 2,
              fontSize: { xs: 20, md: 28 },
            }}
          >
            {t('info.page.map.title')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.white,
              fontSize: { xs: 13, md: 15 },
              mb: 4,
            }}
          >
            {t('info.page.map.description')}
          </Typography>

          {loading && (
            <LinearProgress
              sx={{
                mb: 3,
                backgroundColor: colors.secondaryGrey,
                '& .MuiLinearProgress-bar': { backgroundColor: colors.primaryGreen },
              }}
            />
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              alignItems: 'stretch',
            }}
          >
            {/* Filtres */}
            <Box
              sx={{
                width: { xs: '100%', md: '25%', lg: '20%' },
                flexShrink: 0,
              }}
            >
              <MapFilters
                categories={categories}
                selectedTypes={selectedTypes}
                onTypesChange={setSelectedTypes}
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </Box>

            {/* Carte */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <ParkMap
                data={mapData}
                loading={loading}
                error={error}
                selectedTypes={selectedTypes}
                selectedCategories={selectedCategories}
                searchQuery={searchQuery}
              />
            </Box>
          </Box>
        </Box>

        {/* Section Légende */}
        <Box
          sx={{
            mb: 6,
            p: 3,
            bgcolor: colors.secondaryDarkAlt,
            borderRadius: 2,
            border: `1px solid ${colors.secondaryGrey}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colors.primaryRed,
              mb: 2,
              fontWeight: 'bold',
            }}
          >
            {t('info.page.map.legend.title')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' } }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: colors.primaryRed,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `3px solid ${colors.white}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="white" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="2" fill="white"/>
                  <line x1="12" y1="3" x2="12" y2="21" stroke="white" strokeWidth="1.5"/>
                  <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="1.5"/>
                  <circle cx="12" cy="5" r="1.5" fill="white"/>
                  <circle cx="12" cy="19" r="1.5" fill="white"/>
                  <circle cx="5" cy="12" r="1.5" fill="white"/>
                  <circle cx="19" cy="12" r="1.5" fill="white"/>
                </svg>
              </Box>
              <Typography sx={{ color: colors.white, fontSize: 14 }}>
                {t('info.page.map.legend.attractions')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' } }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: colors.primaryGreen,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `3px solid ${colors.white}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="6" fill="none" stroke="white" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="2" fill="white"/>
                </svg>
              </Box>
              <Typography sx={{ color: colors.white, fontSize: 14 }}>
                {t('info.page.map.legend.activities')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' } }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: colors.warning,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `3px solid ${colors.white}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill="white"/>
                </svg>
              </Box>
              <Typography sx={{ color: colors.white, fontSize: 14 }}>
                Restauration
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' } }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: colors.white,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `3px solid ${colors.white}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4zM18 22v-6h3l-2.54-7.63C18.18 7.55 17.42 7 16.56 7h-.12c-.86 0-1.63.55-1.9 1.37L12 16h3v6h3zM7.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm9 0c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z" fill="#10130C"/>
                </svg>
              </Box>
              <Typography sx={{ color: colors.white, fontSize: 14 }}>
                {t('info.page.map.legend.toilets')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' } }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#29B6F6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `3px solid ${colors.white}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4V8h16v11z" fill="white"/>
                </svg>
              </Box>
              <Typography sx={{ color: colors.white, fontSize: 14 }}>
                {t('info.page.map.legend.shops')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Section Horaires de la semaine */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: colors.primaryRed,
              fontFamily: 'Creepster',
              mb: 3,
              fontSize: { xs: 20, md: 28 },
            }}
          >
            {t('info.page.hours.title')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {[
              { day: t('info.page.hours.days.monday'), hours: t('info.page.hours.closed'), closed: true },
              { day: t('info.page.hours.days.tuesday'), hours: t('info.page.hours.closed'), closed: true },
              { day: t('info.page.hours.days.wednesday'), hours: '10h00 - 22h00', closed: false },
              { day: t('info.page.hours.days.thursday'), hours: '10h00 - 22h00', closed: false },
              { day: t('info.page.hours.days.friday'), hours: '10h00 - 23h00', closed: false },
              { day: t('info.page.hours.days.saturday'), hours: '09h00 - 00h00', closed: false },
              { day: t('info.page.hours.days.sunday'), hours: '09h00 - 22h00', closed: false },
            ].map((item) => (
              <Box
                key={item.day}
                sx={{
                  p: 2.5,
                  bgcolor: colors.secondaryDarkAlt,
                  borderRadius: 2,
                  border: `2px solid ${item.closed ? colors.primaryRed : colors.primaryGreen}40`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Typography
                  sx={{
                    color: colors.white,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  {item.day}
                </Typography>
                <Typography
                  sx={{
                    color: item.closed ? colors.primaryRed : colors.primaryGreen,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {item.hours}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Section Tarifs */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: colors.primaryRed,
              fontFamily: 'Creepster',
              mb: 3,
              fontSize: { xs: 20, md: 28 },
            }}
          >
            {t('info.page.prices.title')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {prices.map((price) => (
              <Box
                key={price.id}
                sx={{
                  p: 3,
                  bgcolor: colors.secondaryDarkAlt,
                  borderRadius: 2,
                  border: `2px solid ${colors.primaryGreen}80`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'transform 0.2s, border-color 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: colors.primaryGreen,
                  },
                }}
              >
                <Typography
                  sx={{
                    color: colors.primaryGreen,
                    fontSize: 18,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}
                >
                  {price.label}
                </Typography>
                <Typography
                  sx={{
                    color: colors.white,
                    fontSize: 36,
                    fontWeight: 'bold',
                    lineHeight: 1,
                  }}
                >
                  {i18n.language === 'fr' 
                    ? `${price.amount.toFixed(2).replace('.', ',')} €` 
                    : `€${price.amount.toFixed(2)}`}
                </Typography>
                <Typography
                  sx={{
                    color: colors.secondaryGrey,
                    fontSize: 13,
                    textAlign: 'center',
                  }}
                >
                  {price.duration_days === 1 ? t('info.page.prices.oneDay') : t('info.page.prices.passDays', { days: price.duration_days })}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography
            sx={{
              color: colors.secondaryGrey,
              fontSize: 14,
              mt: 3,
              textAlign: 'center',
            }}
          >
            {t('info.page.prices.note')}
          </Typography>
        </Box>

        {/* Section Contact */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: colors.primaryRed,
              fontFamily: 'Creepster',
              mb: 3,
              fontSize: { xs: 20, md: 28 },
            }}
          >
            {t('info.page.contact.title')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            <Box
              sx={{
                p: 4,
                bgcolor: colors.secondaryDarkAlt,
                borderRadius: 2,
                border: `1px solid ${colors.secondaryGrey}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: colors.primaryRed, mb: 3, fontWeight: 'bold', fontSize: 18 }}
              >
                {t('info.page.contact.coordinates.title')}
              </Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Typography sx={{ color: colors.primaryGreen, fontSize: 14, mb: 0.5, fontWeight: 600 }}>
                    {t('info.page.contact.coordinates.phone')}
                  </Typography>
                  <Typography sx={{ color: colors.white, fontSize: 16 }}>
                    01 23 45 67 89
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: colors.primaryGreen, fontSize: 14, mb: 0.5, fontWeight: 600 }}>
                    {t('info.page.contact.coordinates.email')}
                  </Typography>
                  <Typography sx={{ color: colors.white, fontSize: 16 }}>
                    contact@zombieland.fr
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: colors.primaryGreen, fontSize: 14, mb: 0.5, fontWeight: 600 }}>
                    {t('info.page.contact.coordinates.customerService')}
                  </Typography>
                  <Typography sx={{ color: colors.white, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: t('info.page.contact.coordinates.customerServiceHours') }} />
                </Box>
                <Box>
                  <Typography sx={{ color: colors.primaryGreen, fontSize: 14, mb: 0.5, fontWeight: 600 }}>
                    {t('info.page.contact.coordinates.socialMedia')}
                  </Typography>
                  <Typography sx={{ color: colors.white, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: t('info.page.contact.coordinates.socialMediaHandle') }} />
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 4,
                bgcolor: colors.secondaryDarkAlt,
                borderRadius: 2,
                border: `1px solid ${colors.secondaryGrey}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: colors.primaryRed, mb: 3, fontWeight: 'bold', fontSize: 18 }}
              >
                {t('info.page.contact.help.title')}
              </Typography>
              <Typography sx={{ color: colors.white, fontSize: 14, lineHeight: 1.8, mb: 3 }}>
                {t('info.page.contact.help.description')}
              </Typography>
              <Stack spacing={1.5}>
                {[
                  t('info.page.contact.help.items.reservations'),
                  t('info.page.contact.help.items.groups'),
                  t('info.page.contact.help.items.accessibility'),
                  t('info.page.contact.help.items.lockers'),
                  t('info.page.contact.help.items.birthdays'),
                ].map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: colors.primaryGreen,
                      }}
                    />
                    <Typography sx={{ color: colors.white, fontSize: 14 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Section Plan d'accès */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: colors.primaryRed,
              fontFamily: 'Creepster',
              mb: 3,
              fontSize: { xs: 20, md: 28 },
            }}
          >
            {t('info.page.access.title')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
            <Box
              sx={{
                p: 4,
                bgcolor: colors.secondaryDarkAlt,
                borderRadius: 2,
                border: `1px solid ${colors.secondaryGrey}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: colors.primaryRed, mb: 3, fontWeight: 'bold', fontSize: 18 }}
              >
                {t('info.page.access.address.title')}
              </Typography>
              <Typography sx={{ color: colors.white, fontSize: 16, mb: 3, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: t('info.page.access.address.street') }} />

              <Typography
                variant="h6"
                sx={{ color: colors.primaryRed, mb: 2, mt: 4, fontWeight: 'bold', fontSize: 18 }}
              >
                {t('info.page.access.publicTransport.title')}
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography sx={{ color: colors.primaryGreen, fontSize: 14, fontWeight: 600 }}>
                    {t('info.page.access.publicTransport.metro.label')}
                  </Typography>
                  <Typography sx={{ color: colors.white, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: t('info.page.access.publicTransport.metro.info') }} />
                </Box>
                <Box>
                  <Typography sx={{ color: colors.primaryGreen, fontSize: 14, fontWeight: 600 }}>
                    {t('info.page.access.publicTransport.rer.label')}
                  </Typography>
                  <Typography sx={{ color: colors.white, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: t('info.page.access.publicTransport.rer.info') }} />
                </Box>
                <Box>
                  <Typography sx={{ color: colors.primaryGreen, fontSize: 14, fontWeight: 600 }}>
                    {t('info.page.access.publicTransport.bus.label')}
                  </Typography>
                  <Typography sx={{ color: colors.white, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: t('info.page.access.publicTransport.bus.info') }} />
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 4,
                bgcolor: colors.secondaryDarkAlt,
                borderRadius: 2,
                border: `1px solid ${colors.secondaryGrey}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: colors.primaryRed, mb: 3, fontWeight: 'bold', fontSize: 18 }}
              >
                {t('info.page.access.car.title')}
              </Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Typography sx={{ color: colors.primaryGreen, fontSize: 14, fontWeight: 600, mb: 1 }}>
                    {t('info.page.access.car.fromCenter.label')}
                  </Typography>
                  <Typography sx={{ color: colors.white, fontSize: 14, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: t('info.page.access.car.fromCenter.info') }} />
                </Box>
                <Box>
                  <Typography sx={{ color: colors.primaryGreen, fontSize: 14, fontWeight: 600, mb: 1 }}>
                    {t('info.page.access.car.fromA1.label')}
                  </Typography>
                  <Typography sx={{ color: colors.white, fontSize: 14, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: t('info.page.access.car.fromA1.info') }} />
                </Box>
                <Box>
                  <Typography sx={{ color: colors.primaryGreen, fontSize: 14, fontWeight: 600, mb: 1 }}>
                    {t('info.page.access.car.parking.label')}
                  </Typography>
                  <Typography sx={{ color: colors.white, fontSize: 14, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: t('info.page.access.car.parking.info') }} />
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Google Maps Embed */}
          <Box
            sx={{
              mt: 3,
              height: { xs: 300, md: 450 },
              borderRadius: 2,
              overflow: 'hidden',
              border: `2px solid ${colors.secondaryGrey}`,
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.94722698267!2d2.277024999999999!3d48.8588897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sParis%2C%20France!5e0!3m2!1sen!2sfr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('info.page.access.mapTitle')}
            />
          </Box>
        </Box>

        {/* Section FAQ */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: colors.primaryRed,
              fontFamily: 'Creepster',
              mb: 3,
              fontSize: { xs: 20, md: 28 },
            }}
          >
            {t('info.page.faq.title')}
          </Typography>
          <Stack spacing={2}>
            {[
              {
                q: t('info.page.faq.items.accessibility.question'),
                a: t('info.page.faq.items.accessibility.answer'),
              },
              {
                q: t('info.page.faq.items.age.question'),
                a: t('info.page.faq.items.age.answer'),
              },
              {
                q: t('info.page.faq.items.food.question'),
                a: t('info.page.faq.items.food.answer'),
              },
              {
                q: t('info.page.faq.items.animals.question'),
                a: t('info.page.faq.items.animals.answer'),
              },
              {
                q: t('info.page.faq.items.weather.question'),
                a: t('info.page.faq.items.weather.answer'),
              },
              {
                q: t('info.page.faq.items.cancellation.question'),
                a: t('info.page.faq.items.cancellation.answer'),
              },
              {
                q: t('info.page.faq.items.lockers.question'),
                a: t('info.page.faq.items.lockers.answer'),
              },
              {
                q: t('info.page.faq.items.events.question'),
                a: t('info.page.faq.items.events.answer'),
              },
            ].map((faq, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  bgcolor: colors.secondaryDarkAlt,
                  borderRadius: 2,
                  border: `1px solid ${colors.secondaryGrey}`,
                }}
              >
                <Typography
                  sx={{
                    color: colors.primaryGreen,
                    fontSize: 16,
                    fontWeight: 'bold',
                    mb: 1.5,
                  }}
                >
                  {faq.q}
                </Typography>
                <Typography
                  sx={{
                    color: colors.white,
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {faq.a}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
