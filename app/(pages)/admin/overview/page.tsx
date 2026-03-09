"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { StatsOverview } from "@/components/admin/AdminDashboardComponents"

export default function AdminOverview() {
  const stats = [
    { label: "Total Users", value: "2,847", change: "+12%", trend: "up" as const },
    { label: "Active Bins", value: "156", change: "+8%", trend: "up" as const },
    { label: "System Health", value: "98%", change: "+2%", trend: "up" as const },
    { label: "Alerts", value: "3", change: "-5%", trend: "down" as const }
  ]

  const systems = [
    { id: 1, name: "Classification AI", status: "Online", uptime: "99.9%", lastCheck: "2 mins ago" },
    { id: 2, name: "Database Server", status: "Online", uptime: "99.5%", lastCheck: "1 min ago" },
    { id: 3, name: "API Gateway", status: "Maintenance", uptime: "95.2%", lastCheck: "5 mins ago" },
    { id: 4, name: "Cache Server", status: "Online", uptime: "99.8%", lastCheck: "30 secs ago" }
  ]

  const logs = [
    { id: 1, type: "error" as const, message: "Failed to process image upload", timestamp: "2024-03-09 14:32:15", user: "System" },
    { id: 2, type: "warning" as const, message: "High memory usage detected", timestamp: "2024-03-09 14:30:22", user: "Monitor" },
    { id: 3, type: "info" as const, message: "User registration completed", timestamp: "2024-03-09 14:28:10", user: "john@example.com" },
    { id: 4, type: "success" as const, message: "Bin sync completed successfully", timestamp: "2024-03-09 14:25:33", user: "System" }
  ]

  // Chart data
  const usageData = [
    { day: "Mon", scans: 145, users: 89 },
    { day: "Tue", scans: 178, users: 102 },
    { day: "Wed", scans: 156, users: 95 },
    { day: "Thu", scans: 189, users: 110 },
    { day: "Fri", scans: 201, users: 125 },
    { day: "Sat", scans: 167, users: 98 },
    { day: "Sun", scans: 143, users: 87 }
  ]

  const classificationData = [
    { type: "Plastic", count: 342, percentage: 28, color: "#3B82F6" },
    { type: "Paper", count: 298, percentage: 24, color: "#10B981" },
    { type: "Organic", count: 256, percentage: 21, color: "#F59E0B" },
    { type: "Glass", count: 189, percentage: 15, color: "#8B5CF6" },
    { type: "Metal", count: 145, percentage: 12, color: "#EF4444" }
  ]

  const maxScans = Math.max(...usageData.map(d => d.scans))
  const maxUsers = Math.max(...usageData.map(d => d.users))

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-600">System dashboard and key metrics</p>
        </div>

        <div className="space-y-6">
          {/* Stats Overview */}
          <StatsOverview stats={stats} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Usage Trends</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  {usageData.map((data, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 text-sm text-gray-600">{data.day}</div>
                      <div className="flex-1 flex items-center space-x-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                          <div 
                            className="bg-primary h-6 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${(data.scans / maxScans) * 100}%` }}
                          >
                            <span className="text-xs text-white font-medium">{data.scans}</span>
                          </div>
                        </div>
                        <div className="w-16 text-xs text-gray-500">{data.users} users</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-gray-600">Scans</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-600">Users</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification Pie Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Classification</h3>
              <div className="flex items-center space-x-6">
                {/* Pie Chart */}
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    {classificationData.map((item, index) => {
                      const startAngle = classificationData.slice(0, index).reduce((sum, d) => sum + d.percentage, 0)
                      const endAngle = startAngle + item.percentage
                      const circumference = 2 * Math.PI * 56 // radius = 56
                      const strokeDasharray = (item.percentage / 100) * circumference
                      const strokeDashoffset = -(startAngle / 100) * circumference
                      
                      return (
                        <circle
                          key={item.type}
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="16"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-300"
                        />
                      )
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">1,230</div>
                      <div className="text-xs text-gray-500">Total Items</div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex-1 space-y-2">
                  {classificationData.map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-700">{item.type}</span>
                      </div>
                      <div className="text-sm text-gray-900 font-medium">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Status and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                {systems.map((system) => (
                  <div key={system.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{system.name}</p>
                      <p className="text-xs text-gray-500">Uptime: {system.uptime}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        system.status === "Online" ? "bg-green-100 text-green-800" :
                        system.status === "Maintenance" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {system.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{system.lastCheck}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {logs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      log.type === "error" ? "bg-red-500" :
                      log.type === "warning" ? "bg-yellow-500" :
                      log.type === "success" ? "bg-green-500" : "bg-blue-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{log.message}</p>
                      <p className="text-xs text-gray-500">{log.timestamp} • {log.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
