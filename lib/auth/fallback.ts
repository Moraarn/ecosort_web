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
      const data = readFileSync(USERS_FILE, 'utf-8')
      const users = JSON.parse(data)
      console.log('FallbackAuth: Loaded users:', Object.keys(users).length)
      return users
    } else {
      console.log('FallbackAuth: Users file does not exist')
    }
  } catch (error) {
    console.log('FallbackAuth: Failed to load users:', error)
  }
  return {}
}

const saveUsers = (users: any) => {
  try {
    console.log('FallbackAuth: Saving users to:', USERS_FILE)
    console.log('FallbackAuth: Users to save:', Object.keys(users).length)
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
    console.log('FallbackAuth: Users saved successfully')
  } catch (error) {
    console.log('FallbackAuth: Failed to save users:', error)
  }
}

export class FallbackAuth {
  static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  static generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  static async signUp(email: string, password: string, fullName: string, phone?: string, role: 'citizen' | 'admin' = 'citizen'): Promise<{ user: FallbackUser; sessionToken: string }> {
    // Load existing users
    const users = loadUsers()
    
    // Check if user already exists
    for (const user of Object.values(users) as FallbackUser[]) {
      if (user.email === email) {
        throw new Error('User already exists')
      }
    }

    const userId = this.generateId()
    const sessionToken = this.generateSessionToken()
    const now = Date.now()

    const user: FallbackUser = {
      id: userId,
      email,
      fullName,
      phone,
      role,
      totalPoints: 0,
      createdAt: new Date(now).toISOString(),
      password // Store password for testing (in production, this would be hashed)
    }

    // Store user and session
    users[userId] = user
    saveUsers(users)

    const sessions = loadSessions()
    sessions[sessionToken] = { userId, expiresAt: now + (7 * 24 * 60 * 60 * 1000) } // 7 days
    saveSessions(sessions)

    return { user, sessionToken }
  }

  static async signIn(email: string, password: string): Promise<{ user: FallbackUser; sessionToken: string }> {
    console.log('FallbackAuth: Looking for user with email:', email)
    
    const users = loadUsers()
    console.log('FallbackAuth: Available users:', Object.values(users).map((u: any) => ({ id: u.id, email: u.email, role: u.role })))
    
    // Find user by email
    for (const user of Object.values(users) as FallbackUser[]) {
      if (user.email === email && user.password === password) {
        const sessionToken = this.generateSessionToken()
        const now = Date.now()
        
        console.log('FallbackAuth: Found user, creating session with token:', sessionToken.substring(0, 10) + '...')
        
        // Create new session
        const sessions = loadSessions()
        sessions[sessionToken] = { userId: user.id, expiresAt: now + (7 * 24 * 60 * 60 * 1000) } // 7 days
        saveSessions(sessions)
        
        console.log('FallbackAuth: Session stored. Total sessions now:', Object.keys(sessions).length)
        
        return { user, sessionToken }
      }
    }

    console.log('FallbackAuth: No user found with matching email and password')
    throw new Error('Invalid credentials')
  }

  static async getUserBySession(sessionToken: string): Promise<FallbackUser | null> {
    const sessions = loadSessions()
    const session = sessions[sessionToken]
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
        delete sessions[sessionToken]
        saveSessions(sessions)
      }
      return null
    }

    const users = loadUsers()
    const user = users[session.userId]
    console.log('FallbackAuth: Found user for session:', !!user)
    return user || null
  }

  static async signOut(sessionToken: string): Promise<void> {
    const sessions = loadSessions()
    delete sessions[sessionToken]
    saveSessions(sessions)
  }

  // Helper method to create some default users for testing
  static createDefaultUsers(): void {
    const users = loadUsers()
    const sessions = loadSessions()
    
    // Only create defaults if no users exist
    if (Object.keys(users).length === 0) {
      const defaultUsers = [
        {
          email: 'admin@ecosort.com',
          password: 'admin123',
          fullName: 'Admin User',
          role: 'admin' as const
        },
        {
          email: 'citizen@ecosort.com',
          password: 'citizen123',
          fullName: 'Citizen User',
          role: 'citizen' as const
        }
      ]

      defaultUsers.forEach(({ email, password, fullName, role }) => {
        const userId = this.generateId()
        const user: FallbackUser = {
          id: userId,
          email,
          fullName,
          role,
          totalPoints: 0,
          createdAt: new Date().toISOString(),
          password // Include password for testing
        }
        users[userId] = user
      })
      
      saveUsers(users)
      console.log('FallbackAuth: Created default users')
    }
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
    
    const sessions = loadSessions()
    console.log('FallbackAuth: Available sessions:', Object.keys(sessions).map((k: any) => k.substring(0, 10) + '...'))

    if (!sessionToken) {
      console.log('FallbackAuth: No session token found')
      return null
    }

    const user = await this.getUserBySession(sessionToken)
    console.log('FallbackAuth: User lookup result:', user ? { id: user.id, email: user.email, role: user.role } : 'No user found')
    return user
  }

  // Get all users (for debugging)
  static getAllUsers(): FallbackUser[] {
    const users = loadUsers()
    return Object.values(users) as FallbackUser[]
  }
}

// Initialize default users
FallbackAuth.createDefaultUsers()
