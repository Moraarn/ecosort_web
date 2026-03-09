// Fallback authentication system for development when Supabase is unavailable
export interface FallbackUser {
  id: string
  email: string
  fullName: string
  phone?: string
  role: 'citizen' | 'admin'
  totalPoints: number
  createdAt: string
}

// In-memory user store (for development only)
const users: Map<string, FallbackUser> = new Map()
const sessions: Map<string, { userId: string; expiresAt: number }> = new Map()

export class FallbackAuth {
  static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  static generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  static async signUp(email: string, password: string, fullName: string, phone?: string, role: 'citizen' | 'admin' = 'citizen'): Promise<{ user: FallbackUser; sessionToken: string }> {
    // Check if user already exists
    for (const user of users.values()) {
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
      createdAt: new Date(now).toISOString()
    }

    // Store user and session
    users.set(userId, user)
    sessions.set(sessionToken, { userId, expiresAt: now + (7 * 24 * 60 * 60 * 1000) }) // 7 days

    return { user, sessionToken }
  }

  static async signIn(email: string, password: string): Promise<{ user: FallbackUser; sessionToken: string }> {
    // Find user by email
    for (const user of users.values()) {
      if (user.email === email) {
        const sessionToken = this.generateSessionToken()
        const now = Date.now()
        
        // Create new session
        sessions.set(sessionToken, { userId: user.id, expiresAt: now + (7 * 24 * 60 * 60 * 1000) }) // 7 days
        
        return { user, sessionToken }
      }
    }

    throw new Error('Invalid credentials')
  }

  static async getUserBySession(sessionToken: string): Promise<FallbackUser | null> {
    const session = sessions.get(sessionToken)
    if (!session || session.expiresAt < Date.now()) {
      sessions.delete(sessionToken)
      return null
    }

    return users.get(session.userId) || null
  }

  static async signOut(sessionToken: string): Promise<void> {
    sessions.delete(sessionToken)
  }

  // Helper method to create some default users for testing
  static createDefaultUsers(): void {
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
        createdAt: new Date().toISOString()
      }
      users.set(userId, user)
    })
  }

  // Get all users (for debugging)
  static getAllUsers(): FallbackUser[] {
    return Array.from(users.values())
  }
}

// Initialize default users
FallbackAuth.createDefaultUsers()
