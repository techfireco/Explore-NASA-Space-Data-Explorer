'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Rocket, Key } from 'lucide-react'
import { useAPIKey } from '@/contexts/APIKeyContext'
import APIKeyModal from './APIKeyModal'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAPIModal, setShowAPIModal] = useState(false)
  const pathname = usePathname()
  const { isDemo, rateLimit } = useAPIKey()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/apod', label: 'APOD' },
    { href: '/mars-rover', label: 'Mars Rover' },
    { href: '/asteroids', label: 'Asteroids' },
    { href: '/mars-weather', label: 'Mars Weather' },
    { href: '/search-media', label: 'Media Search' },
    { href: '/tech-transfer', label: 'Tech Transfer' },
    { href: '/events', label: 'Earth Events' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Rocket className="h-8 w-8 text-space-400 group-hover:text-space-300 transition-colors" />
              <span className="text-xl font-bold text-gradient">Explore NASA</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-space-600/50 text-space-300 border border-space-500/50'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* API Key Status & Mobile menu button */}
            <div className="flex items-center space-x-4">
              {/* Rate Limit Indicator */}
              {rateLimit && (
                <div className="hidden sm:flex items-center space-x-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    rateLimit.remaining > 10 ? 'bg-green-400' : 
                    rateLimit.remaining > 5 ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className="text-gray-400">
                    {rateLimit.remaining}/{rateLimit.limit}
                  </span>
                </div>
              )}

              {/* API Key Button */}
              <button
                onClick={() => setShowAPIModal(true)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  isDemo 
                    ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-600/30'
                    : 'bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30'
                }`}
              >
                <Key className="h-3 w-3" />
                <span>{isDemo ? 'Demo' : 'Custom'}</span>
              </button>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-space-600/50 text-space-300 border border-space-500/50'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <APIKeyModal 
        isOpen={showAPIModal} 
        onClose={() => setShowAPIModal(false)} 
      />
    </>
  )
}

export default Navigation