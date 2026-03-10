export interface ClassificationHistory {
  id: string
  user_id: string
  image_url: string
  classification_result: {
    category: {
      name: string
      confidence: number
      disposal_instructions: string
    }
    educational_content?: {
      wasteType: string
      recyclable: boolean
      environmentalImpact: string
      funFact: string
      alternatives: string
    }
  }
  created_at: string
  user_email?: string
}

export interface ClassificationHistoryStats {
  total_classifications: number
  this_week: number
  this_month: number
  most_classified_category: string
  recycling_rate: number
}
