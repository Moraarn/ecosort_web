'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { translateText } from '@/lib/translations'

interface BinGuideProps {
  selectedLanguage: string
}

export default function BinGuide({ selectedLanguage }: BinGuideProps) {
  const bins = [
    { name: 'Plastic', color: '#3B82F6', description: 'Bottles, containers, bags' },
    { name: 'Paper', color: '#10B981', description: 'Newspapers, cardboard' },
    { name: 'Metal', color: '#EAB308', description: 'Cans, foil, containers' },
    { name: 'Glass', color: '#EF4444', description: 'Bottles, jars' },
    { name: 'Organic', color: '#92400E', description: 'Food waste, yard waste' },
    { name: 'E-waste', color: '#9333EA', description: 'Electronics, batteries' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          {translateText('recycling bins guide', selectedLanguage)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {bins.map((bin) => (
            <div key={bin.name} className="flex items-center gap-2 p-2 border rounded-lg">
              <div 
                className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"
                style={{ backgroundColor: bin.color }}
              />
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{bin.name}</p>
                <p className="text-xs text-gray-500 truncate">{bin.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          {translateText('match your waste to the correct bin color', selectedLanguage)}
        </p>
      </CardContent>
    </Card>
  )
}
