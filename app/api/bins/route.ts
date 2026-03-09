import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const updateBinSchema = z.object({
  action: z.enum(['update_fill_level', 'update_weight', 'collect', 'simulate_fill']),
  fill_level: z.number().min(0).max(100).optional(),
  weight_kg: z.number().min(0).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const locationId = searchParams.get('location_id')

    let query = (supabase
      .from('bins') as any)
      .select(`
        *,
        bin_status (
          fill_level_percentage,
          battery_level,
          temperature,
          humidity,
          status,
          last_updated
        ),
        qr_locations (
          id,
          qr_code,
          location_name,
          address,
          latitude,
          longitude,
          waste_categories (
            id,
            name,
            bin_color
          )
        )
      `)

    // Filter by status if provided
    if (status) {
      query = query.eq('bin_status.status', status)
    }

    // Filter by location if provided
    if (locationId) {
      query = query.eq('qr_location_id', locationId)
    }

    const { data: bins, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      bins: bins,
      total: bins?.length || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { binId, action, fill_level, weight_kg } = body
    
    // Validate the update data
    const updateData = updateBinSchema.parse({ action, fill_level, weight_kg })

    if (!binId) {
      return NextResponse.json(
        { error: 'Bin ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Check if bin exists
    const { data: bin, error: binError } = await (supabase
      .from('bins') as any)
      .select('*')
      .eq('id', binId)
      .single()

    if (binError || !bin) {
      return NextResponse.json(
        { error: 'Bin not found' },
        { status: 404 }
      )
    }

    // Handle different actions
    switch (updateData.action) {
      case 'update_fill_level':
        if (updateData.fill_level !== undefined) {
          const { error: statusError } = await (supabase
            .from('bin_status') as any)
            .upsert({
              bin_id: binId,
              fill_level_percentage: updateData.fill_level,
              last_updated: new Date().toISOString(),
              status: updateData.fill_level >= 90 ? 'full' : 
                     updateData.fill_level >= 75 ? 'normal' : 'normal'
            })

          if (statusError) {
            return NextResponse.json(
              { error: statusError.message },
              { status: 400 }
            )
          }
        }
        break

      case 'update_weight':
        if (updateData.weight_kg !== undefined) {
          const { error: updateError } = await (supabase
            .from('bins') as any)
            .update({ current_weight_kg: updateData.weight_kg })
            .eq('id', binId)

          if (updateError) {
            return NextResponse.json(
              { error: updateError.message },
              { status: 400 }
            )
          }
        }
        break

      case 'collect':
        // Reset bin status and weight
        const { error: collectError } = await (supabase
          .from('bins') as any)
          .update({ 
            current_weight_kg: 0,
            last_collected: new Date().toISOString()
          })
          .eq('id', binId)

        if (collectError) {
          return NextResponse.json(
            { error: collectError.message },
            { status: 400 }
          )
        }

        const { error: statusResetError } = await (supabase
          .from('bin_status') as any)
          .upsert({
            bin_id: binId,
            fill_level_percentage: 0,
            last_updated: new Date().toISOString(),
            status: 'normal'
          })

        if (statusResetError) {
          return NextResponse.json(
            { error: statusResetError.message },
            { status: 400 }
          )
        }
        break

      case 'simulate_fill':
        // IoT simulation - add random fill
        const randomIncrease = Math.floor(Math.random() * 15) + 5
        
        // Get current status
        const { data: currentStatus } = await (supabase
          .from('bin_status') as any)
          .select('fill_level_percentage')
          .eq('bin_id', binId)
          .single()

        const newFillLevel = Math.min(100, (currentStatus?.fill_level_percentage || 0) + randomIncrease)
        const newWeight = (bin.current_weight_kg || 0) + (randomIncrease * 2.5)

        // Update bin weight
        await (supabase
          .from('bins') as any)
          .update({ current_weight_kg: newWeight })
          .eq('id', binId)

        // Update bin status
        const { error: simError } = await (supabase
          .from('bin_status') as any)
          .upsert({
            bin_id: binId,
            fill_level_percentage: newFillLevel,
            battery_level: newFillLevel >= 75 ? 85 : 95,
            temperature: 25 + Math.random() * 10,
            humidity: 40 + Math.random() * 20,
            last_updated: new Date().toISOString(),
            status: newFillLevel >= 90 ? 'full' : 
                   newFillLevel >= 75 ? 'normal' : 'normal'
          })

        if (simError) {
          return NextResponse.json(
            { error: simError.message },
            { status: 400 }
          )
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Get updated bin data
    const { data: updatedBin } = await (supabase
      .from('bins') as any)
      .select(`
        *,
        bin_status (
          fill_level_percentage,
          battery_level,
          temperature,
          humidity,
          status,
          last_updated
        ),
        qr_locations (
          id,
          qr_code,
          location_name,
          address,
          latitude,
          longitude,
          waste_categories (
            id,
            name,
            bin_color
          )
        )
      `)
      .eq('id', binId)
      .single()

    return NextResponse.json({
      success: true,
      bin: updatedBin,
      message: `Bin ${binId} updated successfully`
    })
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

// IoT Simulation endpoint
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get all bins with their status
    const { data: bins, error: binsError } = await (supabase
      .from('bins') as any)
      .select(`
        *,
        bin_status (
          fill_level_percentage,
          battery_level,
          temperature,
          humidity,
          status,
          last_updated
        )
      `)

    if (binsError || !bins) {
      return NextResponse.json(
        { error: binsError?.message || 'Failed to fetch bins' },
        { status: 400 }
      )
    }

    // Simulate IoT updates for all bins
    const updatedBins = await Promise.all(
      bins.map(async (bin: any) => {
        const randomChange = Math.floor(Math.random() * 10) - 3 // Random change between -3 and +6
        const newFillLevel = Math.max(0, Math.min(100, (bin.bin_status?.fill_level_percentage || 0) + randomChange))
        const newWeight = Math.max(0, (bin.current_weight_kg || 0) + randomChange * 1.5)
        
        // Update bin weight
        await (supabase
          .from('bins') as any)
          .update({ current_weight_kg: newWeight })
          .eq('id', bin.id)

        // Update bin status
        const newStatus = newFillLevel >= 90 ? 'full' : 
                        newFillLevel >= 75 ? 'normal' : 'normal'
        
        await (supabase
          .from('bin_status') as any)
          .upsert({
            bin_id: bin.id,
            fill_level_percentage: newFillLevel,
            battery_level: newFillLevel >= 75 ? 85 : 95,
            temperature: 25 + Math.random() * 10,
            humidity: 40 + Math.random() * 20,
            last_updated: new Date().toISOString(),
            status: newStatus
          })

        return {
          ...bin,
          current_weight_kg: newWeight,
          bin_status: {
            ...bin.bin_status,
            fill_level_percentage: newFillLevel,
            battery_level: newFillLevel >= 75 ? 85 : 95,
            temperature: 25 + Math.random() * 10,
            humidity: 40 + Math.random() * 20,
            last_updated: new Date().toISOString(),
            status: newStatus
          }
        }
      })
    )

    // Find bins that need collection
    const binsNeedingCollection = updatedBins.filter(bin => bin.bin_status?.status === 'full')

    return NextResponse.json({
      success: true,
      bins: updatedBins,
      binsNeedingCollection: binsNeedingCollection,
      message: `IoT simulation completed. ${binsNeedingCollection.length} bins need collection.`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
