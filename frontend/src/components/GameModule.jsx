import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Replay,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Help,
  EmojiEvents,
  Timer,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/authService';

const GameModule = () => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const { /*user,*/ isGuest } = useAuth();
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    lives: 3,
    time: 0,
    isPlaying: false,
    isPaused: false,
    gameOver: false
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    initializePhaserGame();
    loadBestScore();

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  const loadBestScore = async () => {
    if (!isGuest) {
      try {
        const stats = await gameService.getUserStats();
        setBestScore(stats.bestScore || 0);
      } catch (error) {
        console.error('Error cargando mejor puntuación:', error);
      }
    }
  };

  const initializePhaserGame = () => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#1a1a2e',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    phaserGameRef.current = new Phaser.Game(config);
  };

  // Phaser Scene Functions
  function preload() {
    // Crear assets gráficos simples
    this.load.image('player', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/>
        <circle cx="12" cy="12" r="2" fill="#000"/>
        <circle cx="20" cy="12" r="2" fill="#000"/>
        <path d="M10 20 Q16 26 22 20" stroke="#000" stroke-width="2" fill="none"/>
      </svg>
    `));

    this.load.image('wave', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="40" height="10" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 5 Q10 0 20 5 T40 5" stroke="#8B5CF6" stroke-width="2" fill="none"/>
      </svg>
    `));

    this.load.image('obstacle', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>
        <text x="15" y="20" text-anchor="middle" fill="white" font-size="12">!</text>
      </svg>
    `));

    this.load.image('powerup', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <star points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="#10B981"/>
      </svg>
    `));
  }

  function create() {
    const scene = this;
    scene.gameData = {
      player: null,
      waves: null,
      obstacles: null,
      powerups: null,
      cursors: null,
      waveTimer: 0,
      obstacleTimer: 0,
      powerupTimer: 0,
      score: 0,
      level: 1,
      lives: 3,
      gameActive: false
    };

    // Crear jugador
    scene.gameData.player = scene.physics.add.sprite(100, 300, 'player');
    scene.gameData.player.setCollideWorldBounds(true);
    scene.gameData.player.setBounce(0.2);

    // Crear grupos
    scene.gameData.waves = scene.physics.add.group();
    scene.gameData.obstacles = scene.physics.add.group();
    scene.gameData.powerups = scene.physics.add.group();

    // Controles
    scene.gameData.cursors = scene.input.keyboard.createCursorKeys();
    scene.wasdKeys = scene.input.keyboard.addKeys('W,S,A,D');

    // Colisiones
    scene.physics.add.overlap(scene.gameData.player, scene.gameData.waves, collectWave, null, scene);
    scene.physics.add.overlap(scene.gameData.player, scene.gameData.obstacles, hitObstacle, null, scene);
    scene.physics.add.overlap(scene.gameData.player, scene.gameData.powerups, collectPowerup, null, scene);

    // Texto de interfaz
    scene.scoreText = scene.add.text(16, 16, 'Puntuación: 0', {
      fontSize: '18px',
      fill: '#FCD34D',
      fontFamily: 'Arial'
    });

    scene.levelText = scene.add.text(16, 44, 'Nivel: 1', {
      fontSize: '16px',
      fill: '#8B5CF6',
      fontFamily: 'Arial'
    });

    scene.livesText = scene.add.text(16, 72, 'Vidas: 3', {
      fontSize: '16px',
      fill: '#EF4444',
      fontFamily: 'Arial'
    });

    // Instrucciones
    scene.add.text(400, 300, 'Usa las flechas o WASD para moverte\nRecoge ondas azules, evita obstáculos rojos\n¡Presiona ESPACIO para comenzar!', {
      fontSize: '16px',
      fill: '#FFFFFF',
      align: 'center',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Comenzar juego con ESPACIO
    scene.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  function update() {
    const scene = this;
    const gameData = scene.gameData;

    // Iniciar juego
    if (scene.spaceKey.isDown && !gameData.gameActive) {
      startGame(scene);
    }

    if (!gameData.gameActive) return;

    // Movimiento del jugador
    if (gameData.cursors.left.isDown || scene.wasdKeys.A.isDown) {
      gameData.player.setVelocityX(-200);
    } else if (gameData.cursors.right.isDown || scene.wasdKeys.D.isDown) {
      gameData.player.setVelocityX(200);
    } else {
      gameData.player.setVelocityX(0);
    }

    if (gameData.cursors.up.isDown || scene.wasdKeys.W.isDown) {
      gameData.player.setVelocityY(-200);
    } else if (gameData.cursors.down.isDown || scene.wasdKeys.S.isDown) {
      gameData.player.setVelocityY(200);
    } else {
      gameData.player.setVelocityY(0);
    }

    // Generar ondas
    gameData.waveTimer += scene.game.loop.delta;
    if (gameData.waveTimer > 1000) {
      createWave(scene);
      gameData.waveTimer = 0;
    }

    // Generar obstáculos
    gameData.obstacleTimer += scene.game.loop.delta;
    const obstacleFrequency = Math.max(2000 - (gameData.level * 150), 400);
    if (gameData.obstacleTimer > obstacleFrequency) {
      createObstacle(scene);
      gameData.obstacleTimer = 0;
    }

    // Generar power-ups
    gameData.powerupTimer += scene.game.loop.delta;
    if (gameData.powerupTimer > 8000) {
      createPowerup(scene);
      gameData.powerupTimer = 0;
    }

    // Limpiar objetos fuera de pantalla
    cleanupObjects(scene);

    // Actualizar nivel
    updateLevel(scene);
  }

  function startGame(scene) {
    scene.gameData.gameActive = true;
    scene.gameData.score = 0;
    scene.gameData.level = 1;
    scene.gameData.lives = 3;
    
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gameOver: false,
      score: 0,
      level: 1,
      lives: 3
    }));

    // Limpiar texto de instrucciones
    scene.children.list.forEach(child => {
      if (child.type === 'Text' && child.text.includes('Presiona ESPACIO')) {
        child.destroy();
      }
    });
  }

  function createWave(scene) {
    const y = Phaser.Math.Between(50, 550);
    const wave = scene.gameData.waves.create(850, y, 'wave');
    wave.setVelocityX(-150 - (scene.gameData.level * 20));
    wave.setScale(0.8);
  }

 function createObstacle(scene) {
  // número de obstáculos = 1 + nivel/3
  const count = Phaser.Math.Clamp(4 + Math.floor(scene.gameData.level / 3), 1, 8);

  for (let i = 0; i < count; i++) {
    const y = Phaser.Math.Between(50, 550);
    const obstacle = scene.gameData.obstacles.create(850 + i * 50, y, 'obstacle');
    obstacle.setVelocityX(-200 - (scene.gameData.level * 50));
  }
}

  function createPowerup(scene) {
    const y = Phaser.Math.Between(50, 550);
    const powerup = scene.gameData.powerups.create(850, y, 'powerup');
    powerup.setVelocityX(-180 - (scene.gameData.level * 10));
  }

  function collectWave(player, wave) {
    wave.destroy();
    this.gameData.score += 10;
    
    // Actualizar interfaz React
    setGameState(prev => ({
      ...prev,
      score: this.gameData.score
    }));
    
    this.scoreText.setText('Puntuación: ' + this.gameData.score);
  }

  function hitObstacle(player, obstacle) {
    obstacle.destroy();
    this.gameData.lives -= 1;
    
    // Efecto visual de daño
    player.setTint(0xff0000);
    this.time.addEvent({
      delay: 200,
      callback: () => player.clearTint(),
      callbackScope: this
    });

    setGameState(prev => ({
      ...prev,
      lives: this.gameData.lives
    }));
    
    this.livesText.setText('Vidas: ' + this.gameData.lives);

    if (this.gameData.lives <= 0) {
      gameOver(this);
    }
  }

  function collectPowerup(player, powerup) {
    powerup.destroy();
    this.gameData.score += 50;
    this.gameData.lives = Math.min(this.gameData.lives + 1, 5);
    
    setGameState(prev => ({
      ...prev,
      score: this.gameData.score,
      lives: this.gameData.lives
    }));
    
    this.scoreText.setText('Puntuación: ' + this.gameData.score);
    this.livesText.setText('Vidas: ' + this.gameData.lives);
  }

  function cleanupObjects(scene) {
    scene.gameData.waves.children.entries.forEach(wave => {
      if (wave.x < -50) wave.destroy();
    });
    
    scene.gameData.obstacles.children.entries.forEach(obstacle => {
      if (obstacle.x < -50) obstacle.destroy();
    });
    
    scene.gameData.powerups.children.entries.forEach(powerup => {
      if (powerup.x < -50) powerup.destroy();
    });
  }

  function updateLevel(scene) {
    const newLevel = Math.floor(scene.gameData.score / 200) + 1;
    if (newLevel > scene.gameData.level) {
      scene.gameData.level = newLevel;
      scene.levelText.setText('Nivel: ' + scene.gameData.level);
      
      setGameState(prev => ({
        ...prev,
        level: scene.gameData.level
      }));
    }
  }

  function gameOver(scene) {
    scene.gameData.gameActive = false;
    
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      gameOver: true
    }));
    
    setShowGameOver(true);
    
    // Guardar puntuación si no es invitado
    if (!isGuest) {
      saveGameScore(scene.gameData.score, scene.gameData.level);
    }

    // Limpiar objetos
    scene.gameData.waves.clear(true, true);
    scene.gameData.obstacles.clear(true, true);
    scene.gameData.powerups.clear(true, true);

    // Mostrar texto de game over
    scene.add.text(400, 300, `¡Juego Terminado!\nPuntuación Final: ${scene.gameData.score}\nPresiona ESPACIO para reiniciar`, {
      fontSize: '20px',
      fill: '#FFFFFF',
      align: 'center',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  const saveGameScore = async (score, level) => {
    try {
      await gameService.saveGameResult({
        gameType: 'electromagnetic_waves',
        score,
        levelReached: level,
        timePlayed: Math.floor(Date.now() / 1000)
      });
      
      if (score > bestScore) {
        setBestScore(score);
      }
    } catch (error) {
      console.error('Error guardando puntuación:', error);
    }
  };

  const togglePause = () => {
    if (phaserGameRef.current && phaserGameRef.current.scene.isActive('default')) {
      const scene = phaserGameRef.current.scene.getScene('default');
      if (scene.physics.world.isPaused) {
        scene.physics.resume();
        scene.tweens.resume();
        scene.time.resume();
      } else {
        scene.physics.pause();
        scene.tweens.pause();
        scene.time.pause();
      }
      
      setGameState(prev => ({
        ...prev,
        isPaused: !prev.isPaused
      }));
    }
  };

  const restartGame = () => {
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('default');
      scene.scene.restart();
    }
    setShowGameOver(false);
    setGameState({
      score: 0,
      level: 1,
      lives: 3,
      time: 0,
      isPlaying: false,
      isPaused: false,
      gameOver: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
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
          Juego de Ondas Electromagnéticas
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
          Navega por el campo electromagnético recogiendo ondas y evitando obstáculos
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Panel de Control */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado del Juego
              </Typography>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2">Puntuación:</Typography>
                <Chip 
                  label={gameState.score}
                  color="primary"
                  sx={{ minWidth: 60 }}
                />
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2">Nivel:</Typography>
                <Chip 
                  label={gameState.level}
                  color="secondary"
                  sx={{ minWidth: 60 }}
                />
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2">Vidas:</Typography>
                <Box display="flex" gap={0.5}>
                  {[...Array(5)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: i < gameState.lives ? '#EF4444' : 'rgba(255,255,255,0.2)'
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {!isGuest && (
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Mejor Puntuación:</Typography>
                  <Chip 
                    label={bestScore}
                    variant="outlined"
                    icon={<EmojiEvents />}
                    sx={{ minWidth: 60 }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Controles */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Controles
              </Typography>
              
              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <Tooltip title="Pausar/Reanudar">
                  <IconButton 
                    onClick={togglePause}
                    disabled={!gameState.isPlaying}
                    color={gameState.isPaused ? "secondary" : "primary"}
                  >
                    {gameState.isPaused ? <PlayArrow /> : <Pause />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Reiniciar">
                  <IconButton onClick={restartGame} color="error">
                    <Replay />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title={soundEnabled ? "Silenciar" : "Activar sonido"}>
                  <IconButton 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    color={soundEnabled ? "primary" : "default"}
                  >
                    {soundEnabled ? <VolumeUp /> : <VolumeOff />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Instrucciones">
                  <IconButton 
                    onClick={() => setShowInstructions(true)}
                    color="info"
                  >
                    <Help />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography variant="body2" color="text.secondary">
                • Flechas o WASD: Mover<br/>
                • ESPACIO: Iniciar/Reiniciar<br/>
                • Recoge ondas azules (+10 pts)<br/>
                • Evita obstáculos rojos (-1 vida)<br/>
                • Estrellas verdes (+50 pts, +1 vida)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Área de Juego */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Box
                ref={gameRef}
                sx={{
                  width: '100%',
                  maxWidth: '800px',
                  height: '600px',
                  mx: 'auto',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  '& canvas': {
                    width: '100% !important',
                    height: '100% !important',
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Instrucciones */}
      <Dialog 
        open={showInstructions} 
        onClose={() => setShowInstructions(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Instrucciones del Juego
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Objetivo
            </Typography>
            <Typography variant="body2">
              Controla tu partícula cargada y navega por el campo electromagnético 
              recogiendo ondas mientras evitas los obstáculos.
            </Typography>
          </Alert>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Controles:
          </Typography>
          <Typography variant="body2" component="div">
            • <strong>Flechas</strong> o <strong>W,A,S,D</strong>: Mover la partícula<br/>
            • <strong>ESPACIO</strong>: Iniciar/Reiniciar el juego<br/>
          </Typography>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Elementos del Juego:
          </Typography>
          <Typography variant="body2" component="div">
            • <strong style={{color: '#8B5CF6'}}>Ondas azules</strong>: +10 puntos<br/>
            • <strong style={{color: '#EF4444'}}>Obstáculos rojos</strong>: -1 vida<br/>
            • <strong style={{color: '#10B981'}}>Estrellas verdes</strong>: +50 puntos y +1 vida<br/>
          </Typography>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Mecánicas:
          </Typography>
          <Typography variant="body2" component="div">
            • La dificultad aumenta cada 200 puntos<br/>
            • Los objetos se mueven más rápido en niveles superiores<br/>
            • Máximo 5 vidas disponibles<br/>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInstructions(false)} color="primary">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Game Over */}
      <Dialog 
        open={showGameOver} 
        onClose={() => setShowGameOver(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div" textAlign="center">
            ¡Juego Terminado!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={2}>
            <EmojiEvents sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            
            <Typography variant="h4" color="primary.main" gutterBottom>
              {gameState.score}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Puntuación Final
            </Typography>
            
            <Typography variant="body2" color="text.secondary" mb={2}>
              Nivel alcanzado: {gameState.level}
            </Typography>

            {gameState.score > bestScore && !isGuest && (
              <Alert severity="success" sx={{ mt: 2 }}>
                ¡Nueva mejor puntuación!
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={restartGame} 
            variant="contained" 
            startIcon={<Replay />}
            size="large"
          >
            Jugar de Nuevo
          </Button>
          <Button onClick={() => setShowGameOver(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GameModule;