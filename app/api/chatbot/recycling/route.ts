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

function findRecyclingAnswer(query: string, language: string): { answer: string, category: string } | null {
  const knowledge = recyclingKnowledge[language as keyof typeof recyclingKnowledge] || recyclingKnowledge.en
  const lowerQuery = query.toLowerCase()
  
  // Check for specific recycling keywords
  for (const [key, value] of Object.entries(knowledge)) {
    if (lowerQuery.includes(key)) {
      return value
    }
  }
  
  return null
}

async function callOpenAI(message: string, context?: string, language: string = 'en'): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const systemPrompt = language === 'sw' 
    ? `Wewe ni msaada wa kipekee wa kupanga taka kwa EcoSort AI. Unajibu maswali kuhusu usimamizi wa taka, upangaji, na mazingira. Unatoa majibu mafupi na ya manufaa. Ikiwa swala halihusiani na usimamizi wa taka, jibu kwa njia ya kirafiki lakini rejesha mada kwa mazingira.`
    : `You are a helpful waste management assistant for EcoSort AI. You answer questions about waste management, recycling, and environmental topics. Provide concise, helpful responses. If the question is not related to waste management, answer helpfully but try to bring it back to environmental context.`

  const contextPrompt = context 
    ? `${language === 'sw' ? 'Mada ya sasa:' : 'Current context:'} ${context}. `
    : ''

  const userPrompt = `${contextPrompt}${message}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 150,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'Sorry, I could not process your request.'
}

export async function POST(request: NextRequest) {
  try {
    const { message, language = 'en', context } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let response: string
    let category: string = 'general'

    // First check if it's a specific recycling question
    const recyclingAnswer = findRecyclingAnswer(message, language)
    
    if (recyclingAnswer) {
      // Use recycling knowledge base for specific questions
      response = recyclingAnswer.answer
      category = recyclingAnswer.category
    } else {
      // Use OpenAI for general conversation
      try {
        response = await callOpenAI(message, context, language)
        category = 'ai-assisted'
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError)
        // Fallback to default recycling advice if OpenAI fails
        const fallbackKnowledge = recyclingKnowledge[language as keyof typeof recyclingKnowledge] || recyclingKnowledge.en
        response = fallbackKnowledge.default?.answer || 'I apologize, but I\'m having trouble connecting to my AI service. For proper recycling guidance, please identify the material type and check your local recycling guidelines.'
        category = 'fallback'
      }
    }
    
    // Log to database if available
    try {
      const supabase = await createServerClient()
      await (supabase
        .from('chatbot_logs') as any)
        .insert({
          user_message: message,
          bot_response: response,
          language: language,
          context: context,
          category: category,
          created_at: new Date().toISOString()
        })
    } catch (dbError) {
      console.log('Chatbot logging skipped (database unavailable):', (dbError as Error).message)
    }

    return NextResponse.json({
      response,
      category,
      language,
      source: recyclingAnswer ? 'knowledge-base' : 'openai'
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
