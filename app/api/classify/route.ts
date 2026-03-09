import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const userId = formData.get('userId') as string
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Mock AI classification - replace with actual AI model
    const wasteCategories = [
      { name: "Plastic", color: "blue", icon: "🍶", points: 15, instructions: "Rinse and place in blue bin. Remove caps.", impact: "Takes 450+ years to decompose" },
      { name: "Organic", color: "green", icon: "🍃", points: 10, instructions: "Place in green compost bin. No plastic bags.", impact: "Reduces methane emissions" },
      { name: "Metal", color: "yellow", icon: "🥫", points: 20, instructions: "Rinse and place in yellow bin. Crush cans to save space.", impact: "Infinitely recyclable" },
      { name: "Glass", color: "red", icon: "🍾", points: 18, instructions: "Rinse and place in red bin. Separate by color if possible.", impact: "100% recyclable without quality loss" },
      { name: "Paper", color: "blue", icon: "📄", points: 12, instructions: "Keep dry and place in blue bin. No waxed paper.", impact: "Saves trees and reduces energy" },
      { name: "E-waste", color: "purple", icon: "📱", points: 25, instructions: "Take to special e-waste collection point. Do not put in regular bins.", impact: "Contains hazardous materials" }
    ]

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockCategory = wasteCategories[Math.floor(Math.random() * wasteCategories.length)]
    const confidence = 75 + Math.floor(Math.random() * 20)
    
    // In production, you would:
    // 1. Upload image to Supabase Storage
    // 2. Send to AI model (TensorFlow.js or Replicate)
    // 3. Store classification in waste_logs table
    
    // Mock database insertion for waste_logs
    const wasteLogId = `waste_${Date.now()}`
    const mockWasteLog = {
      id: wasteLogId,
      user_id: userId,
      image_url: `https://storage.supabase.co/waste-images/${image.name}`,
      detected_category: mockCategory.name,
      confidence_score: confidence / 100,
      disposal_confirmed: false,
      points_awarded: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Waste log created:', mockWasteLog)
    
    const result = {
      success: true,
      wasteLogId: wasteLogId,
      category: mockCategory,
      confidence: confidence,
      processingTime: 1.2,
      imageUrl: mockWasteLog.image_url,
      timestamp: new Date().toISOString(),
      nextStep: "dispose"
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Classification error:', error)
    return NextResponse.json(
      { error: 'Failed to classify image' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'AI Classification API',
    endpoints: {
      POST: '/api/classify - Classify waste image',
      parameters: {
        image: 'File (required) - Image file to classify'
      }
    }
  })
}
