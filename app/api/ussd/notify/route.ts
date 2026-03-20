import { USSDAnalyticsService } from '../../../../lib/ussd/analyticsService'
import { NextRequest, NextResponse } from 'next/server'


// Africa's Talking USSD session notification endpoint
// Called when a USSD session ends (timeout, user disconnect, or END response)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract session data from Africa's Talking notification
    const {
      sessionId,
      phoneNumber,
      serviceCode,
      duration,
      inputCount,
      lastInput,
      status
    } = body

    // Validate required fields
    if (!sessionId || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required notification parameters' },
        { status: 400 }
      )
    }

    // Initialize analytics service
    const analyticsService = new USSDAnalyticsService()

    // Log session completion
    await analyticsService.logSessionEnd({
      sessionId,
      phoneNumber,
      serviceCode: serviceCode || 'unknown',
      duration: duration || 0,
      inputCount: inputCount || 0,
      lastInput: lastInput || '',
      status: status || 'unknown',
      timestamp: new Date()
    })

    // Process session summary for analytics
    const sessionSummary = await analyticsService.getSessionSummary(sessionId)

    // Log for monitoring and debugging
    console.log('USSD Session Completed:', {
      sessionId,
      phoneNumber,
      duration: `${duration}ms`,
      inputCount,
      status,
      summary: sessionSummary
    })

    // Return success response
    return NextResponse.json({
      status: 'logged',
      sessionId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('USSD Notification Error:', error)
    
    return NextResponse.json(
      { error: 'Failed to process notification' },
      { status: 500 }
    )
  }
}

// Health check for notification endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'EcoSort AI USSD Notifications',
    timestamp: new Date().toISOString()
  })
}
