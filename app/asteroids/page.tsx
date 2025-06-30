'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, AlertTriangle, Info, ExternalLink, Zap, Globe } from 'lucide-react'
import { useAPIKey } from '@/contexts/APIKeyContext'
import { fetchNearEarthObjects } from '@/lib/api'
import { format, addDays } from 'date-fns'

interface CloseApproachData {
  close_approach_date: string
  close_approach_date_full: string
  epoch_date_close_approach: number
  relative_velocity: {
    kilometers_per_second: string
    kilometers_per_hour: string
    miles_per_hour: string
  }
  miss_distance: {
    astronomical: string
    lunar: string
    kilometers: string
    miles: string
  }
  orbiting_body: string
}

interface Asteroid {
  id: string
  neo_reference_id: string
  name: string
  nasa_jpl_url: string
  absolute_magnitude_h: number
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
    meters: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
    miles: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
    feet: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
  }
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: CloseApproachData[]
  is_sentry_object: boolean
}

interface NEOData {
  links: {
    next?: string
    prev?: string
    self: string
  }
  element_count: number
  near_earth_objects: {
    [date: string]: Asteroid[]
  }
}

const AsteroidsPage = () => {
  const [neoData, setNeoData] = useState<NEOData | null>(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'))
  const [error, setError] = useState<string | null>(null)
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null)
  const { apiKey } = useAPIKey()

  useEffect(() => {
    loadNEOData()
  }, [apiKey, startDate, endDate])

  const loadNEOData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchNearEarthObjects(apiKey, startDate, endDate)
      setNeoData(data)
    } catch (error: any) {
      setError(error.response?.data?.error_message || 'Failed to load asteroid data')
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = () => {
    if (startDate && endDate) {
      loadNEOData()
    }
  }

  const getAllAsteroids = (): Asteroid[] => {
    if (!neoData) return []
    return Object.values(neoData.near_earth_objects).flat()
  }

  const getHazardousAsteroids = (): Asteroid[] => {
    return getAllAsteroids().filter(asteroid => asteroid.is_potentially_hazardous_asteroid)
  }

  const formatDistance = (distance: string, unit: string) => {
    const num = parseFloat(distance)
    return `${num.toLocaleString()} ${unit}`
  }

  const formatVelocity = (velocity: string) => {
    const num = parseFloat(velocity)
    return num.toLocaleString()
  }

  const getDangerLevel = (asteroid: Asteroid) => {
    if (asteroid.is_potentially_hazardous_asteroid) return 'high'
    const approach = asteroid.close_approach_data[0]
    const missDistance = parseFloat(approach.miss_distance.lunar)
    if (missDistance < 10) return 'medium'
    return 'low'
  }

  const getDangerColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
      default: return 'text-green-400 bg-green-900/20 border-green-500/30'
    }
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
              <div key={i} className="loading-skeleton h-48 rounded-xl" />
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
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Asteroid Data</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button onClick={loadNEOData} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const allAsteroids = getAllAsteroids()
  const hazardousAsteroids = getHazardousAsteroids()

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Near Earth Objects</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track asteroids and comets approaching Earth. Monitor potentially hazardous objects 
            and their closest approach distances and velocities.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-space-400" />
              <span className="text-white font-medium">Date Range:</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-gray-300 text-sm">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-gray-300 text-sm">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <button onClick={handleDateChange} className="btn-primary">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {neoData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-space-400 mb-2">
                {neoData.element_count}
              </div>
              <div className="text-gray-300">Total Objects</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {hazardousAsteroids.length}
              </div>
              <div className="text-gray-300">Potentially Hazardous</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {allAsteroids.length - hazardousAsteroids.length}
              </div>
              <div className="text-gray-300">Safe Objects</div>
            </div>
          </div>
        )}

        {/* Asteroids List */}
        {neoData && (
          <div className="space-y-6">
            {Object.entries(neoData.near_earth_objects).map(([date, asteroids]) => (
              <div key={date}>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-space-400" />
                  <span>{format(new Date(date), 'MMMM d, yyyy')}</span>
                  <span className="text-sm text-gray-400 font-normal">({asteroids.length} objects)</span>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {asteroids.map((asteroid) => {
                    const approach = asteroid.close_approach_data[0]
                    const dangerLevel = getDangerLevel(asteroid)
                    
                    return (
                      <div key={asteroid.id} className="card card-hover">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">
                              {asteroid.name}
                            </h3>
                            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getDangerColor(dangerLevel)}`}>
                              {asteroid.is_potentially_hazardous_asteroid ? (
                                <AlertTriangle className="h-3 w-3" />
                              ) : (
                                <Info className="h-3 w-3" />
                              )}
                              <span>
                                {asteroid.is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Safe'}
                              </span>
                            </div>
                          </div>
                          <a
                            href={asteroid.nasa_jpl_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Diameter:</span>
                            <div className="text-white">
                              {asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(0)} - 
                              {asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} m
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Approach Date:</span>
                            <div className="text-white">
                              {format(new Date(approach.close_approach_date), 'MMM d, yyyy')}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Miss Distance:</span>
                            <div className="text-white">
                              {formatDistance(approach.miss_distance.lunar, 'LD')}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDistance(approach.miss_distance.kilometers, 'km')}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Velocity:</span>
                            <div className="text-white flex items-center space-x-1">
                              <Zap className="h-3 w-3" />
                              <span>{formatVelocity(approach.relative_velocity.kilometers_per_hour)} km/h</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedAsteroid(asteroid)}
                          className="mt-4 w-full btn-secondary text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Modal */}
        {selectedAsteroid && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedAsteroid.name}
                    </h2>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getDangerColor(getDangerLevel(selectedAsteroid))}`}>
                      {selectedAsteroid.is_potentially_hazardous_asteroid ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                      <span>
                        {selectedAsteroid.is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Safe Object'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAsteroid(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">NEO Reference ID:</span>
                        <div className="text-white font-mono">{selectedAsteroid.neo_reference_id}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Absolute Magnitude:</span>
                        <div className="text-white">{selectedAsteroid.absolute_magnitude_h}</div>
                      </div>
                    </div>
                  </div>

                  {/* Size Estimates */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Estimated Diameter</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Meters:</span>
                        <div className="text-white">
                          {selectedAsteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(1)} - 
                          {selectedAsteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(1)} m
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Feet:</span>
                        <div className="text-white">
                          {selectedAsteroid.estimated_diameter.feet.estimated_diameter_min.toFixed(0)} - 
                          {selectedAsteroid.estimated_diameter.feet.estimated_diameter_max.toFixed(0)} ft
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Close Approach Data */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Close Approach Data</h3>
                    {selectedAsteroid.close_approach_data.map((approach, index) => (
                      <div key={index} className="bg-gray-700/30 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Date:</span>
                            <div className="text-white">{approach.close_approach_date_full}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Orbiting Body:</span>
                            <div className="text-white flex items-center space-x-1">
                              <Globe className="h-3 w-3" />
                              <span>{approach.orbiting_body}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Miss Distance:</span>
                            <div className="text-white">
                              <div>{formatDistance(approach.miss_distance.kilometers, 'km')}</div>
                              <div className="text-xs text-gray-400">
                                {formatDistance(approach.miss_distance.lunar, 'Lunar Distances')}
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Relative Velocity:</span>
                            <div className="text-white">
                              <div>{formatVelocity(approach.relative_velocity.kilometers_per_hour)} km/h</div>
                              <div className="text-xs text-gray-400">
                                {formatVelocity(approach.relative_velocity.kilometers_per_second)} km/s
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <a
                      href={selectedAsteroid.nasa_jpl_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>View on NASA JPL</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => setSelectedAsteroid(null)}
                      className="btn-secondary"
                    >
                      Close
                    </button>
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

export default AsteroidsPage