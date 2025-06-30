import axios from 'axios'

const NASA_BASE_URL = 'https://api.nasa.gov'

// Helper function to handle API responses and rate limits
const handleResponse = (response: any) => {
  // Extract rate limit headers if available
  const rateLimit = {
    limit: response.headers['x-ratelimit-limit'],
    remaining: response.headers['x-ratelimit-remaining'],
    resetTime: response.headers['x-ratelimit-reset']
  }

  // Return both data and rate limit info
  return {
    data: response.data,
    rateLimit
  }
}

// Fetch Astronomy Picture of the Day
export const fetchAPOD = async (apiKey: string, date?: string) => {
  try {
    const params: any = { api_key: apiKey }
    if (date) params.date = date

    const response = await axios.get(`${NASA_BASE_URL}/planetary/apod`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching APOD:', error)
    throw error
  }
}

// Fetch Mars Rover Photos
export const fetchMarsRoverPhotos = async (
  apiKey: string,
  rover: string,
  sol?: number,
  earthDate?: string,
  camera?: string,
  page: number = 1
) => {
  try {
    const params: any = { api_key: apiKey, page }
    if (sol !== undefined) params.sol = sol
    if (earthDate) params.earth_date = earthDate
    if (camera) params.camera = camera.toLowerCase() // API expects lowercase camera names

    const response = await axios.get(
      `${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos`,
      { 
        params,
        timeout: 15000, // 15 second timeout for potentially large photo responses
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching Mars Rover photos:', error)
    
    // Enhanced error handling for Mars Rover Photos API
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - The Mars Rover Photos API is taking too long to respond. This may be due to large photo datasets or server issues.')
    } else if (error.response) {
      const status = error.response.status
      if (status === 404) {
        throw new Error(`Mars Rover Photos API: No photos found for the specified criteria. The ${rover} rover may not have photos for the requested sol/date or camera.`)
      } else if (status >= 500) {
        throw new Error('Mars Rover Photos API server error. The NASA service may be temporarily unavailable.')
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. The Mars Rover Photos API allows maximum 2000 requests per hour per IP address.')
      } else if (status === 400) {
        throw new Error('Invalid request parameters. Please check your sol/date range and camera selection.')
      } else {
        throw new Error(`Mars Rover Photos API error (${status}): ${error.response.data?.error?.message || 'Unknown error occurred'}`)
      }
    } else if (error.request) {
      throw new Error('Network error - Unable to connect to Mars Rover Photos API. Please check your internet connection.')
    } else {
      throw new Error('Mars Rover Photos API request failed: ' + error.message)
    }
  }
}

// Fetch Mars Rover Manifest
export const fetchRoverManifest = async (apiKey: string, rover: string) => {
  try {
    const response = await axios.get(
      `${NASA_BASE_URL}/mars-photos/api/v1/manifests/${rover}`,
      { 
        params: { api_key: apiKey },
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data.photo_manifest
  } catch (error: any) {
    console.error('Error fetching rover manifest:', error)
    
    // Enhanced error handling for Mars Rover Manifest API
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - The Mars Rover Manifest API is taking too long to respond.')
    } else if (error.response) {
      const status = error.response.status
      if (status === 404) {
        throw new Error(`Mars Rover Manifest API: No manifest found for rover '${rover}'. Please check the rover name (curiosity, opportunity, spirit, perseverance).`)
      } else if (status >= 500) {
        throw new Error('Mars Rover Manifest API server error. The NASA service may be temporarily unavailable.')
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. The Mars Rover Manifest API allows maximum 2000 requests per hour per IP address.')
      } else {
        throw new Error(`Mars Rover Manifest API error (${status}): ${error.response.data?.error?.message || 'Unknown error occurred'}`)
      }
    } else if (error.request) {
      throw new Error('Network error - Unable to connect to Mars Rover Manifest API. Please check your internet connection.')
    } else {
      throw new Error('Mars Rover Manifest API request failed: ' + error.message)
    }
  }
}

// Fetch Near Earth Objects
export const fetchNearEarthObjects = async (apiKey: string, startDate: string, endDate: string) => {
  try {
    const response = await axios.get(`${NASA_BASE_URL}/neo/rest/v1/feed`, {
      params: {
        api_key: apiKey,
        start_date: startDate,
        end_date: endDate
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching near earth objects:', error)
    throw error
  }
}

// Fetch Mars Weather
export const fetchMarsWeather = async (apiKey: string) => {
  try {
    const response = await axios.get(`${NASA_BASE_URL}/insight_weather/`, {
      params: {
        api_key: apiKey,
        feedtype: 'json',
        ver: '1.0'
      },
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error: any) {
    console.error('Error fetching Mars weather:', error)
    
    // Enhanced error handling for Mars Weather API
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - The Mars Weather API is taking too long to respond. This may be due to server issues or network connectivity.')
    } else if (error.response) {
      const status = error.response.status
      if (status === 404) {
        throw new Error('Mars Weather API endpoint not found. The InSight mission has ended and the service may have been discontinued.')
      } else if (status >= 500) {
        throw new Error('Mars Weather API server error. The NASA service may be temporarily unavailable.')
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. The Mars Weather API allows maximum 2000 requests per hour per IP address.')
      } else {
        throw new Error(`Mars Weather API error (${status}): ${error.response.data?.error?.message || 'Unknown error occurred'}`)
      }
    } else if (error.request) {
      throw new Error('Network error - Unable to connect to Mars Weather API. Please check your internet connection.')
    } else {
      throw new Error('Mars Weather API request failed: ' + error.message)
    }
  }
}

// Search NASA Image and Video Library
export const searchNASAMedia = async (
  query: string,
  mediaType?: string,
  yearStart?: string,
  yearEnd?: string,
  page: number = 1
) => {
  try {
    const params: any = { q: query, page }
    if (mediaType) params.media_type = mediaType
    if (yearStart) params.year_start = yearStart
    if (yearEnd) params.year_end = yearEnd

    const response = await axios.get('https://images-api.nasa.gov/search', {
      params,
      timeout: 15000, // 15 second timeout for media searches
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error: any) {
    console.error('Error searching NASA media:', error)
    
    // Enhanced error handling for NASA Image and Video Library API
    if (error.code === 'ECONNABORTED') {
      throw new Error('Search timeout - The NASA Image and Video Library is taking too long to respond. This may be due to large result sets or server issues.')
    } else if (error.response) {
      const status = error.response.status
      if (status === 404) {
        throw new Error('NASA Image and Video Library API: Search endpoint not found. The service may have changed.')
      } else if (status >= 500) {
        throw new Error('NASA Image and Video Library API server error. The service may be temporarily unavailable.')
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before searching again.')
      } else if (status === 400) {
        throw new Error('Invalid search parameters. Please check your query and filter settings.')
      } else {
        throw new Error(`NASA Image and Video Library API error (${status}): ${error.response.data?.error?.message || 'Unknown error occurred'}`)
      }
    } else if (error.request) {
      throw new Error('Network error - Unable to connect to NASA Image and Video Library. Please check your internet connection.')
    } else {
      throw new Error('NASA Image and Video Library search failed: ' + error.message)
    }
  }
}

// Fetch NASA Tech Transfer data (Patents, Software, Spinoffs)
export const fetchTechTransfer = async (
  apiKey: string, 
  searchType: 'patent' | 'patent_issued' | 'software' | 'spinoff' = 'patent',
  query?: string
) => {
  try {
    const params: any = { api_key: apiKey }
    if (query) {
      params[searchType] = query
    }

    const response = await axios.get(`${NASA_BASE_URL}/techtransfer`, {
      params,
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching tech transfer data:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - NASA TechTransfer API is taking too long to respond')
      }
      if (error.response?.status === 404) {
        throw new Error('TechTransfer data not found for the specified search criteria')
      }
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded - Please wait before making another request')
      }
      if (error.response?.status === 400) {
        throw new Error('Invalid search parameters - Please check your search criteria')
      }
      if (error.response?.status && error.response.status >= 500) {
        throw new Error('NASA TechTransfer API server error - Please try again later')
      }
    }
    
    if (error instanceof Error && error.message.includes('Network Error')) {
      throw new Error('Network connection failed - Please check your internet connection')
    }
    
    throw new Error('Failed to fetch TechTransfer data - Please try again')
  }
}

// Search NASA Patents
export const searchNASAPatents = async (apiKey: string, query?: string) => {
  return fetchTechTransfer(apiKey, 'patent', query)
}

// Search NASA Patent Issued Information
export const searchNASAPatentIssued = async (apiKey: string, query?: string) => {
  return fetchTechTransfer(apiKey, 'patent_issued', query)
}

// Search NASA Software
export const searchNASASoftware = async (apiKey: string, query?: string) => {
  return fetchTechTransfer(apiKey, 'software', query)
}

// Search NASA Spinoffs
export const searchNASASpinoffs = async (apiKey: string, query?: string) => {
  return fetchTechTransfer(apiKey, 'spinoff', query)
}

// Fetch Earth Observatory Natural Event Tracker (EONET) events
export const fetchEONETEvents = async (days?: number, category?: string) => {
  try {
    const params: any = {}
    if (days) params.days = days
    if (category) params.category = category

    const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/events', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching EONET events:', error)
    throw error
  }
}

// Fetch EONET Categories
export const fetchEONETCategories = async () => {
  try {
    const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/categories')
    return response.data
  } catch (error) {
    console.error('Error fetching EONET categories:', error)
    throw error
  }
}

// Fetch EPIC Natural Color Images
export const fetchEPICNaturalImages = async (apiKey: string, date?: string) => {
  try {
    const endpoint = date 
      ? `${NASA_BASE_URL}/EPIC/api/natural/date/${date}`
      : `${NASA_BASE_URL}/EPIC/api/natural/images`
    
    const response = await axios.get(endpoint, {
      params: { api_key: apiKey }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching EPIC natural images:', error)
    throw error
  }
}

// Fetch EPIC Enhanced Color Images
export const fetchEPICEnhancedImages = async (apiKey: string, date?: string) => {
  try {
    const endpoint = date 
      ? `${NASA_BASE_URL}/EPIC/api/enhanced/date/${date}`
      : `${NASA_BASE_URL}/EPIC/api/enhanced/images`
    
    const response = await axios.get(endpoint, {
      params: { api_key: apiKey }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching EPIC enhanced images:', error)
    throw error
  }
}

// Fetch EPIC Available Dates
export const fetchEPICAvailableDates = async (apiKey: string, imageType: 'natural' | 'enhanced' = 'natural') => {
  try {
    const response = await axios.get(`${NASA_BASE_URL}/EPIC/api/${imageType}/all`, {
      params: { api_key: apiKey }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching EPIC available dates:', error)
    throw error
  }
}

// Generate EPIC Image URL
export const getEPICImageUrl = (imageName: string, date: string, imageType: 'natural' | 'enhanced' = 'natural', apiKey: string) => {
  const formattedDate = date.split('-').join('/')
  return `${NASA_BASE_URL}/EPIC/archive/${imageType}/${formattedDate}/png/${imageName}.png?api_key=${apiKey}`
}

// NASA Open Science Data Repository (OSDR) APIs
const OSDR_BASE_URL = 'https://osdr.nasa.gov'

// Fetch Study Data Files
export const fetchOSDRStudyFiles = async (
  studyIds: string,
  page: number = 0,
  size: number = 25,
  allFiles: boolean = false
) => {
  try {
    const params: any = {}
    if (page > 0) params.page = page
    if (size !== 25) params.size = size
    if (allFiles) params.all_files = allFiles

    const response = await axios.get(`${OSDR_BASE_URL}/osdr/data/osd/files/${studyIds}`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR study files:', error)
    throw error
  }
}

// Fetch Study Metadata
export const fetchOSDRStudyMetadata = async (studyId: string) => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/osdr/data/osd/meta/${studyId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR study metadata:', error)
    throw error
  }
}

// Search OSDR Datasets
export const searchOSDRDatasets = async (
  term?: string,
  from: number = 0,
  size: number = 10,
  type?: string,
  sort?: string,
  order?: 'ASC' | 'DESC',
  filters?: { field: string; value: string }[]
) => {
  try {
    const params: any = { from, size }
    if (term) params.term = term
    if (type) params.type = type || 'cgene' // Default to cgene for NASA data
    if (sort) params.sort = sort
    if (order) params.order = order
    
    // Add filter parameters
    if (filters) {
      filters.forEach(filter => {
        params[`ffield`] = filter.field
        params[`fvalue`] = filter.value
      })
    }

    console.log('API Request URL:', `${OSDR_BASE_URL}/osdr/data/search`)
    console.log('API Request params:', params)
    
    const response = await axios.get(`${OSDR_BASE_URL}/osdr/data/search`, { 
      params,
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    console.log('Raw API Response:', response.data)
    
    // Transform the response to match our expected format
    const transformedData = {
      hits: response.data.hits?.total?.value || response.data.hits?.total || 0,
      studies: response.data.hits?.hits?.map((hit: any) => ({
        identifier: hit._source?.['Study Identifier'] || hit._source?.Accession || hit._id,
        title: hit._source?.['Study Title'] || hit._source?.title || 'Untitled Study',
        description: hit._source?.['Study Description'] || hit._source?.description || 'No description available',
        organism: hit._source?.organism || hit._source?.['Organism'],
        assayType: hit._source?.['Study Assay Technology Type'] || hit._source?.assayType,
        projectType: hit._source?.['Project Type'] || hit._source?.projectType
      })) || []
    }
    
    console.log('Transformed data:', transformedData)
    return transformedData
  } catch (error: any) {
    console.error('Error searching OSDR datasets:', error)
    
    // Provide more specific error messages for different types of network issues
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to OSDR API. Please check your internet connection.')
    } else if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      throw new Error('OSDR API request timed out. The service may be temporarily unavailable.')
    } else if (error.response?.status === 404) {
      throw new Error('OSDR API endpoint not found. The service may have changed.')
    } else if (error.response?.status >= 500) {
      throw new Error('OSDR API server error. Please try again later.')
    } else if (error.response?.status === 429) {
      throw new Error('Too many requests to OSDR API. Please wait a moment and try again.')
    } else if (error.message?.includes('Network Error')) {
      throw new Error('Network error occurred. The OSDR API might be temporarily unavailable.')
    } else {
      throw new Error(`OSDR API error: ${error.message || 'Unknown error occurred'}`)
    }
  }
}

// Fetch All Experiments
export const fetchOSDRExperiments = async () => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/experiments`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR experiments:', error)
    throw error
  }
}

// Fetch Single Experiment
export const fetchOSDRExperiment = async (identifier: string) => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/experiment/${identifier}`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR experiment:', error)
    throw error
  }
}

// Fetch All Missions
export const fetchOSDRMissions = async () => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/missions`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR missions:', error)
    throw error
  }
}

// Fetch Single Mission
export const fetchOSDRMission = async (identifier: string) => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/mission/${identifier}`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR mission:', error)
    throw error
  }
}

// Fetch All Payloads
export const fetchOSDRPayloads = async () => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/payloads`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR payloads:', error)
    throw error
  }
}

// Fetch Single Payload
export const fetchOSDRPayload = async (identifier: string) => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/payload/${identifier}`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR payload:', error)
    throw error
  }
}

// Fetch All Hardware
export const fetchOSDRHardware = async () => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/hardware`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR hardware:', error)
    throw error
  }
}

// Fetch Single Hardware
export const fetchOSDRHardwareItem = async (identifier: string) => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/hardware/${identifier}`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR hardware item:', error)
    throw error
  }
}

// Fetch All Vehicles
export const fetchOSDRVehicles = async () => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/vehicles`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR vehicles:', error)
    throw error
  }
}

// Fetch Single Vehicle
export const fetchOSDRVehicle = async (identifier: string) => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/vehicle/${identifier}`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR vehicle:', error)
    throw error
  }
}

// Fetch All Subjects
export const fetchOSDRSubjects = async () => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/subjects`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR subjects:', error)
    throw error
  }
}

// Fetch Single Subject
export const fetchOSDRSubject = async (identifier: string) => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/subject/${identifier}`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR subject:', error)
    throw error
  }
}

// Fetch All Biospecimens
export const fetchOSDRBiospecimens = async () => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/biospecimens`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR biospecimens:', error)
    throw error
  }
}

// Fetch Single Biospecimen
export const fetchOSDRBiospecimen = async (identifier: string) => {
  try {
    const response = await axios.get(`${OSDR_BASE_URL}/geode-py/ws/api/biospecimen/${identifier}`)
    return response.data
  } catch (error) {
    console.error('Error fetching OSDR biospecimen:', error)
    throw error
  }
}

// Generate OSDR File Download URL
export const getOSDRFileDownloadUrl = (remoteUrl: string) => {
  return `${OSDR_BASE_URL}${remoteUrl}`
}