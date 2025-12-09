import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme/theme'
import './index.css'
import { router } from './router'
import {LoginProvider} from "./context/UserLoginContext.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
        <CssBaseline />
            <LoginProvider>
                <RouterProvider router={router} />
            </LoginProvider>
    </ThemeProvider>
  </StrictMode>,
)
