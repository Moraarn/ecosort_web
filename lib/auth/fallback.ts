// Fallback authentication system for development when Supabase is unavailable
import { NextRequest } from 'next/server'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

// In-memory session storage as fallback for production
const memorySessions = new Map()
const memoryUsers = new Map()

// File-based storage for development
const SESSIONS_FILE = join(process.cwd(), 'sessions.json')
const USERS_FILE = join(process.cwd(), 'users.json')

// Determine if we should use memory storage (production) or file storage (development)
const useMemoryStorage = process.env.NODE_ENV === 'production'

export interface FallbackUser {
  id: string
  email: string
  fullName: string
  phone?: string
  role: 'citizen' | 'admin'
  totalPoints: number
  createdAt: string
  password?: string // Add password field for testing
}

export interface FallbackSession {
  userId: string
  expiresAt: number
}

export class FallbackAuth {
  private static sessions: Map<string, FallbackSession> = new Map()
  private static users: Map<string, FallbackUser> = new Map()

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private static generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  static async signUp(email: string, password: string, fullName: string, phone?: string, role: 'citizen' | 'admin' = 'citizen'): Promise<{ user: FallbackUser; sessionToken: string }> {
    const user: FallbackUser = {
      id: this.generateId(),
      email,
      fullName,
      phone,
      role,
      totalPoints: 0,
      createdAt: new Date().toISOString(),
      password // In production, this should be hashed
    }

    this.users.set(user.id, user)
    console.log('FallbackAuth: Created user:', { id: user.id, email: user.email, role: user.role })

    const sessionToken = this.generateSessionToken()
    const now = Date.now()
    
    this.sessions.set(sessionToken, { userId: user.id, expiresAt: now + (7 * 24 * 60 * 60 * 1000) }) // 7 days
    
    console.log('FallbackAuth: Session created. Total sessions now:', this.sessions.size)
    
    return { user, sessionToken }
  }

  static async signIn(email: string, password: string): Promise<{ user: FallbackUser; sessionToken: string }> {
    console.log('FallbackAuth: Looking for user with email:', email)
    console.log('FallbackAuth: Available users:', Array.from(this.users.values()).map(u => ({ id: u.id, email: u.email, role: u.role })))
    
    // Find user by email
    for (const user of this.users.values()) {
      if (user.email === email && user.password === password) {
        const sessionToken = this.generateSessionToken()
        const now = Date.now()
        
        console.log('FallbackAuth: Found user, creating session with token:', sessionToken.substring(0, 10) + '...')
        
        // Create new session
        this.sessions.set(sessionToken, { userId: user.id, expiresAt: now + (7 * 24 * 60 * 60 * 1000) }) // 7 days
        
        console.log('FallbackAuth: Session stored. Total sessions now:', this.sessions.size)
        
        return { user, sessionToken }
      }
    }

    console.log('FallbackAuth: No user found with matching email and password')
    throw new Error('Invalid credentials')
  }

  static async getUserBySession(sessionToken: string): Promise<FallbackUser | null> {
    const session = this.sessions.get(sessionToken)
    console.log('FallbackAuth: Session lookup for token:', sessionToken.substring(0, 10) + '...')
    console.log('FallbackAuth: Session found:', !!session)
    
    if (session) {
      console.log('FallbackAuth: Session expires at:', new Date(session.expiresAt).toISOString())
      console.log('FallbackAuth: Current time:', new Date().toISOString())
      console.log('FallbackAuth: Session expired?', session.expiresAt < Date.now())
    }
    
    if (!session || session.expiresAt < Date.now()) {
      if (session) {
        console.log('FallbackAuth: Removing expired session')
        this.sessions.delete(sessionToken)
      }
      return null
    }

    const user = this.users.get(session.userId)
    console.log('FallbackAuth: Found user for session:', !!user)
    return user || null
  }

  static async getCurrentUser(request: NextRequest): Promise<FallbackUser | null> {
    // Get session token from Authorization header or cookies
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    
    let sessionToken = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      sessionToken = authHeader.substring(7)
    } else if (cookieHeader) {
      // Parse cookies to find session token
      const cookies = cookieHeader.split(';').reduce((acc: any, cookie: string) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {})
      sessionToken = cookies.auth_token
    }

    console.log('FallbackAuth: Looking for session token:', sessionToken?.substring(0, 10) + '...')
    console.log('FallbackAuth: Available sessions:', Array.from(this.sessions.keys()).map(k => k.substring(0, 10) + '...'))

    if (!sessionToken) {
      console.log('FallbackAuth: No session token found')
      return null
    }

    const user = await this.getUserBySession(sessionToken)
    console.log('FallbackAuth: User lookup result:', user ? { id: user.id, email: user.email, role: user.role } : 'No user found')
    return user
  }

  static async signOut(sessionToken: string): Promise<void> {
    this.sessions.delete(sessionToken)
  }

  static async createDefaultUsers(): Promise<void> {
    // Only create defaults if no users exist
    if (this.users.size === 0) {
      // Create default admin user
      const adminUser: FallbackUser = {
        id: this.generateId(),
        email: 'admin@ecosort.com',
        fullName: 'Admin User',
        role: 'admin',
        totalPoints: 0,
        createdAt: new Date().toISOString(),
        password: 'admin123'
      }

      // Create default citizen user
      const citizenUser: FallbackUser = {
        id: this.generateId(),
        email: 'citizen@ecosort.com',
        fullName: 'Citizen User',
        role: 'citizen',
        totalPoints: 0,
        createdAt: new Date().toISOString(),
        password: 'citizen123'
      }

      this.users.set(adminUser.id, adminUser)
      this.users.set(citizenUser.id, citizenUser)

      console.log('FallbackAuth: Default users created')
      console.log('FallbackAuth: Admin - email: admin@ecosort.com, password: admin123')
      console.log('FallbackAuth: Citizen - email: citizen@ecosort.com, password: citizen123')
    }
  }

  // Get all users (for debugging)
  static getAllUsers(): FallbackUser[] {
    return Array.from(this.users.values())
  }
}

// Initialize default users
FallbackAuth.createDefaultUsers()
