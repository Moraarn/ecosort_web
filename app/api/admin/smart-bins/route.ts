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
  },
  {
    id: 5,
    name: "Kisumu Market Bin",
    status: "Active",
    progress: 60,
    wasteType: "Organic",
    lastSync: "4 mins ago",
    location: "Kisumu Market, Kenya",
    lat: -0.0917,
    lng: 34.7680,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: "Jinja Town Square Bin",
    status: "Active",
    progress: 55,
    wasteType: "Glass",
    lastSync: "6 mins ago",
    location: "Jinja Town Square, Uganda",
    lat: 0.4242,
    lng: 33.2045,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    name: "Nakuru Business District Bin",
    status: "Warning",
    progress: 88,
    wasteType: "Mixed",
    lastSync: "2 mins ago",
    location: "Nakuru Business District, Kenya",
    lat: -0.3031,
    lng: 36.0695,
    alerts: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    name: "Mbale Central Market Bin",
    status: "Active",
    progress: 40,
    wasteType: "Plastic",
    lastSync: "7 mins ago",
    location: "Mbale Central Market, Uganda",
    lat: 1.0771,
    lng: 34.1805,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    name: "Eldoret Mall Bin",
    status: "Active",
    progress: 35,
    wasteType: "Paper",
    lastSync: "5 mins ago",
    location: "Eldoret Mall, Kenya",
    lat: 0.5143,
    lng: 35.2698,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 10,
    name: "Gulu Municipal Bin",
    status: "Active",
    progress: 70,
    wasteType: "Metal",
    lastSync: "3 mins ago",
    location: "Gulu Municipal, Uganda",
    lat: 2.7746,
    lng: 32.2989,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 11,
    name: "Thika Road Mall Bin",
    status: "Active",
    progress: 50,
    wasteType: "E-waste",
    lastSync: "4 mins ago",
    location: "Thika Road Mall, Kenya",
    lat: -1.2209,
    lng: 36.9256,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 12,
    name: "Mukono Town Center Bin",
    status: "Active",
    progress: 65,
    wasteType: "Organic",
    lastSync: "6 mins ago",
    location: "Mukono Town Center, Uganda",
    lat: 0.3545,
    lng: 32.7525,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 13,
    name: "Kitale Market Bin",
    status: "Active",
    progress: 45,
    wasteType: "Glass",
    lastSync: "8 mins ago",
    location: "Kitale Market, Kenya",
    lat: 1.0150,
    lng: 35.0063,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 14,
    name: "Arua Park Bin",
    status: "Active",
    progress: 38,
    wasteType: "Plastic",
    lastSync: "5 mins ago",
    location: "Arua Park, Uganda",
    lat: 3.0050,
    lng: 30.9114,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 15,
    name: "Garissa County Bin",
    status: "Active",
    progress: 55,
    wasteType: "Mixed",
    lastSync: "7 mins ago",
    location: "Garissa County, Kenya",
    lat: -0.5291,
    lng: 39.6397,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 16,
    name: "Lira City Square Bin",
    status: "Active",
    progress: 42,
    wasteType: "Paper",
    lastSync: "4 mins ago",
    location: "Lira City Square, Uganda",
    lat: 2.2472,
    lng: 32.9004,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 17,
    name: "Machakos Town Bin",
    status: "Warning",
    progress: 85,
    wasteType: "Organic",
    lastSync: "2 mins ago",
    location: "Machakos Town, Kenya",
    lat: -1.5168,
    lng: 37.2635,
    alerts: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 18,
    name: "Masaka Central Bin",
    status: "Active",
    progress: 48,
    wasteType: "Metal",
    lastSync: "6 mins ago",
    location: "Masaka Central, Uganda",
    lat: -0.3366,
    lng: 31.5405,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 19,
    name: "Nyeri Town Center Bin",
    status: "Active",
    progress: 33,
    wasteType: "Glass",
    lastSync: "5 mins ago",
    location: "Nyeri Town Center, Kenya",
    lat: -0.4201,
    lng: 36.9476,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 20,
    name: "Fort Portal City Bin",
    status: "Active",
    progress: 58,
    wasteType: "E-waste",
    lastSync: "3 mins ago",
    location: "Fort Portal City, Uganda",
    lat: 0.6602,
    lng: 30.2748,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 21,
    name: "Kakamega Market Bin",
    status: "Active",
    progress: 52,
    wasteType: "Plastic",
    lastSync: "4 mins ago",
    location: "Kakamega Market, Kenya",
    lat: 0.2842,
    lng: 34.7529,
    alerts: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 22,
    name: "Soroti Municipal Bin",
    status: "Active",
    progress: 46,
    wasteType: "Mixed",
    lastSync: "7 mins ago",
    location: "Soroti Municipal, Uganda",
    lat: 1.3693,
    lng: 33.6041,
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
