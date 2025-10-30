import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Fade,
  Grow,
  Button,
  Avatar,
  Slider,
  Divider,
  Paper
} from '@mui/material';
import {
  Radio,
  Wifi,
  PhoneAndroid,
  MedicalServices,
  FlashOn,
  Satellite,
  Radar as RadarIcon,
  PlayArrow,
  Pause
} from '@mui/icons-material';

const ApplicationsModule = () => {
  // Estado para el simulador de radar
  const [radarFreq, setRadarFreq] = useState(5);
  const [radarPower, setRadarPower] = useState(7);
  const [isScanning, setIsScanning] = useState(false);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [flightTime, setFlightTime] = useState('--');
  const scanIntervalRef = useRef(null);

  const applications = [
    {
      id: 'radio',
      title: 'Comunicaciones por Radio',
      icon: Radio,
      description: 'Las ondas de radio permiten las comunicaciones inalámbricas a largas distancias.',
      details: 'Frecuencias de 3 kHz a 300 GHz se utilizan para radio AM/FM, televisión, y comunicaciones móviles.',
      color: '#3B82F6'
    },
    {
      id: 'wifi',
      title: 'WiFi y Bluetooth',
      icon: Wifi,
      description: 'Tecnologías inalámbricas que utilizan microondas para transferencia de datos.',
      details: 'WiFi opera en 2.4 GHz y 5 GHz, mientras que Bluetooth usa 2.4 GHz con saltos de frecuencia.',
      color: '#10B981'
    },
    {
      id: 'mobile',
      title: 'Telefonía Móvil',
      icon: PhoneAndroid,
      description: 'Los teléfonos celulares usan ondas electromagnéticas para comunicación.',
      details: 'Desde 1G hasta 5G, cada generación utiliza diferentes frecuencias y técnicas de modulación.',
      color: '#8B5CF6'
    },
    {
      id: 'medical',
      title: 'Aplicaciones Médicas',
      icon: MedicalServices,
      description: 'Rayos X, resonancia magnética y otros equipos médicos.',
      details: 'Los rayos X permiten ver dentro del cuerpo, mientras que la RM usa campos magnéticos intensos.',
      color: '#EF4444'
    },
    {
      id: 'power',
      title: 'Transmisión de Energía',
      icon: FlashOn,
      description: 'Las líneas de transmisión eléctrica transportan energía a largas distancias.',
      details: 'Frecuencias de 50-60 Hz se utilizan para distribución de energía eléctrica en redes.',
      color: '#F59E0B'
    },
    {
      id: 'satellite',
      title: 'Comunicaciones Satelitales',
      icon: Satellite,
      description: 'Satélites que proporcionan comunicaciones globales y GPS.',
      details: 'Utilizan microondas y frecuencias más altas para comunicación espacial.',
      color: '#06B6D4'
    }
  ];

  // Calcular longitud de onda
  const wavelength = ((3e8 / (radarFreq * 1e9)) * 100).toFixed(2);

  // Efecto para la animación del radar
  useEffect(() => {
    if (isScanning) {
      scanIntervalRef.current = setInterval(() => {
        setSweepAngle(prev => (prev + 3) % 360);
        
        // Generar objetos aleatorios ocasionalmente
        if (Math.random() > 0.95) {
          generateRandomObject();
        }
      }, 30);
    } else {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning]);

  const generateRandomObject = () => {
    const newObject = {
      id: Date.now(),
      angle: Math.random() * 360,
      distance: 30 + Math.random() * 60,
      size: 4 + Math.random() * 6
    };

    setDetectedObjects(prev => {
      const updated = [...prev, newObject];
      // Mantener máximo 10 objetos
      return updated.slice(-10);
    });

    // Calcular tiempo de vuelo (distancia * 2 / velocidad de luz)
    const distance = newObject.distance * 1000; // convertir a metros
    const time = (distance * 2 / 3e8 * 1e6).toFixed(2); // en microsegundos
    setFlightTime(time);
  };

  const toggleScan = () => {
    setIsScanning(!isScanning);
    if (!isScanning) {
      setDetectedObjects([]);
      setFlightTime('--');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Aplicaciones Tecnológicas
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="800px"
            mx="auto"
          >
            Descubre cómo el electromagnetismo impulsa la tecnología moderna
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={3} mb={6}>
        {applications.map((app, index) => {
          const IconComponent = app.icon;
          return (
            <Grid item xs={12} md={6} lg={4} key={app.id}>
              <Grow in timeout={800 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${app.color}15 0%, ${app.color}05 100%)`,
                    border: `1px solid ${app.color}30`,
                    borderRadius: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          backgroundColor: app.color,
                          mr: 2,
                          width: 48,
                          height: 48,
                        }}
                      >
                        <IconComponent />
                      </Avatar>
                      <Typography variant="h6" color="text.primary" fontWeight={600}>
                        {app.title}
                      </Typography>
                    </Box>

                    <Typography variant="body1" color="text.primary" mb={2} sx={{ lineHeight: 1.6 }}>
                      {app.description}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={3} sx={{ flexGrow: 1 }}>
                      {app.details}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          );
        })}
      </Grid>

      {/* Simulador de Radar */}
      <Fade in timeout={1200}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Título del Simulador */}
            <Box textAlign="center" mb={4}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(45deg, #10B981, #059669)',
                }}
              >
                <RadarIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" gutterBottom sx={{ color: '#10B981', fontWeight: 700 }}>
                Simulador de Radar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Experimenta cómo funcionan los sistemas de radar usando ondas electromagnéticas
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {/* Panel de Control */}
              <Grid item xs={12} lg={5}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: '#FCD34D', fontWeight: 600 }}>
                    Panel de Control
                  </Typography>

                  <Box mb={3}>
                    <Typography variant="body2" gutterBottom>
                      Frecuencia del Radar (GHz)
                    </Typography>
                    <Slider
                      value={radarFreq}
                      onChange={(e, val) => setRadarFreq(val)}
                      min={1}
                      max={10}
                      step={0.1}
                      valueLabelDisplay="auto"
                      sx={{
                        color: '#10B981',
                        '& .MuiSlider-thumb': {
                          backgroundColor: '#10B981',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {radarFreq} GHz
                    </Typography>
                  </Box>

                  <Box mb={3}>
                    <Typography variant="body2" gutterBottom>
                      Potencia de Transmisión
                    </Typography>
                    <Slider
                      value={radarPower}
                      onChange={(e, val) => setRadarPower(val)}
                      min={1}
                      max={10}
                      step={1}
                      valueLabelDisplay="auto"
                      sx={{
                        color: '#10B981',
                        '& .MuiSlider-thumb': {
                          backgroundColor: '#10B981',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {radarPower * 10}%
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={isScanning ? <Pause /> : <PlayArrow />}
                    onClick={toggleScan}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(45deg, #10B981, #059669)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #059669, #047857)',
                      },
                    }}
                  >
                    {isScanning ? 'Detener Escaneo' : 'Iniciar Escaneo'}
                  </Button>
                </Paper>

                {/* Información Técnica */}
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: '#60A5FA', fontWeight: 600 }}>
                    Información Técnica
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Velocidad de onda:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        3×10⁸ m/s
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Longitud de onda:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {wavelength} cm
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Tiempo de vuelo:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {flightTime} μs
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Objetos detectados:
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#10B981' }}>
                        {detectedObjects.length}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Pantalla del Radar */}
              <Grid item xs={12} lg={7}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      paddingBottom: '100%',
                      background: 'radial-gradient(circle, rgba(5, 150, 105, 0.3) 0%, rgba(4, 120, 87, 0.5) 100%)',
                      borderRadius: '50%',
                      border: '4px solid #10B981',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Líneas de cuadrícula */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        '&::before, &::after': {
                          content: '""',
                          position: 'absolute',
                          background: 'rgba(16, 185, 129, 0.3)',
                        },
                        '&::before': {
                          top: '50%',
                          left: 0,
                          width: '100%',
                          height: '1px',
                        },
                        '&::after': {
                          left: '50%',
                          top: 0,
                          width: '1px',
                          height: '100%',
                        },
                      }}
                    />

                    {/* Círculos concéntricos */}
                    {[70, 50, 30].map((size, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          position: 'absolute',
                          top: `${(100 - size) / 2}%`,
                          left: `${(100 - size) / 2}%`,
                          width: `${size}%`,
                          height: `${size}%`,
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: '50%',
                        }}
                      />
                    ))}

                    {/* Línea de barrido */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '2px',
                        height: '50%',
                        background: 'linear-gradient(to top, #10B981, transparent)',
                        transformOrigin: 'top',
                        transform: `translate(-50%, 0) rotate(${sweepAngle}deg)`,
                        transition: 'transform 0.03s linear',
                      }}
                    />

                    {/* Objetos detectados */}
                    {detectedObjects.map((obj) => (
                      <Box
                        key={obj.id}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: `${obj.size}px`,
                          height: `${obj.size}px`,
                          background: '#10B981',
                          borderRadius: '50%',
                          boxShadow: '0 0 10px #10B981',
                          transform: `translate(-50%, -50%) rotate(${obj.angle}deg) translateY(-${obj.distance}%) rotate(-${obj.angle}deg)`,
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                          },
                        }}
                      />
                    ))}

                    {/* Centro del radar */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '8px',
                        height: '8px',
                        background: '#10B981',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 10px #10B981',
                      }}
                    />
                  </Box>

                  <Box mt={3} textAlign="center">
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#10B981',
                        fontFamily: 'monospace',
                        letterSpacing: 2,
                        mb: 1,
                      }}
                    >
                      {isScanning ? 'RADAR ACTIVO - ESCANEANDO...' : 'RADAR EN ESPERA'}
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        0 km
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        50 km
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        100 km
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Explicación del Radar */}
            <Box mt={4}>
              <Divider sx={{ mb: 3, borderColor: 'rgba(16, 185, 129, 0.3)' }} />
              <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: '#60A5FA', mb: 3 }}>
                ¿Cómo funciona el Radar?
              </Typography>

              <Grid container spacing={3}>
                {[
                  {
                    icon: '📡',
                    title: '1. Transmisión',
                    desc: 'El radar emite ondas electromagnéticas usando las ecuaciones de Maxwell',
                  },
                  {
                    icon: '🎯',
                    title: '2. Reflexión',
                    desc: 'Las ondas rebotan en objetos y regresan al receptor',
                  },
                  {
                    icon: '📊',
                    title: '3. Análisis',
                    desc: 'Se calcula distancia y velocidad usando el tiempo de vuelo',
                  },
                ].map((step, idx) => (
                  <Grid item xs={12} md={4} key={idx}>
                    <Box textAlign="center">
                      <Typography variant="h3" mb={1}>
                        {step.icon}
                      </Typography>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.desc}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default ApplicationsModule;