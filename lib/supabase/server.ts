import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from '../../types/database'

export async function createServerClient() {
  const cookieStore = cookies()
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Cookie: cookieStore.toString()
        }
      }
    }
  )
}

export async function getServerUser() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getServerUserProfile() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile as Database['public']['Tables']['profiles']['Row'] | null
}

export async function requireAuth() {
  const user = await getServerUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireAdmin() {
  const profile = await getServerUserProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Admin access required')
  }
  return profile
}
