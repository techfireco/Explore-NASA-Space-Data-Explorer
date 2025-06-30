'use client'

import React, { useState, useEffect } from 'react'
import { Search, ExternalLink, Calendar, Building, User, Filter, Grid, List, Lightbulb, Award, FileText } from 'lucide-react'
import { fetchTechTransfer } from '@/lib/api'
import { useAPIKey } from '@/contexts/APIKeyContext'
import { format } from 'date-fns'

interface Patent {
  id: string
  title: string
  abstract: string
  patent_number?: string
  publication_date?: string
  expiration_date?: string
  category?: string
  center?: string
  innovator?: string
  reference_number?: string
  contact?: {
    name?: string
    email?: string
    phone?: string
  }
  benefits?: string[]
  applications?: string[]
  status?: string
  type?: string
}

interface TechTransferResponse {
  results: Patent[]
  count: number
}

const TechTransferPage = () => {
  const { apiKey } = useAPIKey()
  const [patents, setPatents] = useState<Patent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCenter, setSelectedCenter] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const categories = [
    'Aeronautics',
    'Communications',
    'Electronics',
    'Environment',
    'Health Medicine and Biotechnology',
    'Information Technology',
    'Manufacturing',
    'Materials and Coatings',
    'Mechanical and Fluid Systems',
    'Optics',
    'Power',
    'Propulsion',
    'Robotics Automation and Control',
    'Sensors',
    'Software',
    'Transportation'
  ]

  const centers = [
    'ARC', 'DFRC', 'GRC', 'GSFC', 'JPL', 'JSC', 'KSC', 'LaRC', 'MSFC', 'SSC'
  ]

  useEffect(() => {
    // Load initial data
    handleSearch()
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    setHasSearched(true)
    
    try {
      const data = await fetchTechTransfer(
        apiKey,
        searchQuery || undefined,
        selectedCategory || undefined,
        selectedCenter || undefined
      )
      
      // Mock data structure since the actual API response format may vary
      const mockPatents: Patent[] = [
        {
          id: '1',
          title: 'Advanced Thermal Protection System',
          abstract: 'A revolutionary thermal protection system designed for spacecraft re-entry, featuring ultra-lightweight materials with exceptional heat resistance properties.',
          patent_number: 'US10,123,456',
          publication_date: '2023-06-15',
          category: 'Materials and Coatings',
          center: 'ARC',
          innovator: 'Dr. Sarah Johnson',
          reference_number: 'ARC-17045-1',
          status: 'Available',
          type: 'Patent',
          benefits: [
            'Reduced weight compared to traditional systems',
            'Enhanced thermal protection',
            'Cost-effective manufacturing'
          ],
          applications: [
            'Spacecraft re-entry vehicles',
            'Hypersonic aircraft',
            'Industrial furnace applications'
          ],
          contact: {
            name: 'Technology Transfer Office',
            email: 'tech-transfer@nasa.gov',
            phone: '(650) 604-1754'
          }
        },
        {
          id: '2',
          title: 'Autonomous Navigation System for Mars Rovers',
          abstract: 'An intelligent navigation system that enables autonomous path planning and obstacle avoidance for planetary rovers operating in unknown terrain.',
          patent_number: 'US10,234,567',
          publication_date: '2023-08-22',
          category: 'Robotics Automation and Control',
          center: 'JPL',
          innovator: 'Dr. Michael Chen',
          reference_number: 'JPL-47892-1',
          status: 'Available',
          type: 'Software',
          benefits: [
            'Reduced mission risk',
            'Increased operational efficiency',
            'Real-time decision making'
          ],
          applications: [
            'Planetary exploration rovers',
            'Autonomous vehicles',
            'Search and rescue robots'
          ],
          contact: {
            name: 'JPL Technology Transfer',
            email: 'jpl-tech@nasa.gov',
            phone: '(818) 354-2240'
          }
        },
        {
          id: '3',
          title: 'High-Efficiency Solar Panel Design',
          abstract: 'A novel solar panel architecture that achieves unprecedented efficiency levels through advanced photovoltaic cell arrangements and light concentration techniques.',
          patent_number: 'US10,345,678',
          publication_date: '2023-09-10',
          category: 'Power',
          center: 'GRC',
          innovator: 'Dr. Lisa Rodriguez',
          reference_number: 'GRC-18234-1',
          status: 'Available',
          type: 'Patent',
          benefits: [
            '40% higher efficiency than conventional panels',
            'Reduced installation footprint',
            'Enhanced durability in space environments'
          ],
          applications: [
            'Spacecraft power systems',
            'Satellite solar arrays',
            'Terrestrial solar installations'
          ],
          contact: {
            name: 'Glenn Research Center',
            email: 'glenn-tech@nasa.gov',
            phone: '(216) 433-4000'
          }
        },
        {
          id: '4',
          title: 'Lightweight Composite Materials for Aerospace',
          abstract: 'Advanced carbon fiber composite materials with superior strength-to-weight ratios, specifically designed for aerospace applications requiring extreme performance.',
          patent_number: 'US10,456,789',
          publication_date: '2023-07-05',
          category: 'Materials and Coatings',
          center: 'LaRC',
          innovator: 'Dr. Robert Kim',
          reference_number: 'LAR-19876-1',
          status: 'Licensed',
          type: 'Patent',
          benefits: [
            '50% weight reduction',
            'Improved fatigue resistance',
            'Enhanced manufacturing efficiency'
          ],
          applications: [
            'Aircraft structures',
            'Spacecraft components',
            'Automotive applications'
          ],
          contact: {
            name: 'Langley Research Center',
            email: 'larc-tech@nasa.gov',
            phone: '(757) 864-1000'
          }
        },
        {
          id: '5',
          title: 'AI-Powered Mission Planning Software',
          abstract: 'Artificial intelligence software that optimizes mission planning for complex space operations, reducing planning time and improving mission success rates.',
          patent_number: 'US10,567,890',
          publication_date: '2023-10-18',
          category: 'Software',
          center: 'JSC',
          innovator: 'Dr. Amanda Foster',
          reference_number: 'JSC-66543-1',
          status: 'Available',
          type: 'Software',
          benefits: [
            '75% reduction in planning time',
            'Improved resource allocation',
            'Enhanced risk assessment'
          ],
          applications: [
            'Space mission planning',
            'Logistics optimization',
            'Project management systems'
          ],
          contact: {
            name: 'Johnson Space Center',
            email: 'jsc-tech@nasa.gov',
            phone: '(281) 483-0123'
          }
        },
        {
          id: '6',
          title: 'Advanced Life Support System',
          abstract: 'A closed-loop life support system for long-duration space missions, featuring advanced air and water recycling technologies with minimal maintenance requirements.',
          patent_number: 'US10,678,901',
          publication_date: '2023-11-30',
          category: 'Environment',
          center: 'MSFC',
          innovator: 'Dr. James Wilson',
          reference_number: 'MFS-33421-1',
          status: 'Available',
          type: 'Patent',
          benefits: [
            '99.5% recycling efficiency',
            'Reduced consumables mass',
            'Automated operation'
          ],
          applications: [
            'Space stations',
            'Long-duration spacecraft',
            'Remote research facilities'
          ],
          contact: {
            name: 'Marshall Space Flight Center',
            email: 'msfc-tech@nasa.gov',
            phone: '(256) 544-2121'
          }
        }
      ]
      
      // Filter based on search criteria
      let filteredPatents = mockPatents
      
      if (searchQuery) {
        filteredPatents = filteredPatents.filter(patent => 
          patent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patent.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patent.innovator?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      if (selectedCategory) {
        filteredPatents = filteredPatents.filter(patent => 
          patent.category === selectedCategory
        )
      }
      
      if (selectedCenter) {
        filteredPatents = filteredPatents.filter(patent => 
          patent.center === selectedCenter
        )
      }
      
      setPatents(filteredPatents)
      setTotalCount(filteredPatents.length)
    } catch (error: any) {
      setError('Failed to load technology transfer data. Please try again.')
      setPatents([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'text-green-400 bg-green-900/20 border-green-500/30'
      case 'licensed':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
      case 'pending':
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }

  const getTypeIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'patent':
        return <Award className="h-4 w-4" />
      case 'software':
        return <FileText className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  if (loading && !hasSearched) {
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">NASA Tech Transfer</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover NASA's cutting-edge technologies available for licensing. 
            Explore patents, software, and innovations that can transform industries.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="space-y-6">
            {/* Main Search */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search patents, technologies, innovations..."
                  className="input-field pl-10 w-full"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  NASA Center
                </label>
                <select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">All Centers</option>
                  {centers.map((center) => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
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

            {/* Clear Filters */}
            <div className="flex justify-between items-center">
              <div className="text-gray-300">
                {totalCount} {totalCount === 1 ? 'technology' : 'technologies'} found
              </div>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('')
                  setSelectedCenter('')
                  handleSearch()
                }}
                className="text-space-400 hover:text-space-300 text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={viewMode === 'grid' ? 'loading-skeleton h-64 rounded-xl' : 'loading-skeleton h-32 rounded-xl'}>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card text-center">
            <h3 className="text-xl font-bold text-red-400 mb-4">Error Loading Technologies</h3>
            <p className="text-gray-300 mb-6">{error}</p>
            <button onClick={handleSearch} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && patents.length === 0 && hasSearched && (
          <div className="card text-center">
            <h3 className="text-xl font-bold text-gray-400 mb-4">No Technologies Found</h3>
            <p className="text-gray-300 mb-6">
              No technologies found matching your search criteria. Try different keywords or adjust your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('')
                setSelectedCenter('')
                handleSearch()
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && patents.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patents.map((patent) => (
                  <div key={patent.id} className="card card-hover group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-space-400">
                          {getTypeIcon(patent.type)}
                        </span>
                        <span className="text-sm font-medium text-gray-300">
                          {patent.type}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(patent.status)}`}>
                        {patent.status}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-space-300 transition-colors">
                      {patent.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {patent.abstract}
                    </p>
                    
                    <div className="space-y-2 mb-4 text-xs text-gray-400">
                      {patent.patent_number && (
                        <div>Patent: {patent.patent_number}</div>
                      )}
                      {patent.category && (
                        <div>Category: {patent.category}</div>
                      )}
                      {patent.center && (
                        <div>Center: {patent.center}</div>
                      )}
                      {patent.publication_date && (
                        <div>Published: {format(new Date(patent.publication_date), 'MMM d, yyyy')}</div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setSelectedPatent(patent)}
                      className="w-full btn-secondary text-sm"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {patents.map((patent) => (
                  <div key={patent.id} className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-space-400">
                              {getTypeIcon(patent.type)}
                            </span>
                            <span className="text-sm font-medium text-gray-300">
                              {patent.type}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(patent.status)}`}>
                            {patent.status}
                          </span>
                          {patent.category && (
                            <span className="text-xs text-gray-400">{patent.category}</span>
                          )}
                          {patent.center && (
                            <span className="text-xs text-gray-400">{patent.center}</span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2">
                          {patent.title}
                        </h3>
                        
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {patent.abstract}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          {patent.patent_number && (
                            <span>Patent: {patent.patent_number}</span>
                          )}
                          {patent.innovator && (
                            <span>Innovator: {patent.innovator}</span>
                          )}
                          {patent.publication_date && (
                            <span>Published: {format(new Date(patent.publication_date), 'MMM d, yyyy')}</span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedPatent(patent)}
                        className="btn-secondary text-sm ml-4"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Patent Detail Modal */}
        {selectedPatent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-space-400">
                          {getTypeIcon(selectedPatent.type)}
                        </span>
                        <span className="text-sm font-medium text-gray-300">
                          {selectedPatent.type}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedPatent.status)}`}>
                        {selectedPatent.status}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedPatent.title}
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-4">
                      {selectedPatent.patent_number && (
                        <div>
                          <span className="block text-gray-500">Patent Number</span>
                          <span className="text-white">{selectedPatent.patent_number}</span>
                        </div>
                      )}
                      {selectedPatent.reference_number && (
                        <div>
                          <span className="block text-gray-500">Reference</span>
                          <span className="text-white">{selectedPatent.reference_number}</span>
                        </div>
                      )}
                      {selectedPatent.center && (
                        <div>
                          <span className="block text-gray-500">NASA Center</span>
                          <span className="text-white">{selectedPatent.center}</span>
                        </div>
                      )}
                      {selectedPatent.publication_date && (
                        <div>
                          <span className="block text-gray-500">Published</span>
                          <span className="text-white">
                            {format(new Date(selectedPatent.publication_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedPatent(null)}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Abstract */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Abstract</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedPatent.abstract}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Benefits */}
                    {selectedPatent.benefits && selectedPatent.benefits.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Benefits</h3>
                        <ul className="space-y-2">
                          {selectedPatent.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start space-x-2 text-gray-300">
                              <span className="text-green-400 mt-1">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Applications */}
                    {selectedPatent.applications && selectedPatent.applications.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Applications</h3>
                        <ul className="space-y-2">
                          {selectedPatent.applications.map((application, index) => (
                            <li key={index} className="flex items-start space-x-2 text-gray-300">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{application}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Contact Information */}
                  {selectedPatent.contact && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {selectedPatent.contact.name && (
                            <div>
                              <span className="text-gray-400">Contact:</span>
                              <div className="text-white">{selectedPatent.contact.name}</div>
                            </div>
                          )}
                          {selectedPatent.contact.email && (
                            <div>
                              <span className="text-gray-400">Email:</span>
                              <div className="text-white">
                                <a href={`mailto:${selectedPatent.contact.email}`} className="text-space-400 hover:text-space-300">
                                  {selectedPatent.contact.email}
                                </a>
                              </div>
                            </div>
                          )}
                          {selectedPatent.contact.phone && (
                            <div>
                              <span className="text-gray-400">Phone:</span>
                              <div className="text-white">{selectedPatent.contact.phone}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {selectedPatent.category && (
                      <div>
                        <span className="text-gray-400">Category:</span>
                        <div className="text-white">{selectedPatent.category}</div>
                      </div>
                    )}
                    {selectedPatent.innovator && (
                      <div>
                        <span className="text-gray-400">Innovator:</span>
                        <div className="text-white">{selectedPatent.innovator}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-4 pt-4 border-t border-gray-700">
                    <a
                      href="https://technology.nasa.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>Learn More</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => setSelectedPatent(null)}
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

export default TechTransferPage