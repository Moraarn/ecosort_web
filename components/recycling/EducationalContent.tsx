'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { translateText } from '@/lib/translations'
import { ClassificationResult } from '@/types/waste'

interface EducationalContentProps {
  classification: ClassificationResult | null
}

export default function EducationalContent({ classification }: EducationalContentProps) {
  if (!classification || !classification.educationalContent) {
    return null
  }

  const edu = classification.educationalContent

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📚 {translateText('Educational Information', 'en')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-2">
            <span className="font-medium text-sm min-w-20">{translateText('Type', 'en')}:</span>
            <span className="text-sm text-gray-700">{edu.wasteType}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-medium text-sm min-w-20">{translateText('Recyclable', 'en')}:</span>
            <span className={`text-sm font-medium ${edu.recyclable ? 'text-green-600' : 'text-red-600'}`}>
              {edu.recyclable ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          
          <div className="space-y-1">
            <span className="font-medium text-sm">{translateText('Environmental Impact', 'en')}:</span>
            <p className="text-sm text-gray-700 pl-0">{edu.environmentalImpact}</p>
          </div>
          
          <div className="space-y-1">
            <span className="font-medium text-sm">{translateText('Recycling Instructions', 'en')}:</span>
            <p className="text-sm text-gray-700 pl-0">{edu.recyclingInstructions}</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <span className="font-medium text-sm text-blue-800">💡 {translateText('Fun Fact', 'en')}:</span>
            <p className="text-sm text-blue-700 mt-1">{edu.funFact}</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <span className="font-medium text-sm text-green-800">🌱 {translateText('Eco Alternatives', 'en')}:</span>
            <p className="text-sm text-green-700 mt-1">{edu.alternatives}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
