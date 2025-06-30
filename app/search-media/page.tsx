'use client'

import React, { useState, useEffect } from 'react'
import { Search, Play, Download, ExternalLink, Calendar, User, Filter, Grid, List, Image as ImageIcon, Video, X } from 'lucide-react'
import { searchNASAMedia } from '@/lib/api'
import { format } from 'date-fns'

interface MediaItem {
  href: string
  data: Array<{
    nasa_id: string
    title: string
    description?: string
    media_type: 'image' | 'video' | 'audio'
    date_created: string
    center?: string
    photographer?: string
    keywords?: string[]
    description_508?: string
  }>
  links?: Array<{
    href: string
    rel: string
    render?: string
  }>
}

interface SearchResponse {
  collection: {
    version: string
    href: string
    items: MediaItem[]
    metadata: {
      total_hits: number
    }
    links?: Array<{
      href: string
      rel: string
      prompt?: string
    }>
  }
}

const SearchMediaPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalHits, setTotalHits] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [mediaType, setMediaType] = useState<'all' | 'image' | 'video' | 'audio'>('all')
  const [yearStart, setYearStart] = useState('')
  const [yearEnd, setYearEnd] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const itemsPerPage = 24

  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setError(null)
    setCurrentPage(page)
    setHasSearched(true)
    
    try {
      const data = await searchNASAMedia(
        searchQuery,
        mediaType === 'all' ? undefined : mediaType,
        yearStart || undefined,
        yearEnd || undefined,
        page
      )
      
      setMediaItems(data.collection.items || [])
      setTotalHits(data.collection.metadata?.total_hits || 0)
    } catch (error: any) {
      setError('Failed to search media. Please try again.')
      setMediaItems([])
      setTotalHits(0)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(1)
    }
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      default:
        return <ImageIcon className="h-4 w-4" />
    }
  }

  const getMediaTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'text-blue-400'
      case 'video':
        return 'text-red-400'
      case 'audio':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  const getThumbnailUrl = (item: MediaItem) => {
    const thumbnailLink = item.links?.find(link => link.rel === 'preview')
    return thumbnailLink?.href || '/placeholder-image.jpg'
  }

  const getOriginalUrl = (item: MediaItem) => {
    return item.href
  }

  const totalPages = Math.ceil(totalHits / itemsPerPage)

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handleSearch(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button onClick={() => handleSearch(1)} className="btn-secondary">
              1
            </button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handleSearch(page)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-space-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
            <button onClick={() => handleSearch(totalPages)} className="btn-secondary">
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handleSearch(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">NASA Image and Video Library</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Access NASA's comprehensive collection of space images, videos, and audio files from images.nasa.gov. 
            Search through thousands of high-quality media assets from missions, research, and educational content.
          </p>
          
          {/* API Information */}
          <div className="bg-gray-800 rounded-lg p-6 mt-8 text-left max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">API Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Available Endpoints</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• <strong>GET /search:</strong> Search media assets by query and filters</li>
                  <li>• <strong>GET /asset/{'{nasa_id}'}:</strong> Retrieve media asset manifest</li>
                  <li>• <strong>GET /metadata/{'{nasa_id}'}:</strong> Get metadata location</li>
                  <li>• <strong>GET /captions/{'{nasa_id}'}:</strong> Access video captions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Search Features</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• <strong>Media Types:</strong> Images, videos, and audio files</li>
                  <li>• <strong>Date Filtering:</strong> Search by year range</li>
                  <li>• <strong>Pagination:</strong> Browse through large result sets</li>
                  <li>• <strong>REST API:</strong> JSON responses with predictable URLs</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                <strong>Data Source:</strong> Official NASA Image and Video Library API • 
                <a href="https://images.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  Visit images.nasa.gov
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Search Controls */}
        <div className="card mb-8">
          <div className="space-y-6">
            {/* Main Search */}
            <div className="space-y-3">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for space images, videos, missions..."
                    className="input-field pl-10 w-full"
                  />
                </div>
                <button
                  onClick={() => handleSearch(1)}
                  disabled={loading || !searchQuery.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
              
              {/* Quick Search Suggestions */}
              {!hasSearched && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-400">Popular searches:</span>
                  {['Mars', 'ISS', 'Hubble', 'Apollo 11', 'Earth', 'Jupiter', 'Curiosity', 'SpaceX'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        handleSearch(1)
                      }}
                      className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Media Type
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as any)}
                  className="input-field w-full"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year Start
                </label>
                <input
                  type="number"
                  value={yearStart}
                  onChange={(e) => setYearStart(e.target.value)}
                  placeholder="e.g., 2020"
                  min="1958"
                  max={new Date().getFullYear()}
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year End
                </label>
                <input
                  type="number"
                  value={yearEnd}
                  onChange={(e) => setYearEnd(e.target.value)}
                  placeholder="e.g., 2024"
                  min="1958"
                  max={new Date().getFullYear()}
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  View Mode
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-space-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                    <span>Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-space-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <List className="h-4 w-4" />
                    <span>List</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            {(mediaType !== 'all' || yearStart || yearEnd) && (
              <div className="flex justify-center pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setMediaType('all')
                    setYearStart('')
                    setYearEnd('')
                  }}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {hasSearched && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-300">
              {loading ? (
                'Searching...'
              ) : (
                `${totalHits.toLocaleString()} results found${searchQuery ? ` for "${searchQuery}"` : ''}`
              )}
            </div>
            {totalHits > 0 && (
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className={viewMode === 'grid' ? 'loading-skeleton h-64 rounded-xl' : 'loading-skeleton h-32 rounded-xl'}>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card text-center">
            <h3 className="text-xl font-bold text-red-400 mb-4">Search Error</h3>
            <p className="text-gray-300 mb-6">{error}</p>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Troubleshooting Tips:</h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• <strong>Network issues:</strong> Check your internet connection and try again</li>
                <li>• <strong>Search terms:</strong> Try simpler keywords or remove special characters</li>
                <li>• <strong>Rate limiting:</strong> Wait a moment before making another search</li>
                <li>• <strong>Server issues:</strong> The NASA API may be temporarily unavailable</li>
                <li>• <strong>Filter conflicts:</strong> Try clearing filters and searching again</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => handleSearch(currentPage)} className="btn-primary">
                Try Again
              </button>
              <a 
                href="https://images.nasa.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-secondary"
              >
                Visit Official Site
              </a>
            </div>
          </div>
        )}

        {/* No Results */}
        {hasSearched && !loading && !error && mediaItems.length === 0 && (
          <div className="card text-center">
            <h3 className="text-xl font-bold text-gray-400 mb-4">No Results Found</h3>
            <p className="text-gray-300 mb-6">
              No media found for your search criteria. The NASA Image and Video Library contains thousands of assets - try adjusting your search.
            </p>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Search Suggestions:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-white font-medium mb-2">Popular Topics:</h5>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• "Mars" - Red planet exploration</li>
                    <li>• "ISS" - International Space Station</li>
                    <li>• "Hubble" - Space telescope images</li>
                    <li>• "Apollo" - Moon landing missions</li>
                    <li>• "Earth" - Our planet from space</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2">Search Tips:</h5>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Use simple, descriptive keywords</li>
                    <li>• Try mission names (e.g., "Curiosity")</li>
                    <li>• Search for celestial objects (e.g., "Jupiter")</li>
                    <li>• Remove year filters for broader results</li>
                    <li>• Try different media types</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setMediaType('all')
                  setYearStart('')
                  setYearEnd('')
                }}
                className="btn-secondary"
              >
                Clear All Filters
              </button>
              <a 
                href="https://images.nasa.gov/search-results?q=mars&media=image" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
              >
                Browse Popular Content
              </a>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && mediaItems.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mediaItems.map((item, index) => {
                  const data = item.data[0]
                  if (!data) return null
                  
                  return (
                    <div key={`${data.nasa_id}-${index}`} className="card card-hover group">
                      <div className="relative aspect-video mb-4 bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={getThumbnailUrl(item)}
                          alt={data.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder-image.jpg'
                          }}
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm ${getMediaTypeColor(data.media_type)}`}>
                            {getMediaIcon(data.media_type)}
                            <span className="capitalize">{data.media_type}</span>
                          </span>
                        </div>
                        {data.media_type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white/80" />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-space-300 transition-colors">
                          {data.title}
                        </h3>
                        
                        {data.description && (
                          <p className="text-sm text-gray-300 line-clamp-3">
                            {data.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{format(new Date(data.date_created), 'MMM d, yyyy')}</span>
                          {data.center && <span>{data.center}</span>}
                        </div>
                        
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="w-full btn-secondary text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {mediaItems.map((item, index) => {
                  const data = item.data[0]
                  if (!data) return null
                  
                  return (
                    <div key={`${data.nasa_id}-${index}`} className="card">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="relative w-32 h-24 bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={getThumbnailUrl(item)}
                              alt={data.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder-image.jpg'
                              }}
                            />
                            {data.media_type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="h-6 w-6 text-white/80" />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-700 ${getMediaTypeColor(data.media_type)}`}>
                                  {getMediaIcon(data.media_type)}
                                  <span className="capitalize">{data.media_type}</span>
                                </span>
                                <span className="text-xs text-gray-400">
                                  {format(new Date(data.date_created), 'MMM d, yyyy')}
                                </span>
                                {data.center && (
                                  <span className="text-xs text-gray-400">{data.center}</span>
                                )}
                              </div>
                              
                              <h3 className="font-semibold text-white mb-2 line-clamp-1">
                                {data.title}
                              </h3>
                              
                              {data.description && (
                                <p className="text-sm text-gray-300 line-clamp-2">
                                  {data.description}
                                </p>
                              )}
                            </div>
                            
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="btn-secondary text-sm ml-4"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            
            {renderPagination()}
          </>
        )}

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {(() => {
                  const data = selectedItem.data[0]
                  if (!data) return null
                  
                  return (
                    <>
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-700 ${getMediaTypeColor(data.media_type)}`}>
                              {getMediaIcon(data.media_type)}
                              <span className="capitalize">{data.media_type}</span>
                            </span>
                            <span className="text-sm text-gray-400">
                              {format(new Date(data.date_created), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2">
                            {data.title}
                          </h2>
                          <div className="text-sm text-gray-400 mb-4">
                            NASA ID: {data.nasa_id}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedItem(null)}
                          className="text-gray-400 hover:text-white text-xl"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                            <img
                              src={getThumbnailUrl(selectedItem)}
                              alt={data.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder-image.jpg'
                              }}
                            />
                            {data.media_type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="h-16 w-16 text-white/80" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <a
                              href={getOriginalUrl(selectedItem)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary flex items-center space-x-2 flex-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>View Original</span>
                            </a>
                            <a
                              href={getThumbnailUrl(selectedItem)}
                              download={`${data.nasa_id}.jpg`}
                              className="btn-secondary flex items-center space-x-2"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {data.description && (
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {data.description}
                              </p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            {data.center && (
                              <div>
                                <span className="text-gray-400">Center:</span>
                                <div className="text-white">{data.center}</div>
                              </div>
                            )}
                            {data.photographer && (
                              <div>
                                <span className="text-gray-400">Photographer:</span>
                                <div className="text-white">{data.photographer}</div>
                              </div>
                            )}
                          </div>
                          
                          {data.keywords && data.keywords.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-2">Keywords</h3>
                              <div className="flex flex-wrap gap-2">
                                {data.keywords.slice(0, 10).map((keyword, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchMediaPage