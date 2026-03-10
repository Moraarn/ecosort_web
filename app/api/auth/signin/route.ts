import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { FallbackAuth } from '@/lib/auth/fallback'

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

interface Profile {
  role: 'citizen' | 'admin'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = signinSchema.parse(body)

    // Try Supabase first, fallback to in-memory auth
    try {
      const supabase = await createServerClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (!data.user || !data.session) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Fetch user profile to get role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single() as { data: Profile | null, error: any }

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { 
          message: 'Signed in successfully',
          user: data.user,
          session: data.session,
          role: profile.role,
          redirectUrl: profile.role === 'admin' ? '/admin/overview' : '/dashboard'
        },
        { status: 200 }
      )
    } catch (supabaseError) {
      console.log('Supabase signin failed, using fallback auth:', supabaseError)
      
      // Use fallback authentication
      console.log('FallbackAuth: Attempting signin for email:', email)
      const { user, sessionToken } = await FallbackAuth.signIn(email, password)
      console.log('FallbackAuth: Signin successful, session token:', sessionToken.substring(0, 10) + '...')
      console.log('FallbackAuth: User role:', user.role)

      return NextResponse.json(
        {
          message: 'Signed in successfully with fallback auth',
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              full_name: user.fullName,
              phone: user.phone,
              role: user.role
            }
          },
          session: {
            access_token: sessionToken,
            expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
          },
          role: user.role,
          redirectUrl: user.role === 'admin' ? '/admin/overview' : '/dashboard'
        },
        { status: 200 }
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
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
