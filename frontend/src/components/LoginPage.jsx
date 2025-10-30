// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  CircularProgress,
  Avatar,
  Container,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  FlashOn,
  ArrowBack,
  Visibility,
  VisibilityOff,
  Person,
  PersonAdd,
  PlayArrow,
  Info
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [screen, setScreen] = useState('main'); // 'main' | 'login' | 'register' | 'guest'
  const [showPassword, setShowPassword] = useState(false);

  // Auth context
  const { login, register, loginAsGuest, loading, error, clearError } = useAuth();

  // Resetea error al cambiar pantalla
  useEffect(() => {
    if (error) clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const goBack = () => {
    setScreen('main');
    clearError();
  };

  const renderLogo = () => (
    <Box textAlign="center" mb={3}>
      <Avatar
        sx={{
          width: 64,
          height: 64,
          mx: 'auto',
          mb: 2,
          background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
        }}
      >
        <FlashOn sx={{ fontSize: 32, color: 'white' }} />
      </Avatar>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        MaxWaveX
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Bienvenido a la plataforma de electromagnetismo
      </Typography>
    </Box>
  );

  const LoginForm = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
      if (error) { 
        clearError();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, password]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email || !password) {
        return;
      }
      try {
        await login(email, password);
      } catch (err) {
        console.error('Login error:', err);
      }
    };

    return (
      <Box>
        {renderLogo()}

        <Typography variant="h5" textAlign="center" gutterBottom sx={{ color: '#FCD34D', fontWeight: 600, mb: 1 }}>
          Iniciar Sesión
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
          Accede a tu cuenta existente
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Email o Usuario
            </Typography>
            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={(ev) => { setEmail(ev.target.value); if (error) clearError(); }}
              required
              placeholder="tu@email.com"
              inputProps={{ autoComplete: 'off' }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255,255,255,0.05)' } }}
            />
          </Box>

          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Contraseña
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(ev) => { setPassword(ev.target.value); if (error) clearError(); }}
              required
              placeholder="••••••••"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" type="button">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255,255,255,0.05)' } }}
            />
          </Box>
          
          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                color: 'white',
                py: 1.5,
                background: 'linear-gradient(90deg, #2563EB 0%, #8B5CF6 100%)',
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(90deg, #1D4ED8 0%, #7C3AED 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
            </Button>
            <Button type="button" fullWidth variant="outlined" size="large" startIcon={<ArrowBack />} onClick={onBack}
              sx={{
                color: 'white',
                py: 1.5,
                borderColor: 'rgba(255,255,255,0.3)',
                borderRadius: 2,
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.05)' }
              }}
            >
              Volver
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  const RegisterForm = ({ onBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [localError, setLocalError] = useState('');

    useEffect(() => {
      if (error) clearError();
      setLocalError('');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, email, password, confirmPassword, acceptTerms]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLocalError('');

      // Validaciones
      if (!name || !email || !password || !confirmPassword) {
        setLocalError('Por favor completa todos los campos');
        return;
      }

      if (password !== confirmPassword) {
        setLocalError('Las contraseñas no coinciden');
        return;
      }

      if (password.length < 6) {
        setLocalError('La contraseña debe tener al menos 6 caracteres');
        return;
      }


      try {
        await register(name, email, password);
        // Si llega aquí, el registro fue exitoso
      } catch (err) {
        console.error('Register error:', err);
      }
    };

    return (
      <Box>
        {renderLogo()}
        <Typography variant="h5" textAlign="center" gutterBottom sx={{ color: '#10B981', fontWeight: 600, mb: 1 }}>
          Crear Cuenta
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
          Únete a Maxwell Academy
        </Typography>

        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => { clearError(); setLocalError(''); }}>
            {localError || error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Nombre Completo
            </Typography>
            <TextField 
              fullWidth 
              value={name} 
              onChange={(ev) => { setName(ev.target.value); setLocalError(''); if (error) clearError(); }}
              required 
              placeholder="Tu nombre completo" 
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255,255,255,0.05)' } }} 
            />
          </Box>

          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Email
            </Typography>
            <TextField 
              fullWidth 
              type="email" 
              value={email} 
              onChange={(ev) => { setEmail(ev.target.value); setLocalError(''); if (error) clearError(); }}
              required 
              placeholder="tu@email.com" 
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255,255,255,0.05)' } }} 
            />
          </Box>

          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Contraseña
            </Typography>
            <TextField 
              fullWidth 
              type="password" 
              value={password} 
              onChange={(ev) => { setPassword(ev.target.value); setLocalError(''); if (error) clearError(); }}
              required 
              placeholder="••••••••" 
              helperText="Mínimo 6 caracteres"
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255,255,255,0.05)' } }} 
            />
          </Box>

          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Confirmar Contraseña
            </Typography>
            <TextField 
              fullWidth 
              type="password" 
              value={confirmPassword} 
              onChange={(ev) => { setConfirmPassword(ev.target.value); setLocalError(''); if (error) clearError(); }}
              required 
              error={password !== confirmPassword && confirmPassword !== ''} 
              helperText={password !== confirmPassword && confirmPassword !== '' ? 'Las contraseñas no coinciden' : ''}
              placeholder="••••••••" 
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255,255,255,0.05)' } }} 
            />
          </Box>


          <Box display="flex" flexDirection="column" gap={2}>
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large" 
              disabled={loading} 
              sx={{ 
                color: 'white', 
                py: 1.5, 
                background: 'linear-gradient(90deg,#059669 0%,#10B981 100%)', 
                borderRadius: 2, 
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(90deg,#047857 0%,#059669 100%)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Crear Cuenta'}
            </Button>

            <Button 
              type="button" 
              fullWidth 
              variant="outlined" 
              size="large" 
              startIcon={<ArrowBack />} 
              onClick={onBack} 
              sx={{ 
                color: 'white',
                py: 1.5,
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              Volver
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  const GuestForm = ({ onBack }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!username || username.trim().length < 2) return;
      try {
        await loginAsGuest(username.trim());
      } catch (err) {
        console.error('Guest login error:', err);
      }
    };

    return (
      <Box>
        {renderLogo()}
        <Typography variant="h5" textAlign="center" gutterBottom sx={{ color: '#F59E0B', fontWeight: 600, mb: 1 }}>
          Acceso como Invitado
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
          Explora Maxwell Academy sin crear cuenta
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={clearError}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>Nombre de Usuario</Typography>
            <TextField fullWidth value={username} onChange={(ev) => { setUsername(ev.target.value); if (error) clearError(); }} required placeholder="Elige un nombre de usuario" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255,255,255,0.05)' } }} inputProps={{ autoComplete: 'off' }} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Este nombre se usará para personalizar tu experiencia</Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} 
            sx={{ 
            color: 'white', 
            py: 1.5, 
            background: 'linear-gradient(90deg,#D97706 0%,#F59E0B 100%)', 
            borderRadius: 2 }}>
              {loading ? <CircularProgress size={24} /> : 'Continuar como Invitado'}
            </Button>

            <Button type="button" fullWidth variant="outlined" size="large" startIcon={<ArrowBack />} onClick={onBack} 
            sx={{ 
              color: 'white',
              py: 1.5 }}>
              Volver
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" py={4}>
        <Card sx={{ width: '100%', maxWidth: 480, backdropFilter: 'blur(20px)', backgroundColor: 'rgba(30,41,59,0.95)', borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {screen === 'main' && (
              <Box>
                {renderLogo()}
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={clearError}>{error}</Alert>}
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button type="button" fullWidth variant="contained" startIcon={<Person />} size="large" onClick={() => setScreen('login')} 
                  sx={{ 
                    color: 'white',
                    py: 2, 
                    background: 'linear-gradient(90deg,#2563EB 0%,#8B5CF6 100%)' }
                    }>Iniciar Sesión</Button>
                  <Button type="button" fullWidth variant="contained" startIcon={<PersonAdd />} size="large" onClick={() => setScreen('register')} 
                  sx={{ 
                    color: 'white',
                    py: 2, 
                    background: 'linear-gradient(90deg,#059669 0%,#10B981 100%)' 
                    }}>Registrarse</Button>
                  <Button type="button" fullWidth variant="contained" startIcon={<PlayArrow />} size="large" onClick={() => setScreen('guest')} 
                  sx={{ 
                    color: 'white',
                    py: 2, 
                    background: 'linear-gradient(90deg,#D97706 0%,#F59E0B 100%)' }
                    }>Continuar como Invitado</Button>
                </Box>
              </Box>
            )}

            {screen === 'login' && <LoginForm onBack={goBack} />}
            {screen === 'register' && <RegisterForm onBack={goBack} />}
            {screen === 'guest' && <GuestForm onBack={goBack} />}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;