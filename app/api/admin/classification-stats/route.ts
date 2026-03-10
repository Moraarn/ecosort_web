import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('sb-access-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user token and check if admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get all classifications
    const { data: classifications, error } = await supabase
      .from('classification_history')
      .select('*')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }

    // Calculate stats
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const thisWeek = classifications?.filter(c => 
      new Date(c.created_at) >= oneWeekAgo
    ).length || 0

    const thisMonth = classifications?.filter(c => 
      new Date(c.created_at) >= oneMonthAgo
    ).length || 0

    // Calculate recycling rate (items classified as recyclable)
    const recyclableCategories = ['Plastic', 'Paper', 'Glass', 'Metal']
    const recyclableCount = classifications?.filter(c => 
      recyclableCategories.includes(c.classification_result.category.name)
    ).length || 0

    const recyclingRate = classifications?.length > 0 
      ? Math.round((recyclableCount / classifications.length) * 100)
      : 0

    // Find most classified category
    const categoryCounts: { [key: string]: number } = {}
    classifications?.forEach(c => {
      const category = c.classification_result.category.name
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })

    const mostClassifiedCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'

    const stats = {
      total_classifications: classifications?.length || 0,
      this_week: thisWeek,
      this_month: thisMonth,
      recycling_rate: recyclingRate,
      most_classified_category: mostClassifiedCategory
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
