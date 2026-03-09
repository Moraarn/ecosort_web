import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

const recyclingKnowledge = {
  en: {
    batteries: {
      answer: "Batteries should be taken to special collection points or electronic waste recycling centers. Never put them in regular trash as they contain harmful chemicals.",
      category: "e-waste"
    },
    "plastic bags": {
      answer: "Most plastic bags cannot be recycled in regular recycling programs. Reuse them when possible, or return them to grocery store collection bins. Consider using reusable cloth bags instead.",
      category: "plastic"
    },
    "glass bottles": {
      answer: "Glass bottles should be rinsed and placed in the glass recycling bin. Remove caps and lids first. They can be recycled infinitely without losing quality.",
      category: "glass"
    },
    "food waste": {
      answer: "Food waste should go in organic/compost bins. If you have a garden, consider composting at home. Avoid putting food waste in regular trash as it creates methane in landfills.",
      category: "organic"
    },
    "electronics": {
      answer: "Electronic waste should be taken to e-waste recycling centers. Many electronics stores and manufacturers offer take-back programs. Never put electronics in regular trash.",
      category: "e-waste"
    },
    default: {
      answer: "For proper recycling guidance, identify the material type (plastic, paper, glass, metal, organic, or e-waste) and check your local recycling guidelines. When in doubt, contact your local waste management authority.",
      category: "general"
    }
  },
  sw: {
    batteries: {
      answer: "Betri zinapaswa kupelekwa kwenye vituo maalum vya kukusanya au vituo vya kutengeneza taka za kielektroniki. Kamwe usitupe kwenye taka za kawaida kwa sababu zina kemikali hatari.",
      category: "taka za kielektroniki"
    },
    "plastiki": {
      answer: "Mifuko ya plastiki mingi haiwezi kutengenezwa tena katika programu za kawaida za kutengeneza. Tumia tena iwezekanavyo, au rudisha kwenye vikapu vya kukusanya maduka. Fikiria kutumia mikuku ya nguo badala yake.",
      category: "plastiki"
    },
    "chupa za kioo": {
      answer: "Chupa za kioo zisafishwe na kuwekwa kwenye chombo cha kioo cha kutengeneza tena. Ondoa vifuniko na virango kwanza. Zinaweza kutengenezwa tena bila kiporo bila kupoteza ubora.",
      category: "kioo"
    },
    "taka za chakula": {
      answer: "Taka za chakula ziwekwe kwenye vikapu vya kiumbe/kunyunyizia. Ikiwa una bustani, fikiria kufanya kompost nyumbani. Epuka kuitupa taka za chakula kwenye taka za kawaida kwa sababu huzalisha methani kwenye maeneo ya taka.",
      category: "kiumbe"
    },
    default: {
      answer: "Kwa mwongozo wa kutengeneza vizuri, tambua aina ya nyenzo (plastiki, karatasi, kioo, chuma, kiumbe, au taka za kielektroniki) na angalia mwongozo wa kutengeneza wa eneo lako. Ikiwa una shaka, wasiliana na mamlaka yako ya usimamizi wa taka.",
      category: "jumla"
    }
  }
}

function findAnswer(query: string, language: string): { answer: string, category: string } {
  const knowledge = recyclingKnowledge[language as keyof typeof recyclingKnowledge] || recyclingKnowledge.en
  const lowerQuery = query.toLowerCase()
  
  // Check for specific keywords
  for (const [key, value] of Object.entries(knowledge)) {
    if (key !== 'default' && lowerQuery.includes(key)) {
      return value
    }
  }
  
  return knowledge.default
}

export async function POST(request: NextRequest) {
  try {
    const { message, language = 'en', context } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Find answer based on keywords
    const result = findAnswer(message, language)
    
    // Log the interaction for analytics
    const supabase = await createServerClient()
    try {
      await (supabase
        .from('chatbot_logs') as any)
        .insert({
          user_message: message,
          bot_response: result.answer,
          language: language,
          context: context,
          created_at: new Date().toISOString()
        })
    } catch (dbError) {
      // Log error but don't fail the response
      console.error('Failed to log chatbot interaction:', dbError)
    }

    return NextResponse.json({
      response: result.answer,
      category: result.category,
      language: language
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
