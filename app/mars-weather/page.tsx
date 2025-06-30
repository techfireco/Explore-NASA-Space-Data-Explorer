'use client'

import React, { useState, useEffect } from 'react'
import { Thermometer, Wind, Gauge, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { fetchMarsWeather } from '@/lib/api'
import { useAPIKey } from '@/contexts/APIKeyContext'
import { format } from 'date-fns'

interface WeatherData {
  sol: number
  ls: number
  season: string
  min_temp?: number
  max_temp?: number
  pressure?: number
  wind_speed?: number
  wind_direction?: string
  atmo_opacity?: string
  sunrise?: string
  sunset?: string
  local_uv_irradiance_index?: string
  min_gts_temp?: number
  max_gts_temp?: number
}

interface MarsWeatherResponse {
  sol_keys: string[]
  validity_checks: Record<string, any>
  [key: string]: any
}

const MarsWeatherPage = () => {
  const { apiKey } = useAPIKey()
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSol, setSelectedSol] = useState<WeatherData | null>(null)

  useEffect(() => {
    loadWeatherData()
  }, [apiKey])

  const loadWeatherData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMarsWeather(apiKey)
      
      // Transform the data structure
      const transformedData: WeatherData[] = []
      
      if (data.sol_keys && Array.isArray(data.sol_keys)) {
        data.sol_keys.forEach((solKey: string) => {
          const solData = data[solKey]
          if (solData && typeof solData === 'object') {
            transformedData.push({
              sol: parseInt(solKey),
              ls: solData.ls || 0,
              season: solData.season || 'Unknown',
              min_temp: solData.AT?.mn,
              max_temp: solData.AT?.mx,
              pressure: solData.PRE?.av,
              wind_speed: solData.HWS?.av,
              wind_direction: solData.WD?.most_common?.compass_point,
              atmo_opacity: solData.atmo_opacity,
              sunrise: solData.sunrise,
              sunset: solData.sunset,
              local_uv_irradiance_index: solData.local_uv_irradiance_index,
              min_gts_temp: solData.GTS?.mn,
              max_gts_temp: solData.GTS?.mx
            })
          }
        })
      }
      
      // Sort by sol number (most recent first)
      transformedData.sort((a, b) => b.sol - a.sol)
      setWeatherData(transformedData)
      
      if (transformedData.length > 0) {
        setSelectedSol(transformedData[0])
      }
    } catch (error: any) {
      console.error('Mars weather API error:', error)
      
      let errorMessage = 'Failed to load Mars weather data.'
      
      if (error.response?.status === 404) {
        errorMessage = 'Mars weather API endpoint not found. The InSight mission has ended and the service may have been discontinued.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Mars weather API server error. The service may be temporarily unavailable.'
      } else if (error.message?.includes('Network Error')) {
        errorMessage = 'Network error occurred. Please check your internet connection and try again.'
      } else {
        errorMessage = 'The InSight mission ended in December 2022. Historical data may be limited or unavailable due to power management issues during the mission.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const formatTemperature = (temp?: number) => {
    if (temp === undefined || temp === null) return 'N/A'
    return `${temp.toFixed(1)}°C`
  }

  const formatPressure = (pressure?: number) => {
    if (pressure === undefined || pressure === null) return 'N/A'
    return `${pressure.toFixed(1)} Pa`
  }

  const formatWindSpeed = (speed?: number) => {
    if (speed === undefined || speed === null) return 'N/A'
    return `${speed.toFixed(1)} m/s`
  }

  const getTemperatureTrend = (current?: number, previous?: number) => {
    if (!current || !previous) return null
    if (current > previous) return <TrendingUp className="h-4 w-4 text-red-400" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-blue-400" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getSeasonColor = (season: string) => {
    switch (season.toLowerCase()) {
      case 'spring':
        return 'text-green-400'
      case 'summer':
        return 'text-yellow-400'
      case 'autumn':
      case 'fall':
        return 'text-orange-400'
      case 'winter':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  const getAtmosphereOpacityColor = (opacity?: string) => {
    switch (opacity?.toLowerCase()) {
      case 'sunny':
        return 'text-yellow-400'
      case 'cloudy':
        return 'text-gray-400'
      case 'dusty':
        return 'text-orange-400'
      default:
        return 'text-gray-400'
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="loading-skeleton h-96 rounded-xl" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="loading-skeleton h-20 rounded-xl" />
              ))}
            </div>
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
            <h1 className="text-2xl font-bold text-red-400 mb-4">InSight Mars Weather Data Unavailable</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-300 text-sm mb-3">
                <strong>About Missing Data:</strong> The InSight mission experienced significant data gaps due to power management needs.
                Dust storms and seasonal changes affected the lander's solar panels, requiring careful power conservation.
              </p>
              <p className="text-gray-300 text-sm">
                For detailed information about data availability and mission status, visit the official 
                <a href="https://mars.nasa.gov/insight/weather/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline ml-1">
                  InSight Weather page
                </a> or submit feedback at 
                <a href="https://mars.nasa.gov/feedback/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline ml-1">
                  mars.nasa.gov/feedback
                </a>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={loadWeatherData} className="btn-primary">
                Try Again
              </button>
              <a href="https://mars.nasa.gov/insight/weather/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                View Official Data
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (weatherData.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card">
            <h1 className="text-2xl font-bold text-yellow-400 mb-4">No Weather Data Available</h1>
            <p className="text-gray-300 mb-6">
              No Mars weather data is currently available. The InSight API provides per-Sol summary data for the last seven available Sols (Martian Days).
            </p>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-300 text-sm mb-2">
                <strong>About Data Availability:</strong>
              </p>
              <ul className="text-left text-gray-300 text-sm space-y-1">
                <li>• Data values may change as more information is downlinked from the spacecraft</li>
                <li>• Wind and sensor data may not exist for certain date ranges</li>
                <li>• Power management requirements caused significant data gaps</li>
                <li>• Dust storms affected solar panel efficiency and data collection</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={loadWeatherData} className="btn-primary">
                Refresh
              </button>
              <a href="https://mars.nasa.gov/insight/weather/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                View Seasonal Report
              </a>
            </div>
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
          <h1 className="section-title">InSight: Mars Weather Service</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Weather data from Mars collected by NASA's InSight lander at Elysium Planitia. 
            Continuous measurements of temperature, wind, and pressure on the Martian surface.
          </p>
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg max-w-4xl mx-auto">
            <p className="text-yellow-300 text-sm mb-2">
              <strong>⚠️ Mission Status:</strong> InSight mission ended in December 2022. This service has significant missing data due to InSight needing to manage power use.
            </p>
            <p className="text-gray-300 text-sm">
              Dust storms and distance from the sun affected InSight's power situation, resulting in data gaps. 
              For more information, visit <a href="https://mars.nasa.gov/insight/weather/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">mars.nasa.gov/insight/weather</a>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Weather Display */}
          <div className="lg:col-span-2">
            {selectedSol && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Sol {selectedSol.sol}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <span className={getSeasonColor(selectedSol.season)}>
                        {selectedSol.season}
                      </span>
                      <span>LS {selectedSol.ls.toFixed(1)}°</span>
                      {selectedSol.atmo_opacity && (
                        <span className={getAtmosphereOpacityColor(selectedSol.atmo_opacity)}>
                          {selectedSol.atmo_opacity}
                        </span>
                      )}
                    </div>
                  </div>
                  <Calendar className="h-8 w-8 text-space-400" />
                </div>

                {/* Temperature */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Thermometer className="h-6 w-6 text-red-400" />
                      <h3 className="text-lg font-semibold text-white">Temperature</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">High:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-red-400">
                            {formatTemperature(selectedSol.max_temp)}
                          </span>
                          {weatherData[1] && getTemperatureTrend(selectedSol.max_temp, weatherData[1].max_temp)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Low:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-blue-400">
                            {formatTemperature(selectedSol.min_temp)}
                          </span>
                          {weatherData[1] && getTemperatureTrend(selectedSol.min_temp, weatherData[1].min_temp)}
                        </div>
                      </div>
                      {(selectedSol.max_temp && selectedSol.min_temp) && (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                          <span className="text-gray-300">Range:</span>
                          <span className="text-white font-medium">
                            {(selectedSol.max_temp - selectedSol.min_temp).toFixed(1)}°C
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Gauge className="h-6 w-6 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Atmospheric Pressure</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {formatPressure(selectedSol.pressure)}
                      </div>
                      <div className="text-sm text-gray-300">
                        {selectedSol.pressure && `${(selectedSol.pressure / 100).toFixed(2)} hPa`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wind and Additional Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Wind className="h-6 w-6 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Wind</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Speed:</span>
                        <span className="text-xl font-bold text-green-400">
                          {formatWindSpeed(selectedSol.wind_speed)}
                        </span>
                      </div>
                      {selectedSol.wind_direction && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Direction:</span>
                          <span className="text-white font-medium">
                            {selectedSol.wind_direction}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Additional Data</h3>
                    <div className="space-y-3 text-sm">
                      {selectedSol.sunrise && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Sunrise:</span>
                          <span className="text-white">{selectedSol.sunrise}</span>
                        </div>
                      )}
                      {selectedSol.sunset && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Sunset:</span>
                          <span className="text-white">{selectedSol.sunset}</span>
                        </div>
                      )}
                      {selectedSol.local_uv_irradiance_index && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">UV Index:</span>
                          <span className="text-white">{selectedSol.local_uv_irradiance_index}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sol History Sidebar */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Sols</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {weatherData.slice(0, 10).map((sol, index) => (
                  <button
                    key={sol.sol}
                    onClick={() => setSelectedSol(sol)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedSol?.sol === sol.sol
                        ? 'border-space-500 bg-space-900/30'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">Sol {sol.sol}</span>
                      <span className={`text-xs ${getSeasonColor(sol.season)}`}>
                        {sol.season}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>
                        <span className="text-red-400">{formatTemperature(sol.max_temp)}</span>
                      </div>
                      <div>
                        <span className="text-blue-400">{formatTemperature(sol.min_temp)}</span>
                      </div>
                    </div>
                    {sol.pressure && (
                      <div className="text-xs text-gray-400 mt-1">
                        {formatPressure(sol.pressure)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">About Mars Weather</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <strong className="text-white">Sol:</strong> A Martian day, approximately 24 hours and 37 minutes.
                </p>
                <p>
                  <strong className="text-white">LS:</strong> Solar longitude, indicating Mars' position in its orbit around the Sun.
                </p>
                <p>
                  <strong className="text-white">Season:</strong> Mars has seasons similar to Earth due to its axial tilt.
                </p>
                <p>
                  <strong className="text-white">Pressure:</strong> Atmospheric pressure on Mars is about 1% of Earth's.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarsWeatherPage