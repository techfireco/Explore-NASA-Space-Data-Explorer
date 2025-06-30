'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Download, Eye, Globe, Palette, RefreshCw, Satellite, Zap } from 'lucide-react'
import { fetchEPICNaturalImages, fetchEPICEnhancedImages, fetchEPICAvailableDates, getEPICImageUrl } from '@/lib/api'
import { useAPIKey } from '@/contexts/APIKeyContext'
import { format } from 'date-fns'

interface EPICImage {
  identifier: string
  caption: string
  image: string
  version: string
  centroid_coordinates: {
    lat: number
    lon: number
  }
  dscovr_j2000_position: {
    x: number
    y: number
    z: number
  }
  lunar_j2000_position: {
    x: number
    y: number
    z: number
  }
  sun_j2000_position: {
    x: number
    y: number
    z: number
  }
  attitude_quaternions: {
    q0: number
    q1: number
    q2: number
    q3: number
  }
  date: string
  coords: {
    centroid_coordinates: {
      lat: number
      lon: number
    }
    dscovr_j2000_position: {
      x: number
      y: number
      z: number
    }
    lunar_j2000_position: {
      x: number
      y: number
      z: number
    }
    sun_j2000_position: {
      x: number
      y: number
      z: number
    }
    attitude_quaternions: {
      q0: number
      q1: number
      q2: number
      q3: number
    }
  }
}

