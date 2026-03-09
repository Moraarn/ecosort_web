export interface SmartBin {
  id: number
  name: string
  status: "Active" | "Warning" | "Offline"
  progress: number
  wasteType: string
  lastSync: string
  location: string
  lat: number
  lng: number
  alerts: number
  created_at?: string
}
