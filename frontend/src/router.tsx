import { createBrowserRouter } from 'react-router-dom';
import { DesignSystem } from './DesignSystem/DesignSystem';
import { Activities } from './pages/Activities';
import { ActivityDetail } from './pages/ActivityDetail';
import RootPage from './pages/RootPage/RootPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        // element: <Home />, // Page principale
      },
      {
        path: 'activities',
        element: <Activities />,
      },
      {
        path: 'activities/:id',
        element: <ActivityDetail />,
      },
      {
        path: 'design-system',
        element: <DesignSystem />,
      },
      {
        path: 'login',
        // element: <Login />, // Connexion
      },
      {
        path: 'register',
        // element: <Register />, // Inscription
      },
      {
        path: 'account',
        // element: <Account />, // Compte utilisateur
      },
      {
        path: 'admin',
        // element: <Admin />, // Back-office
      },
      {
        path: 'reservations',
        // element: <Reservations />, // Réservations
      },
      {
        path: 'contact',
        // element: <Contact />, // Formulaire de Contacte
      },
      {
        path: 'info',
        // element: <GeneralInfo />, // Informations générales
      },
      {
        path: 'static/:pageType',
        // element: <StaticPage />, // Page statique (Gestion cookie, ML, RGPD, CGU, CGV...)
      },
    ],
  },
]);

