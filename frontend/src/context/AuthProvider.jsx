import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { authService } from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("maxwavex_token");
        if (token) {
          const userData = await authService.verifyToken();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error verificando token:", error);
        localStorage.removeItem("maxwavex_token");
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

 // Función de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(email, password);
      
      setUser(response.user);
      localStorage.setItem('maxwavex_token', response.token);
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(name, email, password);
      
      setUser(response.user);
      localStorage.setItem('maxwavex_token', response.token);
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para acceso como invitado
  const loginAsGuest = async (username) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.createGuestSession(username);
      
      setUser(response.guest);
      localStorage.setItem('maxwavex_token', response.token);
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('maxwavex_token');
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Función para actualizar datos del usuario
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };
  const value = {
    user,
    loading,
    error,
    login,
    register,
    loginAsGuest,
    logout,
    clearError,
    updateUser,
    isAuthenticated: !!user,
    isGuest: user?.userType === "guest",
    isRegistered: user?.userType !== "guest",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