const EarthImageryPage = () => {
  const { apiKey } = useAPIKey()
  const [images, setImages] = useState<EPICImage[]>([])
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingDates, setLoadingDates] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [imageType, setImageType] = useState<'natural' | 'enhanced'>('natural')
  const [selectedImage, setSelectedImage] = useState<EPICImage | null>(null)

  useEffect(() => {
    if (apiKey) {
      loadImages()
      loadAvailableDates()
    }
  }, [apiKey, selectedDate, imageType])

  const loadImages = async () => {
    if (!apiKey) return
    
    setLoading(true)
    setError(null)
    try {
      const data = imageType === 'natural' 
        ? await fetchEPICNaturalImages(apiKey, selectedDate)
        : await fetchEPICEnhancedImages(apiKey, selectedDate)
      setImages(data || [])
    } catch (error: any) {
      setError('Failed to load Earth imagery data')
      console.error('Error loading images:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableDates = async () => {
    if (!apiKey) return
    
    setLoadingDates(true)
    try {
      const dates = await fetchEPICAvailableDates(apiKey, imageType)
      // Filter and validate dates
      const validDates = (dates || []).filter((date: string) => {
        const dateObj = new Date(date)
        return !isNaN(dateObj.getTime())
      })
      setAvailableDates(validDates)
    } catch (error) {
      console.error('Error loading available dates:', error)
      setAvailableDates([])
    } finally {
      setLoadingDates(false)
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
  }

  const handleImageTypeChange = (type: 'natural' | 'enhanced') => {
    setImageType(type)
    setSelectedDate('') // Reset date when changing type
  }

  const getImageUrl = (image: EPICImage) => {
    const imageDate = selectedDate || image.date.split(' ')[0]
    return getEPICImageUrl(image.image, imageDate, imageType, apiKey!)
  }

  const formatCoordinates = (lat: number, lon: number) => {
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`
  }

  const formatDistance = (position: { x: number; y: number; z: number }) => {
    const distance = Math.sqrt(position.x ** 2 + position.y ** 2 + position.z ** 2)
    return `${(distance / 1000).toFixed(0)} km`
  }

  if (!apiKey) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card">
            <Satellite className="h-16 w-16 text-space-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">API Key Required</h1>
            <p className="text-gray-300 mb-6">
              Please set your NASA API key to view Earth imagery from the EPIC camera.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="loading-skeleton h-12 w-96 mx-auto mb-4" />
            <div className="loading-skeleton h-6 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-skeleton h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Earth Imagery</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button onClick={loadImages} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Earth Polychromatic Imaging Camera</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            View full-disc Earth imagery captured by DSCOVR's EPIC camera from the unique vantage point 
            of the Earth-Sun Lagrange point, 1.5 million kilometers from Earth.
          </p>
        </div>

        {/* Controls */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Image Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image Type
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleImageTypeChange('natural')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageType === 'natural'
                      ? 'bg-space-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Eye className="h-4 w-4 inline mr-2" />
                  Natural
                </button>
                <button
                  onClick={() => handleImageTypeChange('enhanced')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageType === 'enhanced'
                      ? 'bg-space-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Palette className="h-4 w-4 inline mr-2" />
                  Enhanced
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="input-field w-full"
                disabled={loadingDates}
              >
                <option value="">Latest Available</option>
                {availableDates.slice(0, 30).map((date) => {
                  // Validate date before formatting
                  const dateObj = new Date(date)
                  const isValidDate = !isNaN(dateObj.getTime())
                  
                  return (
                    <option key={date} value={date}>
                      {isValidDate ? format(dateObj, 'MMM d, yyyy') : date}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Refresh */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  loadImages()
                  loadAvailableDates()
                }}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
                disabled={loading || loadingDates}
              >
                <RefreshCw className={`h-4 w-4 ${loading || loadingDates ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-space-400 mb-2">
              {images.length}
            </div>
            <div className="text-gray-300">Images Available</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-cosmic-400 mb-2">
              {availableDates.length}
            </div>
            <div className="text-gray-300">Available Dates</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              2048×2048
            </div>
            <div className="text-gray-300">Image Resolution</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              L1
            </div>
            <div className="text-gray-300">Lagrange Point</div>
          </div>
        </div>

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="card text-center">
            <h3 className="text-xl font-bold text-gray-400 mb-4">No Images Available</h3>
            <p className="text-gray-300 mb-6">
              No Earth imagery available for the selected date and type. Try selecting a different date.
            </p>
            <button
              onClick={() => setSelectedDate('')}
              className="btn-secondary"
            >
              View Latest Images
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={image.identifier || index} className="card card-hover">
                <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={getImageUrl(image)}
                    alt={image.caption || 'Earth from EPIC'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/api/placeholder/400/400'
                    }}
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {image.caption || `Earth Image ${index + 1}`}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(image.date), 'MMM d, yyyy HH:mm')}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-space-400" />
                      <span className="text-gray-400">Center:</span>
                      <span className="text-white">
                        {formatCoordinates(
                          image.centroid_coordinates.lat,
                          image.centroid_coordinates.lon
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Satellite className="h-4 w-4 text-space-400" />
                      <span className="text-gray-400">DSCOVR Distance:</span>
                      <span className="text-white">
                        {formatDistance(image.dscovr_j2000_position)}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="btn-secondary flex-1 text-sm"
                    >
                      View Details
                    </button>
                    <a
                      href={getImageUrl(image)}
                      download={`epic_${image.image}.png`}
                      className="btn-primary px-3 py-2"
                      title="Download Image"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Detail Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedImage.caption || 'Earth from EPIC'}
                    </h2>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(selectedImage.date), 'MMM d, yyyy HH:mm \'UTC\'')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={getImageUrl(selectedImage)}
                      alt={selectedImage.caption || 'Earth from EPIC'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-6">
                    {/* Coordinates */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Earth Center Coordinates</h3>
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Latitude:</span>
                            <div className="text-white">{selectedImage.centroid_coordinates.lat.toFixed(4)}°</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Longitude:</span>
                            <div className="text-white">{selectedImage.centroid_coordinates.lon.toFixed(4)}°</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spacecraft Position */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">DSCOVR Position (J2000)</h3>
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">X:</span>
                            <div className="text-white">{selectedImage.dscovr_j2000_position.x.toFixed(0)} km</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Y:</span>
                            <div className="text-white">{selectedImage.dscovr_j2000_position.y.toFixed(0)} km</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Z:</span>
                            <div className="text-white">{selectedImage.dscovr_j2000_position.z.toFixed(0)} km</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-gray-400">Distance from Earth:</span>
                          <span className="text-white ml-2">{formatDistance(selectedImage.dscovr_j2000_position)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lunar Position */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Moon Position (J2000)</h3>
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">X:</span>
                            <div className="text-white">{selectedImage.lunar_j2000_position.x.toFixed(0)} km</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Y:</span>
                            <div className="text-white">{selectedImage.lunar_j2000_position.y.toFixed(0)} km</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Z:</span>
                            <div className="text-white">{selectedImage.lunar_j2000_position.z.toFixed(0)} km</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4">
                      <a
                        href={getImageUrl(selectedImage)}
                        download={`epic_${selectedImage.image}.png`}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Image</span>
                      </a>
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="btn-secondary"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EarthImageryPage