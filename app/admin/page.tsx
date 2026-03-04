"use client"

import { useState } from "react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Database query mock data - based on actual schema queries
  const mockData = {
    overview: {
      totalUsers: 10567,
      activeUsers: 3421,
      totalDisposals: 45890,
      todayDisposals: 342,
      averageAccuracy: 87.3,
      totalPointsAwarded: 234567
    },
    // Query: SELECT detected_category, COUNT(*) FROM waste_logs WHERE disposal_confirmed = true GROUP BY detected_category
    wasteAnalytics: [
      { category: "Plastic", count: 15420, percentage: 33.6, color: "blue" },
      { category: "Organic", count: 12450, percentage: 27.1, color: "orange" },
      { category: "Paper", count: 8930, percentage: 19.5, color: "yellow" },
      { category: "Glass", count: 5420, percentage: 11.8, color: "red" },
      { category: "Metal", count: 2890, percentage: 6.3, color: "purple" },
      { category: "E-waste", count: 780, percentage: 1.7, color: "orange" }
    ],
    // Query: SELECT * FROM bins JOIN qr_locations ON bins.location_id = qr_locations.id
    bins: [
      { id: "BIN001", location: "Main Street - Recycling Center", type: "Mixed Waste", fillLevel: 67, status: "normal", lastCollected: "2 hours ago", lat: -1.2921, lng: 36.8219 },
      { id: "BIN002", location: "City Park - Organic Waste", type: "Organic", fillLevel: 89, status: "warning", lastCollected: "1 day ago", lat: -1.2833, lng: 36.8167 },
      { id: "BIN003", location: "Shopping Mall - Plastic Collection", type: "Plastic", fillLevel: 45, status: "normal", lastCollected: "6 hours ago", lat: -1.2747, lng: 36.8119 },
      { id: "BIN004", location: "School Campus - Paper Recycling", type: "Paper", fillLevel: 78, status: "normal", lastCollected: "4 hours ago", lat: -1.2956, lng: 36.8258 },
      { id: "BIN005", location: "Industrial Area - Metal Collection", type: "Metal", fillLevel: 92, status: "critical", lastCollected: "2 days ago", lat: -1.3015, lng: 36.8302 }
    ],
    // Query: SELECT p.full_name, wl.detected_category, wl.confidence_score, wl.created_at FROM profiles p JOIN waste_logs wl ON p.id = wl.user_id ORDER BY wl.created_at DESC LIMIT 10
    recentActivity: [
      { user: "John Doe", action: "Classified Plastic", time: "2 mins ago", confidence: 94, userId: "user_001" },
      { user: "Sarah Chen", action: "Scanned QR at Main Street", time: "5 mins ago", points: 15, userId: "user_002" },
      { user: "Mike Johnson", action: "Classified Glass", time: "8 mins ago", confidence: 88, userId: "user_003" },
      { user: "Emma Davis", action: "Scanned QR at City Park", time: "12 mins ago", points: 10, userId: "user_004" },
      { user: "James Kimani", action: "Classified E-waste", time: "15 mins ago", confidence: 91, userId: "user_005" },
      { user: "Grace Atieno", action: "Scanned QR at Shopping Mall", time: "18 mins ago", points: 12, userId: "user_006" },
      { user: "Kevin Waweru", action: "Classified Organic", time: "22 mins ago", confidence: 89, userId: "user_007" },
      { user: "Lucy Kamau", action: "Scanned QR at School Campus", time: "25 mins ago", points: 18, userId: "user_008" }
    ],
    // Query: SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count FROM waste_logs WHERE disposal_confirmed = true GROUP BY date ORDER BY date DESC LIMIT 30
    timeSeriesData: [
      { date: "2024-01-15", count: 342 },
      { date: "2024-01-14", count: 298 },
      { date: "2024-01-13", count: 412 },
      { date: "2024-01-12", count: 387 },
      { date: "2024-01-11", count: 356 },
      { date: "2024-01-10", count: 423 },
      { date: "2024-01-09", count: 398 },
      { date: "2024-01-08", count: 367 }
    ],
    // Query: SELECT * FROM leaderboard ORDER BY rank ASC LIMIT 20
    leaderboard: [
      { rank: 1, fullName: "Alice Kimani", totalPoints: 3450, totalDisposals: 128, lastActivity: "2024-01-15T10:30:00Z" },
      { rank: 2, fullName: "Bob Ochieng", totalPoints: 2890, totalDisposals: 112, lastActivity: "2024-01-15T09:15:00Z" },
      { rank: 3, fullName: "Carol Wanjiku", totalPoints: 2675, totalDisposals: 98, lastActivity: "2024-01-14T16:45:00Z" },
      { rank: 4, fullName: "David Mutua", totalPoints: 2450, totalDisposals: 89, lastActivity: "2024-01-15T11:20:00Z" },
      { rank: 5, fullName: "Eva Achieng", totalPoints: 2230, totalDisposals: 87, lastActivity: "2024-01-14T14:30:00Z" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-xl">EcoSort AI</span>
              <span className="text-gray-600">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AD</span>
                </div>
                <span className="text-gray-700">Admin User</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage the EcoSort AI platform</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {["overview", "analytics", "bins", "users", "activity"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-orange-600 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{mockData.overview.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-blue-700 font-medium">Total Users</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">{mockData.overview.activeUsers.toLocaleString()}</div>
                    <div className="text-sm text-orange-700 font-medium">Active Users</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">{mockData.overview.totalDisposals.toLocaleString()}</div>
                    <div className="text-sm text-purple-700 font-medium">Total Disposals</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">{mockData.overview.todayDisposals}</div>
                    <div className="text-sm text-orange-700 font-medium">Today's Disposals</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-600">{mockData.overview.averageAccuracy}%</div>
                    <div className="text-sm text-yellow-700 font-medium">Avg Accuracy</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600">{mockData.overview.totalPointsAwarded.toLocaleString()}</div>
                    <div className="text-sm text-red-700 font-medium">Points Awarded</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">{activity.user[0]}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{activity.user}</div>
                            <div className="text-sm text-gray-600">{activity.action}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{activity.time}</div>
                          {activity.confidence && <div className="text-xs text-gray-500">{activity.confidence}% confidence</div>}
                          {activity.points && <div className="text-xs text-orange-600">+{activity.points} pts</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Analytics</h3>
                
                {/* Waste Categories Chart */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Waste Distribution by Category</h4>
                  <div className="space-y-3">
                    {mockData.wasteAnalytics.map((category) => (
                      <div key={category.category} className="flex items-center space-x-4">
                        <div className="w-24 text-sm font-medium text-gray-700">{category.category}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                          <div
                            className={`absolute top-0 left-0 h-6 bg-${category.color}-500 rounded-full`}
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-20 text-right">
                          <div className="text-sm font-medium text-gray-900">{category.count.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">{category.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Most Common</h4>
                    <div className="text-2xl font-bold text-orange-600">Plastic</div>
                    <div className="text-sm text-gray-600">33.6% of all disposals</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Least Common</h4>
                    <div className="text-2xl font-bold text-blue-600">E-waste</div>
                    <div className="text-sm text-gray-600">1.7% of all disposals</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Peak Hour</h4>
                    <div className="text-2xl font-bold text-purple-600">2-4 PM</div>
                    <div className="text-sm text-gray-600">Highest activity period</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bins" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Bin Management</h3>
                  <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium">
                    Add New Bin
                  </button>
                </div>

                {/* Bin Status */}
                <div className="space-y-4">
                  {mockData.bins.map((bin) => (
                    <div key={bin.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="font-medium text-gray-900">{bin.id}</div>
                          <div className="text-sm text-gray-600">{bin.location}</div>
                          <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {bin.type}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          bin.status === "full" 
                            ? "bg-red-100 text-red-700" 
                            : bin.status === "maintenance"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {bin.status}
                        </div>
                      </div>

                      {/* Fill Level Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Fill Level</span>
                          <span className={`font-medium ${
                            bin.fillLevel > 80 ? "text-red-600" : bin.fillLevel > 60 ? "text-yellow-600" : "text-orange-600"
                          }`}>
                            {bin.fillLevel}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              bin.fillLevel > 80 ? "bg-red-500" : bin.fillLevel > 60 ? "bg-yellow-500" : "bg-orange-500"
                            }`}
                            style={{ width: `${bin.fillLevel}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                        <span>Last collected: {bin.lastCollected}</span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Schedule Collection
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium">
                      Export
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disposals</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { name: "John Doe", email: "john@example.com", points: 2450, disposals: 156, joined: "2024-01-15", status: "active" },
                        { name: "Sarah Chen", email: "sarah@example.com", points: 3120, disposals: 203, joined: "2024-01-10", status: "active" },
                        { name: "Mike Johnson", email: "mike@example.com", points: 1890, disposals: 134, joined: "2024-01-20", status: "active" },
                        { name: "Emma Davis", email: "emma@example.com", points: 2670, disposals: 178, joined: "2024-01-08", status: "inactive" }
                      ].map((user, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600">{user.name[0]}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{user.points.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.disposals}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.joined}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === "active" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Activity Log</h3>
                
                {/* Activity Timeline */}
                <div className="space-y-4">
                  {[
                    { time: "2 mins ago", action: "New user registration", user: "alice@example.com", type: "user" },
                    { time: "5 mins ago", action: "Bin marked as full", user: "System", type: "bin" },
                    { time: "8 mins ago", action: "AI classification completed", user: "john@example.com", type: "classification" },
                    { time: "12 mins ago", action: "QR code scanned", user: "sarah@example.com", type: "scan" },
                    { time: "15 mins ago", action: "Points awarded", user: "mike@example.com", type: "reward" },
                    { time: "20 mins ago", action: "Daily report generated", user: "System", type: "system" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "user" ? "bg-blue-500" :
                        activity.type === "bin" ? "bg-yellow-500" :
                        activity.type === "classification" ? "bg-orange-500" :
                        activity.type === "scan" ? "bg-purple-500" :
                        activity.type === "reward" ? "bg-orange-500" :
                        "bg-gray-500"
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">{activity.action}</div>
                          <div className="text-sm text-gray-500">{activity.time}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">by {activity.user}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
