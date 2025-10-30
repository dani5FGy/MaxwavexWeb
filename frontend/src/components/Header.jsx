import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  FlashOn,
  AccountCircle,
  ExitToApp,
  MenuBook,
  Functions,
  Engineering,
  SportsEsports,
  Science,
  Dashboard as DashboardIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isGuest } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { label: 'Teoría', path: '/theory', icon: MenuBook },
    { label: 'Ecuaciones', path: '/equations', icon: Functions },
    { label: 'Aplicaciones', path: '/applications', icon: Engineering },
    { label: 'Simulación', path: '/simulation', icon: Science },
    { label: 'Juego', path: '/game', icon: SportsEsports },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const isCurrentPath = (path) => location.pathname === path;

  const getUserDisplayName = () => {
    if (isGuest) {
      return user?.username || 'Invitado';
    }
    return user?.name || 'Usuario';
  };

  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        {/* Logo y Título */}
        <Box 
          display="flex" 
          alignItems="center" 
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
            }}
          >
            <FlashOn sx={{ color: 'white' }} />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}
            >
              MaxWaveX
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              Bienvenido, {getUserDisplayName()}
              {isGuest && (
                <Chip
                  label="Invitado"
                  size="small"
                  sx={{
                    ml: 1,
                    height: 16,
                    fontSize: '0.6rem',
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    color: '#FCD34D',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                  }}
                />
              )}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Desktop */}
        {!isMobile && (
          <Box display="flex" alignItems="center" gap={1} mr={2}>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Tooltip key={item.path} title={item.label}>
                  <Button
                    startIcon={<IconComponent />}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: isCurrentPath(item.path) ? 'primary.main' : 'text.primary',
                      backgroundColor: isCurrentPath(item.path) 
                        ? 'rgba(252, 211, 77, 0.1)' 
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(252, 211, 77, 0.1)',
                        color: 'primary.main',
                      },
                      borderRadius: 2,
                      px: 2,
                      minWidth: 'auto',
                    }}
                  >
                    {item.label}
                  </Button>
                </Tooltip>
              );
            })}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={handleMobileMenuOpen}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* User Menu */}
        <Tooltip title="Perfil de usuario">
          <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                backgroundColor: isGuest ? 'orange.main' : 'primary.main',
                fontSize: '1rem',
              }}
            >
              {getUserInitial()}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1.5,
              minWidth: 200,
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '& .MuiMenuItem-root': {
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileMenuClose} disabled>
            <AccountCircle sx={{ mr: 2 }} />
            <Box>
              <Typography variant="subtitle2">{getUserDisplayName()}</Typography>
              <Typography variant="caption" color="text.secondary">
                {isGuest ? 'Sesión de invitado' : user?.email}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ExitToApp sx={{ mr: 2 }} />
            Cerrar Sesión
          </MenuItem>
        </Menu>

        {/* Mobile Navigation Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1.5,
              minWidth: 250,
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '& .MuiMenuItem-root': {
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              },
            },
          }}
        >
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <MenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                selected={isCurrentPath(item.path)}
              >
                <IconComponent sx={{ mr: 2 }} />
                {item.label}
              </MenuItem>
            );
          })}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;