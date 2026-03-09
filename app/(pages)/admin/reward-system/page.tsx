"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function RewardSystem() {
  const [showAddRewardModal, setShowAddRewardModal] = useState(false)

  const rewards = [
    {
      id: 1,
      name: "Free Coffee at EcoCafe",
      partner: "EcoCafe",
      points: 500,
      category: "Food & Beverage",
      status: "Active",
      redeemed: 234,
      available: 1000,
      expiry: "2024-06-30"
    },
    {
      id: 2,
      name: "10% Off Recycling Supplies",
      partner: "GreenStore",
      points: 300,
      category: "Shopping",
      status: "Active",
      redeemed: 156,
      available: 500,
      expiry: "2024-05-15"
    },
    {
      id: 3,
      name: "Public Transport Pass",
      partner: "City Transit",
      points: 800,
      category: "Transport",
      status: "Active",
      redeemed: 89,
      available: 200,
      expiry: "2024-04-30"
    },
    {
      id: 4,
      name: "Plant a Tree Certificate",
      partner: "GreenEarth Foundation",
      points: 1000,
      category: "Environmental",
      status: "Inactive",
      redeemed: 445,
      available: 0,
      expiry: "2024-03-31"
    }
  ]

  const categories = ["All", "Food & Beverage", "Shopping", "Transport", "Environmental", "Entertainment"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredRewards = selectedCategory === "All" 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory)

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reward System</h1>
          <p className="text-gray-600">Manage rewards and partner programs</p>
        </div>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Total Rewards</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{rewards.length}</p>
              <p className="text-sm text-green-600 mt-1">+2 this month</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Active Rewards</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {rewards.filter(r => r.status === "Active").length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Currently available</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Total Redeemed</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {rewards.reduce((sum, r) => sum + r.redeemed, 0)}
              </p>
              <p className="text-sm text-green-600 mt-1">+15% this week</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Active Partners</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {new Set(rewards.map(r => r.partner)).size}
              </p>
              <p className="text-sm text-gray-500 mt-1">Partner businesses</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddRewardModal(true)}
                className="px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
              >
                Add Reward
              </button>
            </div>
          </div>

          {/* Rewards Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRewards.map((reward) => (
                    <tr key={reward.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{reward.name}</p>
                          <p className="text-xs text-gray-500">Expires: {reward.expiry}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reward.partner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-primary">{reward.points}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{reward.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900">{reward.redeemed} / {reward.available}</p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-primary h-1.5 rounded-full" 
                              style={{ width: `${(reward.redeemed / reward.available) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          reward.status === "Active" ? "bg-green-100 text-green-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {reward.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary hover:underline mr-3">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Reward Modal */}
        {showAddRewardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">Add New Reward</h2>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reward Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter reward name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partner</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter partner name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points Required</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter points required"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Food & Beverage</option>
                    <option>Shopping</option>
                    <option>Transport</option>
                    <option>Environmental</option>
                    <option>Entertainment</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Quantity</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter available quantity"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
                <button
                  onClick={() => setShowAddRewardModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddRewardModal(false)}
                  className="px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
                >
                  Add Reward
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminSidebar>
  )
}
