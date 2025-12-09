import { createBrowserRouter } from 'react-router-dom';
import { DesignSystem } from './DesignSystem/DesignSystem';
import { ActivityDetail } from './pages/ActivityDetail';
import RootPage from './pages/RootPage/RootPage';
import HomePage from "./pages/HomePage/HomePage.tsx";
import { ReservationProcessusPage } from './pages/ReservationProcessus/ReservationProcessusPage';
import { DesignSystem } from './DesignSystem';
import { Activities } from './pages/Activities';
import RootPage from './pages/RootPage/RootPage';
import HomePage from "./pages/HomePage/HomePage.tsx";
import { ReservationProcessusPage } from './pages/ReservationProcessus';
import LoginPage from "./pages/AuthPage/LoginPage.tsx";
import AccountPage from "./pages/AuthPage/AccountPage.tsx";
import RegisterPage from "./pages/AuthPage/RegisterPage.tsx";
import SuccesAuthPage from "./pages/AuthPage/SuccesAuthPage.tsx";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <HomePage />, // Page principale
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
        element: <LoginPage />, // Connexion
      },
      {
        path: 'register',
        element: <RegisterPage />, // Inscription
      },
      {
        path: 'register/success',
        element: <SuccesAuthPage/>,
      },
      {
        path: 'account',
        element: <AccountPage />, // Compte utilisateur
      },
      {
        path: 'admin',
        // element: <Admin />, // Back-office
      },
      {
        path: 'reservations',
        element: <ReservationProcessusPage />, // Réservations
      },
      {
        path: 'contact',
        // element: <Contact />, // Formulaire de Contacte
      },
      {
        path: 'info',
        // element: <GeneralInfo />, // InformationsMain générales
      },
      {
        path: 'static/:pageType',
        // element: <StaticPage />, // Page statique (Gestion cookie, ML, RGPD, CGU, CGV...)
      },
    ],
  },
]);

