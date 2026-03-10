"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: "citizen" as "citizen" | "admin"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signup(formData.email, formData.password, formData.fullName, formData.phone, formData.role)
      
      // Redirect to appropriate dashboard
      if (formData.role === 'admin') {
        router.push('/admin/overview')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
        

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-800">Join the movement for smarter waste management</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent placeholder-gray-600"
                placeholder="Enter your full name"
                style={{ color: '#1A202C' }}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent placeholder-gray-600"
                placeholder="Enter your email"
                style={{ color: '#1A202C' }}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent placeholder-gray-600"
                placeholder="Enter your phone number"
                style={{ color: '#1A202C' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  <input
                    type="radio"
                    name="role"
                    value="citizen"
                    checked={formData.role === "citizen"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`text-center border-2 rounded-lg p-3 transition-all ${
                    formData.role === "citizen" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-300 bg-white"
                  }`}>
                    <div className="text-2xl mb-1">👤</div>
                    <div className="font-medium text-gray-900">Citizen</div>
                    <div className="text-xs text-gray-500">Join as a regular user</div>
                  </div>
                </label>

                <label className="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`text-center border-2 rounded-lg p-3 transition-all ${
                    formData.role === "admin" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-300 bg-white"
                  }`}>
                    <div className="text-2xl mb-1">👨‍💼</div>
                    <div className="font-medium text-gray-900">Admin</div>
                    <div className="text-xs text-gray-500">Manage waste system</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent placeholder-gray-600"
                placeholder="Create a password"
                minLength={8}
                style={{ color: '#1A202C' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
