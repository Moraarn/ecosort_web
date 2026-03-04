export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  role: 'user' | 'admin'
  total_points: number
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  full_name: string
  phone?: string
}

export interface ProfileUpdate {
  full_name?: string
  avatar_url?: string
  phone?: string
}
