import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

// In-memory fallback storage for development
const fallbackBins: any[] = [
  {
    id: 1,
    name: "Central Park Bin",
    status: "Active",
    progress: 75,
    wasteType: "Mixed",
    lastSync: "2 mins ago",
    location: "Central Park",
    lat: 40.7829,
    lng: -73.9654,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Downtown Plaza Bin",
    status: "Active",
    progress: 45,
    wasteType: "Plastic",
    lastSync: "5 mins ago",
    location: "Downtown Plaza",
    lat: 40.7128,
    lng: -74.0060,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Airport Terminal Bin",
    status: "Warning",
    progress: 92,
    wasteType: "Mixed",
    lastSync: "1 min ago",
    location: "Airport Terminal",
    lat: 40.6413,
    lng: -73.7781,
    alerts: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: "University Campus Bin",
    status: "Active",
    progress: 30,
    wasteType: "Paper",
    lastSync: "3 mins ago",
    location: "University Campus",
    lat: 40.8075,
    lng: -73.9626,
    alerts: 0,
    created_at: new Date().toISOString()
  }
]

const binSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  wasteType: z.enum(['Mixed', 'Plastic', 'Paper', 'Organic', 'Metal', 'Glass', 'E-waste']),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

// GET - Fetch all smart bins
export async function GET(request: NextRequest) {
  try {
    // Try Supabase first
    try {
      const supabase = await createServerClient()
      
      const { data, error } = await supabase
        .from('smart_bins')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return NextResponse.json({ bins: data }, { status: 200 })
    } catch (supabaseError) {
      console.log('Supabase smart bins fetch failed, using fallback:', supabaseError)
      
      // Use fallback data
      return NextResponse.json({ bins: fallbackBins }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch smart bins' },
      { status: 500 }
    )
  }
}

// POST - Create new smart bin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = binSchema.parse(body)

    const newBin = {
      ...validatedData,
      status: "Active",
      progress: 0,
      alerts: 0,
      lastSync: "Just now",
      created_at: new Date().toISOString()
    }

    // Try Supabase first
    try {
      const supabase = await createServerClient()
      
      const { data, error } = await supabase
        .from('smart_bins')
        .insert(newBin)
        .select()
        .single()

      if (error) {
        throw error
      }

      return NextResponse.json({ bin: data }, { status: 201 })
    } catch (supabaseError) {
      console.log('Supabase smart bin creation failed, using fallback:', supabaseError)
      
      // Use fallback storage
      const fallbackBin = {
        ...newBin,
        id: fallbackBins.length + 1
      }
      fallbackBins.push(fallbackBin)
      
      return NextResponse.json({ bin: fallbackBin }, { status: 201 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create smart bin' },
      { status: 500 }
    )
  }
}

// PUT - Update smart bin
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const validatedData = binSchema.partial().parse(updateData)

    // Try Supabase first
    try {
      const supabase = await createServerClient()
      
      const { data, error } = await supabase
        .from('smart_bins')
        .update(validatedData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return NextResponse.json({ bin: data }, { status: 200 })
    } catch (supabaseError) {
      console.log('Supabase smart bin update failed, using fallback:', supabaseError)
      
      // Use fallback storage
      const binIndex = fallbackBins.findIndex((bin) => bin.id === id)
      if (binIndex === -1) {
        return NextResponse.json(
          { error: 'Smart bin not found' },
          { status: 404 }
        )
      }
      
      fallbackBins[binIndex] = { ...fallbackBins[binIndex], ...validatedData }
      
      return NextResponse.json({ bin: fallbackBins[binIndex] }, { status: 200 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update smart bin' },
      { status: 500 }
    )
  }
}

// DELETE - Delete smart bin
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = parseInt(url.searchParams.get('id') || '0')

    if (!id) {
      return NextResponse.json(
        { error: 'Bin ID is required' },
        { status: 400 }
      )
    }

    // Try Supabase first
    try {
      const supabase = await createServerClient()
      
      const { error } = await supabase
        .from('smart_bins')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return NextResponse.json({ message: 'Smart bin deleted successfully' }, { status: 200 })
    } catch (supabaseError) {
      console.log('Supabase smart bin deletion failed, using fallback:', supabaseError)
      
      // Use fallback storage
      const binIndex = fallbackBins.findIndex((bin) => bin.id === id)
      if (binIndex === -1) {
        return NextResponse.json(
          { error: 'Smart bin not found' },
          { status: 404 }
        )
      }
      
      fallbackBins.splice(binIndex, 1)
      
      return NextResponse.json({ message: 'Smart bin deleted successfully' }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete smart bin' },
      { status: 500 }
    )
  }
}
