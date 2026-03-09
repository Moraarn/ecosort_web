"use client"

import { useEffect } from 'react'

export default function SmoothScroll() {
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        const targetId = link.getAttribute('href')?.slice(1)
        const targetElement = document.getElementById(targetId || '')
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    document.addEventListener('click', handleLinkClick)
    
    return () => {
      document.removeEventListener('click', handleLinkClick)
    }
  }, [])

  return null
}
