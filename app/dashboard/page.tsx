"use client"

import { useState } from "react"
import Link from "next/link"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const mockData = {
    totalPoints: 2450,
    weeklyPoints: 320,
    monthlyPoints: 890,
    rank: 12,
    totalDisposals: 156,
    currentStreak: 7,
    achievements: [
      { id: 1, name: "First Sort", icon: "🌟", earned: true },
      { id: 2, name: "Eco Warrior", icon: "🏆", earned: true },
      { id: 3, name: "Week Streak", icon: "🔥", earned: true },
      { id: 4, name: "Top Recycler", icon: "👑", earned: false }
    ],
    recentActivity: [
      { id: 1, type: "Plastic", points: 15, time: "2 hours ago", confidence: 92 },
      { id: 2, type: "Organic", points: 10, time: "5 hours ago", confidence: 88 },
      { id: 3, type: "Glass", points: 18, time: "1 day ago", confidence: 95 },
      { id: 4, type: "Paper", points: 12, time: "2 days ago", confidence: 90 }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
  

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h1>
          <p className="text-gray-600">Continue your eco journey and make a difference today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <span className="text-sm text-orange-600 font-medium">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{mockData.totalPoints.toLocaleString()}</div>
            <div className="text-gray-600 text-sm">Total Points</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-sm text-blue-600 font-medium">+8%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">#{mockData.rank}</div>
            <div className="text-gray-600 text-sm">Leaderboard Rank</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <span className="text-sm text-purple-600 font-medium">Active</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{mockData.currentStreak}</div>
            <div className="text-gray-600 text-sm">Day Streak</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">♻️</span>
              </div>
              <span className="text-sm text-orange-600 font-medium">+5</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{mockData.totalDisposals}</div>
            <div className="text-gray-600 text-sm">Total Disposals</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {["overview", "activity", "achievements", "leaderboard"].map((tab) => (
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/classify" className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                          <span className="text-white">📷</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Classify Waste</div>
                          <div className="text-sm text-gray-600">AI-powered categorization</div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/scan" className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white">📱</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Scan QR Code</div>
                          <div className="text-sm text-gray-600">Log your disposal</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-sm">♻️</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{activity.type} Waste</div>
                            <div className="text-sm text-gray-600">{activity.time}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-orange-600">+{activity.points}</div>
                          <div className="text-xs text-gray-500">{activity.confidence}% confidence</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h3>
                <div className="space-y-3">
                  {mockData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">♻️</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{activity.type} Classification</div>
                          <div className="text-sm text-gray-600">{activity.time} • {activity.confidence}% confidence</div>
                        </div>
                      </div>
                      <div className="font-medium text-orange-600">+{activity.points} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "achievements" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockData.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${
                        achievement.earned
                          ? "bg-orange-50 border-orange-200"
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <div className="font-medium text-gray-900">{achievement.name}</div>
                          <div className="text-sm text-gray-600">
                            {achievement.earned ? "Earned" : "Locked"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "leaderboard" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Recyclers</h3>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Sarah Chen", points: 3450, trend: "up" },
                    { rank: 2, name: "Mike Johnson", points: 3120, trend: "up" },
                    { rank: 3, name: "Emma Davis", points: 2890, trend: "down" },
                    { rank: 4, name: "John Smith", points: 2670, trend: "up" },
                    { rank: 5, name: "Lisa Wang", points: 2450, trend: "same" },
                    { rank: 12, name: "You", points: mockData.totalPoints, trend: "up", isUser: true }
                  ].map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        user.isUser ? "bg-orange-50 border border-orange-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.rank <= 3 ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-700"
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name} {user.isUser && "(You)"}
                          </div>
                          <div className="text-sm text-gray-600">{user.points.toLocaleString()} points</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {user.trend === "up" && <span className="text-orange-600">↑</span>}
                        {user.trend === "down" && <span className="text-red-600">↓</span>}
                        {user.trend === "same" && <span className="text-gray-600">→</span>}
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
