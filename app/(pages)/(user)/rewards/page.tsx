"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"

export default function Rewards() {
  const [activeTab, setActiveTab] = useState("available")
  const [userPoints] = useState(2450)

  const availableRewards = [
    {
      id: 1,
      title: "Coffee Shop Voucher",
      description: "Get 50% off at Green Bean Coffee",
      points: 500,
      category: "Food & Drink",
      image: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      expiry: "30 days",
      partner: "Green Bean Coffee"
    },
    {
      id: 2,
      title: "Eco Store Discount",
      description: "20% off on sustainable products",
      points: 800,
      category: "Shopping",
      image: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      expiry: "60 days",
      partner: "EcoMart"
    },
    {
      id: 3,
      title: "Public Transport Credit",
      description: "$10 credit for metro/bus rides",
      points: 1000,
      category: "Transport",
      image: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m0 0v8m0-8l-8 8m4-8h4m-4 0v8" />
        </svg>
      ),
      expiry: "90 days",
      partner: "City Transit"
    },
    {
      id: 4,
      title: "Plant a Tree",
      description: "Contribute to urban forest initiative",
      points: 300,
      category: "Environment",
      image: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      expiry: "No expiry",
      partner: "Green Earth Foundation"
    },
    {
      id: 5,
      title: "Movie Ticket",
      description: "Free movie ticket at Eco Cinema",
      points: 600,
      category: "Entertainment",
      image: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      expiry: "45 days",
      partner: "Eco Cinema"
    },
    {
      id: 6,
      title: "Gym Day Pass",
      description: "One day access to FitGreen Gym",
      points: 400,
      category: "Health & Fitness",
      image: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      expiry: "30 days",
      partner: "FitGreen Gym"
    }
  ]

  const redeemedRewards = [
    {
      id: 7,
      title: "Reusable Water Bottle",
      description: "Eco-friendly stainless steel bottle",
      points: 350,
      redeemedDate: "2024-01-15",
      image: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m-7.5-7.5h19M9 10h6m-6 4h6m2-5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      ),
      partner: "EcoGear"
    },
    {
      id: 8,
      title: "Bike Rental Credit",
      description: "2 hours free bike rental",
      points: 200,
      redeemedDate: "2024-01-10",
      image: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      partner: "City Bikes"
    }
  ]

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Food & Drink": "bg-blue-100 text-blue-800",
      "Shopping": "bg-purple-100 text-purple-800",
      "Transport": "bg-green-100 text-green-800",
      "Environment": "bg-emerald-100 text-emerald-800",
      "Entertainment": "bg-pink-100 text-pink-800",
      "Health & Fitness": "bg-green-100 text-green-800"
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Rewards</h1>
          <p className="text-sm sm:text-base text-gray-600">Redeem your points for amazing eco-friendly rewards</p>
        </div>

        {/* Points Balance */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-green-100 text-xs sm:text-sm mb-1">Available Points</p>
              <p className="text-2xl sm:text-3xl font-bold">{userPoints.toLocaleString()}</p>
              <p className="text-green-100 text-xs sm:text-sm mt-2">Keep recycling to earn more points!</p>
            </div>
            <div className="text-white flex-shrink-0 ml-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-1 sm:space-x-8 px-4 sm:px-6 overflow-x-auto" aria-label="Tabs">
              {["available", "redeemed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
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
        </div>

        {/* Available Rewards */}
        {activeTab === "available" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {availableRewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl sm:text-4xl">{reward.image}</div>
                    <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${getCategoryColor(reward.category)}`}>
                      {reward.category}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base leading-tight">{reward.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{reward.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 mb-4 gap-2 sm:gap-4">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="truncate">{reward.partner}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{reward.expiry}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">{reward.points}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                    <button 
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                        userPoints >= reward.points
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={userPoints < reward.points}
                    >
                      {userPoints >= reward.points ? "Redeem" : "Insufficient"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Redeemed Rewards */}
        {activeTab === "redeemed" && (
          <div className="space-y-3 sm:space-y-4">
            {redeemedRewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="text-2xl sm:text-3xl flex-shrink-0">{reward.image}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{reward.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{reward.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="truncate">{reward.partner}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Redeemed on {reward.redeemedDate}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <span>{reward.points} points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                    Redeemed
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
