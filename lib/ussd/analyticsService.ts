export interface USSDSessionStart {
  sessionId: string
  phoneNumber: string
  serviceCode: string
  language: string
  timestamp: Date
}

export interface USSDInteraction {
  sessionId: string
  phoneNumber: string
  userInput: string
  systemResponse: string
  timestamp: Date
}

export interface USSDSessionEnd {
  sessionId: string
  phoneNumber: string
  serviceCode: string
  duration: number
  inputCount: number
  lastInput: string
  status: string
  timestamp: Date
}

export interface SessionSummary {
  sessionId: string
  phoneNumber: string
  startTime: Date
  endTime?: Date
  duration?: number
  totalInteractions: number
  path: string[]
  completionStatus: 'active' | 'completed' | 'timeout' | 'error'
  language: string
}

export class USSDAnalyticsService {
  private sessions: Map<string, SessionSummary> = new Map()
  private interactions: Map<string, USSDInteraction[]> = new Map()

  async logSessionStart(sessionData: USSDSessionStart): Promise<void> {
    const session: SessionSummary = {
      sessionId: sessionData.sessionId,
      phoneNumber: sessionData.phoneNumber,
      startTime: sessionData.timestamp,
      totalInteractions: 0,
      path: [],
      completionStatus: 'active',
      language: sessionData.language
    }

    this.sessions.set(sessionData.sessionId, session)
    this.interactions.set(sessionData.sessionId, [])

    // Log to console (in production, this would go to a database)
    console.log('USSD Session Started:', {
      sessionId: sessionData.sessionId,
      phoneNumber: sessionData.phoneNumber,
      language: sessionData.language,
      timestamp: sessionData.timestamp
    })
  }

  async logInteraction(interactionData: USSDInteraction): Promise<void> {
    const session = this.sessions.get(interactionData.sessionId)
    const interactions = this.interactions.get(interactionData.sessionId) || []

    // Add interaction
    interactions.push(interactionData)
    this.interactions.set(interactionData.sessionId, interactions)

    // Update session
    if (session) {
      session.totalInteractions = interactions.length
      session.path.push(interactionData.userInput)
      this.sessions.set(interactionData.sessionId, session)
    }

    // Log to console (in production, this would go to a database)
    console.log('USSD Interaction:', {
      sessionId: interactionData.sessionId,
      userInput: interactionData.userInput,
      responseLength: interactionData.systemResponse.length,
      timestamp: interactionData.timestamp
    })
  }

  async logSessionEnd(sessionEndData: USSDSessionEnd): Promise<void> {
    const session = this.sessions.get(sessionEndData.sessionId)
    const interactions = this.interactions.get(sessionEndData.sessionId) || []

    if (session) {
      session.endTime = sessionEndData.timestamp
      session.duration = sessionEndData.duration
      session.completionStatus = this.mapStatus(sessionEndData.status)
      this.sessions.set(sessionEndData.sessionId, session)
    }

    // Log to console (in production, this would go to a database)
    console.log('USSD Session Ended:', {
      sessionId: sessionEndData.sessionId,
      phoneNumber: sessionEndData.phoneNumber,
      duration: sessionEndData.duration,
      inputCount: sessionEndData.inputCount,
      status: sessionEndData.status,
      timestamp: sessionEndData.timestamp
    })

    // In production, you would persist this data to a database
    // await this.saveToDatabase(session, interactions)
  }

  async getSessionSummary(sessionId: string): Promise<SessionSummary | null> {
    return this.sessions.get(sessionId) || null
  }

  async getAllSessions(): Promise<SessionSummary[]> {
    return Array.from(this.sessions.values())
  }

  async getSessionInteractions(sessionId: string): Promise<USSDInteraction[]> {
    return this.interactions.get(sessionId) || []
  }

  // Analytics methods
  async getUsageStats(timeframe?: { start: Date; end: Date }): Promise<{
    totalSessions: number
    averageDuration: number
    completionRate: number
    mostUsedPaths: string[]
    languageBreakdown: Record<string, number>
  }> {
    let sessions = Array.from(this.sessions.values())

    // Filter by timeframe if provided
    if (timeframe) {
      sessions = sessions.filter(session => 
        session.startTime >= timeframe.start && session.startTime <= timeframe.end
      )
    }

    const completedSessions = sessions.filter(s => s.completionStatus === 'completed')
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)

    // Calculate most used paths
    const pathCounts: Record<string, number> = {}
    sessions.forEach(session => {
      const pathKey = session.path.slice(0, 3).join('->') // First 3 steps
      pathCounts[pathKey] = (pathCounts[pathKey] || 0) + 1
    })

    const mostUsedPaths = Object.entries(pathCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([path]) => path)

    // Language breakdown
    const languageBreakdown: Record<string, number> = {}
    sessions.forEach(session => {
      languageBreakdown[session.language] = (languageBreakdown[session.language] || 0) + 1
    })

    return {
      totalSessions: sessions.length,
      averageDuration: sessions.length > 0 ? totalDuration / sessions.length : 0,
      completionRate: sessions.length > 0 ? (completedSessions.length / sessions.length) * 100 : 0,
      mostUsedPaths,
      languageBreakdown
    }
  }

  private mapStatus(status: string): SessionSummary['completionStatus'] {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'completed'
      case 'timeout':
        return 'timeout'
      case 'error':
        return 'error'
      default:
        return 'completed' // Default assumption
    }
  }

  // In production, these would save to your database
  private async saveToDatabase(session: SessionSummary, interactions: USSDInteraction[]): Promise<void> {
    // Example implementation with Supabase
    /*
    const { data, error } = await supabase
      .from('ussd_sessions')
      .insert({
        session_id: session.sessionId,
        phone_number: session.phoneNumber,
        start_time: session.startTime,
        end_time: session.endTime,
        duration: session.duration,
        total_interactions: session.totalInteractions,
        path: session.path,
        completion_status: session.completionStatus,
        language: session.language
      })

    if (error) {
      console.error('Failed to save session to database:', error)
    }

    // Save interactions
    for (const interaction of interactions) {
      await supabase
        .from('ussd_interactions')
        .insert({
          session_id: interaction.sessionId,
          phone_number: interaction.phoneNumber,
          user_input: interaction.userInput,
          system_response: interaction.systemResponse,
          timestamp: interaction.timestamp
        })
    }
    */
  }
}
