import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)

    const categoryId = searchParams.get('category_id')
    
    let query = supabase
      .from('waste_categories')
      .select('*')
      .order('name')

    if (categoryId) {
      query = query.eq('id', parseInt(categoryId))
    }

    const { data: categories, error } = await query

    if (error) {
      console.error('Database error:', error)
      // Return default categories if database fails
      const defaultCategories = [
        {
          id: 1,
          name: 'Plastic',
          description: 'Plastic bottles, containers, bags, and packaging materials',
          bin_color: 'Blue',
          disposal_instructions: 'Clean and dry plastics. Remove caps and rings. Check recycling number 1-7.',
          environmental_impact: 'Takes 450+ years to decompose, harms marine life',
          points_value: 10,
          icon_url: '/icons/plastic.png',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Paper',
          description: 'Newspapers, cardboard, office paper, and paper products',
          bin_color: 'Green',
          disposal_instructions: 'Keep dry and clean. Remove plastic windows from envelopes. Flatten cardboard boxes.',
          environmental_impact: 'Saves trees, reduces landfill space',
          points_value: 8,
          icon_url: '/icons/paper.png',
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Metal',
          description: 'Aluminum cans, steel cans, foil, and metal containers',
          bin_color: 'Yellow',
          disposal_instructions: 'Rinse containers. Crush cans to save space. Remove food residue.',
          environmental_impact: 'Infinitely recyclable, saves energy vs new production',
          points_value: 12,
          icon_url: '/icons/metal.png',
          created_at: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Glass',
          description: 'Glass bottles, jars, and other glass containers',
          bin_color: 'Red',
          disposal_instructions: 'Rinse and remove lids. Separate by color if required. No broken glass.',
          environmental_impact: '100% recyclable, can be recycled endlessly',
          points_value: 15,
          icon_url: '/icons/glass.png',
          created_at: new Date().toISOString()
        },
        {
          id: 5,
          name: 'Organic',
          description: 'Food waste, yard waste, and compostable materials',
          bin_color: 'Brown',
          disposal_instructions: 'Compost food scraps and yard waste. No meat or dairy in home compost.',
          environmental_impact: 'Reduces methane, creates nutrient-rich soil',
          points_value: 5,
          icon_url: '/icons/organic.png',
          created_at: new Date().toISOString()
        },
        {
          id: 6,
          name: 'E-waste',
          description: 'Electronic devices, batteries, and electrical equipment',
          bin_color: 'Purple',
          disposal_instructions: 'Take to special e-waste facilities. Remove batteries. Do not put in regular trash.',
          environmental_impact: 'Contains toxic materials, valuable for recycling',
          points_value: 20,
          icon_url: '/icons/ewaste.png',
          created_at: new Date().toISOString()
        }
      ]
      
      return NextResponse.json(
        { categories: defaultCategories },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { categories },
      { status: 200 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
