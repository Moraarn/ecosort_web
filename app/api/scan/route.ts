import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const scanSchema = z.object({
  qr_code: z.string(),
  waste_category_id: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qr_code, waste_category_id } = scanSchema.parse(body)

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Find QR location in database
    const { data: qrLocation, error: qrError } = await supabase
      .from('qr_locations')
      .select(`
        *,
        waste_categories (
          id,
          name,
          bin_color,
          points_value
        )
      `)
      .eq('qr_code', qr_code)
      .eq('status', 'active')
      .single()

    if (qrError || !qrLocation) {
      return NextResponse.json(
        { error: 'Invalid or inactive QR code' },
        { status: 404 }
      )
    }

    // Validate waste category if provided
    if (waste_category_id && qrLocation.waste_type_id && waste_category_id !== qrLocation.waste_type_id) {
      return NextResponse.json(
        { error: 'Waste type does not match this bin location' },
        { status: 400 }
      )
    }

    const finalCategoryId = waste_category_id || qrLocation.waste_type_id
    const category = qrLocation.waste_categories

    if (!finalCategoryId || !category) {
      return NextResponse.json(
        { error: 'No waste category specified for this location' },
        { status: 400 }
      )
    }

    // Create waste log for QR scan disposal
    const { data: wasteLog, error: logError } = await supabase
      .from('waste_logs')
      .insert({
        user_id: user.id,
        waste_category_id: finalCategoryId,
        qr_location_id: qrLocation.id,
        confidence_score: 1.0, // QR scan is considered verified
        points_earned: category.points_value,
        verified: true,
        disposal_timestamp: new Date().toISOString(),
      })
      .select()
      .single()

    if (logError || !wasteLog) {
      return NextResponse.json(
        { error: logError?.message || 'Failed to create waste log' },
        { status: 400 }
      )
    }

    // Award points using database function
    const { error: rewardError } = await supabase.rpc('award_disposal_points', {
      user_uuid: user.id,
      waste_log_uuid: wasteLog.id,
      points: category.points_value,
      description: `Points earned for ${category.name} disposal at ${qrLocation.location_name || 'QR location'}`
    })

    if (rewardError) {
      console.error('Failed to award points:', rewardError)
    }

    return NextResponse.json(
      {
        success: true,
        location: qrLocation,
        category: category,
        points_earned: category.points_value,
        waste_log: wasteLog,
        timestamp: new Date().toISOString(),
        message: `Successfully logged disposal at ${qrLocation.location_name || 'QR location'}`
      },
      { status: 200 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseFloat(searchParams.get('radius') || '5') // radius in km

    // Get nearby QR locations (simplified - in production use proper geospatial queries)
    const { data: locations, error } = await supabase
      .from('qr_locations')
      .select(`
        *,
        waste_categories (
          id,
          name,
          bin_color,
          points_value
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Filter by radius (simplified calculation)
    const nearbyLocations = locations?.filter(location => {
      if (!location.latitude || !location.longitude) return true // Include locations without coordinates
      const distance = calculateDistance(lat, lng, location.latitude, location.longitude)
      return distance <= radius
    }) || locations

    return NextResponse.json(
      { locations: nearbyLocations },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
