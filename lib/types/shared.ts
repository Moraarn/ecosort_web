export interface Achievement {
  id: number
  name: string
  description: string
  icon_url: string
  points_required: number
  badge_type: 'disposal' | 'streak' | 'category' | 'special'
  created_at: string
}
