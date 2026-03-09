'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Upload, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { translateText } from '@/lib/translations'
import { ClassificationResult } from '@/types/waste'

interface ImageUploadProps {
  selectedImage: File | null
  imagePreview: string
  isProcessing: boolean
  onImageSelect: (file: File) => void
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCameraCapture: () => void
  onClassifyImage: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  selectedLanguage: string
}

export default function ImageUpload({ 
  selectedImage, 
  imagePreview, 
  isProcessing, 
  onImageSelect, 
  onFileInput, 
  onCameraCapture, 
  onClassifyImage, 
  fileInputRef,
  selectedLanguage
}: ImageUploadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {translateText('upload.waste.image', selectedLanguage)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {imagePreview ? (
            <div className="space-y-4">
              <div className="relative h-48 w-full">
                <Image
                  src={imagePreview}
                  alt="Waste image"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={onClassifyImage} disabled={isProcessing}>
                  {isProcessing ? translateText('analyzing', 'en') : translateText('classify.waste', 'en')}
                </Button>
                <Button variant="outline" onClick={() => onImageSelect(null as any)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {translateText('clear', selectedLanguage)}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-gray-500">
                <Upload className="h-12 w-12 mx-auto mb-4" />
                <p>{translateText('upload.or.capture', 'en')}</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  {translateText('upload.image', 'en')}
                </Button>
                <Button variant="outline" onClick={onCameraCapture}>
                  <Camera className="h-4 w-4 mr-2" />
                  {translateText('camera.capture', 'en')}
                </Button>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileInput}
            className="hidden"
            capture="environment"
          />
        </div>
      </CardContent>
    </Card>
  )
}
