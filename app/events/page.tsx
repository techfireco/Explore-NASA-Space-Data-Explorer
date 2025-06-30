'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Calendar, ExternalLink, Filter, AlertTriangle, Flame, Cloud, Zap, Mountain } from 'lucide-react'
import { fetchEONETEvents, fetchEONETCategories } from '@/lib/api'
import { format } from 'date-fns'

interface EventGeometry {
  magnitudeValue?: number
  magnitudeUnit?: string
  date: string
  type: string
  coordinates: [number, number]
}

interface EventCategory {
  id: string
  title: string
}

interface EventSource {
  id: string
  url: string
}

interface Event {
  id: string
  title: string
  description?: string
  link: string
  closed?: string
  categories: EventCategory[]
  sources: EventSource[]
  geometry: EventGeometry[]
}

interface EONETResponse {
  title: string
  description: string
  link: string
  events: Event[]
}

interface Category {
  id: string
  title: string
  description: string
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDays, setSelectedDays] = useState(30)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadEvents()
  }, [selectedCategory, selectedDays])

  const loadCategories = async () => {
    try {
      const data = await fetchEONETCategories()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchEONETEvents(selectedDays, selectedCategory)
      setEvents(data.events || [])
    } catch (error: any) {
      setError('Failed to load events data')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'wildfires':
        return <Flame className="h-5 w-5 text-red-400" />
      case 'storms':
        return <Cloud className="h-5 w-5 text-blue-400" />
      case 'volcanoes':
        return <Mountain className="h-5 w-5 text-orange-400" />
      case 'severeStorms':
        return <Zap className="h-5 w-5 text-yellow-400" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />
    }
  }

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'wildfires':
        return 'border-red-500/30 bg-red-900/20'
      case 'storms':
        return 'border-blue-500/30 bg-blue-900/20'
      case 'volcanoes':
        return 'border-orange-500/30 bg-orange-900/20'
      case 'severeStorms':
        return 'border-yellow-500/30 bg-yellow-900/20'
      default:
        return 'border-gray-500/30 bg-gray-900/20'
    }
  }

  const getEventStatus = (event: Event) => {
    return event.closed ? 'Closed' : 'Active'
  }

  const getEventStatusColor = (event: Event) => {
    return event.closed ? 'text-gray-400' : 'text-green-400'
  }

  const formatCoordinates = (coords: [number, number]) => {
    const [lon, lat] = coords
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`
  }

  const getLatestGeometry = (event: Event) => {
    if (!event.geometry || event.geometry.length === 0) return null
    return event.geometry.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
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
              <div key={i} className="loading-skeleton h-64 rounded-xl" />
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
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Events</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button onClick={loadEvents} className="btn-primary">
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
          <h1 className="section-title">Earth Natural Events</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track natural disasters and events happening around the world in real-time. 
            Data provided by NASA's Earth Observatory Natural Event Tracker (EONET).
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </h2>
            <button
              onClick={() => {
                setSelectedCategory('')
                setSelectedDays(30)
              }}
              className="text-space-400 hover:text-space-300 text-sm"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-full"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Days Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Period
              </label>
              <select
                value={selectedDays}
                onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                className="input-field w-full"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-space-400 mb-2">
              {events.length}
            </div>
            <div className="text-gray-300">Total Events</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {events.filter(e => !e.closed).length}
            </div>
            <div className="text-gray-300">Active Events</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-400 mb-2">
              {events.filter(e => e.closed).length}
            </div>
            <div className="text-gray-300">Closed Events</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-cosmic-400 mb-2">
              {new Set(events.map(e => e.categories[0]?.id)).size}
            </div>
            <div className="text-gray-300">Categories</div>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="card text-center">
            <h3 className="text-xl font-bold text-gray-400 mb-4">No Events Found</h3>
            <p className="text-gray-300 mb-6">
              No events found for the selected filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('')
                setSelectedDays(30)
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const latestGeometry = getLatestGeometry(event)
              const category = event.categories[0]
              
              return (
                <div key={event.id} className="card card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getCategoryIcon(category?.id)}
                        <span className="text-sm font-medium text-gray-300">
                          {category?.title}
                        </span>
                        <span className={`text-xs font-medium ${getEventStatusColor(event)}`}>
                          {getEventStatus(event)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {latestGeometry && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-space-400" />
                        <span className="text-gray-300">
                          {formatCoordinates(latestGeometry.coordinates)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-space-400" />
                        <span className="text-gray-300">
                          {format(new Date(latestGeometry.date), 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                      {latestGeometry.magnitudeValue && (
                        <div className="text-sm">
                          <span className="text-gray-400">Magnitude:</span>
                          <span className="text-white ml-2">
                            {latestGeometry.magnitudeValue.toLocaleString()} {latestGeometry.magnitudeUnit}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </button>
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {getCategoryIcon(selectedEvent.categories[0]?.id)}
                      <span className="text-sm font-medium text-gray-300">
                        {selectedEvent.categories[0]?.title}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(selectedEvent.categories[0]?.id)}`}>
                        {getEventStatus(selectedEvent)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedEvent.title}
                    </h2>
                    {selectedEvent.description && (
                      <p className="text-gray-300">
                        {selectedEvent.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Event Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Event Timeline</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedEvent.geometry
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((geometry, index) => (
                        <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-400">Date:</span>
                              <div className="text-white">
                                {format(new Date(geometry.date), 'MMM d, yyyy HH:mm')}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Location:</span>
                              <div className="text-white">
                                {formatCoordinates(geometry.coordinates)}
                              </div>
                            </div>
                            {geometry.magnitudeValue && (
                              <div className="sm:col-span-2">
                                <span className="text-gray-400">Magnitude:</span>
                                <span className="text-white ml-2">
                                  {geometry.magnitudeValue.toLocaleString()} {geometry.magnitudeUnit}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sources */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Data Sources</h3>
                    <div className="space-y-2">
                      {selectedEvent.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-space-400 hover:text-space-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>{source.id}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <a
                      href={selectedEvent.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>View on EONET</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => setSelectedEvent(null)}
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

export default EventsPage