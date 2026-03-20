import { NextRequest, NextResponse } from 'next/server'
import { USSDMenuService } from '../../../lib/ussd/menuService'
import { getUSSDLanguageByCode, type SupportedLanguage } from '@/types/languages'
import { USSDAnalyticsService } from '../../../lib/ussd/analyticsService'

// Africa's Talking USSD callback endpoint
export async function POST(request: NextRequest) {
  try {
    // Parse form data from Africa's Talking
    const formData = await request.formData()
    const sessionId = formData.get('sessionId') as string
    const serviceCode = formData.get('serviceCode') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const text = formData.get('text') as string

    // Validate required fields
    if (!sessionId || !serviceCode || !phoneNumber || text === null) {
      return NextResponse.json(
        { error: 'Missing required USSD parameters' },
        { status: 400 }
      )
    }

    // Initialize services
    const menuService = new USSDMenuService()
    const analyticsService = new USSDAnalyticsService()

    // Detect language from phone number prefix or default to English
    const language = detectLanguage(phoneNumber)

    // Log session start for analytics
    if (text === '') {
      await analyticsService.logSessionStart({
        sessionId,
        phoneNumber,
        serviceCode,
        language,
        timestamp: new Date()
      })
    }

    // Process USSD request
    const response = await menuService.processRequest({
      sessionId,
      serviceCode,
      phoneNumber,
      text,
      language
    })

    // Log session interaction
    await analyticsService.logInteraction({
      sessionId,
      phoneNumber,
      userInput: text,
      systemResponse: response,
      timestamp: new Date()
    })

    // Return USSD response in plain text format
    return new NextResponse(response, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('USSD Error:', error)
    
    // Fallback response for errors
    const errorResponse = 'END Service temporarily unavailable. Please try again later.'
    
    return new NextResponse(errorResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }
}

// Detect language based on phone number prefix
function detectLanguage(phoneNumber: string): SupportedLanguage {
  // Kenya country code +254 -> default to Swahili
  if (phoneNumber.startsWith('+254') || phoneNumber.startsWith('254')) {
    return 'sw'
  }
  
  // Uganda country code +256 -> default to Luganda  
  if (phoneNumber.startsWith('+256') || phoneNumber.startsWith('256')) {
    return 'lg'
  }
  
  // Default to English for other countries
  return 'en'
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'EcoSort AI USSD',
    timestamp: new Date().toISOString()
  })
}
