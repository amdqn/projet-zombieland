import { useState } from 'react';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import { colors } from '../../theme';
import { CustomBreadcrumbs } from '../../components/common';
import { HeroSection } from '../../components/hero/HeroSection';
import { ReservationList } from './ReservationManagement.tsx/ReservationList';
import { ActivityList } from './ActivityManagement.tsx/ActivityList';
import { AttractionList } from './AttractionManagement.tsx/AttractionList';
import {PriceList} from "./PriceManagement/PriceList.tsx";
import { CategoryList } from './CategoryManagement/CategoryList';
import { UserList } from './UserManagement/UserList';
import { useTranslation } from 'react-i18next';

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState<number>(0);

  const heroImages = [
    '/activities-images/post-apocalyptic-street.jpg',
    '/activities-images/zombie.jpg',
    '/activities-images/abandoned-lab.jpg',
    '/activities-images/haunted-hospital.jpg',
  ].slice(0, 5);

  const tabs = [
    { label: t('admin.dashboard.tabs.reservations'), component: <ReservationList /> },
    { label: t('admin.dashboard.tabs.activities'), component: <ActivityList /> },
    { label: t('admin.dashboard.tabs.attractions'), component: <AttractionList /> },
    { label: t('admin.dashboard.tabs.prices'), component: <PriceList /> },
    { label: t('admin.dashboard.tabs.users'), component: <UserList /> },
    { label: t('admin.dashboard.tabs.categories'), component: <CategoryList /> },
  ];

  return (
    <Box sx={{ backgroundColor: colors.secondaryDark, minHeight: '100vh', color: colors.white }}>
      <HeroSection images={heroImages}>
        <Box>
          <Box sx={{ pt: { xs: 2, md: 2 }, mb: { xs: 1, md: 1 } }}>
            <CustomBreadcrumbs
              items={[
                { label: t('admin.dashboard.breadcrumbs.home'), path: '/', showOnMobile: true },
                { label: t('admin.dashboard.breadcrumbs.admin'), showOnMobile: true },
                { label: 'Administration', showOnMobile: true },
              ]}
            />
          </Box>

          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mb: { xs: 1.5, md: 3 },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.primaryGreen,
                height: 3,
              },
              '& .MuiTabs-scrollButtons': {
                color: colors.white,
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
              },
              '& .MuiTab-root': {
                color: colors.white,
                opacity: 0.6,
                fontSize: { xs: '0.85rem', md: '1.1rem' },
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                minHeight: { xs: 40, md: 48 },
                padding: { xs: '8px 12px', md: '12px 24px' },
                '&.Mui-selected': {
                  color: colors.primaryGreen,
                  opacity: 1,
                },
                '&:hover': {
                  color: colors.primaryGreen,
                  opacity: 0.9,
                },
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.8rem', md: '4rem' },
              color: colors.white,
              textShadow: `
              0 0 20px rgba(198, 38, 40, 0.8),
              0 0 40px rgba(58, 239, 48, 0.4),
              3px 3px 0 ${colors.primaryRed}
            `,
              marginBottom: { xs: '8px', md: '12px' },
              lineHeight: 1,
              letterSpacing: '2px',
            }}
          >
            {t('admin.dashboard.title')}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: { xs: '100%', md: '560px' },
              color: colors.white,
              fontSize: { xs: '0.85rem', md: '1.1rem' },
              mb: { xs: 1.5, md: 3 },
            }}
          >
            {t('admin.dashboard.description')}
          </Typography>
        </Box>
      </HeroSection>

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
        <Box
          sx={{
            backgroundColor: colors.secondaryDarkAlt,
            border: `1px solid ${colors.secondaryGrey}`,
            borderRadius: '12px',
            p: { xs: 2, md: 3 },
            minHeight: '400px',
          }}
        >
          {tabs[tabValue]?.component}
        </Box>
      </Container>
    </Box>
  );
};
