import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, requireAdmin } from '@/lib/supabase/server'
import { z } from 'zod'

const adminActionSchema = z.object({
  action: z.enum(['update_bin_status', 'generate_report', 'export_data']),
  data: z.any().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    await requireAdmin() // Ensure user is admin

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || 'week'
    const type = searchParams.get('type') || 'overview'

    let data

    switch (type) {
      case 'overview':
        // Get overview statistics
        const [
          { count: totalUsers },
          { count: totalDisposals },
          { data: todayDisposals },
          { data: accuracyData },
          { data: pointsData },
          { data: newUsersData }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('waste_logs').select('*', { count: 'exact', head: true }),
          supabase.from('waste_logs').select('*', { count: 'exact' }).eq('disposal_timestamp', new Date().toISOString().split('T')[0]),
          supabase.from('waste_logs').select('confidence_score'),
          supabase.from('rewards').select('points'),
          supabase.from('profiles').select('created_at').eq('created_at', new Date().toISOString().split('T')[0])
        ])

        const avgAccuracy = accuracyData?.reduce((sum, log) => sum + (log.confidence_score || 0), 0) / (accuracyData?.length || 1) * 100
        const totalPoints = pointsData?.reduce((sum, reward) => sum + reward.points, 0) || 0

        data = {
          totalUsers,
          totalDisposals,
          todayDisposals: todayDisposals?.length || 0,
          averageAccuracy: avgAccuracy,
          totalPointsAwarded: totalPoints,
          newUsersToday: newUsersData?.length || 0
        }
        break

      case 'waste':
        // Get waste category analytics
        const { data: wasteAnalytics } = await supabase
          .from('waste_analytics')
          .select('*')
          .order('disposal_date', { ascending: false })
          .limit(timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365)

        // Aggregate by category
        const categoryStats = wasteAnalytics?.reduce((acc, item) => {
          const existing = acc.find(stat => stat.category === item.category_name)
          if (existing) {
            existing.count += item.total_disposals
            existing.totalPoints += item.total_points || 0
          } else {
            acc.push({
              category: item.category_name,
              count: item.total_disposals,
              totalPoints: item.total_points || 0,
              avgConfidence: item.avg_confidence || 0
            })
          }
          return acc
        }, []) || []

        data = { wasteAnalytics: categoryStats }
        break

      case 'timeseries':
        // Get time series data
        const daysBack = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - daysBack)

        const { data: timeSeriesData } = await supabase
          .from('waste_logs')
          .select('disposal_timestamp, confidence_score')
          .gte('disposal_timestamp', startDate.toISOString())

        // Group by date
        const groupedData = timeSeriesData?.reduce((acc, log) => {
          const date = log.disposal_timestamp.split('T')[0]
          const existing = acc.find(item => item.date === date)
          if (existing) {
            existing.disposals += 1
            existing.accuracy = (existing.accuracy + (log.confidence_score || 0)) / 2
          } else {
            acc.push({
              date,
              disposals: 1,
              accuracy: log.confidence_score || 0
            })
          }
          return acc
        }, []) || []

        data = { timeSeriesData: groupedData }
        break

      case 'locations':
        // Get location analytics
        const { data: locationAnalytics } = await supabase
          .from('qr_locations')
          .select(`
            *,
            bins (
              *,
              bin_status (
                fill_level_percentage,
                status
              )
            ),
            waste_logs(count)
          `)

        data = {
          locationAnalytics: locationAnalytics?.map(location => ({
            id: location.id,
            location_name: location.location_name,
            address: location.address,
            total_disposals: location.waste_logs?.length || 0,
            avg_fill_level: location.bins?.reduce((sum, bin) => sum + (bin.bin_status?.fill_level_percentage || 0), 0) / (location.bins?.length || 1),
            status: location.bins?.some(bin => bin.bin_status?.status === 'full') ? 'full' : 'normal'
          })) || []
        }
        break

      case 'users':
        // Get user analytics
        const { data: userAnalytics } = await supabase
          .from('user_analytics')
          .select('*')
          .order('total_points', { ascending: false })
          .limit(100)

        data = { userAnalytics }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      timeframe,
      type,
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    await requireAdmin() // Ensure user is admin

    const body = await request.json()
    const { action, data } = adminActionSchema.parse(body)

    switch (action) {
      case 'update_bin_status':
        if (!data?.binId || !data?.status) {
          return NextResponse.json(
            { error: 'Bin ID and status are required' },
            { status: 400 }
          )
        }

        const { error: updateError } = await supabase
          .from('bin_status')
          .upsert({
            bin_id: data.binId,
            status: data.status,
            last_updated: new Date().toISOString()
          })

        if (updateError) {
          return NextResponse.json(
            { error: updateError.message },
            { status: 400 }
          )
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Bin status updated successfully' 
        })
      
      case 'generate_report':
        // In production, generate actual PDF report
        return NextResponse.json({ 
          success: true, 
          reportUrl: `/reports/analytics-${Date.now()}.pdf`,
          message: 'Report generated successfully'
        })
      
      case 'export_data':
        // In production, generate actual CSV export
        return NextResponse.json({ 
          success: true, 
          downloadUrl: `/exports/data-${Date.now()}.csv`,
          message: 'Data exported successfully'
        })
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

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
