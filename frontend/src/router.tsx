import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { type ReactElement, useContext } from 'react';
import { ActivityDetail } from './pages/ActivityDetail';
import { DesignSystem } from './DesignSystem';
import { Activities } from './pages/Activities';
import RootPage from './pages/RootPage/RootPage';
import HomePage from "./pages/HomePage/HomePage.tsx";
import { ReservationProcessusPage } from './pages/ReservationProcessus';
import LoginPage from "./pages/AuthPage/LoginPage.tsx";
import AccountPage from "./pages/AuthPage/AccountPage.tsx";
import RegisterPage from "./pages/AuthPage/RegisterPage.tsx";
import SuccesAuthPage from "./pages/AuthPage/SuccesAuthPage.tsx";
import { LoginContext } from './context/UserLoginContext.tsx';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isLogged } = useContext(LoginContext);
  const location = useLocation();

  if (!isLogged) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: 'Veuillez vous connecter pour accéder à la réservation.',
        }}
      />
    );
  }

  return children;
};

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
        path: 'attractions/:id',
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
        element: (
          <ProtectedRoute>
            <ReservationProcessusPage />
          </ProtectedRoute>
        ), // Réservations
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

