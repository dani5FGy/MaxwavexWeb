import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Fade,
  Grow
} from '@mui/material';

const EquationsModule = () => {
  const maxwellEquations = [
    {
      id: 'gauss',
      title: '1. Ley de Gauss',
      differential: '∇ · E = ρ/ε₀',
      integral: '∮ E · dA = Q/ε₀',
      description: 'El flujo eléctrico a través de una superficie cerrada es proporcional a la carga eléctrica encerrada.',
      color: '#3B82F6'
    },
    {
      id: 'gauss-magnetic',
      title: '2. Ley de Gauss Magnética',
      differential: '∇ · B = 0',
      integral: '∮ B · dA = 0',
      description: 'No existen monopolos magnéticos; las líneas de campo magnético son cerradas.',
      color: '#8B5CF6'
    },
    {
      id: 'faraday',
      title: '3. Ley de Faraday',
      differential: '∇ × E = -∂B/∂t',
      integral: '∮ E · dl = -dΦ_B/dt',
      description: 'Un campo magnético variable en el tiempo induce un campo eléctrico rotacional.',
      color: '#10B981'
    },
    {
      id: 'ampere',
      title: '4. Ley de Ampère-Maxwell',
      differential: '∇ × B = μ₀J + μ₀ε₀∂E/∂t',
      integral: '∮ B · dl = μ₀I + μ₀ε₀dΦ_E/dt',
      description: 'Las corrientes eléctricas y los campos eléctricos variables generan campos magnéticos.',
      color: '#F59E0B'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            Las Cuatro Ecuaciones de Maxwell
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="800px"
            mx="auto"
          >
            El marco matemático que unifica la electricidad y el magnetismo
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {maxwellEquations.map((equation, index) => (
          <Grid item xs={12} md={6} key={equation.id}>
            <Grow in timeout={800 + index * 200}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${equation.color}15 0%, ${equation.color}05 100%)`,
                  border: `1px solid ${equation.color}30`,
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ color: equation.color, fontWeight: 600 }}
                  >
                    {equation.title}
                  </Typography>

                  <Box mb={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Forma Diferencial:
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        p: 2,
                        borderRadius: 2,
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        fontSize: '1.5rem',
                        color: 'white',
                        mb: 2,
                      }}
                    >
                      {equation.differential}
                    </Box>
                  </Box>

                  <Box mb={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Forma Integral:
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        p: 2,
                        borderRadius: 2,
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        fontSize: '1.5rem',
                        color: 'white',
                        mb: 2,
                      }}
                    >
                      {equation.integral}
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {equation.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EquationsModule;
