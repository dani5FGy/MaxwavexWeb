// frontend/src/components/SimulationModule.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Slider,
  Paper,
  Button,
  Fade,
  Grid,
  Alert,
  Avatar,
  Divider
} from '@mui/material';
import {
  FlashOn,
  Explore,
  Autorenew,
  Waves as WavesIcon,
  Functions,
  Science,
  Save
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/authService';

const SimulationModule = () => {
  const { user, isGuest } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [time, setTime] = useState(0);
  const animationRef = useRef(null);
  
  // Estados para Gauss E
  const [charge, setCharge] = useState(5);
  const [gaussRadius, setGaussRadius] = useState(2.0);
  
  // Estados para Gauss B
  const [current, setCurrent] = useState(3.0);
  const [distance, setDistance] = useState(1.5);
  
  // Estados para Faraday
  const [bField, setBField] = useState(0.5);
  const [frequency, setFrequency] = useState(1.0);
  const [loopRadius, setLoopRadius] = useState(0.5);
  
  // Estados para Ampère
  const [ampereCurrent, setAmpereCurrent] = useState(2.0);
  const [ampereRadius, setAmpereRadius] = useState(1.0);
  
  // Estados para ondas EM
  const [amplitude, setAmplitude] = useState(1.0);
  const [waveFreq, setWaveFreq] = useState(1.0);
  const [speed, setSpeed] = useState(3.0);

  // Estados para progreso
  const [saveStatus, setSaveStatus] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);

  // Refs para canvas
  const gaussERef = useRef(null);
  const gaussBRef = useRef(null);
  const faradayRef = useRef(null);
  const ampereRef = useRef(null);
  const waveRef = useRef(null);

  const tabs = [
    { label: 'Ley de Gauss (E)', icon: <FlashOn />, id: 'gauss-e' },
    { label: 'Ley de Gauss (B)', icon: <Explore />, id: 'gauss-b' },
    { label: 'Ley de Faraday', icon: <Autorenew />, id: 'faraday' },
    { label: 'Ley de Ampère', icon: <FlashOn />, id: 'ampere' },
    { label: 'Ondas EM', icon: <WavesIcon />, id: 'wave' }
  ];

  // Limpiar animaciones al desmontar
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Inicializar simulación según la pestaña actual
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (currentTab === 0) drawGaussE();
    else if (currentTab === 1) drawGaussB();
    else if (currentTab === 2) animateFaraday();
    else if (currentTab === 3) drawAmpere();
    else if (currentTab === 4) animateWave();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTab, charge, gaussRadius, current, distance, bField, frequency, loopRadius, ampereCurrent, ampereRadius, amplitude, waveFreq, speed]);

  // Contador de tiempo de sesión
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Cálculos físicos
  const calcGaussE = () => {
    const Q = charge * 1e-6;
    const epsilon0 = 8.854e-12;
    const flux = Q / epsilon0;
    const E = Q / (4 * Math.PI * epsilon0 * gaussRadius * gaussRadius);
    return { flux, E };
  };

  const calcGaussB = () => {
    const mu0 = 4 * Math.PI * 1e-7;
    const B = (mu0 * current) / (2 * Math.PI * distance);
    return { B };
  };

  const calcFaraday = () => {
    const omega = 2 * Math.PI * frequency;
    const B = bField * Math.cos(omega * time);
    const area = Math.PI * loopRadius * loopRadius;
    const flux = B * area;
    const emf = -omega * bField * area * Math.sin(omega * time);
    return { flux, emf };
  };

  const calcAmpere = () => {
    const mu0 = 4 * Math.PI * 1e-7;
    const B = (mu0 * ampereCurrent) / (2 * Math.PI * ampereRadius);
    const circulation = mu0 * ampereCurrent;
    return { B, circulation };
  };

  const calcWave = () => {
    const omega = 2 * Math.PI * waveFreq;
    const k = omega / speed;
    const wavelength = 2 * Math.PI / k;
    return { k, omega, wavelength };
  };

  // ========== ANIMACIONES MEJORADAS ==========

  // Función de dibujo para Gauss E con animación
  const drawGaussE = () => {
    const canvas = gaussERef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    
    let animTime = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = gaussRadius * 60;

      // Efecto de brillo pulsante en la carga
      const pulseSize = 15 + Math.sin(animTime * 3) * 3;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseSize * 2);
      gradient.addColorStop(0, charge > 0 ? 'rgba(255, 107, 107, 0.8)' : 'rgba(78, 205, 196, 0.8)');
      gradient.addColorStop(0.5, charge > 0 ? 'rgba(255, 107, 107, 0.4)' : 'rgba(78, 205, 196, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize * 2, 0, 2 * Math.PI);
      ctx.fill();

      // Dibujar carga central con sombra
      ctx.shadowBlur = 20;
      ctx.shadowColor = charge > 0 ? '#ff6b6b' : '#4ecdc4';
      ctx.fillStyle = charge > 0 ? '#ff6b6b' : '#4ecdc4';
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(charge > 0 ? '+' : '-', centerX, centerY + 7);

      // Superficie gaussiana animada
      const dashOffset = animTime * 20;
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 10]);
      ctx.lineDashOffset = -dashOffset;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      // Líneas de campo con partículas animadas
      const numVectors = 16;
      for (let i = 0; i < numVectors; i++) {
        const angle = (i / numVectors) * 2 * Math.PI;
        const startX = centerX + Math.cos(angle) * 20;
        const startY = centerY + Math.sin(angle) * 20;
        const endX = centerX + Math.cos(angle) * 150;
        const endY = centerY + Math.sin(angle) * 150;

        // Línea de campo con gradiente
        const lineGradient = ctx.createLinearGradient(startX, startY, endX, endY);
        lineGradient.addColorStop(0, charge > 0 ? '#ff6b6b' : '#4ecdc4');
        lineGradient.addColorStop(1, charge > 0 ? 'rgba(255, 107, 107, 0.2)' : 'rgba(78, 205, 196, 0.2)');
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Partículas animadas en las líneas
        const particlePos = ((animTime * 50 + i * 20) % 130) + 20;
        const particleX = centerX + Math.cos(angle) * particlePos;
        const particleY = centerY + Math.sin(angle) * particlePos;
        
        ctx.fillStyle = charge > 0 ? '#ff6b6b' : '#4ecdc4';
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI);
        ctx.fill();

        // Flechas animadas
        const arrowDist = 100 + Math.sin(animTime * 2) * 10;
        const arrowX = centerX + Math.cos(angle) * arrowDist;
        const arrowY = centerY + Math.sin(angle) * arrowDist;
        
        ctx.strokeStyle = charge > 0 ? '#ff6b6b' : '#4ecdc4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 10 * Math.cos(angle - 0.3), arrowY - 10 * Math.sin(angle - 0.3));
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 10 * Math.cos(angle + 0.3), arrowY - 10 * Math.sin(angle + 0.3));
        ctx.stroke();
      }

      animTime += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Función de dibujo para Gauss B con animación
  const drawGaussB = () => {
    const canvas = gaussBRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    
    let animTime = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Efecto de flujo de corriente animado
      const flowOffset = animTime * 30;
      for (let i = -150; i < 150; i += 15) {
        const y = centerY + i + (flowOffset % 15);
        const alpha = 0.3 + Math.sin(animTime * 2 + i * 0.1) * 0.2;
        ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, y);
        ctx.lineTo(centerX + 5, y);
        ctx.stroke();
      }

      // Corriente (cable) con brillo
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ffd700';
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 150);
      ctx.lineTo(centerX, centerY + 150);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Flecha de corriente pulsante
      const arrowSize = 10 + Math.sin(animTime * 3) * 2;
      ctx.fillStyle = '#ff6b6b';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff6b6b';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 150);
      ctx.lineTo(centerX - arrowSize, centerY - 135);
      ctx.lineTo(centerX + arrowSize, centerY - 135);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Círculos de campo magnético con rotación y brillo
      const numCircles = 5;
      for (let i = 1; i <= numCircles; i++) {
        const radius = i * 30;
        const alpha = (1 - i * 0.15) * (0.8 + Math.sin(animTime * 2 + i) * 0.2);
        
        ctx.strokeStyle = `rgba(76, 236, 196, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#4ecdc4';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // Partículas rotando en los círculos
        const numParticles = 8;
        for (let j = 0; j < numParticles; j++) {
          const angle = (j / numParticles) * 2 * Math.PI + animTime + i * 0.5;
          const px = centerX + Math.cos(angle) * radius;
          const py = centerY + Math.sin(angle) * radius;
          
          ctx.fillStyle = '#4ecdc4';
          ctx.shadowBlur = 5;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      // Flechas tangenciales animadas
      const numArrows = 12;
      for (let i = 0; i < numArrows; i++) {
        const angle = (i / numArrows) * 2 * Math.PI + animTime * 0.5;
        const radius = 120;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const tangentAngle = angle + Math.PI / 2;
        
        const arrowLength = 20 + Math.sin(animTime * 3 + i) * 5;
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(tangentAngle) * arrowLength, y + Math.sin(tangentAngle) * arrowLength);
        ctx.stroke();

        // Punta de flecha
        const tipX = x + Math.cos(tangentAngle) * arrowLength;
        const tipY = y + Math.sin(tangentAngle) * arrowLength;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - 8 * Math.cos(tangentAngle - 0.3), tipY - 8 * Math.sin(tangentAngle - 0.3));
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - 8 * Math.cos(tangentAngle + 0.3), tipY - 8 * Math.sin(tangentAngle + 0.3));
        ctx.stroke();
      }

      animTime += 0.03;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Animación de Faraday mejorada
  const animateFaraday = () => {
    const canvas = faradayRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const omega = 2 * Math.PI * frequency;
      const B = bField * Math.cos(omega * time);
      const loopRadiusPx = loopRadius * 100;

      // Líneas de campo magnético con efecto de onda
      const numLines = 20;
      const spacing = canvas.width / numLines;
      for (let i = 0; i < numLines; i++) {
        const x = i * spacing;
        const alpha = Math.abs(B) / bField;
        const wave = Math.sin(time * 2 + i * 0.3) * 5;
        
        // Línea principal
        ctx.strokeStyle = `rgba(138, 43, 226, ${alpha * 0.7})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(138, 43, 226, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x + wave, 0);
        ctx.lineTo(x + wave, canvas.height);
        ctx.stroke();

        // Puntos brillantes en las líneas
        const numDots = 8;
        for (let j = 0; j < numDots; j++) {
          const y = (j / numDots) * canvas.height + (time * 50) % (canvas.height / numDots);
          ctx.fillStyle = `rgba(138, 43, 226, ${alpha * 0.8})`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(x + wave, y, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      // Espira con efectos de inducción
      const emf = -omega * bField * Math.PI * loopRadius * loopRadius * Math.sin(omega * time);
      const emfIntensity = Math.abs(emf) / (omega * bField * Math.PI * loopRadius * loopRadius);
      
      // Aura de la espira
      ctx.strokeStyle = `rgba(255, 215, 0, ${emfIntensity * 0.3})`;
      ctx.lineWidth = 20;
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#ffd700';
      ctx.beginPath();
      ctx.arc(centerX, centerY, loopRadiusPx, 0, 2 * Math.PI);
      ctx.stroke();

      // Espira principal
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 6;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ffd700';
      ctx.beginPath();
      ctx.arc(centerX, centerY, loopRadiusPx, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Chispas eléctricas animadas
      const numSparks = 12;
      for (let i = 0; i < numSparks; i++) {
        const angle = (i / numSparks) * 2 * Math.PI + time * 3;
        const sparkDist = loopRadiusPx + 5 + Math.sin(time * 5 + i) * 3;
        const sx = centerX + Math.cos(angle) * sparkDist;
        const sy = centerY + Math.sin(angle) * sparkDist;
        
        ctx.fillStyle = `rgba(255, 215, 0, ${emfIntensity * 0.8})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffd700';
        ctx.beginPath();
        ctx.arc(sx, sy, 2 + emfIntensity * 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Flechas de corriente inducida
      if (Math.abs(emf) > 0.01) {
        const numArrows = 8;
        const arrowDirection = emf > 0 ? 1 : -1;
        for (let i = 0; i < numArrows; i++) {
          const angle = (i / numArrows) * 2 * Math.PI + time * 2 * arrowDirection;
          const ax = centerX + Math.cos(angle) * loopRadiusPx;
          const ay = centerY + Math.sin(angle) * loopRadiusPx;
          const tangentAngle = angle + Math.PI / 2 * arrowDirection;
          
          ctx.strokeStyle = `rgba(255, 100, 100, ${emfIntensity})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax + Math.cos(tangentAngle) * 15, ay + Math.sin(tangentAngle) * 15);
          ctx.stroke();

          // Punta de flecha
          const tipX = ax + Math.cos(tangentAngle) * 15;
          const tipY = ay + Math.sin(tangentAngle) * 15;
          ctx.beginPath();
          ctx.moveTo(tipX, tipY);
          ctx.lineTo(tipX - 8 * Math.cos(tangentAngle - 0.3), tipY - 8 * Math.sin(tangentAngle - 0.3));
          ctx.moveTo(tipX, tipY);
          ctx.lineTo(tipX - 8 * Math.cos(tangentAngle + 0.3), tipY - 8 * Math.sin(tangentAngle + 0.3));
          ctx.stroke();
        }
      }

      setTime(prev => prev + 0.02);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Dibujo de Ampère mejorado
  const drawAmpere = () => {
    const canvas = ampereRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    
    let animTime = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = ampereRadius * 80;

      // Ondas de campo magnético expandiéndose
      for (let i = 0; i < 3; i++) {
        const waveRadius = ((animTime * 50 + i * 60) % 180) + radius - 20;
        const waveAlpha = 1 - ((animTime * 50 + i * 60) % 180) / 180;
        
        ctx.strokeStyle = `rgba(76, 236, 196, ${waveAlpha * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, waveRadius, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Corriente (punto) con efecto pulsante
      const pulseSize = 12 + Math.sin(animTime * 4) * 3;
      
      // Aura de corriente
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseSize * 3);
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize * 3, 0, 2 * Math.PI);
      ctx.fill();

      // Punto de corriente
      ctx.fillStyle = '#ffd700';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffd700';
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⊙', centerX, centerY);

      // Camino de Ampère con animación
      const dashOffset = animTime * 30;
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
      ctx.lineWidth = 4;
      ctx.setLineDash([15, 10]);
      ctx.lineDashOffset = -dashOffset;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffd700';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Vectores de campo B con animación
      const numVectors = 16;
      for (let i = 0; i < numVectors; i++) {
        const angle = (i / numVectors) * 2 * Math.PI + animTime * 0.5;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const tangentAngle = angle + Math.PI / 2;
        
        const vectorLength = 30 + Math.sin(animTime * 3 + i) * 5;
        
        // Estela del vector
        const trailGradient = ctx.createLinearGradient(
          x, y,
          x + Math.cos(tangentAngle) * vectorLength,
          y + Math.sin(tangentAngle) * vectorLength
        );
        trailGradient.addColorStop(0, 'rgba(78, 205, 196, 0.3)');
        trailGradient.addColorStop(1, 'rgba(78, 205, 196, 0.8)');
        
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#4ecdc4';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(tangentAngle) * vectorLength, y + Math.sin(tangentAngle) * vectorLength);
        ctx.stroke();

        // Punta de flecha brillante
        const tipX = x + Math.cos(tangentAngle) * vectorLength;
        const tipY = y + Math.sin(tangentAngle) * vectorLength;
        
        ctx.fillStyle = '#4ecdc4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - 10 * Math.cos(tangentAngle - 0.4), tipY - 10 * Math.sin(tangentAngle - 0.4));
        ctx.lineTo(tipX - 10 * Math.cos(tangentAngle + 0.4), tipY - 10 * Math.sin(tangentAngle + 0.4));
        ctx.closePath();
        ctx.fill();

        // Partículas en el camino
        const particleAngle = angle + Math.PI / 2;
        const particleDist = radius + Math.sin(animTime * 4 + i * 0.5) * 10;
        const px = centerX + Math.cos(angle) * particleDist;
        const py = centerY + Math.sin(angle) * particleDist;
        
        ctx.fillStyle = '#4ecdc4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      animTime += 0.03;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Animación de ondas EM mejorada
  const animateWave = () => {
    const canvas = waveRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerY = canvas.height / 2;
      const omega = 2 * Math.PI * waveFreq;
      const k = omega / speed;
      const scale = 80;

      // Fondo con gradiente
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
      bgGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Línea central con brillo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Estela del campo eléctrico
      ctx.strokeStyle = 'rgba(255, 107, 107, 0.2)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const xPos = x / canvas.width * 10;
        const E = amplitude * Math.sin(k * xPos - omega * time);
        const y = centerY - E * scale;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Campo eléctrico principal
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff6b6b';
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const xPos = x / canvas.width * 10;
        const E = amplitude * Math.sin(k * xPos - omega * time);
        const y = centerY - E * scale;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Partículas en el campo eléctrico
      const numEParticles = 15;
      for (let i = 0; i < numEParticles; i++) {
        const x = (i / numEParticles) * canvas.width;
        const xPos = x / canvas.width * 10;
        const E = amplitude * Math.sin(k * xPos - omega * time);
        const y = centerY - E * scale;
        
        ctx.fillStyle = '#ff6b6b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Estela del campo magnético
      ctx.strokeStyle = 'rgba(78, 205, 196, 0.2)';
      ctx.lineWidth = 8;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const xPos = x / canvas.width * 10;
        const B = (amplitude / speed) * Math.sin(k * xPos - omega * time);
        const y = centerY - B * scale * speed;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Campo magnético principal
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#4ecdc4';
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const xPos = x / canvas.width * 10;
        const B = (amplitude / speed) * Math.sin(k * xPos - omega * time);
        const y = centerY - B * scale * speed;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Partículas en el campo magnético
      const numBParticles = 15;
      for (let i = 0; i < numBParticles; i++) {
        const x = (i / numBParticles) * canvas.width;
        const xPos = x / canvas.width * 10;
        const B = (amplitude / speed) * Math.sin(k * xPos - omega * time);
        const y = centerY - B * scale * speed;
        
        ctx.fillStyle = '#4ecdc4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Vectores de campo en puntos específicos
      const numVectors = 8;
      for (let i = 0; i < numVectors; i++) {
        const x = (i / numVectors) * canvas.width + canvas.width / (numVectors * 2);
        const xPos = x / canvas.width * 10;
        
        // Vector E
        const E = amplitude * Math.sin(k * xPos - omega * time);
        const Ey = centerY - E * scale;
        const vectorELength = Math.abs(E) * scale * 0.6;
        
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, centerY);
        ctx.lineTo(x, centerY - vectorELength * Math.sign(E));
        ctx.stroke();

        // Flecha E
        if (Math.abs(E) > 0.1) {
          const arrowY = centerY - vectorELength * Math.sign(E);
          ctx.fillStyle = '#ff6b6b';
          ctx.beginPath();
          ctx.moveTo(x, arrowY);
          ctx.lineTo(x - 5, arrowY + 10 * Math.sign(E));
          ctx.lineTo(x + 5, arrowY + 10 * Math.sign(E));
          ctx.closePath();
          ctx.fill();
        }

        // Vector B (perpendicular)
        const B = (amplitude / speed) * Math.sin(k * xPos - omega * time);
        
        // Círculo para indicar dirección hacia adentro/afuera
        ctx.fillStyle = B > 0 ? '#4ecdc4' : '#4ecdc4';
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, centerY, 8, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Punto o cruz para indicar dirección
        if (Math.abs(B) > 0.01) {
          ctx.fillStyle = '#4ecdc4';
          if (B > 0) {
            // Punto (sale de la pantalla)
            ctx.beginPath();
            ctx.arc(x, centerY, 3, 0, 2 * Math.PI);
            ctx.fill();
          } else {
            // Cruz (entra a la pantalla)
            ctx.strokeStyle = '#4ecdc4';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - 4, centerY - 4);
            ctx.lineTo(x + 4, centerY + 4);
            ctx.moveTo(x + 4, centerY - 4);
            ctx.lineTo(x - 4, centerY + 4);
            ctx.stroke();
          }
        }
      }

      // Etiquetas animadas
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      
      // Etiqueta E
      const labelEY = centerY - amplitude * scale - 30;
      ctx.fillStyle = '#ff6b6b';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff6b6b';
      ctx.fillText('E⃗ (Campo Eléctrico)', 20, labelEY);
      
      // Etiqueta B
      const labelBY = centerY + amplitude * scale * 1.5 + 30;
      ctx.fillStyle = '#4ecdc4';
      ctx.shadowColor = '#4ecdc4';
      ctx.fillText('B⃗ (Campo Magnético)', 20, labelBY);
      
      ctx.shadowBlur = 0;

      setTime(prev => prev + 0.02);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Guardar progreso
  const handleSaveProgress = async () => {
    if (isGuest) {
      setSaveStatus({ type: 'info', message: 'El progreso no se guarda para usuarios invitados' });
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    try {
      const moduleId = 4; // ID del módulo de simulación según tu BD
      const completion = Math.min(((currentTab + 1) / tabs.length) * 100, 100);
      
      await progressService.updateProgress(moduleId, {
        completion_percentage: completion,
        time_spent: sessionTime,
        score: 0
      });

      setSaveStatus({ type: 'success', message: 'Progreso guardado correctamente' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error guardando progreso:', error);
      setSaveStatus({ type: 'error', message: 'Error al guardar progreso' });
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const results = {
    gaussE: calcGaussE(),
    gaussB: calcGaussB(),
    faraday: calcFaraday(),
    ampere: calcAmpere(),
    wave: calcWave()
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Box textAlign="center" mb={4}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(45deg, #FCD34D, #F59E0B)',
            }}
          >
            <Science sx={{ fontSize: 32 }} />
          </Avatar>
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
            Simulador de Ecuaciones de Maxwell
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Experimenta con las leyes fundamentales del electromagnetismo
          </Typography>
          {!isGuest && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tiempo de sesión: {Math.floor(sessionTime / 60)}m {sessionTime % 60}s
            </Typography>
          )}
        </Box>
      </Fade>

      {saveStatus && (
        <Fade in timeout={300}>
          <Alert severity={saveStatus.type} sx={{ mb: 3 }}>
            {saveStatus.message}
          </Alert>
        </Fade>
      )}

      <Paper sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
        <Tabs
          value={currentTab}
          onChange={(e, val) => setCurrentTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontWeight: 600,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {/* Ley de Gauss (E) */}
      {currentTab === 0 && (
        <Fade in timeout={500}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ color: '#FCD34D' }}>
                  ⚡ Ley de Gauss para el Campo Eléctrico
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveProgress}
                  sx={{ bgcolor: '#FCD34D', color: '#000' }}
                >
                  Guardar Progreso
                </Button>
              </Box>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(0, 0, 0, 0.3)' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Forma Integral
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      ∮ E⃗ · dA⃗ = Q<sub>enc</sub> / ε₀
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(0, 0, 0, 0.3)' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Forma Diferencial
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      ∇ · E⃗ = ρ / ε₀
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Carga (Q): <strong>{charge} μC</strong>
                  </Typography>
                  <Slider
                    value={charge}
                    onChange={(e, val) => setCharge(val)}
                    min={-10}
                    max={10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Radio Gaussiano (r): <strong>{gaussRadius.toFixed(1)} m</strong>
                  </Typography>
                  <Slider
                    value={gaussRadius}
                    onChange={(e, val) => setGaussRadius(val)}
                    min={0.5}
                    max={4}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>

              <canvas 
                ref={gaussERef} 
                style={{ 
                  width: '100%', 
                  height: 400, 
                  background: 'rgba(0, 0, 0, 0.4)', 
                  borderRadius: 8 
                }} 
              />

              <Paper sx={{ p: 2, mt: 3, background: 'rgba(0, 0, 0, 0.3)' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Flujo eléctrico (Φ<sub>E</sub>):</strong> {results.gaussE.flux.toExponential(2)} N·m²/C
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Campo eléctrico (E):</strong> {results.gaussE.E.toExponential(2)} N/C
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  El flujo eléctrico a través de una superficie cerrada es proporcional a la carga encerrada.
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Ley de Gauss (B) */}
      {currentTab === 1 && (
        <Fade in timeout={500}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ color: '#FCD34D' }}>
                  🧲 Ley de Gauss para el Campo Magnético
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveProgress}
                  sx={{ bgcolor: '#FCD34D', color: '#000' }}
                >
                  Guardar Progreso
                </Button>
              </Box>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(0, 0, 0, 0.3)' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Forma Integral
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      ∮ B⃗ · dA⃗ = 0
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(0, 0, 0, 0.3)' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Forma Diferencial
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      ∇ · B⃗ = 0
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Corriente (I): <strong>{current.toFixed(1)} A</strong>
                  </Typography>
                  <Slider
                    value={current}
                    onChange={(e, val) => setCurrent(val)}
                    min={0.5}
                    max={5}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Distancia (r): <strong>{distance.toFixed(1)} m</strong>
                  </Typography>
                  <Slider
                    value={distance}
                    onChange={(e, val) => setDistance(val)}
                    min={0.5}
                    max={3}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>

              <canvas 
                ref={gaussBRef} 
                style={{ 
                  width: '100%', 
                  height: 400, 
                  background: 'rgba(0, 0, 0, 0.4)', 
                  borderRadius: 8 
                }} 
              />

              <Paper sx={{ p: 2, mt: 3, background: 'rgba(0, 0, 0, 0.3)' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Flujo magnético (Φ<sub>B</sub>):</strong> 0 Wb (siempre cero)
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Campo magnético (B):</strong> {results.gaussB.B.toExponential(2)} T
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No existen monopolos magnéticos; las líneas de campo magnético son cerradas.
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Ley de Faraday */}
      {currentTab === 2 && (
        <Fade in timeout={500}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ color: '#FCD34D' }}>
                  🔄 Ley de Faraday - Inducción Electromagnética
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveProgress}
                  sx={{ bgcolor: '#FCD34D', color: '#000' }}
                >
                  Guardar Progreso
                </Button>
              </Box>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(0, 0, 0, 0.3)' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Forma Integral
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      ∮ E⃗ · dl⃗ = -dΦ<sub>B</sub>/dt
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(0, 0, 0, 0.3)' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Forma Diferencial
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      ∇ × E⃗ = -∂B⃗/∂t
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                  <Typography gutterBottom>
                    Campo B₀: <strong>{bField.toFixed(2)} T</strong>
                  </Typography>
                  <Slider
                    value={bField}
                    onChange={(e, val) => setBField(val)}
                    min={0.1}
                    max={1}
                    step={0.05}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography gutterBottom>
                    Frecuencia: <strong>{frequency.toFixed(1)} Hz</strong>
                  </Typography>
                  <Slider
                    value={frequency}
                    onChange={(e, val) => setFrequency(val)}
                    min={0.2}
                    max={3}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography gutterBottom>
                    Radio espira: <strong>{loopRadius.toFixed(2)} m</strong>
                  </Typography>
                  <Slider
                    value={loopRadius}
                    onChange={(e, val) => setLoopRadius(val)}
                    min={0.2}
                    max={1}
                    step={0.05}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>

              <canvas 
                ref={faradayRef} 
                style={{ 
                  width: '100%', 
                  height: 400, 
                  background: 'rgba(0, 0, 0, 0.4)', 
                  borderRadius: 8 
                }} 
              />

              <Paper sx={{ p: 2, mt: 3, background: 'rgba(0, 0, 0, 0.3)' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>FEM inducida (ε):</strong> {results.faraday.emf.toFixed(2)} V
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Flujo magnético (Φ<sub>B</sub>):</strong> {results.faraday.flux.toFixed(2)} Wb
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Un campo magnético variable en el tiempo induce un campo eléctrico.
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Ley de Ampère */}
      {currentTab === 3 && (
        <Fade in timeout={500}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ color: '#FCD34D' }}>
                  ⚡ Ley de Ampère-Maxwell
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveProgress}
                  sx={{ bgcolor: '#FCD34D', color: '#000' }}
                >
                  Guardar Progreso
                </Button>
              </Box>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(0, 0, 0, 0.3)' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Forma Integral
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      ∮ B⃗ · dl⃗ = μ₀(I<sub>enc</sub> + ε₀ dΦ<sub>E</sub>/dt)
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(0, 0, 0, 0.3)' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Forma Diferencial
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      ∇ × B⃗ = μ₀J⃗ + μ₀ε₀ ∂E⃗/∂t
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Corriente (I): <strong>{ampereCurrent.toFixed(1)} A</strong>
                  </Typography>
                  <Slider
                    value={ampereCurrent}
                    onChange={(e, val) => setAmpereCurrent(val)}
                    min={0}
                    max={5}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Radio (r): <strong>{ampereRadius.toFixed(1)} m</strong>
                  </Typography>
                  <Slider
                    value={ampereRadius}
                    onChange={(e, val) => setAmpereRadius(val)}
                    min={0.3}
                    max={2}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>

              <canvas 
                ref={ampereRef} 
                style={{ 
                  width: '100%', 
                  height: 400, 
                  background: 'rgba(0, 0, 0, 0.4)', 
                  borderRadius: 8 
                }} 
              />

              <Paper sx={{ p: 2, mt: 3, background: 'rgba(0, 0, 0, 0.3)' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Campo magnético (B):</strong> {results.ampere.B.toExponential(2)} T
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Circulación (∮B·dl):</strong> {results.ampere.circulation.toExponential(2)} T·m
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Las corrientes eléctricas y los campos eléctricos variables generan campos magnéticos.
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Ondas EM */}
      {currentTab === 4 && (
        <Fade in timeout={500}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ color: '#FCD34D' }}>
                  🌊 Simulación de Ondas Electromagnéticas
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveProgress}
                  sx={{ bgcolor: '#FCD34D', color: '#000' }}
                >
                  Guardar Progreso
                </Button>
              </Box>

              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                  <Typography gutterBottom>
                    Amplitud (E₀): <strong>{amplitude.toFixed(1)} V/m</strong>
                  </Typography>
                  <Slider
                    value={amplitude}
                    onChange={(e, val) => setAmplitude(val)}
                    min={0.1}
                    max={2}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography gutterBottom>
                    Frecuencia (f): <strong>{waveFreq.toFixed(1)} Hz</strong>
                  </Typography>
                  <Slider
                    value={waveFreq}
                    onChange={(e, val) => setWaveFreq(val)}
                    min={0.5}
                    max={3}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography gutterBottom>
                    Velocidad (c): <strong>{speed.toFixed(1)} × 10⁸ m/s</strong>
                  </Typography>
                  <Slider
                    value={speed}
                    onChange={(e, val) => setSpeed(val)}
                    min={1}
                    max={5}
                    step={0.5}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>

              <canvas 
                ref={waveRef} 
                style={{ 
                  width: '100%', 
                  height: 400, 
                  background: 'rgba(0, 0, 0, 0.4)', 
                  borderRadius: 8 
                }} 
              />

              <Paper sx={{ p: 2, mt: 3, background: 'rgba(0, 0, 0, 0.3)' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Ecuación de onda:</strong> E(x,t) = E₀ sin(kx - ωt)
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Número de onda (k):</strong> {results.wave.k.toFixed(2)} rad/m
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Frecuencia angular (ω):</strong> {results.wave.omega.toFixed(2)} rad/s
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Longitud de onda (λ):</strong> {results.wave.wavelength.toFixed(2)} m
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Información adicional */}
      <Fade in timeout={800}>
        <Card sx={{ mt: 4, background: 'rgba(255, 255, 255, 0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FCD34D' }}>
              📚 Información sobre las simulaciones
            </Typography>
            <Divider sx={{ mb: 2, borderColor: 'rgba(252, 211, 77, 0.2)' }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Controles:</strong> Ajusta los parámetros usando los sliders para ver cómo cambian
                  los campos electromagnéticos en tiempo real.
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Visualización:</strong> Los gráficos muestran representaciones visuales de las
                  ecuaciones de Maxwell y sus aplicaciones.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Progreso:</strong> {isGuest ? 'Crea una cuenta para guardar tu progreso' : 'Tu progreso se guarda automáticamente'}.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Pestañas:</strong> Explora las cinco simulaciones principales que ilustran
                  las ecuaciones de Maxwell.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default SimulationModule;