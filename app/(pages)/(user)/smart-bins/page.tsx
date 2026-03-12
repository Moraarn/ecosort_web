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
      name: "Nairobi Central Bin",
      status: "Active",
      progress: 75,
      wasteType: "Mixed",
      lastSync: "2 mins ago",
      location: "Nairobi Central, Kenya",
      lat: -1.2921,
      lng: 36.8219,
      capacity: 100,
      alerts: 0,
      maintenance: "2024-02-15",
      serialNumber: "BIN-001-NB"
    },
    {
      id: 2,
      name: "Kampala Plaza Bin",
      status: "Active", 
      progress: 45,
      wasteType: "Plastic",
      lastSync: "5 mins ago",
      location: "Kampala Plaza, Uganda",
      lat: 0.3476,
      lng: 32.5825,
      capacity: 100,
      alerts: 1,
      maintenance: "2024-02-20",
      serialNumber: "BIN-002-KP"
    },
    {
      id: 3,
      name: "Mombasa Port Bin",
      status: "Warning",
      progress: 92,
      wasteType: "Mixed",
      lastSync: "1 min ago",
      location: "Mombasa Port, Kenya",
      lat: -4.0435,
      lng: 39.6682,
      capacity: 100,
      alerts: 2,
      maintenance: "2024-02-10",
      serialNumber: "BIN-003-MP"
    },
    {
      id: 4,
      name: "Entebbe Airport Bin",
      status: "Active",
      progress: 30,
      wasteType: "Paper",
      lastSync: "3 mins ago",
      location: "Entebbe Airport, Uganda",
      lat: 0.0434,
      lng: 32.4435,
      capacity: 100,
      alerts: 0,
      maintenance: "2024-02-18",
      serialNumber: "BIN-004-EA"
    },
    {
      id: 5,
      name: "Kisumu Market Bin",
      status: "Active",
      progress: 60,
      wasteType: "Organic",
      lastSync: "4 mins ago",
      location: "Kisumu Market, Kenya",
      lat: -0.0917,
      lng: 34.7680,
      capacity: 100,
      alerts: 0,
      maintenance: "2024-02-22",
      serialNumber: "BIN-005-KM"
    },
    {
      id: 6,
      name: "Jinja Town Square Bin",
      status: "Active",
      progress: 55,
      wasteType: "Glass",
      lastSync: "6 mins ago",
      location: "Jinja Town Square, Uganda",
      lat: 0.4242,
      lng: 33.2045,
      capacity: 100,
      alerts: 0,
      maintenance: "2024-02-25",
      serialNumber: "BIN-006-JT"
    },
    {
      id: 7,
      name: "Nakuru Business District Bin",
      status: "Warning",
      progress: 88,
      wasteType: "Mixed",
      lastSync: "2 mins ago",
      location: "Nakuru Business District, Kenya",
      lat: -0.3031,
      lng: 36.0695,
      capacity: 100,
      alerts: 1,
      maintenance: "2024-02-12",
      serialNumber: "BIN-007-NB"
    },
    {
      id: 8,
      name: "Mbale Central Market Bin",
      status: "Active",
      progress: 40,
      wasteType: "Plastic",
      lastSync: "7 mins ago",
      location: "Mbale Central Market, Uganda",
      lat: 1.0771,
      lng: 34.1805,
      capacity: 100,
      alerts: 0,
      maintenance: "2024-02-28",
      serialNumber: "BIN-008-MM"
    },
    {
      id: 9,
      name: "Eldoret Mall Bin",
      status: "Active",
      progress: 35,
      wasteType: "Paper",
      lastSync: "5 mins ago",
      location: "Eldoret Mall, Kenya",
      lat: 0.5143,
      lng: 35.2698,
      capacity: 100,
      alerts: 0,
      maintenance: "2024-03-01",
      serialNumber: "BIN-009-EM"
    },
    {
      id: 10,
      name: "Gulu Municipal Bin",
      status: "Active",
      progress: 70,
      wasteType: "Metal",
      lastSync: "3 mins ago",
      location: "Gulu Municipal, Uganda",
      lat: 2.7746,
      lng: 32.2989,
      capacity: 100,
      alerts: 0,
      maintenance: "2024-02-14",
      serialNumber: "BIN-010-GM"
    },
    {
      id: 11,
      name: "Thika Road Mall Bin",
      status: "Active",
      progress: 50,
      wasteType: "E-waste",
      lastSync: "4 mins ago",
      location: "Thika Road Mall, Kenya",
      lat: -1.2209,
      lng: 36.9256,
      capacity: 100,
      alerts: 0,
      maintenance: "2024-02-19",
      serialNumber: "BIN-011-TR"
    },
    {
      id: 12,
      name: "Mukono Town Center Bin",
      status: "Active",
      progress: 65,
      wasteType: "Organic",
      lastSync: "6 mins ago",
      location: "Mukono Town Center, Uganda",
      lat: 0.3545,
      lng: 32.7525,
      capacity: 100,
      alerts: 0,
      maintenance: "2024-02-23",
      serialNumber: "BIN-012-MT"
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
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Smart Bins Management</h1>
              <p className="text-sm sm:text-base text-gray-600">Monitor and manage your smart waste bins in real-time</p>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Last updated: {lastRefreshTime.toLocaleTimeString()}
            </div>
          </div>
        </div>


        {/* View Toggle */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  viewMode === "list"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">List View</span>
                <span className="sm:hidden">List</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  viewMode === "map"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="hidden sm:inline">Map View</span>
                <span className="sm:hidden">Map</span>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  isRefreshing 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : "bg-primary hover:bg-primary text-white"
                }`}
              >
                <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
                <span className="sm:hidden">{isRefreshing ? "..." : "Refresh"}</span>
              </button>
              
            </div>
          </div>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {smartBins.map((bin) => (
              <div key={bin.id} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">{bin.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${getStatusColor(bin.status)}`}>
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
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Smart Bin Locations</h2>
              <p className="text-gray-600 text-sm mt-1">
                Click on a marker to see bin details and status
              </p>
            </div>
            
            <div className="p-2 sm:p-4">
              <div className="h-64 sm:h-96 lg:h-[500px]">
                <GoogleMap 
                  markers={smartBins} 
                  onMarkerClick={(marker) => setSelectedBin(marker)}
                />
              </div>
            </div>
            
            {selectedBin && (
              <div className="p-4 sm:p-6 border-t bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Selected Bin: {selectedBin.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Status</p>
                    <p className="font-medium text-sm sm:text-base">{selectedBin.status}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Capacity</p>
                    <p className="font-medium text-sm sm:text-base">{selectedBin.progress}%</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Waste Type</p>
                    <p className="font-medium text-sm sm:text-base">{selectedBin.wasteType}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Last Sync</p>
                    <p className="font-medium text-sm sm:text-base">{selectedBin.lastSync}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      
    </DashboardLayout>
  )
}
