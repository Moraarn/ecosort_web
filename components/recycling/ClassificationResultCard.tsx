import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { translateText } from '@/lib/translations'
import { ClassificationResult } from '@/types/waste'

interface ClassificationResultProps {
  classification: ClassificationResult | null
}

export default function ClassificationResultCard({ classification }: ClassificationResultProps) {
  if (!classification || !classification.category) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translateText('classification.result', 'en')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">{translateText('category', 'en')}:</span>
          <Badge variant="secondary">{classification.category.name || 'Unknown'}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">{translateText('confidence', 'en')}:</span>
          <Badge variant={classification.confidence > 0.8 ? 'default' : 'secondary'}>
            {Math.round(classification.confidence * 100)}%
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">{translateText('bin.color', 'en')}:</span>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: classification.category.bin_color || '#gray' }}
            />
            <span>{classification.category.bin_color || 'Standard'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">{translateText('points', 'en')}:</span>
          <Badge variant="outline">+{classification.category.points_value || 0}</Badge>
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600">
            {classification.category.disposal_instructions || 'Follow standard waste disposal guidelines'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
