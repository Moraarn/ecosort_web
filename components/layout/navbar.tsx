"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["features", "how-it-works", "impact", "about"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getNavLinkClass = (section: string) => {
    const baseClass = "transition-colors border-b-2"
    const isActive = activeSection === section
    return isActive
      ? `${baseClass} text-[var(--primary)] border-[var(--primary)] font-medium`
      : `${baseClass} text-gray-600 border-transparent hover:text-[var(--primary)]`
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b transition-all duration-300">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="EcoSort Logo" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-bold text-xl text-primary">EcoSort</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className={getNavLinkClass("features")}>
              Features
            </Link>
            <Link href="#how-it-works" className={getNavLinkClass("how-it-works")}>
              How It Works
            </Link>
            <Link href="#impact" className={getNavLinkClass("impact")}>
              Impact
            </Link>
            <Link href="#about" className={getNavLinkClass("about")}>
              About
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login">
              <button className="text-gray-600 hover:text-[var(--secondary)] font-medium transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="space-y-1">
              <div className={`w-6 h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-600 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-4">
              <Link href="#features" className={getNavLinkClass("features")}>
                Features
              </Link>
              <Link href="#how-it-works" className={getNavLinkClass("how-it-works")}>
                How It Works
              </Link>
              <Link href="#impact" className={getNavLinkClass("impact")}>
                Impact
              </Link>
              <Link href="#about" className={getNavLinkClass("about")}>
                About
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link href="/auth/login">
                  <button className="w-full text-gray-600 hover:text-[var(--secondary)] font-medium transition-colors py-2">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-lg font-medium transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
