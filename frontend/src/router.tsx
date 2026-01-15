import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { type ReactElement, useContext } from 'react';
import { Box, CircularProgress } from '@mui/material';
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
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { colors } from './theme';
import {UserDashboard} from "./pages/UserPage/UserDashboard.tsx";
import { InformationPage } from './pages/InformationPage';
import StaticPage from "./pages/StaticPage/StaticPage.tsx";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isLogged, isLoading } = useContext(LoginContext);
  const location = useLocation();

  // Attendre la fin du chargement initial avant de vérifier les permissions
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: colors.secondaryDark,
        }}
      >
        <CircularProgress sx={{ color: colors.primaryGreen }} />
      </Box>
    );
  }

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

const AdminProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isLogged, role, isLoading } = useContext(LoginContext);
  const location = useLocation();

  // Attendre la fin du chargement initial avant de vérifier les permissions
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: colors.secondaryDark,
        }}
      >
        <CircularProgress sx={{ color: colors.primaryGreen }} />
      </Box>
    );
  }

  // Redirige vers la connexion si l'utilisateur n'est pas authentifié
  if (!isLogged) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Bloque l'accès si le rôle n'est pas ADMIN
  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
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
        path: 'restaurants/:id',
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
        path: 'account/reservations',
        element: (
            <ProtectedRoute>
              <UserDashboard/>
            </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        ),
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
        element: <InformationPage />, // Informations générales + carte interactive
      },
      {
        path: 'static/:pageType',
        element: <StaticPage />, // Page statique (Gestion cookie, ML, RGPD, CGU, CGV...)
      },
    ],
  },
]);

