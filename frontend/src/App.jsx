import React, { /*useState, useEffect*/ } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';

// Importar componentes
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import TheoryModule from './components/TheoryModule';
import EquationsModule from './components/EquationsModule';
import ApplicationsModule from './components/ApplicationsModule';
import SimulationModule from './components/SimulationModule';
import GameModule from './components/GameModule';
import Header from './components/Header';

// Importar servicios
//import { authService } from './services/authService';
import { AuthProvider, useAuth } from "./context/AuthContext";




// Tema personalizado para Material-UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FCD34D', // Amarillo dorado
      light: '#FEF3C7',
      dark: '#F59E0B',
    },
    secondary: {
      main: '#8B5CF6', // Púrpura
      light: '#C4B5FD',
      dark: '#6D28D9',
    },
    background: {
      default: 'linear-gradient(135deg, #1e3a8a 0%, #581c87 50%, #312e81 100%)',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#D1D5DB',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
});

// Componente de carga
const LoadingScreen = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    sx={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #581c87 50%, #312e81 100%)',
    }}
  >
    <CircularProgress size={60} sx={{ color: '#FCD34D' }} />
  </Box>
);

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente principal de la aplicación
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #581c87 50%, #312e81 100%)',
      }}
    >
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Header />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/theory"
          element={
            <ProtectedRoute>
              <Header />
              <TheoryModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equations"
          element={
            <ProtectedRoute>
              <Header />
              <EquationsModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Header />
              <ApplicationsModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/simulation"
          element={
            <ProtectedRoute>
              <Header />
              <SimulationModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <Header />
              <GameModule />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Box>
  );
};

// Componente raíz de la aplicación
const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
