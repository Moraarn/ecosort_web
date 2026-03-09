'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/lib/types/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName: string, phone?: string, role?: 'citizen' | 'admin') => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setLoading(false)
        return
      }

      // Validate token with API
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // Token invalid, remove it
        localStorage.removeItem('auth_token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store token
      if (data.session?.access_token) {
        localStorage.setItem('auth_token', data.session.access_token)
      }
      
      // Store user role for redirection
      localStorage.setItem('user_role', data.role)

      // Create user object from response
      const userObj: User = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
        phone: data.user.user_metadata?.phone,
        role: data.role,
        total_points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setUser(userObj)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, fullName: string, phone?: string, role: 'citizen' | 'admin' = 'citizen') => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName, phone, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // Store token if available
      if (data.session?.access_token) {
        localStorage.setItem('auth_token', data.session.access_token)
      }
      
      // Store user role for redirection
      localStorage.setItem('user_role', data.role)

      // Create user object from response
      const userObj: User = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
        phone: data.user.user_metadata?.phone,
        role: data.role,
        total_points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setUser(userObj)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
