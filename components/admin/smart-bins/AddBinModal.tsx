import { useState, useEffect } from "react"
import GoogleMap from "@/components/GoogleMap"

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Add New Smart Bin</h2>
          <p className="text-sm text-gray-600 mt-1">Enter bin details and select location on map</p>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bin Name *</label>
              <input
                type="text"
                value={newBin.name}
                onChange={(e) => setNewBin({ ...newBin, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Downtown Plaza Bin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waste Type</label>
              <select
                value={newBin.wasteType}
                onChange={(e) => setNewBin({ ...newBin, wasteType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Description *</label>
            <div className="relative">
              <input
                type="text"
                value={newBin.location}
                onChange={(e) => handleLocationInputChange('location', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Nairobi, Kenya or Kampala, Uganda"
              />
              {newBin.geocoding && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Type a location name - it will be geocoded automatically</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Selection - Click on map to select precise location
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
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
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Selected Location:</span>
                  <span className="ml-2">
                    {newBin.selectedLocation.lat.toFixed(6)}, {newBin.selectedLocation.lng.toFixed(6)}
                  </span>
                </p>
              </div>
            )}
            {!newBin.selectedLocation && (
              <p className="mt-2 text-sm text-gray-500">
                Type a location name above or click anywhere on the map to set the bin location
              </p>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !newBin.selectedLocation}
            className="px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Adding...' : 'Add Bin'}
          </button>
        </div>
      </div>
    </div>
  )
}
