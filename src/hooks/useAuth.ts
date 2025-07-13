import { useState, useEffect } from 'react';
import { authAPI, User } from '../services/api';
import { LoginCredentials, RegisterData } from '../types';

interface AuthHook {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
}

export const useAuth = (): AuthHook => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user data
      getCurrentUser();
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      setIsLoading(true);
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch (err) {
      // If token is invalid, remove it
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      
      // Store token
      localStorage.setItem('authToken', response.token);
      
      // Set user data
      setUser(response.user);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(data);
      
      // Store token
      localStorage.setItem('authToken', response.token);
      
      // Set user data
      setUser(response.user);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    // Optional: call logout API endpoint
    authAPI.logout().catch(() => {
      // Ignore errors for logout API call
    });
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  };
};