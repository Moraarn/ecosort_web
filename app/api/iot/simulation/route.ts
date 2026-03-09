import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, requireAdmin } from '@/lib/supabase/server'
import { z } from 'zod'

// IoT Simulation Service
// This endpoint simulates real-time IoT data from smart bins
// In production, this would be replaced by actual IoT device data

const simulationSchema = z.object({
  action: z.enum(['start', 'stop', 'status', 'update']),
  binIds: z.array(z.string()).optional(),
  interval: z.number().min(1000).max(300000).optional(), // 1 second to 5 minutes
})

// Store active simulations (in production, use Redis or database)
const activeSimulations = new Map<string, NodeJS.Timeout>()

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const binId = searchParams.get('binId')
    const realtime = searchParams.get('realtime') === 'true'

    if (realtime) {
      // Get real-time IoT data
      let query = (supabase
        .from('bin_status') as any)
        .select(`
          *,
          bins (
            *,
            qr_locations (
              location_name,
              address
            )
          )
        `)
        .order('last_updated', { ascending: false })

      if (binId) {
        query = query.eq('bin_id', binId)
      }

      const { data: iotData, error } = await query

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      // Transform data to IoT format
      const transformedData = (iotData as any[] || []).map((item: any) => ({
        binId: (item as any).bin_id,
        location: (item as any).bins?.qr_locations?.location_name || 'Unknown',
        fillLevel: (item as any).fill_level_percentage,
        weight: (item as any).bins?.current_weight_kg || 0,
        temperature: (item as any).temperature,
        batteryLevel: (item as any).battery_level,
        lastSeen: (item as any).last_updated,
        status: (item as any).status,
        binIdentifier: (item as any).bins?.bin_identifier
      })) || []

      return NextResponse.json({
        success: true,
        iotData: transformedData,
        timestamp: new Date().toISOString()
      })
    } else {
      // Get simulation status
      const simulationStatus = Array.from(activeSimulations.keys()).map(binId => ({
        binId,
        status: 'running',
        startTime: new Date().toISOString()
      }))

      return NextResponse.json({
        success: true,
        activeSimulations: simulationStatus,
        totalActive: activeSimulations.size
      })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { action, binIds, interval } = simulationSchema.parse(body)

    switch (action) {
      case 'start':
        return await startSimulation(supabase, binIds, interval)
      
      case 'stop':
        return await stopSimulation(binIds)
      
      case 'status':
        return await getSimulationStatus()
      
      case 'update':
        return await updateIoTData(supabase, binIds)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
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

async function startSimulation(supabase: any, binIds?: string[], interval: number = 30000) {
  try {
    // Get bins to simulate
    let query = (supabase.from('bins') as any).select('id, bin_identifier')
    if (binIds?.length) {
      query = query.in('id', binIds)
    }

    const { data: bins, error } = await query

    if (error || !bins?.length) {
      return NextResponse.json(
        { error: 'No bins found for simulation' },
        { status: 404 }
      )
    }

    // Start simulation for each bin
    const startedSimulations = []
    for (const bin of bins) {
      if (activeSimulations.has(bin.id)) {
        continue // Already running
      }

      const simulationInterval = setInterval(async () => {
        await simulateBinData(supabase, bin.id)
      }, interval)

      activeSimulations.set(bin.id, simulationInterval)
      startedSimulations.push(bin.id)
    }

    return NextResponse.json({
      success: true,
      message: `Simulation started for ${startedSimulations.length} bins`,
      startedBins: startedSimulations,
      interval
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to start simulation' },
      { status: 500 }
    )
  }
}

async function stopSimulation(binIds?: string[]) {
  try {
    const stoppedSimulations = []

    if (binIds?.length) {
      // Stop specific simulations
      for (const binId of binIds) {
        const interval = activeSimulations.get(binId)
        if (interval) {
          clearInterval(interval)
          activeSimulations.delete(binId)
          stoppedSimulations.push(binId)
        }
      }
    } else {
      // Stop all simulations
      for (const [binId, interval] of activeSimulations) {
        clearInterval(interval)
        stoppedSimulations.push(binId)
      }
      activeSimulations.clear()
    }

    return NextResponse.json({
      success: true,
      message: `Simulation stopped for ${stoppedSimulations.length} bins`,
      stoppedBins: stoppedSimulations
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to stop simulation' },
      { status: 500 }
    )
  }
}

async function getSimulationStatus() {
  try {
    const status = Array.from(activeSimulations.entries()).map(([binId, interval]) => ({
      binId,
      status: 'running',
      interval: 'active'
    }))

    return NextResponse.json({
      success: true,
      activeSimulations: status,
      totalActive: activeSimulations.size
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get simulation status' },
      { status: 500 }
    )
  }
}

async function updateIoTData(supabase: any, binIds?: string[]) {
  try {
    const updatedBins = []

    if (binIds?.length) {
      for (const binId of binIds) {
        await simulateBinData(supabase, binId)
        updatedBins.push(binId)
      }
    } else {
      // Update all bins
      const { data: bins } = await (supabase.from('bins') as any).select('id')
      for (const bin of bins || []) {
        await simulateBinData(supabase, bin.id)
        updatedBins.push(bin.id)
      }
    }

    return NextResponse.json({
      success: true,
      message: `IoT data updated for ${updatedBins.length} bins`,
      updatedBins
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update IoT data' },
      { status: 500 }
    )
  }
}

async function simulateBinData(supabase: any, binId: string) {
  try {
    // Get current bin status
    const { data: currentStatus } = await (supabase
      .from('bin_status') as any)
      .select('fill_level_percentage, battery_level')
      .eq('bin_id', binId)
      .single()

    // Simulate realistic IoT changes
    const fillChange = (Math.random() - 0.3) * 10 // Random change between -3 and +7
    const newFillLevel = Math.max(0, Math.min(100, (currentStatus?.fill_level_percentage || 0) + fillChange))
    const newBatteryLevel = Math.max(0, (currentStatus?.battery_level || 100) - Math.random() * 0.5)
    const newTemperature = 20 + Math.random() * 15 // 20-35°C
    const newHumidity = 40 + Math.random() * 30 // 40-70%

    // Determine status based on fill level
    const newStatus = newFillLevel >= 90 ? 'full' : 
                    newFillLevel >= 75 ? 'normal' : 'normal'

    // Update bin status
    await (supabase
      .from('bin_status') as any)
      .upsert({
        bin_id: binId,
        fill_level_percentage: Math.round(newFillLevel),
        battery_level: Math.round(newBatteryLevel),
        temperature: Math.round(newTemperature * 10) / 10,
        humidity: Math.round(newHumidity * 10) / 10,
        status: newStatus,
        last_updated: new Date().toISOString()
      })

    // Update bin weight (rough estimation)
    const weightChange = fillChange * 2.5
    const { data: bin } = await (supabase
      .from('bins') as any)
      .select('current_weight_kg')
      .eq('id', binId)
      .single()

    if (bin) {
      await (supabase
        .from('bins') as any)
        .update({
          current_weight_kg: Math.max(0, ((bin as any).current_weight_kg || 0) + weightChange)
        })
        .eq('id', binId)
    }

    console.log(`IoT simulation updated bin ${binId}: fill=${Math.round(newFillLevel)}%, status=${newStatus}`)
  } catch (error) {
    console.error(`Failed to simulate bin ${binId}:`, error)
  }
}
    
