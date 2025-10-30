import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configurar interceptor para agregar token automáticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('maxwavex_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('maxwavex_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Registro de usuario
  async register(name, email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error en el registro';
      throw new Error(message);
    }
  },

  // Login de usuario
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error en el login';
      throw new Error(message);
    }
  },

  // Crear sesión de invitado
  async createGuestSession(username) {
    try {
      const response = await axios.post(`${API_URL}/auth/guest`, {
        username
      });
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error creando sesión de invitado';
      throw new Error(message);
    }
  },

  // Verificar token
  async verifyToken() {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`);
      return response.data.user;
    } catch {
      throw new Error('Token inválido');
    }
  },

  // Logout
  async logout() {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  },

  // Obtener perfil del usuario
  async getProfile() {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error obteniendo perfil';
      throw new Error(message);
    }
  }
};

// Servicio para módulos educativos
export const moduleService = {
  // Obtener todos los módulos
  async getModules() {
    try {
      const response = await axios.get(`${API_URL}/modules`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error obteniendo módulos';
      throw new Error(message);
    }
  },

  // Obtener módulo por ID
  async getModuleById(id) {
    try {
      const response = await axios.get(`${API_URL}/modules/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error obteniendo módulo';
      throw new Error(message);
    }
  },

  // Obtener módulos por tipo
  async getModulesByType(type) {
    try {
      const response = await axios.get(`${API_URL}/modules/type/${type}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error obteniendo módulos por tipo';
      throw new Error(message);
    }
  }
};

// Servicio para progreso del usuario
export const progressService = {
  // Obtener progreso del usuario
  async getUserProgress() {
    try {
      const response = await axios.get(`${API_URL}/progress`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error obteniendo progreso';
      throw new Error(message);
    }
  },

  // Actualizar progreso de un módulo
  async updateModuleProgress(moduleId, progressData) {
    try {
      const response = await axios.put(`${API_URL}/progress/${moduleId}`, progressData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error actualizando progreso';
      throw new Error(message);
    }
  },

  // Marcar módulo como completado
  async completeModule(moduleId, score = 0) {
    try {
      const response = await axios.post(`${API_URL}/progress/${moduleId}/complete`, {
        score,
        completedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error completando módulo';
      throw new Error(message);
    }
  }
};

// Servicio para juegos y simulaciones
export const gameService = {
  // Guardar resultado de juego
  async saveGameResult(gameData) {
    try {
      const response = await axios.post(`${API_URL}/games/result`, gameData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error guardando resultado del juego';
      throw new Error(message);
    }
  },

  // Obtener mejores puntuaciones
  async getLeaderboard(gameType, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/games/leaderboard/${gameType}?limit=${limit}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error obteniendo tabla de puntuaciones';
      throw new Error(message);
    }
  },

  // Obtener estadísticas del usuario
  async getUserStats() {
    try {
      const response = await axios.get(`${API_URL}/games/stats`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Error obteniendo estadísticas';
      throw new Error(message);
    }
  }
};