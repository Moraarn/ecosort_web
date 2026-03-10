import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { FallbackAuth } from '@/lib/auth/fallback'

export async function GET(request: NextRequest) {
  try {
    // Debug: Log authentication headers
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    console.log('Auth headers:', { authHeader: authHeader?.substring(0, 20) + '...', cookieHeader: cookieHeader?.substring(0, 50) + '...' })
    
    // Try to get user from Supabase first
    let user = null
    let isAdmin = false

    try {
      const supabase = await createServerClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Check if user has admin profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single() as { data: { role: string } | null, error: any }
        
        if (profile && profile.role === 'admin') {
          user = authUser
          isAdmin = true
          console.log('Supabase admin authentication successful')
        }
      }
    } catch (supabaseError) {
      console.log('Supabase auth check failed, trying fallback:', supabaseError)
    }

    // If Supabase failed, try fallback auth
    if (!isAdmin) {
      try {
        const fallbackUser = await FallbackAuth.getCurrentUser(request)
        console.log('Fallback auth result:', fallbackUser ? { id: fallbackUser.id, email: fallbackUser.email, role: fallbackUser.role } : 'No user found')
        
        if (fallbackUser && fallbackUser.role === 'admin') {
          isAdmin = true
          console.log('Using fallback admin authentication')
        }
      } catch (fallbackError) {
        console.log('Fallback auth check failed:', fallbackError)
      }
    }

    if (!isAdmin) {
      console.log('Admin access denied - user not found or not admin')
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Fetch users from database or fallback
    let users = []
    
    try {
      const supabase = await createServerClient()
      const { searchParams } = new URL(request.url)
      const limit = parseInt(searchParams.get('limit') || '50')
      const offset = parseInt(searchParams.get('offset') || '0')
      const search = searchParams.get('search')

      let query = (supabase
        .from('profiles') as any)
        .select(`
          *,
          waste_logs(count),
          rewards(points)
        `)
        .order('total_points', { ascending: false })
        .range(offset, offset + limit - 1)

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
      }

      const { data: dbUsers, error } = await query

      if (!error && dbUsers) {
        users = dbUsers.map((user: any) => ({
          ...(user as any),
          total_disposals: (user as any).waste_logs?.length || 0,
          total_rewards: ((user as any).rewards || []).reduce((sum: number, reward: any) => sum + (reward.points || 0), 0) || 0
        }))
        console.log('Successfully fetched users from Supabase:', users.length)
      } else {
        throw error || new Error('No users found in database')
      }
    } catch (dbError) {
      console.log('Database fetch failed, using fallback users:', dbError)
      // Use fallback users
      users = FallbackAuth.getAllUsers().map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        role: user.role,
        total_points: user.totalPoints,
        created_at: user.createdAt,
        total_disposals: 0,
        total_rewards: 0
      }))
    }

    return NextResponse.json({
      success: true,
      users,
      total: users.length
    })
  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication (same logic as GET)
    let isAdmin = false

    try {
      const supabase = await createServerClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single() as { data: { role: string } | null, error: any }
        
        if (profile && profile.role === 'admin') {
          isAdmin = true
        }
      }
    } catch (supabaseError) {
      console.log('Supabase auth check failed in PUT, trying fallback:', supabaseError)
    }

    if (!isAdmin) {
      try {
        const fallbackUser = await FallbackAuth.getCurrentUser(request)
        if (fallbackUser && fallbackUser.role === 'admin') {
          isAdmin = true
        }
      } catch (fallbackError) {
        console.log('Fallback auth check failed in PUT:', fallbackError)
      }
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      )
    }

    if (!['user', 'admin', 'moderator'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Try Supabase first
    try {
      const supabase = await createServerClient()
      
      const { data: user, error } = await (supabase
        .from('profiles') as any)
        .update({ role })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        user,
        message: `User role updated to ${role}`
      })
    } catch (supabaseError) {
      console.log('Supabase role update failed, trying fallback:', supabaseError)
      
      // Use fallback storage
      const allUsers = FallbackAuth.getAllUsers()
      const targetUser = allUsers.find(u => u.id === userId)
      
      if (targetUser) {
        targetUser.role = role as 'citizen' | 'admin'
        return NextResponse.json({
          success: true,
          user: {
            id: targetUser.id,
            email: targetUser.email,
            full_name: targetUser.fullName,
            role: targetUser.role,
            total_points: targetUser.totalPoints,
            created_at: targetUser.createdAt
          },
          message: `User role updated to ${role} (fallback)`
        })
      } else {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
    }
  } catch (error) {
    console.error('Users PUT API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
