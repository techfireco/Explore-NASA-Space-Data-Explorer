'use client'

import React, { useState, useEffect } from 'react'
import { Search, ExternalLink, Calendar, Building, User, Filter, Grid, List, Code, Rocket, Cpu, Award, FileText, X } from 'lucide-react'
import { searchNASAPatents, searchNASAPatentIssued, searchNASASoftware, searchNASASpinoffs } from '@/lib/api'
import { useAPIKey } from '@/contexts/APIKeyContext'
import { format } from 'date-fns'

interface TechTransferItem {
  id?: string
  title?: string
  abstract?: string
  description?: string
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
  // Software specific fields
  software_version?: string
  programming_language?: string
  license?: string
  // Spinoff specific fields
  company?: string
  industry?: string
  location?: string
  year?: number
}

type SearchType = 'patent' | 'patent_issued' | 'software' | 'spinoff'

const TechTransferPage = () => {
  const { apiKey } = useAPIKey()
  const [items, setItems] = useState<TechTransferItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('patent')
  const [selectedItem, setSelectedItem] = useState<TechTransferItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hasSearched, setHasSearched] = useState(false)

  const searchTypeOptions = [
    {
      value: 'patent',
      label: 'Patents',
      icon: Award,
      description: 'NASA patent applications'
    },
    {
      value: 'patent_issued',
      label: 'Issued Patents',
      icon: FileText,
      description: 'Granted NASA patents'
    },
    {
      value: 'software',
      label: 'Software',
      icon: Code,
      description: 'NASA software releases'
    },
    {
      value: 'spinoff',
      label: 'Spinoffs',
      icon: Rocket,
      description: 'Commercial applications'
    }
  ]

  const commonSearchTerms = {
    patent: ['aerospace', 'propulsion', 'materials', 'sensors', 'robotics', 'navigation'],
    patent_issued: ['spacecraft', 'thermal', 'composite', 'imaging', 'communication', 'power'],
    software: ['simulation', 'modeling', 'analysis', 'visualization', 'control', 'processing'],
    spinoff: ['medical', 'automotive', 'energy', 'manufacturing', 'consumer', 'safety']
  }

  const getItemTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'patent':
      case 'patent_issued':
        return 'bg-blue-100 text-blue-800'
      case 'software':
        return 'bg-green-100 text-green-800'
      case 'spinoff':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'active':
        return 'border-green-500 text-green-700'
      case 'pending':
        return 'border-yellow-500 text-yellow-700'
      case 'expired':
      case 'inactive':
        return 'border-red-500 text-red-700'
      default:
        return 'border-gray-500 text-gray-700'
    }
  }

  const handleSearch = async () => {
    if (!apiKey) {
      setError('Please set your NASA API key first')
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      let data
      switch (searchType) {
        case 'patent':
          data = await searchNASAPatents(searchQuery, apiKey)
          break
        case 'patent_issued':
          data = await searchNASAPatentIssued(searchQuery, apiKey)
          break
        case 'software':
          data = await searchNASASoftware(searchQuery, apiKey)
          break
        case 'spinoff':
          data = await searchNASASpinoffs(searchQuery, apiKey)
          break
        default:
          throw new Error('Invalid search type')
      }
      
      // Process the data based on search type
      let processedItems: TechTransferItem[] = []
      
      if (data && Array.isArray(data)) {
        processedItems = data.map((item: any) => ({
          ...item,
          type: searchType,
          id: item.id || item.patent_number || item.title || Math.random().toString()
        }))
      } else if (data && typeof data === 'object') {
        // Handle single item response
        processedItems = [{
          ...data,
          type: searchType,
          id: data.id || data.patent_number || data.title || Math.random().toString()
        }]
      }
      
      setItems(processedItems)
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Failed to search tech transfer data')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchTypeChange = (newType: SearchType) => {
    setSearchType(newType)
    setItems([])
    setError(null)
    setHasSearched(false)
    setSearchQuery('')
  }

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term)
    // Auto-search when clicking quick terms
    setTimeout(() => {
      if (apiKey) {
        handleSearch()
      }
    }, 100)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setItems([])
    setError(null)
    setHasSearched(false)
  }

  useEffect(() => {
    if (apiKey && !hasSearched) {
      // Optional: Load some initial data
    }
  }, [apiKey, hasSearched])

  const renderSearchTypeSelector = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Search Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {searchTypeOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <button
              key={option.value}
              onClick={() => handleSearchTypeChange(option.value as SearchType)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                searchType === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className={`h-6 w-6 ${
                  searchType === option.value ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <div>
                  <div className={`font-medium ${
                    searchType === option.value ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-sm ${
                    searchType === option.value ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  const renderQuickSearchTerms = () => (
    <div className="mb-4">
      <div className="text-sm text-gray-600 mb-2">Quick search terms:</div>
      <div className="flex flex-wrap gap-2">
        {commonSearchTerms[searchType].map((term) => (
          <button
            key={term}
            onClick={() => handleQuickSearch(term)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  )

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
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

        {/* Search Type Selector */}
        <div className="card mb-8">
          {renderSearchTypeSelector()}
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="space-y-6">
            {/* Quick Search Terms */}
            {renderQuickSearchTerms()}
            
            {/* Search Input */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Search ${searchTypeOptions.find(opt => opt.value === searchType)?.label.toLowerCase()}...`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="btn-primary px-8"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              {(searchQuery || hasSearched) && (
                <button
                  onClick={clearSearch}
                  className="btn-secondary px-4"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        {hasSearched && (
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {items.length} {searchTypeOptions.find(opt => opt.value === searchType)?.label.toLowerCase()} found
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-skeleton h-64 rounded-xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card border-red-200 bg-red-50">
            <div className="flex items-center space-x-3 text-red-700">
              <ExternalLink className="h-5 w-5" />
              <div>
                <p className="font-medium">Search Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && items.length === 0 && hasSearched && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No {searchTypeOptions.find(opt => opt.value === searchType)?.label.toLowerCase()} found</p>
              <p className="text-sm">Try searching with different terms:</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {commonSearchTerms[searchType].slice(0, 3).map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && items.length > 0 && (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getItemTypeColor(item.type)}`}>
                        {item.type || searchType}
                      </span>
                      {item.status && (
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.abstract || item.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      {item.patent_number && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Patent: {item.patent_number}</span>
                        </div>
                      )}
                      {item.software_version && (
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4" />
                          <span>Version: {item.software_version}</span>
                        </div>
                      )}
                      {item.programming_language && (
                        <div className="flex items-center space-x-2">
                          <Cpu className="h-4 w-4" />
                          <span>{item.programming_language}</span>
                        </div>
                      )}
                      {item.company && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span>{item.company}</span>
                        </div>
                      )}
                      {item.industry && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span>{item.industry}</span>
                        </div>
                      )}
                      {item.center && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span>{item.center}</span>
                        </div>
                      )}
                      {item.publication_date && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(item.publication_date), 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                      {item.year && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{item.year}</span>
                        </div>
                      )}
                    </div>
                    
                    <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getItemTypeColor(item.type)}`}>
                            {item.type || searchType}
                          </span>
                          {item.status && (
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {item.abstract || item.description}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          {item.center && (
                            <div>
                              <span className="font-medium">Center:</span> {item.center}
                            </div>
                          )}
                          {item.company && (
                            <div>
                              <span className="font-medium">Company:</span> {item.company}
                            </div>
                          )}
                          {item.patent_number && (
                            <div>
                              <span className="font-medium">Patent:</span> {item.patent_number}
                            </div>
                          )}
                          {item.software_version && (
                            <div>
                              <span className="font-medium">Version:</span> {item.software_version}
                            </div>
                          )}
                          {item.innovator && (
                            <div>
                              <span className="font-medium">Innovator:</span> {item.innovator}
                            </div>
                          )}
                          {item.publication_date && (
                            <div>
                              <span className="font-medium">Published:</span> {format(new Date(item.publication_date), 'MMM dd, yyyy')}
                            </div>
                          )}
                          {item.year && (
                            <div>
                              <span className="font-medium">Year:</span> {item.year}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tech Transfer Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getItemTypeColor(selectedItem.type)}`}>
                        {selectedItem.type || searchType}
                      </span>
                      {selectedItem.status && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedItem.status)}`}>
                          {selectedItem.status}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedItem.title}
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-4">
                      {selectedItem.patent_number && (
                        <div>
                          <span className="font-medium text-gray-300">Patent Number:</span>
                          <div>{selectedItem.patent_number}</div>
                        </div>
                      )}
                      {selectedItem.software_version && (
                        <div>
                          <span className="font-medium text-gray-300">Version:</span>
                          <div>{selectedItem.software_version}</div>
                        </div>
                      )}
                      {selectedItem.programming_language && (
                        <div>
                          <span className="font-medium text-gray-300">Language:</span>
                          <div>{selectedItem.programming_language}</div>
                        </div>
                      )}
                      {selectedItem.license && (
                        <div>
                          <span className="font-medium text-gray-300">License:</span>
                          <div>{selectedItem.license}</div>
                        </div>
                      )}
                      {selectedItem.company && (
                        <div>
                          <span className="font-medium text-gray-300">Company:</span>
                          <div>{selectedItem.company}</div>
                        </div>
                      )}
                      {selectedItem.industry && (
                        <div>
                          <span className="font-medium text-gray-300">Industry:</span>
                          <div>{selectedItem.industry}</div>
                        </div>
                      )}
                      {selectedItem.location && (
                        <div>
                          <span className="font-medium text-gray-300">Location:</span>
                          <div>{selectedItem.location}</div>
                        </div>
                      )}
                      {selectedItem.reference_number && (
                        <div>
                          <span className="font-medium text-gray-300">Reference:</span>
                          <div>{selectedItem.reference_number}</div>
                        </div>
                      )}
                      {selectedItem.center && (
                        <div>
                          <span className="font-medium text-gray-300">NASA Center:</span>
                          <div>{selectedItem.center}</div>
                        </div>
                      )}
                      {selectedItem.publication_date && (
                        <div>
                          <span className="font-medium text-gray-300">Publication Date:</span>
                          <div>{format(new Date(selectedItem.publication_date), 'MMM dd, yyyy')}</div>
                        </div>
                      )}
                      {selectedItem.year && (
                        <div>
                          <span className="font-medium text-gray-300">Year:</span>
                          <div>{selectedItem.year}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {(selectedItem.abstract || selectedItem.description) && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {selectedItem.abstract ? 'Abstract' : 'Description'}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedItem.abstract || selectedItem.description}
                      </p>
                    </div>
                  )}
                  
                  {selectedItem.benefits && selectedItem.benefits.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Benefits</h3>
                      <ul className="space-y-2">
                        {selectedItem.benefits.map((benefit, index) => (
                          <li key={index} className="text-gray-300 flex items-start space-x-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedItem.applications && selectedItem.applications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Applications</h3>
                      <ul className="space-y-2">
                        {selectedItem.applications.map((application, index) => (
                          <li key={index} className="text-gray-300 flex items-start space-x-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{application}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedItem.contact && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Contact Information</h3>
                      <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                        {selectedItem.contact.name && (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300">{selectedItem.contact.name}</span>
                          </div>
                        )}
                        {selectedItem.contact.email && (
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                            <a href={`mailto:${selectedItem.contact.email}`} className="text-blue-400 hover:text-blue-300">
                              {selectedItem.contact.email}
                            </a>
                          </div>
                        )}
                        {selectedItem.contact.phone && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">📞</span>
                            <span className="text-gray-300">{selectedItem.contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {selectedItem.category && (
                      <div>
                        <span className="font-medium text-gray-300">Category:</span>
                        <div className="text-gray-400">{selectedItem.category}</div>
                      </div>
                    )}
                    {selectedItem.innovator && (
                      <div>
                        <span className="font-medium text-gray-300">Innovator:</span>
                        <div className="text-gray-400">{selectedItem.innovator}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                    <button className="btn-primary">
                      Learn More
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
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