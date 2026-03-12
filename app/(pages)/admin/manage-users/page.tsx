"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  total_points: number
  created_at: string
  total_disposals?: number
  total_rewards?: number
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
      } else {
        setError(data.error || 'Failed to fetch users')
        // Use dummy data as fallback
        console.log('Using dummy users data as fallback')
        setUsers(getDummyUsers())
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users')
      // Use dummy data as fallback
      console.log('Using dummy users data as fallback due to error')
      setUsers(getDummyUsers())
    } finally {
      setLoading(false)
    }
  }

  const getDummyUsers = () => {
    return [
      {
        id: "user1",
        email: "john.karibu@example.com",
        full_name: "John Karibu",
        role: "admin",
        total_points: 2450,
        created_at: "2024-01-15T08:30:00Z",
        total_disposals: 42,
        total_rewards: 8
      },
      {
        id: "user2", 
        email: "mary.nakuru@example.com",
        full_name: "Mary Nakuru",
        role: "user",
        total_points: 1820,
        created_at: "2024-02-01T14:20:00Z",
        total_disposals: 31,
        total_rewards: 5
      },
      {
        id: "user3",
        email: "joseph.kampala@example.com", 
        full_name: "Joseph Kampala",
        role: "user",
        total_points: 3100,
        created_at: "2023-12-10T09:15:00Z",
        total_disposals: 58,
        total_rewards: 12
      },
      {
        id: "user4",
        email: "grace.mombasa@example.com",
        full_name: "Grace Mombasa", 
        role: "moderator",
        total_points: 2750,
        created_at: "2024-01-20T11:40:00Z",
        total_disposals: 47,
        total_rewards: 9
      },
      {
        id: "user5",
        email: "samuel.kisumu@example.com",
        full_name: "Samuel Kisumu",
        role: "user", 
        total_points: 890,
        created_at: "2024-02-15T16:55:00Z",
        total_disposals: 15,
        total_rewards: 2
      },
      {
        id: "user6",
        email: "elizabeth.entebbe@example.com",
        full_name: "Elizabeth Entebbe",
        role: "user",
        total_points: 1560,
        created_at: "2024-01-08T13:25:00Z",
        total_disposals: 28,
        total_rewards: 4
      },
      {
        id: "user7",
        email: "david.nakuru@example.com",
        full_name: "David Nakuru",
        role: "user",
        total_points: 4200,
        created_at: "2023-11-22T10:40:00Z", 
        total_disposals: 73,
        total_rewards: 15
      },
      {
        id: "user8",
        email: "susan.jinja@example.com",
        full_name: "Susan Jinja",
        role: "user",
        total_points: 1950,
        created_at: "2024-02-08T15:30:00Z",
        total_disposals: 35,
        total_rewards: 6
      },
      {
        id: "user9",
        email: "michael.eldoret@example.com",
        full_name: "Michael Eldoret",
        role: "moderator",
        total_points: 3380,
        created_at: "2024-01-12T09:20:00Z",
        total_disposals: 61,
        total_rewards: 11
      },
      {
        id: "user10",
        email: "rebecca.mukono@example.com",
        full_name: "Rebecca Mukono",
        role: "user",
        total_points: 650,
        created_at: "2024-02-20T14:10:00Z",
        total_disposals: 12,
        total_rewards: 1
      },
      {
        id: "user11",
        email: "thomas.mbale@example.com",
        full_name: "Thomas Mbale",
        role: "user",
        total_points: 2890,
        created_at: "2024-01-18T12:35:00Z",
        total_disposals: 52,
        total_rewards: 10
      },
      {
        id: "user12",
        email: "patricia.gulu@example.com",
        full_name: "Patricia Gulu",
        role: "user",
        total_points: 1230,
        created_at: "2024-02-25T17:45:00Z",
        total_disposals: 22,
        total_rewards: 3
      }
    ]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return "bg-purple-100 text-purple-800"
      case 'moderator':
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole.toLowerCase() }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ))
        alert(`User role updated to ${newRole}`)
      } else {
        alert(`Failed to update role: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
    }
  }

  return (
    <AdminSidebar>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-sm sm:text-base text-gray-600">User management and role assignments</p>
        </div>

        <div className="space-y-6">
          {/* Loading State */}
          {loading && (
            <div className="bg-white p-8 sm:p-12 rounded-lg border border-gray-200">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-sm sm:text-base text-gray-600">Loading users...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={fetchUsers}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-medium hover:bg-red-200"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          {!loading && !error && (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">User Management</h2>
                  <p className="text-sm text-gray-500 mt-1">{users.length} users registered</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disposals</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-900">
                                {user.full_name || 'Unknown User'}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getRoleBadge(user.role)}`}
                            >
                              <option value="user">User</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className="text-xs sm:text-sm font-medium text-green-600">
                              {user.total_points || 0} pts
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className="text-xs sm:text-sm text-gray-600">
                              {user.total_disposals || 0}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                            <button className="text-primary hover:underline mr-2 sm:mr-3">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {users.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
                    <p className="mt-1 text-sm text-gray-500">No users have registered yet.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminSidebar>
  )
}
