export interface NearbyBin {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  distance: number // in meters
  waste_type: string
  status: 'active' | 'inactive' | 'maintenance'
  bin_color: string
  last_collected?: string
  fill_level?: number
  battery_level?: number
}

export interface LocationPermission {
  granted: boolean
  coordinates?: {
    latitude: number
    longitude: number
  }
  error?: string
}
