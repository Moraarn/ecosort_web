import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const classifySchema = z.object({
  image_url: z.string().url().optional(),
  waste_category_id: z.number(),
  confidence_score: z.number().min(0).max(1),
  qr_location_id: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image_url, waste_category_id, confidence_score, qr_location_id } = classifySchema.parse(body)

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get waste category to determine points
    const { data: category, error: categoryError } = await (supabase
      .from('waste_categories') as any)
      .select('points_value, name')
      .eq('id', waste_category_id)
      .single()

    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Invalid waste category' },
        { status: 400 }
      )
    }

    // Create waste log
    const { data: wasteLog, error: logError } = await (supabase
      .from('waste_logs') as any)
      .insert({
        user_id: user.id,
        image_url,
        waste_category_id,
        confidence_score,
        qr_location_id,
        points_earned: (category as any).points_value,
        verified: confidence_score >= 0.7,
        disposal_timestamp: new Date().toISOString(),
      })
      .select(`
        *,
        waste_categories (
          id,
          name,
          bin_color,
          points_value,
          disposal_instructions,
          environmental_impact
        )
      `)
      .single()

    if (logError || !wasteLog) {
      return NextResponse.json(
        { error: logError?.message || 'Failed to create waste log' },
        { status: 400 }
      )
    }

    // Award points using database function
    if (wasteLog.verified) {
      const { error: rewardError } = await (supabase
        .from('rewards') as any)
        .insert({
          user_uuid: user.id,
          waste_log_uuid: wasteLog.id,
          points: (category as any).points_value,
          description: `Recycled ${(category as any).name} - ${(category as any).points_value} points`
        })

      if (rewardError) {
        console.error('Failed to award points:', rewardError)
      }
    }

    return NextResponse.json(
      { 
        success: true,
        waste_log: wasteLog,
        points_earned: wasteLog.verified ? category.points_value : 0,
        verified: wasteLog.verified,
        category: wasteLog.waste_categories
      },
      { status: 201 }
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
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: wasteLogs, error } = await (supabase
      .from('waste_logs') as any)
      .select(`
        *,
        waste_categories (
          name,
          bin_color
        ),
        qr_locations (
          id,
          location_name,
          address
        )
      `)
      .eq('user_id', user.id)
      .order('disposal_timestamp', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { waste_logs: wasteLogs },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
