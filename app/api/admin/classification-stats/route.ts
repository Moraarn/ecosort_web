import { NextResponse } from 'next/server'

// Classification stats functionality has been removed
export async function GET() {
  return NextResponse.json({ 
    message: 'Classification stats functionality has been disabled',
    stats: {
      total_classifications: 0,
      this_week: 0,
      this_month: 0,
      recycling_rate: 0,
      most_classified_category: 'None'
    }
  })
}
