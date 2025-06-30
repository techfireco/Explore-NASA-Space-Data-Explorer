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
    if (camera) params.camera = camera

    const response = await axios.get(
      `${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos`,
      { params }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching Mars Rover photos:', error)
    throw error
  }
}

// Fetch Mars Rover Manifest
export const fetchRoverManifest = async (apiKey: string, rover: string) => {
  try {
    const response = await axios.get(
      `${NASA_BASE_URL}/mars-photos/api/v1/manifests/${rover}`,
      { params: { api_key: apiKey } }
    )
    return response.data.photo_manifest
  } catch (error) {
    console.error('Error fetching rover manifest:', error)
    throw error
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
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching Mars weather:', error)
    throw error
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

    const response = await axios.get('https://images-api.nasa.gov/search', { params })
    return response.data
  } catch (error) {
    console.error('Error searching NASA media:', error)
    throw error
  }
}

// Fetch NASA Tech Transfer Patents
export const fetchTechTransfer = async (apiKey: string, query?: string, page: number = 1) => {
  try {
    const params: any = { api_key: apiKey, page }
    if (query) params.query = query

    const response = await axios.get(`${NASA_BASE_URL}/techtransfer/patent/`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching tech transfer data:', error)
    throw error
  }
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