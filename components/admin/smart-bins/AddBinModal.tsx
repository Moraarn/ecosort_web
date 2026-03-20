import { useState, useEffect } from "react"
import GoogleMap from "@/components/GoogleMap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface AddBinModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (binData: any) => Promise<void>
  saving: boolean
}

export default function AddBinModal({ isOpen, onClose, onSave, saving }: AddBinModalProps) {
  const [newBin, setNewBin] = useState({
    name: "",
    location: "",
    wasteType: "Mixed",
    selectedLocation: null as { lat: number; lng: number } | null,
    geocoding: false
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setNewBin({
        name: "",
        location: "",
        wasteType: "Mixed",
        selectedLocation: null,
        geocoding: false
      })
    }
  }, [isOpen])

  // Geocode location string to coordinates
  const geocodeLocation = async (locationString: string) => {
    if (!locationString.trim()) return

    setNewBin(prev => ({ ...prev, geocoding: true }))
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        console.warn('Google Maps API key not configured')
        return
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationString)}&key=${apiKey}`
      )
      
      const data = await response.json()
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0]
        const location = result.geometry.location
        
        setNewBin(prev => ({
          ...prev,
          selectedLocation: { lat: location.lat, lng: location.lng },
          geocoding: false
        }))
      } else {
        console.warn('Geocoding failed:', data.status)
        setNewBin(prev => ({ ...prev, geocoding: false }))
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      setNewBin(prev => ({ ...prev, geocoding: false }))
    }
  }

  const handleMapClick = (location: { lat: number; lng: number }) => {
    setNewBin(prev => ({
      ...prev,
      selectedLocation: location
    }))
  }

  const handleLocationInputChange = (field: 'location', value: string) => {
    const updatedBin = { ...newBin, [field]: value }
    
    // If location field changed, trigger geocoding
    if (field === 'location') {
      // Debounce geocoding
      const timeoutId = setTimeout(() => {
        geocodeLocation(value)
      }, 1000)
      
      // Clear previous timeout
      if (newBin.geocoding) {
        clearTimeout(newBin.geocoding as any)
      }
      
      updatedBin.geocoding = timeoutId as any
    }
    
    setNewBin(updatedBin)
  }

  const handleSave = async () => {
    if (!newBin.name || !newBin.location || !newBin.selectedLocation) {
      alert("Please fill in all required fields and select a location on the map")
      return
    }

    const binData = {
      name: newBin.name,
      location: newBin.location,
      wasteType: newBin.wasteType,
      lat: newBin.selectedLocation.lat,
      lng: newBin.selectedLocation.lng
    }

    await onSave(binData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col border border-gray-200/50 animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-8 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Add New Smart Bin
              </h2>
              <p className="text-gray-600 mt-2">Enter bin details and select location on map</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              ✕
            </Button>
          </div>
        </div>
        
        <div className="p-8 space-y-6 overflow-y-auto flex-1">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Bin Name *</label>
                  <input
                    type="text"
                    value={newBin.name}
                    onChange={(e) => setNewBin({ ...newBin, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="e.g., Downtown Plaza Bin"
                  />
                </div>
            
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Waste Type</label>
                  <select
                    value={newBin.wasteType}
                    onChange={(e) => setNewBin({ ...newBin, wasteType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                <option value="Mixed">Mixed</option>
                <option value="Plastic">Plastic</option>
                <option value="Paper">Paper</option>
                <option value="Organic">Organic</option>
                <option value="Glass">Glass</option>
                <option value="Metal">Metal</option>
                <option value="E-waste">E-waste</option>
              </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Location Description *</label>
              <div className="relative">
                <input
                  type="text"
                  value={newBin.location}
                  onChange={(e) => handleLocationInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="e.g., Nairobi, Kenya or Kampala, Uganda"
                />
                {newBin.geocoding && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                Type a location name - it will be geocoded automatically
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Location Selection - Click on map to select precise location
                </span>
              </label>
              <div className="border border-gray-300 rounded-xl overflow-hidden shadow-inner">
                <GoogleMap 
                  markers={newBin.selectedLocation ? [{
                    id: 999,
                    name: "New Bin Location",
                    lat: newBin.selectedLocation.lat,
                    lng: newBin.selectedLocation.lng,
                    status: "Active",
                    progress: 0,
                    wasteType: newBin.wasteType
                  }] : []}
                  onMapClick={handleMapClick}
                  center={newBin.selectedLocation || { lat: -1.2921, lng: 36.8219 }} // Default to Nairobi, Kenya
                />
              </div>
              {newBin.selectedLocation && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-in slide-in-from-top-2 duration-200">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Selected Location:</span>
                    <span className="font-mono text-xs bg-green-100 px-2 py-1 rounded">
                      {newBin.selectedLocation.lat.toFixed(6)}, {newBin.selectedLocation.lng.toFixed(6)}
                    </span>
                  </p>
                </div>
              )}
              {!newBin.selectedLocation && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Type a location name above or click anywhere on the map to set the bin location
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="p-8 border-t border-gray-100 flex justify-end space-x-3 flex-shrink-0 bg-gray-50/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !newBin.selectedLocation}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>+</span>
                Add Bin
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
