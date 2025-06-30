'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Camera, Calendar, Filter, Grid, List, ChevronDown, ExternalLink } from 'lucide-react'
import { useAPIKey } from '@/contexts/APIKeyContext'
import { fetchMarsRoverPhotos, fetchRoverManifest } from '@/lib/api'
import { format } from 'date-fns'

interface Photo {
  id: number
  img_src: string
  earth_date: string
  sol: number
  camera: {
    id: number
    name: string
    full_name: string
  }
  rover: {
    id: number
    name: string
    status: string
  }
}

interface RoverManifest {
  name: string
  landing_date: string
  launch_date: string
  status: string
  max_sol: number
  max_date: string
  total_photos: number
  photos: Array<{
    sol: number
    earth_date: string
    total_photos: number
    cameras: string[]
  }>
}

const MarsRoverPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [manifest, setManifest] = useState<RoverManifest | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedRover, setSelectedRover] = useState('curiosity')
  const [selectedCamera, setSelectedCamera] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSol, setSelectedSol] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const { apiKey } = useAPIKey()

  const rovers = [
    { id: 'curiosity', name: 'Curiosity', description: 'Nuclear-powered rover exploring Gale Crater since 2012' },
    { id: 'opportunity', name: 'Opportunity', description: 'Solar-powered rover that operated from 2004-2018' },
    { id: 'spirit', name: 'Spirit', description: 'Solar-powered rover that operated from 2004-2010' },
    { id: 'perseverance', name: 'Perseverance', description: 'Latest rover with helicopter companion, landed 2021' },
    { id: 'ingenuity', name: 'Ingenuity', description: 'Mars helicopter companion to Perseverance' }
  ]

  const cameras = {
    curiosity: [
      { id: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
      { id: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
      { id: 'MAST', name: 'Mast Camera' },
      { id: 'CHEMCAM', name: 'Chemistry and Camera Complex' },
      { id: 'MAHLI', name: 'Mars Hand Lens Imager' },
      { id: 'MARDI', name: 'Mars Descent Imager' },
      { id: 'NAVCAM', name: 'Navigation Camera' }
    ],
    opportunity: [
      { id: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
      { id: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
      { id: 'NAVCAM', name: 'Navigation Camera' },
      { id: 'PANCAM', name: 'Panoramic Camera' },
      { id: 'MINITES', name: 'Miniature Thermal Emission Spectrometer' }
    ],
    spirit: [
      { id: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
      { id: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
      { id: 'NAVCAM', name: 'Navigation Camera' },
      { id: 'PANCAM', name: 'Panoramic Camera' },
      { id: 'MINITES', name: 'Miniature Thermal Emission Spectrometer' }
    ],
    perseverance: [
      { id: 'EDL_RUCAM', name: 'Rover Up-Look Camera' },
      { id: 'EDL_RDCAM', name: 'Rover Down-Look Camera' },
      { id: 'EDL_DDCAM', name: 'Descent Stage Down-Look Camera' },
      { id: 'EDL_PUCAM1', name: 'Parachute Up-Look Camera A' },
      { id: 'EDL_PUCAM2', name: 'Parachute Up-Look Camera B' },
      { id: 'NAVCAM_LEFT', name: 'Navigation Camera - Left' },
      { id: 'NAVCAM_RIGHT', name: 'Navigation Camera - Right' },
      { id: 'MCZ_LEFT', name: 'Mast Camera Zoom - Left' },
      { id: 'MCZ_RIGHT', name: 'Mast Camera Zoom - Right' },
      { id: 'FRONT_HAZCAM_LEFT_A', name: 'Front Hazard Camera - Left' },
      { id: 'FRONT_HAZCAM_RIGHT_A', name: 'Front Hazard Camera - Right' },
      { id: 'REAR_HAZCAM_LEFT', name: 'Rear Hazard Camera - Left' },
      { id: 'REAR_HAZCAM_RIGHT', name: 'Rear Hazard Camera - Right' }
    ],
    ingenuity: [
      { id: 'NAV', name: 'Navigation Camera' },
      { id: 'RTE', name: 'Return to Earth Camera' }
    ]
  }

  useEffect(() => {
    const loadManifest = async () => {
      try {
        const manifestData = await fetchRoverManifest(apiKey, selectedRover)
        setManifest(manifestData)
      } catch (error) {
        console.error('Error loading manifest:', error)
      }
    }

    loadManifest()
  }, [apiKey, selectedRover])

  useEffect(() => {
    loadPhotos()
  }, [selectedRover, selectedCamera, selectedDate, selectedSol, page])

  const loadPhotos = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMarsRoverPhotos(
        apiKey,
        selectedRover,
        selectedSol ? parseInt(selectedSol) : undefined,
        selectedDate || undefined,
        selectedCamera || undefined,
        page
      )
      setPhotos(data.photos || [])
    } catch (error: any) {
      setError(error.response?.data?.error?.message || 'Failed to load rover photos')
    } finally {
      setLoading(false)
    }
  }

  const handleRoverChange = (rover: string) => {
    setSelectedRover(rover)
    setSelectedCamera('')
    setSelectedDate('')
    setSelectedSol('')
    setPage(1)
  }

  const handleFilterChange = () => {
    setPage(1)
    loadPhotos()
  }

  const clearFilters = () => {
    setSelectedCamera('')
    setSelectedDate('')
    setSelectedSol('')
    setPage(1)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Mars Rover Explorer</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the Red Planet through the eyes of NASA's Mars rovers. 
            View photos from different cameras and mission days.
          </p>
        </div>

        {/* Rover Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Select Rover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rovers.map((rover) => (
              <button
                key={rover.id}
                onClick={() => handleRoverChange(rover.id)}
                className={`card card-hover text-left transition-all duration-300 ${
                  selectedRover === rover.id 
                    ? 'ring-2 ring-space-500 bg-space-900/20' 
                    : ''
                }`}
              >
                <h3 className="text-lg font-bold text-white mb-2">{rover.name}</h3>
                <p className="text-gray-300 text-sm">{rover.description}</p>
                {manifest && selectedRover === rover.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className={`ml-2 font-medium ${
                          manifest.status === 'active' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {manifest.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Photos:</span>
                        <span className="text-white ml-2">{manifest.total_photos.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={clearFilters}
                className="text-space-400 hover:text-space-300 text-sm"
              >
                Clear All
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-space-600' : 'bg-gray-700'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-space-600' : 'bg-gray-700'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Camera Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Camera
              </label>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="input-field w-full"
              >
                <option value="">All Cameras</option>
                {cameras[selectedRover as keyof typeof cameras]?.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Earth Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Earth Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={manifest?.max_date}
                className="input-field w-full"
              />
            </div>

            {/* Sol Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sol (Mars Day)
              </label>
              <input
                type="number"
                value={selectedSol}
                onChange={(e) => setSelectedSol(e.target.value)}
                min="0"
                max={manifest?.max_sol}
                placeholder="Enter sol number"
                className="input-field w-full"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleFilterChange}
                className="btn-primary w-full"
              >
                Search Photos
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-skeleton h-64 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="card text-center">
            <h3 className="text-xl font-bold text-red-400 mb-4">Error Loading Photos</h3>
            <p className="text-gray-300 mb-6">{error}</p>
            <button onClick={loadPhotos} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : photos.length === 0 ? (
          <div className="card text-center">
            <h3 className="text-xl font-bold text-gray-400 mb-4">No Photos Found</h3>
            <p className="text-gray-300 mb-6">
              No photos found for the selected filters. Try adjusting your search criteria.
            </p>
            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {photos.map((photo) => (
              <div key={photo.id} className="card card-hover">
                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={photo.img_src}
                    alt={`Mars photo from ${photo.camera.full_name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-space-400 text-sm font-medium">
                      {photo.camera.full_name}
                    </span>
                    <a
                      href={photo.img_src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Earth Date:</span>
                      <span className="text-white ml-2">{photo.earth_date}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Sol:</span>
                      <span className="text-white ml-2">{photo.sol}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {photos.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="flex items-center px-4 py-2 text-gray-300">
                Page {page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={photos.length < 25}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarsRoverPage