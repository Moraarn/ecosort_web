import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const createRewardSchema = z.object({
  points: z.number(),
  transaction_type: z.enum(['earned', 'redeemed', 'bonus']).default('earned'),
  description: z.string().optional(),
  waste_log_id: z.string().uuid().optional(),
})

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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get user's rewards
    const { data: rewards, error: rewardsError } = await (supabase
      .from('rewards') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (rewardsError) {
      return NextResponse.json(
        { error: rewardsError.message },
        { status: 400 }
      )
    }

    // Get user's achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (
          name,
          description,
          icon,
          badge_color
        )
      `)
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false })

    if (achievementsError) {
      return NextResponse.json(
        { error: achievementsError.message },
        { status: 400 }
      )
    }

    // Get leaderboard
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .order('rank_position', { ascending: true })
      .limit(10)

    if (leaderboardError) {
      return NextResponse.json(
        { error: leaderboardError.message },
        { status: 400 }
      )
    }

    // Get user's profile for points
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      )
    }

    // Calculate time-based points
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const weeklyPoints = (rewards as any[] || []).filter((r: any) => new Date(r.created_at) > weekAgo)
      .reduce((sum: number, reward: any) => sum + (reward.points || 0), 0) || 0

    const monthlyPoints = (rewards as any[] || []).filter((r: any) => new Date(r.created_at) > monthAgo)
      .reduce((sum: number, reward: any) => sum + (reward.points || 0), 0) || 0

    // Get user's rank from leaderboard
    const userRank = (leaderboard as any[])?.find((entry: any) => entry.user_id === user.id)

    return NextResponse.json({
      success: true,
      wallet: {
        totalPoints: (profile as any)?.total_points || 0,
        weeklyPoints,
        monthlyPoints,
        totalDisposals: (rewards as any[] || []).length || 0,
        rankPosition: userRank?.rank_position || null,
      },
      rewards,
      achievements,
      leaderboard: (leaderboard as any[] || []).map((entry: any) => ({
        profiles: (leaderboard as any[] || []).slice(0, 3).map((entry: any) => ({
          name: entry.profiles?.full_name,
          points: entry.total_points,
          rank: entry.rank_position
        })),
        monthlyPoints: entry.monthly_points,
        isUser: entry.user_id === user.id
      })) || []
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
    const rewardData = createRewardSchema.parse(body)

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Create reward record
    const { data: reward, error: rewardError } = await (supabase
      .from('rewards') as any)
      .insert({
        user_id: user.id,
        points: rewardData.points,
        transaction_type: rewardData.transaction_type,
        description: rewardData.description,
        waste_log_id: rewardData.waste_log_id,
      })
      .select()
      .single()

    if (rewardError || !reward) {
      return NextResponse.json(
        { error: rewardError?.message || 'Failed to create reward' },
        { status: 400 }
      )
    }

    // Update user points using database function
    const { error: pointsError } = await (supabase.rpc as any)('update_user_points', {
      user_uuid: user.id
    })

    if (pointsError) {
      console.error('Failed to update user points:', pointsError)
    }

    return NextResponse.json({
      success: true,
      reward,
      message: 'Reward created successfully'
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
