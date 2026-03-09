import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { FallbackAuth } from '@/lib/auth/fallback'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  role: z.enum(['citizen', 'admin']).default('citizen'),
  phone: z.string().optional(),
})

interface Profile {
  role: 'citizen' | 'admin'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, role, phone } = signupSchema.parse(body)

    // Try Supabase first, fallback to in-memory auth
    try {
      const supabase = await createServerClient()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            phone: phone,
          }
        }
      })

      if (error) {
        throw error
      }

      // Fetch user profile to get role for immediate login
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single() as { data: Profile | null, error: any }

        const userRole = profile?.role || role

        return NextResponse.json(
          { 
            message: 'User created and signed in successfully',
            user: data.user,
            session: data.session,
            role: userRole,
            redirectUrl: userRole === 'admin' ? '/admin/overview' : '/dashboard'
          },
          { status: 201 }
        )
      }

      return NextResponse.json(
        { 
          message: 'User created successfully. Please check your email to verify your account.',
          user: data.user,
          role: role,
          redirectUrl: role === 'admin' ? '/admin/overview' : '/dashboard'
        },
        { status: 201 }
      )
    } catch (supabaseError) {
      console.log('Supabase signup failed, using fallback auth:', supabaseError)
      
      // Use fallback authentication
      const { user, sessionToken } = await FallbackAuth.signUp(email, password, fullName, phone, role)

      return NextResponse.json(
        {
          message: 'User created successfully with fallback auth',
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
        { status: 201 }
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
