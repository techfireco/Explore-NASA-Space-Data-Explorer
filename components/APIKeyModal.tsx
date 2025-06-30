'use client'

import React, { useState } from 'react'
import { X, Key, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAPIKey } from '@/contexts/APIKeyContext'

interface APIKeyModalProps {
  isOpen: boolean
  onClose: () => void
}

const APIKeyModal: React.FC<APIKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, isDemo, rateLimit } = useAPIKey()
  const [inputKey, setInputKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  if (!isOpen) return null

  const handleSaveKey = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey.trim())
      setInputKey('')
      onClose()
    }
  }

  const handleUseDemoKey = () => {
    setApiKey('DEMO_KEY')
    setInputKey('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Key className="h-6 w-6 text-space-400" />
          <h2 className="text-xl font-bold text-white">NASA API Key</h2>
        </div>

        {/* Current Status */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            {isDemo ? (
              <>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Using Demo Key</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-medium">Custom Key Active</span>
              </>
            )}
          </div>
          
          {rateLimit && (
            <div className="text-sm text-gray-400">
              Rate Limit: {rateLimit.remaining}/{rateLimit.limit} requests remaining
            </div>
          )}
        </div>

        {/* Demo Key Info */}
        {isDemo && (
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-400 font-medium mb-2">Demo Key Limitations:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 30 requests per hour</li>
              <li>• 50 requests per day</li>
              <li>• Shared across all demo users</li>
            </ul>
          </div>
        )}

        {/* API Key Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter your NASA API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter your API key here..."
              className="input-field w-full pr-20"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-sm"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Get API Key Link */}
        <div className="mb-6">
          <a
            href="https://api.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-space-400 hover:text-space-300 transition-colors"
          >
            <span>Get your free NASA API key</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleSaveKey}
            disabled={!inputKey.trim()}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save API Key
          </button>
          <button
            onClick={handleUseDemoKey}
            className="btn-secondary"
          >
            Use Demo
          </button>
        </div>

        {/* Benefits */}
        <div className="mt-6 bg-space-900/20 border border-space-700/50 rounded-lg p-4">
          <h3 className="text-space-400 font-medium mb-2">Benefits of Custom API Key:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• 1,000 requests per hour</li>
            <li>• No daily limits</li>
            <li>• Faster response times</li>
            <li>• Priority access to new features</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default APIKeyModal