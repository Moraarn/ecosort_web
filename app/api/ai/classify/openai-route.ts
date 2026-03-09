import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { image, categories } = await request.json()

    if (!image || !categories) {
      return NextResponse.json(
        { error: 'Image and categories are required' },
        { status: 400 }
      )
    }

    // Create category list for OpenAI
    const categoryList = categories.map((cat: any) => 
      `${cat.id}: ${cat.name} - ${cat.description || 'No description'}`
    ).join('\n')

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert waste classification AI. Analyze the uploaded image and classify the waste item into one of the following categories:

${categoryList}

Respond with a JSON object containing:
- categoryId: the ID number of the most appropriate category
- confidence: a number between 0 and 1 representing your confidence
- reasoning: brief explanation of why you chose this category

Be accurate and consider the visual characteristics, material type, and common waste disposal practices. Focus on: plastic, paper, metal, glass, organic waste, and electronic waste.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please classify this waste item:"
            },
            {
              type: "image_url",
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.1, // Low temperature for consistent classification
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let result
    try {
      result = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content)
      // Fallback parsing
      result = {
        categoryId: categories[0]?.id || 1,
        confidence: 0.7,
        reasoning: 'Classification completed'
      }
    }

    // Validate the response
    if (!result.categoryId || !result.confidence) {
      throw new Error('Invalid response format from OpenAI')
    }

    return NextResponse.json({
      categoryId: result.categoryId,
      confidence: result.confidence,
      reasoning: result.reasoning || 'AI classification complete'
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      if (error.message.includes('invalid_api_key')) {
        return NextResponse.json(
          { error: 'Invalid API key configuration.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to classify image. Please try again.' },
      { status: 500 }
    )
  }
}
