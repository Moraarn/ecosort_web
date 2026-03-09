"use client"

import { useState } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/DashboardLayout"
import GoogleMap from "@/components/GoogleMap"

export default function Dashboard() {
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
      lng: -73.9654
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
      lng: -73.9855
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
      lng: -73.9680
    }
  ]

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Smart Bins Overview</h1>
          <p className="text-gray-600">Monitor and manage your smart waste bins across the city</p>
        </div>

        {/* Smart Bin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {smartBins.map((bin) => (
            <div key={bin.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{bin.name}</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {bin.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-gray-600">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{bin.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${bin.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="text-gray-600">Waste Type</span>
                  <span className="font-medium">{bin.wasteType}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="text-gray-600">Last Sync</span>
                  <span className="font-medium">{bin.lastSync}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Smart Bin Locations</h2>
            <p className="text-gray-600 text-sm mt-1">
              Click on a marker to see smart bin details
            </p>
          </div>
          
          <div className="p-4">
            <GoogleMap 
              markers={smartBins} 
              onMarkerClick={(marker) => console.log('Clicked marker:', marker)}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
