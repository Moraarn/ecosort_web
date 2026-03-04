import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { qrCode, userId, wasteType } = await request.json()

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code is required' }, { status: 400 })
    }

    // Mock QR validation - replace with actual QR code validation
    const mockQRLocations = [
      { id: "1", code: "ECOSORT-BIN-001", location: "Main Street - Recycling Center", type: "Mixed Waste", status: "active" },
      { id: "2", code: "ECOSORT-BIN-002", location: "City Park - Organic Waste", type: "Organic", status: "active" },
      { id: "3", code: "ECOSORT-BIN-003", location: "Shopping Mall - Plastic Collection", type: "Plastic", status: "active" },
      { id: "4", code: "ECOSORT-BIN-004", location: "School Campus - Paper Recycling", type: "Paper", status: "active" }
    ]

    // Find matching QR code
    const location = mockQRLocations.find(loc => loc.code === qrCode)
    
    if (!location) {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 404 })
    }

    if (location.status !== 'active') {
      return NextResponse.json({ error: 'QR code is not active' }, { status: 400 })
    }

    // Calculate points based on waste type
    const pointsMap = {
      "Plastic": 15,
      "Organic": 10,
      "Metal": 20,
      "Glass": 18,
      "Paper": 12,
      "E-waste": 25
    }

    const points = pointsMap[wasteType as keyof typeof pointsMap] || 10

    // In production, you would:
    // 1. Validate QR code against database
    // 2. Log disposal to waste_logs table
    // 3. Award points to user
    // 4. Update user achievements
    // 5. Send notification

    const result = {
      success: true,
      location: location,
      points: points,
      timestamp: new Date().toISOString(),
      disposalId: `DISPOSAL-${Date.now()}`,
      message: `Successfully logged disposal at ${location.location}`
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('QR scan error:', error)
    return NextResponse.json(
      { error: 'Failed to process QR scan' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'QR Scan API',
    endpoints: {
      POST: '/api/scan - Process QR code scan',
      parameters: {
        qrCode: 'string (required) - QR code value',
        userId: 'string (optional) - User ID',
        wasteType: 'string (optional) - Type of waste disposed'
      }
    }
  })
}
