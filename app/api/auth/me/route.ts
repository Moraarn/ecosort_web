import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/supabase/server'
import { FallbackAuth } from '@/lib/auth/fallback'

export async function GET(request: NextRequest) {
  try {
    // Try Supabase first
    try {
      const user = await getServerUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      return NextResponse.json(
        { user },
        { status: 200 }
      )
    } catch (supabaseError) {
      console.log('Supabase auth check failed, trying fallback:', supabaseError)
      
      // Try fallback authentication
      const authHeader = request.headers.get('authorization')
      const token = authHeader?.replace('Bearer ', '')
      
      if (!token) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        )
      }

      const user = await FallbackAuth.getUserBySession(token)
      
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Convert fallback user to expected format
      const formattedUser = {
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.fullName,
          phone: user.phone,
          role: user.role
        },
        role: user.role,
        total_points: user.totalPoints
      }

      return NextResponse.json(
        { user: formattedUser },
        { status: 200 }
      )
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
