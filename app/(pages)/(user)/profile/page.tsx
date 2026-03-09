"use client"

import DashboardLayout from "@/components/DashboardLayout"
import { useState } from "react"


export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview")

  const recyclingData = {
    plastics: 120,
    organic: 80,
    metal: 45,
    total: 245
  }

  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "January 2024",
    level: "Eco Warrior",
    points: 2450,
    rank: 12
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account and view your recycling impact</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-green-600">JD</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{userProfile.name}</h2>
                <p className="text-gray-600">{userProfile.email}</p>
                <div className="mt-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {userProfile.level}
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-500">{userProfile.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points</span>
                  <span className="font-medium text-green-600">{userProfile.points.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Leaderboard Rank</span>
                  <span className="font-medium text-gray-500">#{userProfile.rank}</span>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="border-b">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {["overview", "achievements", "settings"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? "border-green-600 text-green-600"
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
                    {/* Recycling Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recycling Summary</h3>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{recyclingData.plastics}kg</div>
                            <div className="text-sm text-gray-600">Plastics</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{recyclingData.organic}kg</div>
                            <div className="text-sm text-gray-600">Organic</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{recyclingData.metal}kg</div>
                            <div className="text-sm text-gray-600">Metal</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{recyclingData.total}kg</div>
                            <div className="text-sm text-gray-600">Total Recycled</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        {[
                          { type: "Plastic", amount: "5kg", points: 15, time: "2 hours ago" },
                          { type: "Organic", amount: "3kg", points: 10, time: "5 hours ago" },
                          { type: "Metal", amount: "2kg", points: 18, time: "1 day ago" }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{activity.type} Waste</div>
                                <div className="text-sm text-gray-600">{activity.amount} • {activity.time}</div>
                              </div>
                            </div>
                            <div className="font-medium text-green-600">+{activity.points} pts</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "achievements" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { 
                          name: "First Sort", 
                          icon: (
                            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ), 
                          earned: true, 
                          description: "Complete your first waste classification" 
                        },
                        { 
                          name: "Eco Warrior", 
                          icon: (
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          ), 
                          earned: true, 
                          description: "Recycle 100kg of waste" 
                        },
                        { 
                          name: "Week Streak", 
                          icon: (
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                          ), 
                          earned: true, 
                          description: "7 days of continuous recycling" 
                        },
                        { 
                          name: "Top Recycler", 
                          icon: (
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          ), 
                          earned: false, 
                          description: "Reach top 10 on leaderboard" 
                        }
                      ].map((achievement, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            achievement.earned
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{achievement.name}</div>
                              <div className="text-sm text-gray-600">{achievement.description}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {achievement.earned ? "Earned" : "Locked"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={userProfile.email}
                          className="w-full px-3 py-2 text-gray-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={userProfile.name}
                          className="w-full px-3 py-2 text-gray-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm text-gray-700">Email notifications for new achievements</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm text-gray-700">Weekly recycling summaries</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                          Save Changes
                        </button>
                        <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
