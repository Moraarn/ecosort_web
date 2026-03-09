"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import GoogleMap from "@/components/GoogleMap"

export default function SmartBins() {
  const [selectedBin, setSelectedBin] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date())
  const [showAddBinModal, setShowAddBinModal] = useState(false)
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
      capacity: 100,
      alerts: 0,
      maintenance: "2024-02-15",
      serialNumber: "BIN-001-CP"
    },
    {
      id: 2,
      name: "Shopping Mall Bin",
      status: "Active", 
      progress: 45,
      wasteType: "Plastic",
      lastSync: "5 mins ago",
      location: "City Mall",
      lat: 40.7580,
      lng: -73.9855,
      capacity: 100,
      alerts: 1,
      maintenance: "2024-02-20",
      serialNumber: "BIN-002-CM"
    },
    {
      id: 3,
      name: "School Campus Bin",
      status: "Active",
      progress: 90,
      wasteType: "Paper",
      lastSync: "1 min ago",
      location: "Greenwood School",
      lat: 40.7489,
      lng: -73.9680,
      capacity: 100,
      alerts: 2,
      maintenance: "2024-02-10",
      serialNumber: "BIN-003-GS"
    },
    {
      id: 4,
      name: "Train Station Bin",
      status: "Maintenance",
      progress: 30,
      wasteType: "Mixed",
      lastSync: "1 hour ago",
      location: "Grand Central",
      lat: 40.7527,
      lng: -73.9772,
      capacity: 100,
      alerts: 3,
      maintenance: "2024-02-05",
      serialNumber: "BIN-004-GC"
    },
    {
      id: 5,
      name: "Hospital Bin",
      status: "Active",
      progress: 60,
      wasteType: "Medical",
      lastSync: "3 mins ago",
      location: "City Hospital",
      lat: 40.7614,
      lng: -73.9776,
      capacity: 100,
      alerts: 0,
      maintenance: "2024-02-18",
      serialNumber: "BIN-005-CH"
    },
    {
      id: 6,
      name: "Restaurant Row Bin",
      status: "Active",
      progress: 85,
      wasteType: "Organic",
      lastSync: "2 mins ago",
      location: "Restaurant District",
      lat: 40.7489,
      lng: -73.9880,
      capacity: 100,
      alerts: 1,
      maintenance: "2024-02-12",
      serialNumber: "BIN-006-RR"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "Offline":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-red-600"
    if (progress >= 60) return "bg-green-600"
    return "bg-green-600"
  }

  const getAlertsCount = () => {
    return smartBins.reduce((total, bin) => total + bin.alerts, 0)
  }

  const getActiveBinsCount = () => {
    return smartBins.filter(bin => bin.status === "Active").length
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    // Simulate API call to refresh data
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update last refresh time
    setLastRefreshTime(new Date())
    
    // In a real app, you would fetch fresh data here
    // For now, we'll just simulate the refresh
    
    setIsRefreshing(false)
  }

  const handleAddBin = () => {
    setShowAddBinModal(true)
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

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setNewBin({
      ...newBin,
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      selectedLocation: location
    })
  }

  const handleSaveBin = async () => {
    // Validate form
    if (!newBin.name || !newBin.location || !newBin.selectedLocation) {
      alert("Please fill in all required fields and select a location on the map")
      return
    }

    // Simulate API call to save bin
    console.log("Saving new bin:", newBin)
    
    // Close modal and reset form
    handleCloseModal()
    
    // In a real app, you would refresh the data here
    await handleRefresh()
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Bins Management</h1>
              <p className="text-gray-600">Monitor and manage your smart waste bins in real-time</p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {lastRefreshTime.toLocaleTimeString()}
            </div>
          </div>
        </div>


        {/* View Toggle */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                List View
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "map"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Map View
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isRefreshing 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : "bg-primary hover:bg-primary text-white"
                }`}
              >
                <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </button>
              <button onClick={handleAddBin} className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Bin
              </button>
            </div>
          </div>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smartBins.map((bin) => (
              <div key={bin.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{bin.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bin.status)}`}>
                    {bin.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-gray-600">
                      <span>Progress</span>
                      <span className="font-medium">{bin.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getProgressColor(bin.progress)} h-2 rounded-full`} 
                        style={{ width: `${bin.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Waste Type</span>
                    <span className="font-medium">{bin.wasteType}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Last Sync</span>
                    <span className="font-medium">{bin.lastSync}</span>
                  </div>
                  
                  {bin.alerts > 0 && (
                    <div className="flex items-center text-sm text-red-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{bin.alerts} alert{bin.alerts > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Map View */}
        {viewMode === "map" && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Smart Bin Locations</h2>
              <p className="text-gray-600 text-sm mt-1">
                Click on a marker to see bin details and status
              </p>
            </div>
            
            <div className="p-4">
              <GoogleMap 
                markers={smartBins} 
                onMarkerClick={(marker) => setSelectedBin(marker)}
              />
            </div>
            
            {selectedBin && (
              <div className="p-6 border-t bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-3">Selected Bin: {selectedBin.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Bin Modal */}
      {showAddBinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Add New Smart Bin</h2>
              <p className="text-gray-600 text-sm mt-1">Enter the details for the new smart bin</p>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bin Name *
                </label>
                <input
                  type="text"
                  value={newBin.name}
                  onChange={(e) => setNewBin({ ...newBin, name: e.target.value })}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Downtown Plaza Bin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={newBin.location}
                  onChange={(e) => setNewBin({ ...newBin, location: e.target.value })}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Downtown Plaza"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Type
                </label>
                <select
                  value={newBin.wasteType}
                  onChange={(e) => setNewBin({ ...newBin, wasteType: e.target.value })}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location * - Click on the map to select location
                </label>
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
                    <span className="text-green-700 font-medium">Selected Location:</span>
                    <span className="text-gray-600 ml-2">
                      {newBin.selectedLocation.lat.toFixed(6)}, {newBin.selectedLocation.lng.toFixed(6)}
                    </span>
                  </div>
                )}
                {!newBin.selectedLocation && (
                  <p className="mt-2 text-sm text-gray-500">
                    Click anywhere on the map to set the bin location
                  </p>
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
    </DashboardLayout>
  )
}
