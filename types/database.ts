export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'user' | 'admin'
          total_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'user' | 'admin'
          total_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'user' | 'admin'
          total_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      waste_categories: {
        Row: {
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
        Insert: {
          id?: number
          name: string
          description?: string | null
          bin_color?: string | null
          disposal_instructions?: string | null
          environmental_impact?: string | null
          points_value?: number
          icon_url?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          bin_color?: string | null
          disposal_instructions?: string | null
          environmental_impact?: string | null
          points_value?: number
          icon_url?: string | null
          created_at?: string
        }
      }
      qr_locations: {
        Row: {
          id: string
          qr_code: string
          location_name: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          waste_type_id: number | null
          status: 'active' | 'inactive' | 'maintenance'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          qr_code: string
          location_name?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          waste_type_id?: number | null
          status?: 'active' | 'inactive' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          qr_code?: string
          location_name?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          waste_type_id?: number | null
          status?: 'active' | 'inactive' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
      }
      bins: {
        Row: {
          id: string
          qr_location_id: string | null
          bin_identifier: string | null
          capacity_kg: number | null
          current_weight_kg: number
          last_collected: string | null
          created_at: string
        }
        Insert: {
          id?: string
          qr_location_id?: string | null
          bin_identifier?: string | null
          capacity_kg?: number | null
          current_weight_kg?: number
          last_collected?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          qr_location_id?: string | null
          bin_identifier?: string | null
          capacity_kg?: number | null
          current_weight_kg?: number
          last_collected?: string | null
          created_at?: string
        }
      }
      bin_status: {
        Row: {
          id: string
          bin_id: string | null
          fill_level_percentage: number
          battery_level: number
          last_updated: string
          temperature: number | null
          humidity: number | null
          status: 'normal' | 'full' | 'maintenance' | 'offline'
        }
        Insert: {
          id?: string
          bin_id?: string | null
          fill_level_percentage?: number
          battery_level?: number
          last_updated?: string
          temperature?: number | null
          humidity?: number | null
          status?: 'normal' | 'full' | 'maintenance' | 'offline'
        }
        Update: {
          id?: string
          bin_id?: string | null
          fill_level_percentage?: number
          battery_level?: number
          last_updated?: string
          temperature?: number | null
          humidity?: number | null
          status?: 'normal' | 'full' | 'maintenance' | 'offline'
        }
      }
      waste_logs: {
        Row: {
          id: string
          user_id: string | null
          image_url: string | null
          waste_category_id: number | null
          confidence_score: number | null
          qr_location_id: string | null
          disposal_timestamp: string
          points_earned: number
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          image_url?: string | null
          waste_category_id?: number | null
          confidence_score?: number | null
          qr_location_id?: string | null
          disposal_timestamp?: string
          points_earned?: number
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          image_url?: string | null
          waste_category_id?: number | null
          confidence_score?: number | null
          qr_location_id?: string | null
          disposal_timestamp?: string
          points_earned?: number
          verified?: boolean
          created_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          user_id: string | null
          waste_log_id: string | null
          points: number
          transaction_type: 'earned' | 'redeemed' | 'bonus'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          waste_log_id?: string | null
          points: number
          transaction_type?: 'earned' | 'redeemed' | 'bonus'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          waste_log_id?: string | null
          points?: number
          transaction_type?: 'earned' | 'redeemed' | 'bonus'
          description?: string | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: number
          name: string
          description: string | null
          icon_url: string | null
          points_required: number
          badge_type: 'disposal' | 'streak' | 'category' | 'special'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          icon_url?: string | null
          points_required: number
          badge_type?: 'disposal' | 'streak' | 'category' | 'special'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          icon_url?: string | null
          points_required?: number
          badge_type?: 'disposal' | 'streak' | 'category' | 'special'
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: number
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: number
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: number
          earned_at?: string
        }
      }
      leaderboard: {
        Row: {
          id: string
          user_id: string | null
          rank_position: number | null
          total_points: number | null
          weekly_points: number
          monthly_points: number
          last_updated: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          rank_position?: number | null
          total_points?: number | null
          weekly_points?: number
          monthly_points?: number
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          rank_position?: number | null
          total_points?: number | null
          weekly_points?: number
          monthly_points?: number
          last_updated?: string
        }
      }
      chatbot_logs: {
        Row: {
          id: string
          user_id: string | null
          user_message: string
          bot_response: string
          language: string
          context: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_message: string
          bot_response: string
          language?: string
          context?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          user_message?: string
          bot_response?: string
          language?: string
          context?: string | null
          session_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      waste_analytics: {
        Row: {
          category_name: string
          total_disposals: number
          avg_confidence: number | null
          total_points: number | null
          disposal_date: string
        }
      }
      user_analytics: {
        Row: {
          full_name: string | null
          total_points: number | null
          total_disposals: number
          avg_confidence: number | null
          last_disposal: string | null
        }
      }
    }
    Functions: {
      update_user_points: {
        Args: {
          user_uuid: string
        }
        Returns: void
      }
      award_disposal_points: {
        Args: {
          user_uuid: string
          waste_log_uuid: string
          points: number
          description?: string
        }
        Returns: string
      }
      check_user_achievements: {
        Args: {
          user_uuid: string
        }
        Returns: void
      }
    }
  }
}
