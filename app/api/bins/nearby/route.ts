import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, radius = 5000, wasteType } = await request.json()

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Query for nearby QR locations (bins)
    let query = supabase
      .from('qr_locations')
      .select(`
        *,
        bins!inner(
          *,
          bin_status!inner(
            *
          )
        ),
        waste_categories!inner(
          *
        )
      `)
      .eq('status', 'active')

    // Add waste type filter if specified
    if (wasteType && wasteType !== 'all') {
      query = query.eq('waste_categories.name', wasteType)
    }

    const { data: locations, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bin locations' },
        { status: 500 }
      )
    }

    if (!locations || locations.length === 0) {
      return NextResponse.json({ bins: [] })
    }

    // Calculate distances and filter by radius
    const nearbyBins = locations
      .map(location => {
        const distance = calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        )

        return {
          id: location.id,
          name: location.location_name || `Bin ${location.id.slice(-4)}`,
          address: location.address || 'Address not available',
          latitude: location.latitude,
          longitude: location.longitude,
          distance: Math.round(distance),
          waste_type: location.waste_categories?.name || 'General',
          status: location.status,
          bin_color: location.waste_categories?.bin_color || 'Gray',
          last_collected: location.bins?.[0]?.last_collected,
          fill_level: location.bins?.[0]?.bin_status?.[0]?.fill_level_percentage || 0,
          battery_level: location.bins?.[0]?.bin_status?.[0]?.battery_level || 100
        }
      })
      .filter(bin => bin.distance <= radius)
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json({ bins: nearbyBins })

  } catch (error) {
    console.error('Nearby bins API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
