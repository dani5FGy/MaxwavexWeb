import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  Fade
} from '@mui/material';
import { Construction, PlayArrow } from '@mui/icons-material';

const SimulationModule = () => {
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
            Simulaciones Interactivas
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="800px"
            mx="auto"
          >
            Experimenta con simulaciones de campos electromagnéticos
          </Typography>
        </Box>
      </Fade>

      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Construction sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          
          <Typography variant="h5" gutterBottom>
            Módulo en Desarrollo
          </Typography>
          
          <Typography variant="body1" color="text.secondary" mb={4}>
            Las simulaciones interactivas están siendo desarrolladas. Pronto podrás 
            experimentar con campos electromagnéticos en tiempo real.
          </Typography>

          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="subtitle2" gutterBottom>
              Próximas funcionalidades:
            </Typography>
            <Typography variant="body2">
              • Simulación de campos eléctricos y magnéticos<br/>
              • Propagación de ondas electromagnéticas<br/>
              • Visualización de líneas de campo<br/>
              • Interacción en tiempo real con parámetros
            </Typography>
          </Alert>

          <Button
            variant="outlined"
            startIcon={<PlayArrow />}
            disabled
            size="large"
          >
            Iniciar Simulación (Próximamente)
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SimulationModule;