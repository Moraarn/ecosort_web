import { WasteClassifier } from '@/lib/ai/classifier'
import { getUSSDLanguageByCode, type SupportedLanguage } from '@/types/languages'

export interface USSDWasteQuery {
  description: string
  language: SupportedLanguage
  phoneNumber: string
}

export interface USSDWasteResponse {
  category: string
  binColor: string
  instructions: string
  points: number
  confidence: number
  language: SupportedLanguage
}

export class USSDAIIntegration {
  private classifier: WasteClassifier
  private responseCache: Map<string, USSDWasteResponse> = new Map()

  constructor() {
    this.classifier = WasteClassifier.getInstance()
  }

  async initialize(): Promise<void> {
    // Initialize the classifier if not already done
    if (this.classifier.getCategories().length === 0) {
      await this.classifier.initialize()
    }
  }

  async classifyWasteDescription(query: USSDWasteQuery): Promise<USSDWasteResponse> {
    // Create cache key
    const cacheKey = `${query.description.toLowerCase().trim()}_${query.language}`
    
    // Check cache first for performance
    if (this.responseCache.has(cacheKey)) {
      return this.responseCache.get(cacheKey)!
    }

    // Initialize classifier if needed
    await this.initialize()

    // Use keyword-based classification for USSD (faster than AI)
    const result = this.classifyByKeywords(query.description)
    
    // Get language-specific translations
    const lang = getUSSDLanguageByCode(query.language) || getUSSDLanguageByCode('en')!
    
    // Translate instructions if needed
    const translatedInstructions = this.translateInstructions(result.instructions, query.language)
    
    const response: USSDWasteResponse = {
      category: result.category,
      binColor: result.binColor,
      instructions: translatedInstructions,
      points: result.points,
      confidence: result.confidence,
      language: query.language
    }

    // Cache the response for future use
    this.responseCache.set(cacheKey, response)

    return response
  }

  private classifyByKeywords(description: string): {
    category: string
    binColor: string
    instructions: string
    points: number
    confidence: number
  } {
    const desc = description.toLowerCase().trim()

    // Keyword-based classification for speed and reliability
    const keywordPatterns = {
      plastic: {
        keywords: ['plastic', 'bottle', 'bag', 'container', 'wrap', 'packaging', 'polythene', 'pet'],
        category: 'Plastic',
        binColor: 'Blue',
        instructions: 'Clean and dry plastics. Remove caps and rings. Check recycling number 1-7.',
        points: 10
      },
      glass: {
        keywords: ['glass', 'bottle', 'jar', 'window', 'mirror', 'broken glass'],
        category: 'Glass',
        binColor: 'Red',
        instructions: 'Rinse and remove lids. Separate by color if required. No broken glass.',
        points: 15
      },
      metal: {
        keywords: ['metal', 'can', 'aluminum', 'steel', 'tin', 'foil', 'metal container'],
        category: 'Metal',
        binColor: 'Yellow',
        instructions: 'Rinse containers. Crush cans to save space. Remove food residue.',
        points: 12
      },
      organic: {
        keywords: ['food', 'organic', 'compost', 'vegetable', 'fruit', 'leftover', 'kitchen waste', 'garden waste'],
        category: 'Organic',
        binColor: 'Brown',
        instructions: 'Compost food scraps and yard waste. No meat or dairy in home compost.',
        points: 5
      },
      paper: {
        keywords: ['paper', 'cardboard', 'newspaper', 'magazine', 'office paper', 'envelope', 'box'],
        category: 'Paper',
        binColor: 'Green',
        instructions: 'Keep dry and clean. Remove plastic windows from envelopes. Flatten cardboard boxes.',
        points: 8
      },
      ewaste: {
        keywords: ['electronic', 'computer', 'phone', 'battery', 'charger', 'cable', 'appliance', 'e-waste'],
        category: 'E-waste',
        binColor: 'Purple',
        instructions: 'Take to special e-waste facilities. Remove batteries. Do not put in regular trash.',
        points: 20
      }
    }

    // Find best match based on keywords
    let bestMatch = null
    let highestScore = 0

    for (const [key, pattern] of Object.entries(keywordPatterns)) {
      let score = 0
      for (const keyword of pattern.keywords) {
        if (desc.includes(keyword)) {
          score += 1
        }
      }
      
      if (score > highestScore) {
        highestScore = score
        bestMatch = pattern
      }
    }

    // If no match found, default to general waste
    if (!bestMatch || highestScore === 0) {
      return {
        category: 'General Waste',
        binColor: 'Black',
        instructions: 'Dispose in general waste bin. Consider recycling if possible.',
        points: 2,
        confidence: 0.5
      }
    }

    return {
      category: bestMatch.category,
      binColor: bestMatch.binColor,
      instructions: bestMatch.instructions,
      points: bestMatch.points,
      confidence: Math.min(0.9, 0.6 + (highestScore * 0.1))
    }
  }

