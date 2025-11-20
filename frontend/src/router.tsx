import { createBrowserRouter } from 'react-router-dom';
import { DesignSystem } from './DesignSystem/DesignSystem';
import RootPage from "./page/rootPage.tsx";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        // element: <Home />,
      },
      {
        path: 'activities',
        // element: <Activities />,
      },
      {
        path: 'activities/:id',
        // element: <ActivityDetail />,
      },
      {
        path: 'design-system',
        element: <DesignSystem />,
      },
      {
        path: 'login',
        // element: <Login />,
      },
      {
        path: 'register',
        // element: <Register />,
      },
      {
        path: 'account',
        // element: <Account />,
      },
      {
        path: 'admin',
        // element: <Admin />,
      },
    ],
  },
]);

