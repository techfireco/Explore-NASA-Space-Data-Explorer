'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Calendar, ExternalLink, Download, Share2, Clock, Eye } from 'lucide-react'
import { useAPIKey } from '@/contexts/APIKeyContext'
import { fetchAPOD } from '@/lib/api'
import { format } from 'date-fns'

interface APODData {
  title: string
  explanation: string
  url: string
  hdurl?: string
  media_type: string
  date: string
  copyright?: string
}

const APODPage = () => {
  const [apodData, setApodData] = useState<APODData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [error, setError] = useState<string | null>(null)
  const { apiKey } = useAPIKey()

  useEffect(() => {
    const loadAPOD = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchAPOD(apiKey, selectedDate)
        setApodData(data)
      } catch (error: any) {
        setError(error.response?.data?.error?.message || 'Failed to load APOD data')
      } finally {
        setLoading(false)
      }
    }

    loadAPOD()
  }, [apiKey, selectedDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  const handleShare = async () => {
    if (apodData && navigator.share) {
      try {
        await navigator.share({
          title: apodData.title,
          text: apodData.explanation.substring(0, 200) + '...',
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else if (apodData) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleDownload = () => {
    if (apodData?.hdurl || apodData?.url) {
      const link = document.createElement('a')
      link.href = apodData.hdurl || apodData.url
      link.download = `apod-${apodData.date}.jpg`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="loading-skeleton h-96 w-full rounded-xl" />
            <div className="space-y-4">
              <div className="loading-skeleton h-8 w-full" />
              <div className="loading-skeleton h-4 w-full" />
              <div className="loading-skeleton h-4 w-3/4" />
              <div className="loading-skeleton h-4 w-full" />
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
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading APOD</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
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
          <h1 className="section-title">Astronomy Picture of the Day</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover a different image or photograph of our fascinating universe each day, 
            along with a brief explanation written by a professional astronomer.
          </p>
          
          {/* Date Picker */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-space-400" />
              <label htmlFor="date" className="text-gray-300 font-medium">
                Select Date:
              </label>
            </div>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={format(new Date(), 'yyyy-MM-dd')}
              min="1995-06-16" // APOD started on June 16, 1995
              className="input-field"
            />
          </div>
        </div>

        {apodData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image/Video Section */}
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-gray-800">
                {apodData.media_type === 'image' ? (
                  <div className="relative aspect-square">
                    <Image
                      src={apodData.url}
                      alt={apodData.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="aspect-video">
                    <iframe
                      src={apodData.url}
                      title={apodData.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {apodData.hdurl && (
                  <a
                    href={apodData.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View HD</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {apodData.media_type === 'image' && (
                  <button
                    onClick={handleDownload}
                    className="btn-secondary inline-flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 text-space-400 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {format(new Date(apodData.date), 'MMMM d, yyyy')}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {apodData.title}
                </h2>
                {apodData.copyright && (
                  <p className="text-sm text-gray-400 mb-4">
                    © {apodData.copyright}
                  </p>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {apodData.explanation}
                </p>
              </div>

              {/* Metadata */}
              <div className="card bg-gray-800/30">
                <h3 className="text-lg font-semibold text-white mb-4">Image Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white ml-2">{apodData.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Media Type:</span>
                    <span className="text-white ml-2 capitalize">{apodData.media_type}</span>
                  </div>
                  {apodData.copyright && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-400">Copyright:</span>
                      <span className="text-white ml-2">{apodData.copyright}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default APODPage