  private translateInstructions(instructions: string, language: SupportedLanguage): string {
    // Basic translation mapping for common instructions
    const translations: Record<SupportedLanguage, Record<string, string>> = {
      en: {
        'clean and dry': 'clean and dry',
        'rinse and remove': 'rinse and remove',
        'compost': 'compost',
        'keep dry': 'keep dry',
        'take to special': 'take to special'
      },
      sw: {
        'clean and dry': 'safisha na ukauke',
        'rinse and remove': 'safisha na kuondoa',
        'compost': 'taka chakula',
        'keep dry': 'hifadhi ukauke',
        'take to special': 'peleka kwa maalum'
      },
      lg: {
        'clean and dry': 'sangula era okukauka',
        'rinse and remove': 'sangula era okuwona',
        'compost': 'ebimera bya bulimi',
        'keep dry': 'okukola ebikauke',
        'take to special': 'tandika ku bya maalum'
      },
      ki: {
        'clean and dry': 'sanguraitho na gutonya',
        'rinse and remove': 'sanguraitho na gutungura',
        'compost': 'tithi ya mũrimũ',
        'keep dry': 'gũthondekera thitima',
        'take to special': 'thithia mahitima ma mathomo'
      },
      lu: {
        'clean and dry': 'salo nyalo okony',
        'rinse and remove': 'salo nyalo okwany',
        'compost': 'nyithindo mar dala',
        'keep dry': 'kony nyalo okony',
        'take to special': 'kany ma special'
      },
      ka: {
        'clean and dry': 'kiik che kipsengon',
        'rinse and remove': 'kiik che konyo',
        'compost': 'mitek mar konyo',
        'keep dry': 'kiik che kipsengon',
        'take to special': 'kobon che maalum'
      },
      rn: {
        'clean and dry': 'sangura era okukara',
        'rinse and remove': 'sangura era okuraho',
        'compost': 'ebimera bya mirimu',
        'keep dry': 'okukara ebintu',
        'take to special': 'tanga ku bintu bya maalum'
      }
    }

    if (language === 'en') {
      return instructions
    }

    const langTranslations = translations[language]
    if (!langTranslations) {
      return instructions
    }

    // Simple word replacement translation
    let translated = instructions
    for (const [english, translatedWord] of Object.entries(langTranslations)) {
      translated = translated.replace(new RegExp(english, 'gi'), translatedWord)
    }

    return translated
  }

  // Get quick classification for common items
  getQuickClassification(itemName: string): USSDWasteResponse | null {
    const commonItems: Record<string, USSDWasteResponse> = {
      'plastic bottle': {
        category: 'Plastic',
        binColor: 'Blue',
        instructions: 'Clean and dry plastics. Remove caps and rings.',
        points: 10,
        confidence: 0.95,
        language: 'en'
      },
      'glass bottle': {
        category: 'Glass',
        binColor: 'Red',
        instructions: 'Rinse and remove lids. Separate by color.',
        points: 15,
        confidence: 0.95,
        language: 'en'
      },
      'aluminum can': {
        category: 'Metal',
        binColor: 'Yellow',
        instructions: 'Rinse containers. Crush cans to save space.',
        points: 12,
        confidence: 0.95,
        language: 'en'
      },
      'food waste': {
        category: 'Organic',
        binColor: 'Brown',
        instructions: 'Compost food scraps. No meat or dairy.',
        points: 5,
        confidence: 0.95,
        language: 'en'
      },
      'newspaper': {
        category: 'Paper',
        binColor: 'Green',
        instructions: 'Keep dry and clean. Recycle with paper.',
        points: 8,
        confidence: 0.95,
        language: 'en'
      },
      'phone': {
        category: 'E-waste',
        binColor: 'Purple',
        instructions: 'Take to e-waste facility. Remove battery.',
        points: 20,
        confidence: 0.95,
        language: 'en'
      }
    }

    const key = itemName.toLowerCase().trim()
    return commonItems[key] || null
  }

  // Clear cache (useful for testing or updates)
  clearCache(): void {
    this.responseCache.clear()
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.responseCache.size,
      keys: Array.from(this.responseCache.keys())
    }
  }
}
