export interface WasteCategory {
  id: number
  name: string
  description: string | null
  bin_color: string | null
  disposal_instructions: string | null
  environmental_impact: string | null
  points_value: number
  icon_url: string | null
  created_at: string
}

export interface ClassificationResult {
  category: WasteCategory
  confidence: number
  processing_time: number
  image_url: string
  educationalContent?: {
    wasteType: string
    description: string
    recyclable: boolean
    recyclingInstructions: string
    environmentalImpact: string
    funFact: string
    alternatives: string
  }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  language?: string
}

export interface RecyclingSession {
  id: string
  user_id: string
  classification_result: ClassificationResult | null
  chat_messages: ChatMessage[]
  language: string
  created_at: Date
  updated_at: Date
}

export interface Language {
  code: string
  name: string
  nativeName: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' }
]

export interface VoiceSettings {
  enabled: boolean
  language: string
  rate: number
  pitch: number
  volume: number
}
