import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

// In-memory fallback storage for development
const fallbackBins: any[] = [
  {
    id: 1,
    name: "Nairobi Central Bin",
    status: "Active",
    progress: 75,
    wasteType: "Mixed",
    lastSync: "2 mins ago",
    location: "Nairobi Central, Kenya",
    lat: -1.2921,
    lng: 36.8219,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Kampala Plaza Bin",
    status: "Active",
    progress: 45,
    wasteType: "Plastic",
    lastSync: "5 mins ago",
    location: "Kampala Plaza, Uganda",
    lat: 0.3476,
    lng: 32.5825,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Mombasa Port Bin",
    status: "Warning",
    progress: 92,
    wasteType: "Mixed",
    lastSync: "1 min ago",
    location: "Mombasa Port, Kenya",
    lat: -4.0435,
    lng: 39.6682,
    alerts: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: "Entebbe Airport Bin",
    status: "Active",
    progress: 30,
    wasteType: "Paper",
    lastSync: "3 mins ago",
    location: "Entebbe Airport, Uganda",
    lat: 0.0434,
    lng: 32.4435,
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
      
      const { data, error } = await (supabase
        .from('smart_bins') as any)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase smart bins fetch error:', error)
        throw error
      }

      console.log('Successfully fetched smart bins from Supabase:', data?.length || 0)
      return NextResponse.json({ bins: data }, { status: 200 })
    } catch (supabaseError) {
      console.log('Supabase smart bins fetch failed, using fallback:', supabaseError)
      
      // Use fallback data
      return NextResponse.json({ bins: fallbackBins }, { status: 200 })
    }
  } catch (error) {
    console.error('Smart bins GET error:', error)
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
    console.log('Creating smart bin with data:', body)
    
    const validatedData = binSchema.parse(body)

    const newBin = {
      ...validatedData,
      status: "Active",
      progress: 0,
      alerts: 0,
      lastSync: "Just now",
      created_at: new Date().toISOString()
    }

    console.log('Processed new bin data:', newBin)

    // Try Supabase first
    try {
      const supabase = await createServerClient()
      
      const { data, error } = await (supabase
        .from('smart_bins') as any)
        .insert(newBin)
        .select()
        .single()

      if (error) {
        console.error('Supabase smart bin creation error:', error)
        throw error
      }

      console.log('Successfully created smart bin in Supabase:', data)
      return NextResponse.json({ bin: data }, { status: 201 })
    } catch (supabaseError) {
      console.log('Supabase smart bin creation failed, using fallback:', supabaseError)
      
      // Use fallback storage
      const fallbackBin = {
        ...newBin,
        id: fallbackBins.length + 1
      }
      fallbackBins.push(fallbackBin)
      
      console.log('Created smart bin in fallback storage:', fallbackBin)
      return NextResponse.json({ bin: fallbackBin }, { status: 201 })
    }
  } catch (error) {
    console.error('Smart bins POST error:', error)
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
      
      const { data, error } = await (supabase
        .from('smart_bins') as any)
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
      
      const { error } = await (supabase
        .from('smart_bins') as any)
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
