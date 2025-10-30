import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Avatar,
  Fade,
  Grow,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import {
  MenuBook,
  Functions,
  Engineering,
  SportsEsports,
  Science,
  PlayArrow,
  TrendingUp,
  School,
  Timer,
  EmojiEvents,
  Waves as WavesIcon,
  FlashOn,
  Refresh
} from '@mui/icons-material';
import Explore from '@mui/icons-material/Explore'; 
import SettingsInputAntenna from '@mui/icons-material/SettingsInputAntenna'; 
import DeviceHub from '@mui/icons-material/DeviceHub'; 

import { useAuth } from '../context/AuthContext';
import { moduleService, progressService } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isGuest } = useAuth();
  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [stats, setStats] = useState({
    totalModules: 0,
    completedModules: 0,
    totalScore: 0,
    timeSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [isGuest]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Intentar cargar módulos
      let modulesData = [];
      try {
        modulesData = await moduleService.getModules();
        setModules(modulesData);
      } catch (moduleError) {
        console.error('Error cargando módulos:', moduleError);
        // Usar módulos por defecto si falla la carga
        modulesData = getDefaultModules();
        setModules(modulesData);
      }

      // Intentar cargar progreso solo si no es invitado
      let progressData = [];
      if (!isGuest) {
        try {
          progressData = await progressService.getUserProgress();
          setUserProgress(progressData);
        } catch (progressError) {
          console.error('Error cargando progreso:', progressError);
          // Si falla el progreso, usar datos vacíos pero no bloquear la app
          progressData = [];
          setUserProgress([]);
          // Solo mostrar error si es crítico
          if (progressError.message !== 'Error interno del servidor') {
            setError('No se pudo cargar tu progreso, pero puedes continuar usando la aplicación.');
          }
        }
      }

      // Calcular estadísticas
      const completedCount = progressData.filter(p => p.is_completed).length;
      const totalScore = progressData.reduce((sum, p) => sum + (p.score || 0), 0);
      const totalTime = progressData.reduce((sum, p) => sum + (p.time_spent || 0), 0);

      setStats({
        totalModules: modulesData.length,
        completedModules: completedCount,
        totalScore,
        timeSpent: totalTime
      });
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      setError('Hubo un problema al cargar los datos. Por favor, intenta recargar la página.');
      // Cargar módulos por defecto para que la app sea usable
      setModules(getDefaultModules());
    } finally {
      setLoading(false);
    }
  };

  // Módulos por defecto en caso de fallo del servidor
  const getDefaultModules = () => [
    {
      id: 1,
      title: 'Fundamentos Teóricos',
      description: 'Explora los conceptos fundamentales del electromagnetismo',
      content_type: 'theory',
      difficulty_level: 'beginner',
      order_index: 1
    },
    {
      id: 2,
      title: 'Ecuaciones de Maxwell',
      description: 'Las cuatro ecuaciones fundamentales del electromagnetismo',
      content_type: 'equations',
      difficulty_level: 'intermediate',
      order_index: 2
    },
    {
      id: 3,
      title: 'Aplicaciones Tecnológicas',
      description: 'Descubre las aplicaciones prácticas del electromagnetismo',
      content_type: 'applications',
      difficulty_level: 'intermediate',
      order_index: 3
    },
    {
      id: 4,
      title: 'Simulación Interactiva',
      description: 'Experimenta con simulaciones de campos electromagnéticos',
      content_type: 'simulation',
      difficulty_level: 'advanced',
      order_index: 4
    },
    {
      id: 5,
      title: 'Juego de Ondas',
      description: 'Pon a prueba tus conocimientos con nuestro juego',
      content_type: 'game',
      difficulty_level: 'all',
      order_index: 5
    }
  ];

  const getModuleProgress = (moduleId) => {
    const progress = userProgress.find(p => p.module_id === moduleId);
    return progress ? progress.completion_percentage : 0;
  };

  const isModuleCompleted = (moduleId) => {
    const progress = userProgress.find(p => p.module_id === moduleId);
    return progress ? progress.is_completed : false;
  };

  const getModuleIcon = (contentType) => {
    const icons = {
      theory: MenuBook,
      equations: Functions,
      applications: Engineering,
      simulation: Science,
      game: SportsEsports
    };
    return icons[contentType] || MenuBook;
  };

  const getModuleColor = (contentType) => {
    const colors = {
      theory: '#3B82F6',
      equations: '#8B5CF6',
      applications: '#10B981',
      simulation: '#F59E0B',
      game: '#EF4444'
    };
    return colors[contentType] || '#3B82F6';
  };

  const handleModuleClick = (module) => {
    const routes = {
      theory: '/theory',
      equations: '/equations',
      applications: '/applications',
      simulation: '/simulation',
      game: '/game'
    };
    navigate(routes[module.content_type] || '/theory');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const StatCard = ({ icon: IconComponent, title, value, subtitle, color }) => (
    <Grow in timeout={800}>
      <Card
        sx={{
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          border: `1px solid ${color}30`,
          height: '100%',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight="bold" color={color}>
                {value}
              </Typography>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar
              sx={{
                backgroundColor: color,
                width: 56,
                height: 56,
              }}
            >
              <IconComponent sx={{ fontSize: 28 }} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              <FlashOn sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary">
              Cargando módulos...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Error Alert */}
      {error && (
        <Fade in timeout={400}>
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={loadDashboardData} startIcon={<Refresh />}>
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Hero Section */}
      <Fade in timeout={600}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Ecuaciones de Maxwell
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            maxWidth="800px"
            mx="auto"
            mb={4}
          >
            Descubre las leyes fundamentales que gobiernan el electromagnetismo 
            y las ondas electromagnéticas
          </Typography>
          
          {/* Iconos decorativos */}
          <Box display="flex" justifyContent="center" gap={3} mb={4}>
            <Avatar sx={{ bgcolor: '#3B82F6', animation: 'float 3s ease-in-out infinite' }}>
              <WavesIcon />
            </Avatar>
            <Avatar sx={{ bgcolor: '#8B5CF6', animation: 'float 3s ease-in-out infinite 0.5s' }}>
              <FlashOn />
            </Avatar>
            <Avatar sx={{ bgcolor: '#10B981', animation: 'float 3s ease-in-out infinite 1s' }}>
              <Explore />
            </Avatar>
          </Box>
        </Box>
      </Fade>

      {/* Stats Cards */}
      {!isGuest && (
        <Grid container spacing={3} mb={6}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={School}
              title="Módulos Totales"
              value={stats.totalModules}
              color="#3B82F6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={EmojiEvents}
              title="Completados"
              value={stats.completedModules}
              subtitle={`${Math.round((stats.completedModules / stats.totalModules) * 100)}% progreso`}
              color="#10B981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={TrendingUp}
              title="Puntuación Total"
              value={stats.totalScore}
              color="#8B5CF6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={Timer}
              title="Tiempo Estudiado"
              value={formatTime(stats.timeSpent)}
              color="#F59E0B"
            />
          </Grid>
        </Grid>
      )}

      {/* Módulos Educativos */}
      <Typography variant="h4" gutterBottom mb={3}>
        Módulos Educativos
      </Typography>

      <Grid container spacing={3}>
        {modules.map((module, index) => {
          const IconComponent = getModuleIcon(module.content_type);
          const moduleColor = getModuleColor(module.content_type);
          const progress = getModuleProgress(module.id);
          const completed = isModuleCompleted(module.id);

          return (
            <Grid item xs={12} sm={6} md={4} key={module.id}>
              <Grow in timeout={800 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: `linear-gradient(135deg, ${moduleColor}15 0%, ${moduleColor}05 100%)`,
                    border: `1px solid ${moduleColor}30`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${moduleColor}40`,
                      border: `1px solid ${moduleColor}60`,
                    },
                  }}
                  onClick={() => handleModuleClick(module)}
                >
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          backgroundColor: moduleColor,
                          mr: 2,
                          width: 48,
                          height: 48,
                        }}
                      >
                        <IconComponent />
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                          {module.title}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={module.content_type}
                            size="small"
                            sx={{
                              backgroundColor: `${moduleColor}20`,
                              color: moduleColor,
                              border: `1px solid ${moduleColor}40`,
                              textTransform: 'capitalize',
                            }}
                          />
                          <Chip
                            label={module.difficulty_level}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      </Box>
                      {completed && (
                        <IconButton sx={{ color: '#10B981' }}>
                          <EmojiEvents />
                        </IconButton>
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.6 }}
                    >
                      {module.description}
                    </Typography>

                    {!isGuest && progress > 0 && (
                      <Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="caption" color="text.secondary">
                            Progreso
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round(progress)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: moduleColor,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ p: 2 }}>
                    <Button
                      startIcon={<PlayArrow />}
                      fullWidth
                      variant="contained"
                      sx={{
                        backgroundColor: moduleColor,
                        '&:hover': {
                          backgroundColor: `${moduleColor}dd`,
                        },
                      }}
                    >
                      {completed ? 'Revisar' : 'Comenzar'}
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          );
        })}
      </Grid>

      {/* Quick Actions */}
      <Box mt={6}>
        <Typography variant="h4" gutterBottom mb={3}>
          Acciones Rápidas
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grow in timeout={1200}>
              <Paper
                sx={{
                  p: 4,
                  background: 'linear-gradient(135deg, #3B82F615 0%, #3B82F605 100%)',
                  border: '1px solid #3B82F630',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px #3B82F640',
                  },
                }}
                onClick={() => navigate('/game')}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <SportsEsports sx={{ mr: 2, color: '#3B82F6', fontSize: 32 }} />
                  <Typography variant="h5" color="text.primary">
                    Juego Interactivo
                  </Typography>
                </Box>
                <Typography color="text.secondary" mb={2}>
                  Pon a prueba tus conocimientos con nuestro juego de ondas electromagnéticas
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<PlayArrow />}
                >
                  Jugar Ahora
                </Button>
              </Paper>
            </Grow>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grow in timeout={1400}>
              <Paper
                sx={{
                  p: 4,
                  background: 'linear-gradient(135deg, #8B5CF615 0%, #8B5CF605 100%)',
                  border: '1px solid #8B5CF630',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px #8B5CF640',
                  },
                }}
                onClick={() => navigate('/simulation')}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Science sx={{ mr: 2, color: '#8B5CF6', fontSize: 32 }} />
                  <Typography variant="h5" color="text.primary">
                    Simulación Avanzada
                  </Typography>
                </Box>
                <Typography color="text.secondary" mb={2}>
                  Experimenta con simulaciones interactivas de campos electromagnéticos
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ color: '#8B5CF6', borderColor: '#8B5CF6' }}
                  startIcon={<PlayArrow />}
                >
                  Simular
                </Button>
              </Paper>
            </Grow>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

// Agregar animación CSS para los iconos flotantes
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;
document.head.appendChild(style);

export default Dashboard;

