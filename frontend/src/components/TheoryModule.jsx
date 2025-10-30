import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  LinearProgress,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Fade,
  Grow
} from '@mui/material';
import {
  ExpandMore,
  Waves as WavesIcon,
  FlashOn,
  Explore,
  School,
  PlayArrow,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const TheoryModule = () => {
  const { user, isGuest } = useAuth();
  const [expandedSection, setExpandedSection] = useState('waves');
  const [readingSections, setReadingSections] = useState(new Set());
  const [completedSections, setCompletedSections] = useState(new Set());

  const theoryContent = [
    {
      id: 'waves',
      title: 'Ondas Electromagnéticas',
      icon: WavesIcon,
      color: '#3B82F6',
      description: 'Introducción a las ondas electromagnéticas y su propagación',
      content: `
        Las ondas electromagnéticas son perturbaciones que se propagan a través del espacio 
        y transportan energía sin necesidad de un medio material. Estas ondas consisten en 
        campos eléctricos y magnéticos oscilantes que son perpendiculares entre sí y a la 
        dirección de propagación.

        Características principales:
        - Velocidad de propagación: c = 3 × 10⁸ m/s en el vacío
        - Relación entre frecuencia y longitud de onda: c = λf
        - Transportan energía y momento
        - Se pueden polarizar
        - Experimentan reflexión, refracción y difracción

        **Espectro electromagnético:**
        Desde ondas de radio de baja frecuencia hasta rayos gamma de alta energía, 
        todas son manifestaciones del mismo fenómeno físico fundamental.
      `,
      equations: ['c = λf', 'E = hf', 'c = 1/√(μ₀ε₀)'],
      timeToRead: 8
    },
    {
      id: 'electric',
      title: 'Campo Eléctrico',
      icon: FlashOn,
      color: '#F59E0B',
      description: 'Fundamentos del campo eléctrico y sus propiedades',
      content: `
        El campo eléctrico es una región del espacio en la cual una carga eléctrica 
        experimenta una fuerza. Se define como la fuerza por unidad de carga positiva.

        Propiedades del campo eléctrico:
        - Es un campo vectorial
        - Se representa mediante líneas de campo
        - Las líneas nunca se cruzan
        - Son más densas donde el campo es más intenso
        - Van de cargas positivas a negativas

        **Fuentes del campo eléctrico:**
        - Cargas eléctricas estáticas
        - Campos magnéticos variables en el tiempo
        - Ondas electromagnéticas

        El campo eléctrico es fundamental para entender cómo las cargas interactúan 
        a distancia y cómo se propagan las ondas electromagnéticas.
      `,
      equations: ['E = F/q', 'E = kQ/r²', '∇ · E = ρ/ε₀'],
      timeToRead: 6
    },
    {
      id: 'magnetic',
      title: 'Campo Magnético',
      icon: Explore,
      color: '#8B5CF6',
      description: 'Bases del campo magnético y su relación con la electricidad',
      content: `
        El campo magnético es producido por cargas eléctricas en movimiento y 
        materiales magnéticos. A diferencia del campo eléctrico, las líneas de 
        campo magnético son siempre cerradas.

       Características del campo magnético:
        - No existen monopolos magnéticos aislados
        - Las líneas de campo son cerradas
        - Se mide en Tesla (T) o Gauss (G)
        - Interactúa con cargas en movimiento

        Fuentes del campo magnético:
        - Corrientes eléctricas
        - Imanes permanentes
        - Campos eléctricos variables
        - Momentos magnéticos intrínsecos (spin)

        Relación con el campo eléctrico:
        Los campos eléctricos y magnéticos están íntimamente relacionados. 
        Un campo eléctrico variable genera un campo magnético y viceversa, 
        como lo describen las ecuaciones de Maxwell.
      `,
      equations: ['F = q(v × B)', 'B = μ₀I/(2πr)', '∇ · B = 0'],
      timeToRead: 7
    }
  ];

  const handleSectionExpand = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
    
    // Marcar como leído
    if (!readingSections.has(sectionId)) {
      setReadingSections(prev => new Set([...prev, sectionId]));
    }
  };

  const markAsCompleted = (sectionId) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
  };

  const calculateProgress = () => {
    return Math.round((completedSections.size / theoryContent.length) * 100);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
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
            Fundamentos Teóricos
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="800px"
            mx="auto"
            mb={4}
          >
            Explora los conceptos fundamentales del electromagnetismo que sustentan 
            las ecuaciones de Maxwell
          </Typography>

          {/* Progress */}
          {!isGuest && (
            <Box maxWidth="400px" mx="auto" mb={4}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Progreso del módulo
                </Typography>
                <Typography variant="body2" color="primary.main" fontWeight="bold">
                  {calculateProgress()}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateProgress()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Fade>

      {/* Content Sections */}
      <Grid container spacing={2}>
        {theoryContent.map((section, index) => {
          const IconComponent = section.icon;
          const isCompleted = completedSections.has(section.id);
          const isReading = readingSections.has(section.id);

          return (
            <Grid item xs={12} key={section.id}>
              <Grow in timeout={800 + index * 200}>
                <Accordion
                  expanded={expandedSection === section.id}
                  onChange={() => handleSectionExpand(section.id)}
                  sx={{
                    background: `linear-gradient(135deg, ${section.color}15 0%, ${section.color}05 100%)`,
                    border: `1px solid ${section.color}30`,
                    borderRadius: 2,
                    mb: 2,
                    '&:before': {
                      display: 'none',
                    },
                    '& .MuiAccordionSummary-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: section.color }} />}
                    sx={{ py: 2 }}
                  >
                    <Box display="flex" alignItems="center" width="100%">
                      <Avatar
                        sx={{
                          backgroundColor: section.color,
                          mr: 3,
                          width: 48,
                          height: 48,
                        }}
                      >
                        <IconComponent />
                      </Avatar>
                      
                      <Box flexGrow={1}>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                          <Typography variant="h6" color="text.primary">
                            {section.title}
                          </Typography>
                          {isCompleted && (
                            <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                          )}
                          {isReading && !isCompleted && (
                            <Chip
                              label="Leyendo"
                              size="small"
                              sx={{
                                backgroundColor: `${section.color}20`,
                                color: section.color,
                                border: `1px solid ${section.color}40`,
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {section.description} • {section.timeToRead} min lectura
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ pt: 0 }}>
                    <Box sx={{ pl: 9 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.8,
                          mb: 3,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {section.content}
                      </Typography>

                      {/* Ecuaciones principales */}
                      <Box mb={3}>
                        <Typography variant="subtitle2" gutterBottom color="text.secondary">
                          Ecuaciones principales:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {section.equations.map((equation, idx) => (
                            <Chip
                              key={idx}
                              label={equation}
                              variant="outlined"
                              sx={{
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                color: section.color,
                                borderColor: `${section.color}60`,
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Action buttons */}
                      <Box display="flex" gap={2} mt={3}>
                        {!isCompleted && (
                          <Button
                            variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={() => markAsCompleted(section.id)}
                            sx={{
                              backgroundColor: section.color,
                              '&:hover': {
                                backgroundColor: `${section.color}dd`,
                              },
                            }}
                          >
                            Marcar como Completado
                          </Button>
                        )}
                        
                        <Button
                          variant="outlined"
                          startIcon={<PlayArrow />}
                          sx={{
                            color: section.color,
                            borderColor: section.color,
                            '&:hover': {
                              borderColor: section.color,
                              backgroundColor: `${section.color}10`,
                            },
                          }}
                        >
                          Ver Animación
                        </Button>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grow>
            </Grid>
          );
        })}
      </Grid>

      {/* Summary Card */}
      <Fade in timeout={1200}>
        <Card sx={{ mt: 6, background: 'rgba(255, 255, 255, 0.05)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <School sx={{ mr: 2, color: '#FCD34D', fontSize: 32 }} />
              <Typography variant="h5" color="text.primary">
                Resumen del Módulo
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
              Los tres conceptos fundamentales que acabas de estudiar forman la base 
              del electromagnetismo clásico. Las ondas electromagnéticas emergen de la 
              interacción entre campos eléctricos y magnéticos variables, como lo describen 
              elegantemente las ecuaciones de Maxwell.
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Próximo paso:</strong> Ahora que comprendes los fundamentos teóricos, 
              estás listo para explorar las ecuaciones de Maxwell que unifican estos conceptos 
              en un marco matemático elegante.
            </Typography>

            <Box mt={3}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
                  color: '#000',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #F59E0B, #D97706)',
                  },
                }}
                href="/equations"
              >
                Continuar a Ecuaciones de Maxwell
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default TheoryModule;