"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, User } from './api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  setOAuthUser: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        const token = api.getToken();
        console.log('Auth check - Token:', token ? 'exists' : 'not found');
        if (token) {
          // Try to get user info from the backend to verify token
          // For now, we'll create a basic user object from localStorage or token
          // You could add an API endpoint to verify the token and get user info
          const userInfo = localStorage.getItem('user_info');
          console.log('Auth check - User info:', userInfo ? 'exists' : 'not found');
          if (userInfo) {
            const user = JSON.parse(userInfo);
            console.log('Auth check - Setting user:', user);
            setUser(user);
          } else {
            // If no user info in localStorage, clear the token
            console.log('Auth check - No user info, clearing token');
            api.clearToken();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        api.clearToken();
      } finally {
        console.log('Auth check - Setting loading to false');
        setLoading(false);
      }
    };

    // Use a timeout to ensure this runs after hydration
    const timer = setTimeout(checkAuth, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });
      setUser(response.user);
      // Store user info in localStorage
      localStorage.setItem('user_info', JSON.stringify(response.user));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      console.log('Auth context: Starting signup process...');
      const response = await api.signup({ firstName, lastName, email, password });
      console.log('Auth context: Signup API response:', response);
      setUser(response.user);
      // Store user info in localStorage
      localStorage.setItem('user_info', JSON.stringify(response.user));
      console.log('Auth context: User set and stored in localStorage:', response.user);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      // Clear user info from localStorage
      localStorage.removeItem('user_info');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear the user state even if the API call fails
      setUser(null);
      localStorage.removeItem('user_info');
    }
  };

  // Set OAuth user and token
  const setOAuthUser = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem('user_info', JSON.stringify(user));
    if (api.setToken) {
      api.setToken(token);
    } else {
      localStorage.setItem('auth_token', token);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    setOAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}