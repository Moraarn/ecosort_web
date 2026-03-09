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
    lat: "",
    lng: "",
    selectedLocation: null as { lat: number; lng: number } | null
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setNewBin({
        name: "",
        location: "",
        wasteType: "Mixed",
        lat: "",
        lng: "",
        selectedLocation: null
      })
    }
  }, [isOpen])

  const handleMapClick = (location: { lat: number; lng: number }) => {
    setNewBin({
      ...newBin,
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      selectedLocation: location
    })
  }

  const handleLocationInputChange = (field: 'location' | 'lat' | 'lng', value: string) => {
    const updatedBin = { ...newBin, [field]: value }
    
    // If lat and lng are both provided, update selectedLocation
    if (field === 'lat' || field === 'lng') {
      const lat = field === 'lat' ? parseFloat(value) : parseFloat(newBin.lat)
      const lng = field === 'lng' ? parseFloat(value) : parseFloat(newBin.lng)
      
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        updatedBin.selectedLocation = { lat, lng }
      } else {
        updatedBin.selectedLocation = null
      }
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Add New Smart Bin</h2>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bin Name</label>
            <input
              type="text"
              value={newBin.name}
              onChange={(e) => setNewBin({ ...newBin, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Downtown Plaza Bin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Description</label>
            <input
              type="text"
              value={newBin.location}
              onChange={(e) => setNewBin({ ...newBin, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Downtown Plaza"
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                value={newBin.lat}
                onChange={(e) => handleLocationInputChange('lat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="40.7128"
                min="-90"
                max="90"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                value={newBin.lng}
                onChange={(e) => handleLocationInputChange('lng', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="-74.0060"
                min="-180"
                max="180"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location - Click on map to select or enter coordinates above
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
                center={newBin.selectedLocation || { lat: 40.7128, lng: -74.0060 }}
              />
            </div>
            {newBin.selectedLocation && (
              <p className="text-xs text-gray-500 mt-2">
                Selected: {newBin.selectedLocation.lat.toFixed(6)}, {newBin.selectedLocation.lng.toFixed(6)}
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
            disabled={saving}
            className="px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Adding...' : 'Add Bin'}
          </button>
        </div>
      </div>
    </div>
  )
}
