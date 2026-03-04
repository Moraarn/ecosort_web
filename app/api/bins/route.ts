import { NextRequest, NextResponse } from 'next/server'

// Mock bins data - in production, this would query the bins table
const mockBins = [
  {
    id: "1",
    location_id: "1",
    fill_level: 45,
    weight_kg: 125.5,
    last_collected: "2024-01-15T06:00:00Z",
    status: "normal",
    last_updated: "2024-01-15T14:30:00Z",
    qr_location: {
      id: "1",
      code: "ECOSORT-BIN-001",
      location: "Main Street - Recycling Center",
      latitude: -1.2921,
      longitude: 36.8219,
      type: "Mixed Waste"
    }
  },
  {
    id: "2",
    location_id: "2",
    fill_level: 78,
    weight_kg: 89.2,
    last_collected: "2024-01-14T08:00:00Z",
    status: "warning",
    last_updated: "2024-01-15T14:30:00Z",
    qr_location: {
      id: "2",
      code: "ECOSORT-BIN-002",
      location: "City Park - Organic Waste",
      latitude: -1.2833,
      longitude: 36.8167,
      type: "Organic"
    }
  },
  {
    id: "3",
    location_id: "3",
    fill_level: 23,
    weight_kg: 45.8,
    last_collected: "2024-01-15T10:00:00Z",
    status: "normal",
    last_updated: "2024-01-15T14:30:00Z",
    qr_location: {
      id: "3",
      code: "ECOSORT-BIN-003",
      location: "Shopping Mall - Plastic Collection",
      latitude: -1.2747,
      longitude: 36.8119,
      type: "Plastic"
    }
  },
  {
    id: "4",
    location_id: "4",
    fill_level: 91,
    weight_kg: 156.3,
    last_collected: "2024-01-13T16:00:00Z",
    status: "critical",
    last_updated: "2024-01-15T14:30:00Z",
    qr_location: {
      id: "4",
      code: "ECOSORT-BIN-004",
      location: "School Campus - Paper Recycling",
      latitude: -1.2956,
      longitude: 36.8258,
      type: "Paper"
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const locationId = searchParams.get('location_id')

    let filteredBins = mockBins

    // Filter by status if provided
    if (status) {
      filteredBins = filteredBins.filter(bin => bin.status === status)
    }

    // Filter by location if provided
    if (locationId) {
      filteredBins = filteredBins.filter(bin => bin.location_id === locationId)
    }

    return NextResponse.json({
      success: true,
      bins: filteredBins,
      total: filteredBins.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Bins fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bins data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { binId, action, fill_level, weight_kg } = await request.json()

    if (!binId || !action) {
      return NextResponse.json({ error: 'Bin ID and action are required' }, { status: 400 })
    }

    // Find the bin
    const binIndex = mockBins.findIndex(bin => bin.id === binId)
    if (binIndex === -1) {
      return NextResponse.json({ error: 'Bin not found' }, { status: 404 })
    }

    const bin = mockBins[binIndex]

    // Handle different actions
    switch (action) {
      case 'update_fill_level':
        if (fill_level !== undefined) {
          bin.fill_level = Math.max(0, Math.min(100, fill_level))
          bin.last_updated = new Date().toISOString()
          
          // Update status based on fill level
          if (bin.fill_level >= 90) {
            bin.status = 'critical'
          } else if (bin.fill_level >= 75) {
            bin.status = 'warning'
          } else {
            bin.status = 'normal'
          }
        }
        break

      case 'update_weight':
        if (weight_kg !== undefined) {
          bin.weight_kg = Math.max(0, weight_kg)
          bin.last_updated = new Date().toISOString()
        }
        break

      case 'collect':
        bin.fill_level = 0
        bin.weight_kg = 0
        bin.last_collected = new Date().toISOString()
        bin.last_updated = new Date().toISOString()
        bin.status = 'normal'
        break

      case 'simulate_fill':
        // IoT simulation - add random fill
        const randomIncrease = Math.floor(Math.random() * 15) + 5
        bin.fill_level = Math.min(100, bin.fill_level + randomIncrease)
        bin.weight_kg += randomIncrease * 2.5 // Rough weight estimation
        bin.last_updated = new Date().toISOString()
        
        // Update status
        if (bin.fill_level >= 90) {
          bin.status = 'critical'
        } else if (bin.fill_level >= 75) {
          bin.status = 'warning'
        } else {
          bin.status = 'normal'
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    console.log(`Bin ${binId} updated:`, { action, fill_level: bin.fill_level, status: bin.status })

    return NextResponse.json({
      success: true,
      bin: bin,
      message: `Bin ${binId} updated successfully`
    })
  } catch (error) {
    console.error('Bin update error:', error)
    return NextResponse.json(
      { error: 'Failed to update bin' },
      { status: 500 }
    )
  }
}

// IoT Simulation endpoint
export async function PUT(request: NextRequest) {
  try {
    // Simulate IoT updates for all bins
    const updatedBins = mockBins.map(bin => {
      const randomChange = Math.floor(Math.random() * 10) - 3 // Random change between -3 and +6
      bin.fill_level = Math.max(0, Math.min(100, bin.fill_level + randomChange))
      bin.weight_kg = Math.max(0, bin.weight_kg + randomChange * 1.5)
      bin.last_updated = new Date().toISOString()
      
      // Update status based on fill level
      if (bin.fill_level >= 90) {
        bin.status = 'critical'
      } else if (bin.fill_level >= 75) {
        bin.status = 'warning'
      } else {
        bin.status = 'normal'
      }
      
      return bin
    })

    // Find bins that need collection
    const binsNeedingCollection = updatedBins.filter(bin => bin.status === 'critical')

    return NextResponse.json({
      success: true,
      bins: updatedBins,
      binsNeedingCollection: binsNeedingCollection,
      message: `IoT simulation completed. ${binsNeedingCollection.length} bins need collection.`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('IoT simulation error:', error)
    return NextResponse.json(
      { error: 'Failed to run IoT simulation' },
      { status: 500 }
    )
  }
}
