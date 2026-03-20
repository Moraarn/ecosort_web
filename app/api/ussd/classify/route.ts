import { NextRequest, NextResponse } from 'next/server'
import { USSDAIIntegration } from '../../../../lib/ussd/aiIntegration'
import { type SupportedLanguage } from '@/types/languages'

// USSD waste classification endpoint
// Allows users to describe waste items and get classification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, phoneNumber, language = 'en' } = body

    // Validate required fields
    if (!description || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing description or phone number' },
        { status: 400 }
      )
    }

    // Validate language
    const supportedLanguages: SupportedLanguage[] = ['en', 'sw', 'lg', 'ki', 'lu', 'ka', 'rn']
    if (!supportedLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      )
    }

    // Initialize AI integration
    const aiIntegration = new USSDAIIntegration()

    // Classify waste description
    const result = await aiIntegration.classifyWasteDescription({
      description: description.trim(),
      language: language as SupportedLanguage,
      phoneNumber
    })

    // Format response for USSD
    const ussdResponse = `END ${result.category} waste detected.
${result.instructions}
Bin: ${result.binColor}
Points: ${result.points}`

    return NextResponse.json({
      success: true,
      classification: result,
      ussdResponse
    })

  } catch (error) {
    console.error('USSD Classification Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Classification failed',
        ussdResponse: 'END Service temporarily unavailable. Please try again later.'
      },
      { status: 500 }
    )
  }
}

// Quick classification for common items
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const item = searchParams.get('item')
  const language = (searchParams.get('language') || 'en') as SupportedLanguage

  if (!item) {
    return NextResponse.json(
      { error: 'Missing item parameter' },
      { status: 400 }
    )
  }

  try {
    const aiIntegration = new USSDAIIntegration()
    const result = aiIntegration.getQuickClassification(item)

    if (!result) {
      return NextResponse.json(
        { error: 'Item not found in quick classification database' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      classification: result
    })

  } catch (error) {
    console.error('Quick Classification Error:', error)
    
    return NextResponse.json(
      { error: 'Quick classification failed' },
      { status: 500 }
    )
  }
}
