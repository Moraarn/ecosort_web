"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Wallet() {
  const [userData, setUserData] = useState<any>(null)
  const [rewardHistory, setRewardHistory] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    setIsLoading(true)
    
    try {
      // Mock user data - in production, get from auth context
      const mockUser = {
        id: "user_demo",
        fullName: "John Doe",
        email: "john@example.com",
        totalPoints: 1250,
        rank: 12,
        totalDisposals: 45
      }
      
      // Mock reward history
      const mockRewards = [
        {
          id: "1",
          points: 15,
          source: "plastic_disposal",
          description: "Plastic bottle disposal",
          location: "Main Street - Recycling Center",
          timestamp: "2024-01-15T10:30:00Z"
        },
        {
          id: "2",
          points: 20,
          source: "metal_disposal", 
          description: "Aluminum can disposal",
          location: "City Park - Organic Waste",
          timestamp: "2024-01-14T15:45:00Z"
        },
        {
          id: "3",
          points: 10,
          source: "organic_disposal",
          description: "Food waste disposal",
          location: "Shopping Mall - Plastic Collection",
          timestamp: "2024-01-13T09:20:00Z"
        },
        {
          id: "4",
          points: 25,
          source: "ewaste_disposal",
          description: "Electronic waste disposal",
          location: "School Campus - Paper Recycling",
          timestamp: "2024-01-12T14:15:00Z"
        },
        {
          id: "5",
          points: 12,
          source: "paper_disposal",
          description: "Paper waste disposal",
          location: "Main Street - Recycling Center",
          timestamp: "2024-01-11T11:30:00Z"
        }
      ]
      
      // Mock leaderboard
      const mockLeaderboard = [
        { rank: 1, fullName: "Alice Kimani", totalPoints: 3450, totalDisposals: 128 },
        { rank: 2, fullName: "Bob Ochieng", totalPoints: 2890, totalDisposals: 112 },
        { rank: 3, fullName: "Carol Wanjiku", totalPoints: 2675, totalDisposals: 98 },
        { rank: 4, fullName: "David Mutua", totalPoints: 2450, totalDisposals: 89 },
        { rank: 5, fullName: "Eva Achieng", totalPoints: 2230, totalDisposals: 87 },
        { rank: 6, fullName: "Frank Njoroge", totalPoints: 1980, totalDisposals: 76 },
        { rank: 7, fullName: "Grace Atieno", totalPoints: 1750, totalDisposals: 68 },
        { rank: 8, fullName: "Henry Kariuki", totalPoints: 1560, totalDisposals: 61 },
        { rank: 9, fullName: "Irene Muthoni", totalPoints: 1340, totalDisposals: 54 },
        { rank: 10, fullName: "James Otieno", totalPoints: 1280, totalDisposals: 49 },
        { rank: 11, fullName: "Kevin Waweru", totalPoints: 1265, totalDisposals: 47 },
        { rank: 12, fullName: "John Doe", totalPoints: 1250, totalDisposals: 45 }, // Current user
        { rank: 13, fullName: "Lucy Kamau", totalPoints: 1190, totalDisposals: 43 },
        { rank: 14, fullName: "Michael Muriuki", totalPoints: 1150, totalDisposals: 41 },
        { rank: 15, fullName: "Nancy Adhiambo", totalPoints: 1080, totalDisposals: 38 }
      ]
      
      // Mock achievements
      const mockAchievements = [
        {
          id: "1",
          type: "first_disposal",
          name: "First Step",
          description: "Complete your first waste disposal",
          icon: "🌱",
          unlockedAt: "2024-01-01T10:00:00Z",
          isUnlocked: true
        },
        {
          id: "2",
          type: "top_recycler",
          name: "Top Recycler",
          description: "Reach top 20 in leaderboard",
          icon: "🏆",
          unlockedAt: "2024-01-10T15:30:00Z",
          isUnlocked: true
        },
        {
          id: "3",
          type: "eco_hero",
          name: "Eco Hero",
          description: "Earn 1000+ points",
          icon: "🦸",
          unlockedAt: "2024-01-12T09:15:00Z",
          isUnlocked: true
        },
        {
          id: "4",
          type: "streak_master",
          name: "Streak Master",
          description: "Dispose waste for 7 consecutive days",
          icon: "🔥",
          unlockedAt: null,
          isUnlocked: false
        },
        {
          id: "5",
          type: "variety_collector",
          name: "Variety Collector",
          description: "Dispose all 6 waste types",
          icon: "🌈",
          unlockedAt: null,
          isUnlocked: false
        }
      ]
      
      setUserData(mockUser)
      setRewardHistory(mockRewards)
      setLeaderboard(mockLeaderboard)
      setAchievements(mockAchievements)
      
    } catch (error) {
      console.error("Error fetching wallet data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSourceIcon = (source: string) => {
    const icons: { [key: string]: string } = {
      "plastic_disposal": "🍶",
      "organic_disposal": "🍃",
      "metal_disposal": "🥫",
      "glass_disposal": "🍾",
      "paper_disposal": "📄",
      "ewaste_disposal": "📱"
    }
    return icons[source] || "♻️"
  }

  const getProgressToNextRank = () => {
    if (!userData || !leaderboard) return 0
    
    const currentUserIndex = leaderboard.findIndex(user => user.fullName === userData.fullName)
    if (currentUserIndex <= 0) return 100 // Already at top
    
    const nextRankUser = leaderboard[currentUserIndex - 1]
    const pointsNeeded = nextRankUser.totalPoints - userData.totalPoints
    const totalGap = nextRankUser.totalPoints - leaderboard[currentUserIndex + 1]?.totalPoints || 0
    
    return totalGap > 0 ? Math.max(0, 100 - (pointsNeeded / totalGap * 100)) : 0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wallet data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
              <p className="text-gray-600">Track your rewards and achievements</p>
            </div>
            
            <Link href="/classify">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
                New Disposal
              </button>
            </Link>
          </div>

          {/* Stats Overview */}
          {userData && (
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Total Points</span>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-green-600">{userData.totalPoints.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Rank #{userData.rank}</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Total Disposals</span>
                  <span className="text-2xl">♻️</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">{userData.totalDisposals}</div>
                <div className="text-sm text-gray-500">All time</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Achievements</span>
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {achievements.filter(a => a.isUnlocked).length}/{achievements.length}
                </div>
                <div className="text-sm text-gray-500">Unlocked</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Next Rank Progress</span>
                  <span className="text-2xl">📈</span>
                </div>
                <div className="text-3xl font-bold text-green-600">{getProgressToNextRank().toFixed(0)}%</div>
                <div className="text-sm text-gray-500">To rank #{userData.rank - 1}</div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Reward History */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                
                {rewardHistory.length > 0 ? (
                  <div className="space-y-4">
                    {rewardHistory.map((reward) => (
                      <div key={reward.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{getSourceIcon(reward.source)}</div>
                          <div>
                            <div className="font-medium text-gray-900">{reward.description}</div>
                            <div className="text-sm text-gray-500">{reward.location}</div>
                            <div className="text-xs text-gray-400">{formatDate(reward.timestamp)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">+{reward.points}</div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-500">No activity yet. Start disposing waste to earn points!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Achievements */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
                
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border ${
                        achievement.isUnlocked
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{achievement.name}</div>
                          <div className="text-sm text-gray-500">{achievement.description}</div>
                          {achievement.isUnlocked && achievement.unlockedAt && (
                            <div className="text-xs text-green-600">
                              Unlocked {formatDate(achievement.unlockedAt)}
                            </div>
                          )}
                        </div>
                        {achievement.isUnlocked && (
                          <div className="text-green-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard Preview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Leaderboard</h2>
                
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        user.fullName === userData?.fullName
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.rank === 1 ? "bg-yellow-500 text-white" :
                          user.rank === 2 ? "bg-gray-400 text-white" :
                          user.rank === 3 ? "bg-green-600 text-white" :
                          "bg-gray-200 text-gray-600"
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.totalDisposals} disposals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{user.totalPoints.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {userData && userData.rank > 5 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                          {userData.rank}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">You</div>
                          <div className="text-sm text-gray-500">{userData.totalDisposals} disposals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{userData.totalPoints.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
