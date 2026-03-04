export interface Reward {
  id: string
  user_id: string
  waste_log_id?: string
  points: number
  transaction_type: 'earned' | 'redeemed' | 'bonus'
  description: string
  created_at: string
  waste_log?: WasteLog
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon_url: string
  points_required: number
  badge_type: 'disposal' | 'streak' | 'category' | 'special'
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: number
  earned_at: string
  achievement?: Achievement
}

export interface LeaderboardEntry {
  id: string
  user_id: string
  rank_position: number
  total_points: number
  weekly_points: number
  monthly_points: number
  last_updated: string
  user?: User
}

export interface WalletStats {
  total_points: number
  weekly_points: number
  monthly_points: number
  total_disposals: number
  current_streak: number
  rank_position?: number
}

export interface RewardHistory {
  rewards: Reward[]
  total_earned: number
  total_redeemed: number
  net_points: number
}
