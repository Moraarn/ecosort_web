"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"

export default function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState("all-time")

  const leaderboardData = [
    { rank: 1, name: "Sarah Chen", points: 5420, recycled: 892, co2Saved: 445, trend: "up", avatar: "SC" },
    { rank: 2, name: "Mike Johnson", points: 4890, recycled: 756, co2Saved: 378, trend: "up", avatar: "MJ" },
    { rank: 3, name: "Emma Davis", points: 4230, recycled: 678, co2Saved: 339, trend: "down", avatar: "ED" },
    { rank: 4, name: "Alex Kim", points: 3890, recycled: 623, co2Saved: 311, trend: "up", avatar: "AK" },
    { rank: 5, name: "Lisa Wang", points: 3560, recycled: 589, co2Saved: 294, trend: "same", avatar: "LW" },
    { rank: 6, name: "James Brown", points: 3240, recycled: 545, co2Saved: 272, trend: "up", avatar: "JB" },
    { rank: 7, name: "You", points: 2450, recycled: 445, co2Saved: 222, trend: "up", avatar: "JD", isCurrentUser: true },
    { rank: 8, name: "Nina Patel", points: 2380, recycled: 412, co2Saved: 206, trend: "down", avatar: "NP" },
    { rank: 9, name: "Tom Wilson", points: 2150, recycled: 389, co2Saved: 194, trend: "up", avatar: "TW" },
    { rank: 10, name: "Amy Lee", points: 1980, recycled: 356, co2Saved: 178, trend: "same", avatar: "AL" }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↑"
      case "down":
        return "↓"
      default:
        return "→"
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "1st"
    if (rank === 2) return "2nd"
    if (rank === 3) return "3rd"
    return `${rank}th`
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600">See how you rank among top eco-warriors in your community</p>
        </div>




        {/* Full Leaderboard */}
        <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-300">
            <h2 className="text-xl font-semibold text-gray-900">Complete Rankings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Rank</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Points</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Recycled</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">CO₂ Saved</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user) => (
                  <tr
                    key={user.rank}
                    className={`border-b border-gray-200 ${user.isCurrentUser ? "bg-gray-50" : ""}`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getRankBadge(user.rank)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-gray-600">{user.avatar}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                            {user.isCurrentUser && <span className="ml-2 text-xs text-gray-500">(You)</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.points.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.recycled}kg
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.co2Saved}kg
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getTrendIcon(user.trend)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
