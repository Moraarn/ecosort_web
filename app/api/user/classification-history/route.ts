import { NextResponse } from 'next/server'

// Classification history functionality has been removed
export async function GET() {
  return NextResponse.json({ 
    message: 'Classification history functionality has been disabled',
    classifications: []
  })
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Classification history functionality has been disabled',
    error: 'This endpoint is no longer available'
  }, { status: 404 })
}
