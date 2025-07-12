"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { tokenStorage, apiClient } from './api'

interface User {
  id: string
  name: string
  email: string
  picture?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          // Clear invalid data
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        }
      }
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      tokenStorage.setToken(response.token)
      tokenStorage.setUser(response.user)
      setToken(response.token)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await apiClient.logout(token)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenStorage.clearAuth()
      setToken(null)
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 