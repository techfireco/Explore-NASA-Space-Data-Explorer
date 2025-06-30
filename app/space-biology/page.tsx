'use client'

import React, { useState, useEffect } from 'react'
import { Search, Download, Calendar, Users, FileText, Microscope, Dna, Beaker, Satellite, Loader2 } from 'lucide-react'
import { useAPIKey } from '@/contexts/APIKeyContext'
import {
  fetchOSDRStudyFiles,
  fetchOSDRStudyMetadata,
  searchOSDRDatasets,
  fetchOSDRExperiments,
  fetchOSDRMissions
} from '@/lib/api'

interface Study {
  identifier: string
  title: string
  description: string
  organism?: string
  assayType?: string
  projectType?: string
}

interface SearchResults {
  hits: number
  studies: Study[]
  error?: string
}

interface Experiment {
  identifier: string
  title?: string
  description?: string
  startDate?: string
  endDate?: string
}

interface Mission {
  identifier: string
  title?: string
  description?: string
  startDate?: string
  endDate?: string
}

export default function SpaceBiologyPage() {
  const { apiKey } = useAPIKey()
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [studyMetadata, setStudyMetadata] = useState<any>(null)
  const [studyFiles, setStudyFiles] = useState<any[]>([])

  useEffect(() => {
    loadInitialData()
  }, [apiKey])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [experimentsData, missionsData] = await Promise.all([
        fetchOSDRExperiments(),
        fetchOSDRMissions()
      ])
      setExperiments(experimentsData.slice(0, 10) || [])
      setMissions(missionsData.slice(0, 10) || [])
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async (retryCount = 0) => {
    if (!searchTerm.trim()) return
    
    setLoading(true)
    try {
      console.log('Searching for:', searchTerm)
      const results = await searchOSDRDatasets(
        searchTerm,
        0,
        20,
        'cgene' // Search NASA authoritative data
      )
      console.log('Search results:', results)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      
      // Retry once for network errors
      if (retryCount === 0 && error instanceof Error && 
          (error.message.includes('Network Error') || error.message.includes('timeout'))) {
        console.log('Retrying search...')
        setTimeout(() => performSearch(1), 2000) // Retry after 2 seconds
        return
      }
      
      // Show error to user with helpful guidance
      let errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      if (errorMessage.includes('Network Error') || errorMessage.includes('unavailable')) {
        errorMessage += ' You can try: 1) Checking your internet connection, 2) Waiting a few minutes and trying again, or 3) Visiting the OSDR website directly at https://osdr.nasa.gov/bio/'
      }
      
      setSearchResults({ hits: 0, studies: [], error: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    performSearch(0)
  }

  const handleStudySelect = async (study: Study) => {
    setLoading(true)
    try {
      const [metadata, files] = await Promise.all([
        fetchOSDRStudyMetadata(study.identifier),
        fetchOSDRStudyFiles(study.identifier)
      ])
      setStudyMetadata(metadata)
      setStudyFiles(files || [])
    } catch (error) {
      console.error('Failed to load study details:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Space Biology
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore NASA's Open Science Data Repository for space biology and life sciences research
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: Microscope },
            { id: 'search', label: 'Dataset Search', icon: Search },
            { id: 'experiments', label: 'Experiments', icon: Beaker },
            { id: 'missions', label: 'Missions', icon: Satellite }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="flex items-center gap-2 text-white text-lg font-semibold mb-2">
                    <Search className="h-5 w-5" />
                    Dataset Search
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Search through NASA's Open Science Data Repository
                  </p>
                </div>
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search datasets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      onClick={handleSearch}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                  {searchResults && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400">
                        Found {searchResults.hits} results
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="flex items-center gap-2 text-white text-lg font-semibold mb-2">
                    <Beaker className="h-5 w-5" />
                    Recent Experiments
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Latest space biology experiments
                  </p>
                </div>
                <div>
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {experiments.slice(0, 3).map((exp, index) => (
                        <div key={index} className="text-sm">
                          <div className="text-white font-medium">{exp.identifier}</div>
                          <div className="text-gray-400 text-xs truncate">{exp.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="flex items-center gap-2 text-white text-lg font-semibold mb-2">
                    <Satellite className="h-5 w-5" />
                    Space Missions
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Missions with biological research
                  </p>
                </div>
                <div>
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {missions.slice(0, 3).map((mission, index) => (
                        <div key={index} className="text-sm">
                          <div className="text-white font-medium">{mission.identifier}</div>
                          <div className="text-gray-400 text-xs truncate">{mission.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Overview */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="mb-6">
                <h2 className="flex items-center gap-2 text-white text-xl font-bold mb-2">
                  <Microscope className="h-6 w-6" />
                  NASA Open Science Data Repository
                </h2>
                <p className="text-gray-400">
                  Explore space biology and life sciences research data
                </p>
              </div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <Dna className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Genomics</h3>
                    <p className="text-sm text-gray-400">Gene expression studies</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <Microscope className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Cell Biology</h3>
                    <p className="text-sm text-gray-400">Cellular research</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Physiology</h3>
                    <p className="text-sm text-gray-400">Human studies</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <FileText className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Multi-omics</h3>
                    <p className="text-sm text-gray-400">Integrated data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Dataset Search</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter search terms (e.g., 'mouse liver', 'microgravity', 'gene expression')..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading || !searchTerm.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Search
                  </button>
                </div>

                {/* Search Suggestions */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Popular Search Terms</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-400 mb-2">Organisms</h4>
                      <div className="flex flex-wrap gap-2">
                        {['mouse', 'rat', 'human', 'arabidopsis', 'drosophila', 'c. elegans'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchTerm(term)}
                            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-xs transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-400 mb-2">Research Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {['microgravity', 'gene expression', 'bone density', 'muscle atrophy', 'radiation', 'space flight'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchTerm(term)}
                            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-400 mb-2">Data Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {['RNA-seq', 'proteomics', 'metabolomics', 'imaging', 'behavioral', 'physiological'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchTerm(term)}
                            className="bg-green-600/20 hover:bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-xs transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-400 mb-2">Missions & Studies</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Rodent Research', 'ISS', 'SpaceX', 'Twins Study', 'Plant Habitat', 'Cell Science'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchTerm(term)}
                            className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 px-3 py-1 rounded-full text-xs transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {searchResults && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        Search Results ({searchResults.hits || 0} found)
                      </h3>
                    </div>
                    
                    {searchResults.error && (
                      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                        <p className="text-red-300 text-sm">
                          <strong>Error:</strong> {searchResults.error}
                        </p>
                        <p className="text-red-400 text-xs mt-2">
                          The OSDR API might be temporarily unavailable. Please try again later.
                        </p>
                      </div>
                    )}
                    
                    {!searchResults.error && searchResults.studies?.length === 0 && (
                      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                        <p className="text-yellow-300 text-sm">
                          No results found for "{searchTerm}". Try different search terms or browse the suggestions above.
                        </p>
                      </div>
                    )}
                    
                    <div className="grid gap-4">
                      {searchResults.studies?.map((study: Study, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-600/50 transition-colors"
                          onClick={() => handleStudySelect(study)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-blue-400">
                              {study.title || study.identifier}
                            </h4>
                            <span className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs">
                              {study.identifier}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                            {study.description}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {study.organism && (
                              <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs">
                                {study.organism}
                              </span>
                            )}
                            {study.assayType && (
                              <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs">
                                {study.assayType}
                              </span>
                            )}
                            {study.projectType && (
                              <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs">
                                {study.projectType}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experiments' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="mb-6">
                <h2 className="flex items-center gap-2 text-white text-xl font-bold mb-2">
                  <Beaker className="h-5 w-5" />
                  Space Biology Experiments
                </h2>
                <p className="text-gray-400">
                  Browse space biology experiments and research studies
                </p>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-4">
                  {experiments.map((experiment, index) => (
                    <div key={index} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">{experiment.identifier}</h4>
                        <span className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs">
                          {formatDate(experiment.startDate)} - {formatDate(experiment.endDate)}
                        </span>
                      </div>
                      {experiment.title && (
                        <p className="text-blue-400 font-medium mb-2">{experiment.title}</p>
                      )}
                      {experiment.description && (
                        <p className="text-sm text-gray-300">{experiment.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="mb-6">
                <h2 className="flex items-center gap-2 text-white text-xl font-bold mb-2">
                  <Satellite className="h-5 w-5" />
                  Space Missions
                </h2>
                <p className="text-gray-400">
                  Missions with biological research components
                </p>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-4">
                  {missions.map((mission, index) => (
                    <div key={index} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">{mission.identifier}</h4>
                        <span className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs">
                          {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
                        </span>
                      </div>
                      {mission.title && (
                        <p className="text-blue-400 font-medium mb-2">{mission.title}</p>
                      )}
                      {mission.description && (
                        <p className="text-sm text-gray-300">{mission.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}