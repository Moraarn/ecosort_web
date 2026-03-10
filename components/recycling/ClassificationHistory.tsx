'use client'

import { useState, useEffect } from 'react'
import { type ClassificationHistory, type ClassificationHistoryStats } from '@/types/classification-history'
import { translateText } from '@/lib/translations'

interface ClassificationHistoryProps {
  userId?: string
  isAdmin?: boolean
  selectedLanguage: string
  onClassificationSelect?: (classification: ClassificationHistory) => void
}

export default function ClassificationHistory({ 
  userId, 
  isAdmin = false, 
  selectedLanguage,
  onClassificationSelect 
}: ClassificationHistoryProps) {
  const [classifications, setClassifications] = useState<ClassificationHistory[]>([])
  const [stats, setStats] = useState<ClassificationHistoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    fetchClassificationHistory()
    fetchStats()
  }, [userId, isAdmin])

  const fetchClassificationHistory = async () => {
    try {
      setLoading(true)
      const endpoint = isAdmin ? '/api/admin/classification-history' : '/api/user/classification-history'
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('Failed to fetch classification history')
      }
      
      const data = await response.json()
      setClassifications(data.classifications || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const endpoint = isAdmin ? '/api/admin/classification-stats' : '/api/user/classification-stats'
      const response = await fetch(endpoint)
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(selectedLanguage === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      'Plastic': 'bg-blue-100 text-blue-800',
      'Paper': 'bg-gray-100 text-gray-800',
      'Organic': 'bg-green-100 text-green-800',
      'Glass': 'bg-purple-100 text-purple-800',
      'Metal': 'bg-yellow-100 text-yellow-800',
      'Electronic': 'bg-red-100 text-red-800',
      'Hazardous': 'bg-orange-100 text-orange-800'
    }
    return colors[categoryName] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="text-red-600 text-center">
          {translateText('Error loading classification history', selectedLanguage)}: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-primary">{stats.total_classifications}</div>
            <div className="text-sm text-gray-600">{translateText('Total Classifications', selectedLanguage)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.this_week}</div>
            <div className="text-sm text-gray-600">{translateText('This Week', selectedLanguage)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.recycling_rate}%</div>
            <div className="text-sm text-gray-600">{translateText('Recycling Rate', selectedLanguage)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-purple-600 truncate">{stats.most_classified_category}</div>
            <div className="text-sm text-gray-600">{translateText('Top Category', selectedLanguage)}</div>
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {isAdmin 
                ? translateText('All Classification History', selectedLanguage)
                : translateText('My Classification History', selectedLanguage)
              }
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {translateText('List', selectedLanguage)}
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {translateText('Grid', selectedLanguage)}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {classifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">
                {translateText('No classifications yet', selectedLanguage)}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {translateText('Start classifying waste items to see your history here', selectedLanguage)}
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'list' ? (
                <div className="space-y-4">
                  {classifications.map((classification) => (
                    <div
                      key={classification.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => onClassificationSelect?.(classification)}
                    >
                      <img
                        src={classification.image_url}
                        alt="Classified item"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(classification.classification_result.category.name)}`}>
                            {classification.classification_result.category.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round(classification.classification_result.category.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {classification.classification_result.category.disposal_instructions}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(classification.created_at)}
                          {isAdmin && classification.user_email && ` • ${classification.user_email}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {classifications.map((classification) => (
                    <div
                      key={classification.id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => onClassificationSelect?.(classification)}
                    >
                      <img
                        src={classification.image_url}
                        alt="Classified item"
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <div className="space-y-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(classification.classification_result.category.name)}`}>
                          {classification.classification_result.category.name}
                        </span>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {classification.classification_result.category.disposal_instructions}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(classification.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
