'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface APIKeyContextType {
  apiKey: string
  setApiKey: (key: string) => void
  rateLimit: {
    remaining: number
    limit: number
    resetTime: string
  } | null
  updateRateLimit: (remaining: number, limit: number, resetTime: string) => void
  isDemo: boolean
}

const APIKeyContext = createContext<APIKeyContextType | undefined>(undefined)

export function APIKeyProvider({ children }: { children: React.ReactNode }) {
  // Initialize with environment variable or fallback to DEMO_KEY
  const defaultKey = process.env.NEXT_PUBLIC_NASA_API_KEY || process.env.NASA_API_KEY || 'DEMO_KEY'
  const [apiKey, setApiKeyState] = useState(defaultKey)
  const [rateLimit, setRateLimit] = useState<{
    remaining: number
    limit: number
    resetTime: string
  } | null>(null)

  const isDemo = apiKey === 'DEMO_KEY'

  useEffect(() => {
    // Load API key from localStorage on mount, but prefer environment variable
    const savedKey = localStorage.getItem('nasa_api_key')
    if (savedKey && savedKey !== 'DEMO_KEY' && !process.env.NEXT_PUBLIC_NASA_API_KEY && !process.env.NASA_API_KEY) {
      setApiKeyState(savedKey)
    }
  }, [])

  const setApiKey = (key: string) => {
    setApiKeyState(key)
    if (key === 'DEMO_KEY') {
      localStorage.removeItem('nasa_api_key')
    } else {
      localStorage.setItem('nasa_api_key', key)
    }
  }

  const updateRateLimit = (remaining: number, limit: number, resetTime: string) => {
    setRateLimit({ remaining, limit, resetTime })
  }

  return (
    <APIKeyContext.Provider value={{
      apiKey,
      setApiKey,
      rateLimit,
      updateRateLimit,
      isDemo
    }}>
      {children}
    </APIKeyContext.Provider>
  )
}

export function useAPIKey() {
  const context = useContext(APIKeyContext)
  if (context === undefined) {
    throw new Error('useAPIKey must be used within an APIKeyProvider')
  }
  return context
}