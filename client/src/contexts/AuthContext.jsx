import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/login/me`, {
        withCredentials: true,
      });
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // console.log('User authenticated:', response.data.user.email);
      }
    } catch (error) {
      // console.log('Not authenticated:', error.response?.status);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Check authentication status on app load
  useEffect(() => {
    // checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${baseUrl}/api/login/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      // console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [baseUrl]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};