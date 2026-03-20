import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, radius = 5000, wasteType } = await request.json()

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Mock data for demonstration - replace with actual database query
    const mockBins = [
      {
        id: 'bin_001',
        name: 'EcoSort Station - Central Park',
        address: '123 Central Avenue, Nairobi',
        latitude: latitude + 0.001,
        longitude: longitude + 0.001,
        distance: 150,
        waste_type: 'Recyclables',
        status: 'active',
        bin_color: 'Blue',
        last_collected: '2024-03-20T08:00:00Z',
        fill_level: 25,
        battery_level: 95
      },
      {
        id: 'bin_002',
        name: 'Green Point - Shopping Mall',
        address: '456 Mall Road, Nairobi',
        latitude: latitude - 0.002,
        longitude: longitude + 0.003,
        distance: 350,
        waste_type: 'General Waste',
        status: 'active',
        bin_color: 'Gray',
        last_collected: '2024-03-20T06:30:00Z',
        fill_level: 60,
        battery_level: 88
      },
      {
        id: 'bin_003',
        name: 'Recycling Hub - Market Area',
        address: '789 Market Street, Nairobi',
        latitude: latitude + 0.003,
        longitude: longitude - 0.001,
        distance: 480,
        waste_type: 'Organic',
        status: 'active',
        bin_color: 'Green',
        last_collected: '2024-03-20T07:15:00Z',
        fill_level: 40,
        battery_level: 92
      },
      {
        id: 'bin_004',
        name: 'Smart Bin - Residential Complex',
        address: '321 Estate Drive, Nairobi',
        latitude: latitude - 0.001,
        longitude: longitude - 0.002,
        distance: 620,
        waste_type: 'Recyclables',
        status: 'active',
        bin_color: 'Blue',
        last_collected: '2024-03-20T09:00:00Z',
        fill_level: 15,
        battery_level: 98
      },
      {
        id: 'bin_005',
        name: 'Eco Station - Business District',
        address: '555 Corporate Plaza, Nairobi',
        latitude: latitude + 0.004,
        longitude: longitude + 0.002,
        distance: 850,
        waste_type: 'Hazardous',
        status: 'maintenance',
        bin_color: 'Red',
        last_collected: '2024-03-19T16:00:00Z',
        fill_level: 80,
        battery_level: 45
      }
    ]

    // Filter by waste type if specified
    let filteredBins = mockBins
    if (wasteType && wasteType !== 'all') {
      filteredBins = mockBins.filter(bin => 
        bin.waste_type.toLowerCase().includes(wasteType.toLowerCase())
      )
    }

    // Filter by radius and sort by distance
    const nearbyBins = filteredBins
      .filter((bin: any) => bin.distance <= radius)
      .sort((a: any, b: any) => a.distance - b.distance)

    return NextResponse.json({ bins: nearbyBins })

  } catch (error) {
    console.error('Nearby bins API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
