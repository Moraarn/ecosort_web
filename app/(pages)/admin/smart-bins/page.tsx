"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import GoogleMap from "@/components/GoogleMap"

export default function AdminSmartBins() {
  const [showAddBinModal, setShowAddBinModal] = useState(false)
  const [selectedBin, setSelectedBin] = useState<typeof smartBins[0] | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  const [newBin, setNewBin] = useState({
    name: "",
    location: "",
    wasteType: "Mixed",
    lat: "",
    lng: "",
    selectedLocation: null as { lat: number; lng: number } | null
  })

  const smartBins = [
    {
      id: 1,
      name: "Central Park Bin",
      status: "Active",
      progress: 75,
      wasteType: "Mixed",
      lastSync: "2 mins ago",
      location: "Central Park",
      lat: 40.7829,
      lng: -73.9654,
      alerts: 0
    },
    {
      id: 2,
      name: "Downtown Plaza Bin",
      status: "Active",
      progress: 45,
      wasteType: "Plastic",
      lastSync: "5 mins ago",
      location: "Downtown Plaza",
      lat: 40.7128,
      lng: -74.0060,
      alerts: 0
    },
    {
      id: 3,
      name: "Airport Terminal Bin",
      status: "Warning",
      progress: 92,
      wasteType: "Mixed",
      lastSync: "1 min ago",
      location: "Airport Terminal",
      lat: 40.6413,
      lng: -73.7781,
      alerts: 2
    },
    {
      id: 4,
      name: "University Campus Bin",
      status: "Active",
      progress: 30,
      wasteType: "Paper",
      lastSync: "3 mins ago",
      location: "University Campus",
      lat: 40.8075,
      lng: -73.9626,
      alerts: 0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Warning":
        return "bg-yellow-100 text-yellow-800"
      case "Offline":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-red-500"
    if (progress >= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setNewBin({
      ...newBin,
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      selectedLocation: location
    })
  }

  const handleCloseModal = () => {
    setShowAddBinModal(false)
    setNewBin({
      name: "",
      location: "",
      wasteType: "Mixed",
      lat: "",
      lng: "",
      selectedLocation: null
    })
  }

  const handleSaveBin = () => {
    if (!newBin.name || !newBin.location || !newBin.selectedLocation) {
      alert("Please fill in all required fields and select a location on the map")
      return
    }
    handleCloseModal()
  }

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Smart Bins Management</h1>
          <p className="text-gray-600">Monitor and manage smart waste bins</p>
        </div>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Total Bins</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{smartBins.length}</p>
              <p className="text-sm text-green-600 mt-1">All operational</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Active Bins</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {smartBins.filter(b => b.status === "Active").length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Currently online</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Alerts</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {smartBins.reduce((sum, b) => sum + b.alerts, 0)}
              </p>
              <p className="text-sm text-yellow-600 mt-1">Requires attention</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Avg Capacity</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {Math.round(smartBins.reduce((sum, b) => sum + b.progress, 0) / smartBins.length)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Overall usage</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === "map"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Map View
                </button>
              </div>
              <button
                onClick={() => setShowAddBinModal(true)}
                className="px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
              >
                Add Smart Bin
              </button>
            </div>
          </div>

          {/* Content */}
          {viewMode === "list" ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bin Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sync</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {smartBins.map((bin) => (
                      <tr key={bin.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{bin.name}</p>
                            <p className="text-xs text-gray-500">{bin.location}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bin.status)}`}>
                              {bin.status}
                            </span>
                            {bin.alerts > 0 && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                {bin.alerts} alerts
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`${getProgressColor(bin.progress)} h-2 rounded-full`} 
                                style={{ width: `${bin.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{bin.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bin.wasteType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bin.lastSync}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => setSelectedBin(bin)}
                            className="text-primary hover:underline mr-3"
                          >
                            View
                          </button>
                          <button className="text-red-600 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-96 rounded-lg overflow-hidden">
                <GoogleMap 
                  markers={smartBins}
                  onMarkerClick={(marker) => {
                    const bin = smartBins.find(b => b.id === marker.id)
                    if (bin) setSelectedBin(bin)
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Add Bin Modal */}
        {showAddBinModal && (
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
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
                    <option value="Medical">Medical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location - Click on map to select</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <GoogleMap 
                      markers={newBin.selectedLocation ? [{
                        id: 999,
                        name: "New Bin Location",
                        lat: newBin.selectedLocation.lat,
                        lng: newBin.selectedLocation.lng,
                        status: "Pending",
                        progress: 0,
                        wasteType: newBin.wasteType
                      }] : []}
                      onMarkerClick={() => {}}
                      onMapClick={handleLocationSelect}
                    />
                  </div>
                  {newBin.selectedLocation && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-sm">
                      <span className="text-green-700 font-medium">Selected:</span>
                      <span className="text-gray-600 ml-2">
                        {newBin.selectedLocation.lat.toFixed(6)}, {newBin.selectedLocation.lng.toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBin}
                  className="px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
                >
                  Add Bin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bin Details Modal */}
        {selectedBin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">{selectedBin.name}</h2>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">{selectedBin.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-medium">{selectedBin.progress}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Waste Type</p>
                    <p className="font-medium">{selectedBin.wasteType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Sync</p>
                    <p className="font-medium">{selectedBin.lastSync}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Location</p>
                  <p className="font-medium">{selectedBin.location}</p>
                  <p className="text-sm text-gray-500">
                    {selectedBin.lat.toFixed(6)}, {selectedBin.lng.toFixed(6)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Capacity Level</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${getProgressColor(selectedBin.progress)} h-3 rounded-full`} 
                      style={{ width: `${selectedBin.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
                <button
                  onClick={() => setSelectedBin(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminSidebar>
  )
}
