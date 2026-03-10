import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/supabase/server'
import { FallbackAuth } from '@/lib/auth/fallback'

export async function GET(request: NextRequest) {
  try {
    console.log('=== /API/AUTH/ME DEBUG ===')
    
    // Try Supabase first
    try {
      const user = await getServerUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      console.log('✅ Supabase auth successful')
      return NextResponse.json(
        { user },
        { status: 200 }
      )
    } catch (supabaseError) {
      console.log('❌ Supabase auth check failed, trying fallback:', supabaseError)
      
      // Try fallback authentication
      const authHeader = request.headers.get('authorization')
      const cookieHeader = request.headers.get('cookie')
      
      console.log('Auth headers:', { 
        authHeader: authHeader?.substring(0, 20) + '...', 
        cookieHeader: cookieHeader?.substring(0, 50) + '...' 
      })
      
      let token = authHeader?.replace('Bearer ', '')
      
      // If no token in header, try to get from cookies
      if (!token && cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc: any, cookie: string) => {
          const [key, value] = cookie.trim().split('=')
          acc[key] = value
          return acc
        }, {})
        token = cookies.auth_token
        console.log('Token from cookies:', token?.substring(0, 10) + '...')
      }
      
      if (!token) {
        console.log('❌ No token found in headers or cookies')
        return NextResponse.json(
          { error: 'Not authenticated - no token found' },
          { status: 401 }
        )
      }

      console.log('Trying fallback auth with token:', token.substring(0, 10) + '...')
      const user = await FallbackAuth.getUserBySession(token)
      
      if (!user) {
        console.log('❌ Invalid or expired token')
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      console.log('✅ Fallback auth successful for user:', { id: user.id, email: user.email, role: user.role })

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
    console.log('❌ Internal server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
