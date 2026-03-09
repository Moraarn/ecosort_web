'use client'

import { useEffect } from 'react'
import { translateText } from '@/lib/translations'

interface AnimationOverlayProps {
  showAnimation: boolean
  selectedLanguage: string
}

export default function AnimationOverlay({ showAnimation, selectedLanguage }: AnimationOverlayProps) {
  if (!showAnimation) return null

  return (
    <>
      {/* Animation Overlay - Person Throwing Trash */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="relative">
          {/* Person Figure */}
          <div className="relative">
            {/* Head */}
            <div className="w-8 h-8 bg-orange-300 rounded-full mx-auto mb-1"></div>
            
            {/* Body */}
            <div className="w-12 h-16 bg-blue-600 rounded-t-lg mx-auto relative">
              {/* Arms */}
              <div 
                className="absolute top-2 -left-2 w-3 h-12 bg-orange-300 rounded-full origin-top"
                style={{
                  animation: 'throwArm 1.5s ease-in-out infinite'
                }}
              ></div>
              <div className="absolute top-2 -right-2 w-3 h-12 bg-orange-300 rounded-full"></div>
            </div>
            
            {/* Legs */}
            <div className="flex justify-center gap-2">
              <div className="w-4 h-12 bg-gray-800 rounded-b-lg"></div>
              <div className="w-4 h-12 bg-gray-800 rounded-b-lg"></div>
            </div>
            
            {/* Trash Item Being Thrown */}
            <div 
              className="absolute top-8 left-8 w-6 h-6 bg-gray-500 rounded-full"
              style={{
                animation: 'throwTrash 1.5s ease-in-out infinite'
              }}
            ></div>
            
            {/* Trash Can */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-20 bg-gray-700 rounded-t-lg relative">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gray-800 rounded-t-lg"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600"></div>
              </div>
            </div>
          </div>
          
          {/* Success Message */}
          <div className="text-center mt-8">
            <p className="text-green-600 font-bold text-lg">
              {translateText('classification complete', selectedLanguage)}! 🎉
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes throwArm {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-90deg);
          }
          50% {
            transform: rotate(-45deg);
          }
          75% {
            transform: rotate(-90deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        
        @keyframes throwTrash {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          25% {
            transform: translate(20px, -10px) scale(0.9);
            opacity: 0.9;
          }
          50% {
            transform: translate(40px, -20px) scale(0.8);
            opacity: 0.8;
          }
          75% {
            transform: translate(60px, -10px) scale(0.7);
            opacity: 0.7;
          }
          100% {
            transform: translate(80px, 20px) scale(0.6);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
