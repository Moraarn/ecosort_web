import { Achievement } from './shared'

export interface WasteCategory {
  id: number
  name: string
  description: string
  bin_color: string
  disposal_instructions: string
  environmental_impact: string
  points_value: number
  icon_url: string
  created_at: string
}

export interface WasteLog {
  id: string
  user_id: string
  image_url: string
  waste_category_id: number
  confidence_score: number
  qr_location_id?: string
  disposal_timestamp: string
  points_earned: number
  verified: boolean
  created_at: string
  waste_category?: WasteCategory
  qr_location?: QRLocation
}

export interface QRLocation {
  id: string
  qr_code: string
  location_name: string
  address: string
  latitude: number
  longitude: number
  waste_type_id: number
  status: 'active' | 'inactive' | 'maintenance'
  created_at: string
  updated_at: string
  waste_category?: WasteCategory
}

export interface Bin {
  id: string
  qr_location_id: string
  bin_identifier: string
  capacity_kg: number
  current_weight_kg: number
  last_collected?: string
  created_at: string
  qr_location?: QRLocation
}

export interface BinStatus {
  id: string
  bin_id: string
  fill_level_percentage: number
  battery_level: number
  last_updated: string
  temperature?: number
  humidity?: number
  status: 'normal' | 'full' | 'maintenance' | 'offline'
  bin?: Bin
}

export interface ClassificationResult {
  category: WasteCategory
  confidence: number
  processing_time: number
  image_url: string
}

export interface DisposalConfirmation {
  waste_log: WasteLog
  points_awarded: number
  new_total_points: number
  achievements_earned?: Achievement[]
}
