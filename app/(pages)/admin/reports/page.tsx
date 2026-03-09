"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminReports() {
  const [reportType, setReportType] = useState("usage")
  const [dateRange, setDateRange] = useState("7days")

  const reports = [
    {
      id: 1,
      name: "User Activity Report",
      type: "usage",
      generated: "2024-03-09 14:30:00",
      size: "2.4 MB",
      status: "completed"
    },
    {
      id: 2,
      name: "Waste Classification Analytics",
      type: "analytics",
      generated: "2024-03-09 12:15:00",
      size: "1.8 MB",
      status: "completed"
    },
    {
      id: 3,
      name: "System Performance Report",
      type: "performance",
      generated: "2024-03-09 10:00:00",
      size: "3.1 MB",
      status: "processing"
    },
    {
      id: 4,
      name: "Weekly Summary Report",
      type: "summary",
      generated: "2024-03-08 18:00:00",
      size: "1.2 MB",
      status: "completed"
    }
  ]

  const chartData = {
    usage: [
      { day: "Mon", scans: 145, users: 89, accuracy: 92 },
      { day: "Tue", scans: 178, users: 102, accuracy: 94 },
      { day: "Wed", scans: 156, users: 95, accuracy: 91 },
      { day: "Thu", scans: 189, users: 110, accuracy: 93 },
      { day: "Fri", scans: 201, users: 125, accuracy: 95 },
      { day: "Sat", scans: 167, users: 98, accuracy: 90 },
      { day: "Sun", scans: 143, users: 87, accuracy: 89 }
    ],
    classification: [
      { type: "Plastic", count: 342, percentage: 28, color: "#3B82F6" },
      { type: "Paper", count: 298, percentage: 24, color: "#10B981" },
      { type: "Organic", count: 256, percentage: 21, color: "#F59E0B" },
      { type: "Glass", count: 189, percentage: 15, color: "#8B5CF6" },
      { type: "Metal", count: 145, percentage: 12, color: "#EF4444" }
    ],
    performance: [
      { metric: "API Response Time", value: 85, unit: "ms", status: "good" },
      { metric: "Database Query Time", value: 120, unit: "ms", status: "good" },
      { metric: "Image Processing", value: 2.3, unit: "s", status: "warning" },
      { metric: "Memory Usage", value: 68, unit: "%", status: "good" },
      { metric: "CPU Usage", value: 45, unit: "%", status: "good" }
    ]
  }

  const currentChartData = chartData[reportType as keyof typeof chartData] || chartData.usage

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(d => typeof d[key] === 'number' ? d[key] : 0))
  }

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and view system reports</p>
        </div>

        <div className="space-y-6">
          {/* Report Controls */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="usage">Usage Report</option>
                  <option value="analytics">Analytics Report</option>
                  <option value="performance">Performance Report</option>
                  <option value="summary">Summary Report</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage/Analytics Chart */}
            {(reportType === "usage" || reportType === "analytics") && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {reportType === "usage" ? "Usage Trends" : "Classification Analytics"}
                </h3>
                <div className="space-y-4">
                  {reportType === "usage" && (
                    <div className="space-y-3">
                      {currentChartData.map((data: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{data.day}</span>
                            <span className="text-gray-900 font-medium">{data.scans} scans</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-4">
                              <div 
                                className="bg-primary h-4 rounded-full transition-all duration-300"
                                style={{ width: `${(data.scans / getMaxValue(currentChartData, 'scans')) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-12 text-right">{data.accuracy}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {reportType === "analytics" && (
                    <div className="space-y-4">
                      {/* Pie Chart */}
                      <div className="flex items-center space-x-6">
                        <div className="relative w-32 h-32">
                          <svg className="w-32 h-32 transform -rotate-90">
                            {currentChartData.map((item: any, index: number) => {
                              const startAngle = currentChartData.slice(0, index).reduce((sum: number, d: any) => sum + d.percentage, 0)
                              const circumference = 2 * Math.PI * 56
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
                              <div className="text-xl font-bold text-gray-900">
                                {currentChartData.reduce((sum: number, d: any) => sum + d.count, 0)}
                              </div>
                              <div className="text-xs text-gray-500">Total Items</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          {currentChartData.map((item: any) => (
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
                  )}
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            {reportType === "performance" && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  {currentChartData.map((metric: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                        <span className="text-sm text-gray-900">
                          {metric.value} {metric.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            metric.status === "good" ? "bg-green-500" : 
                            metric.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min(metric.value * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Statistics */}
            {reportType === "summary" && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">1,230</div>
                    <div className="text-sm text-gray-600">Total Scans</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">Active Bins</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2,847</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              <div className="space-y-4">
                {[
                  { name: "Classification AI", health: 98, status: "excellent" },
                  { name: "Database Server", health: 95, status: "good" },
                  { name: "API Gateway", health: 87, status: "warning" },
                  { name: "Cache Server", health: 92, status: "good" }
                ].map((system, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{system.name}</span>
                      <span className="text-sm text-gray-900">{system.health}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          system.status === "excellent" ? "bg-green-500" : 
                          system.status === "good" ? "bg-blue-500" : "bg-yellow-500"
                        }`}
                        style={{ width: `${system.health}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.generated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          report.status === "completed" ? "bg-green-100 text-green-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary hover:underline mr-3">Download</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
