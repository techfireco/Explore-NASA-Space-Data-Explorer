'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Camera, ExternalLink, Globe, Lightbulb, Search, Eye, Thermometer, Zap, Satellite, Microscope } from 'lucide-react';
import { useAPIKey } from '@/contexts/APIKeyContext'
import { fetchAPOD } from '@/lib/api'

interface APODData {
  title: string
  explanation: string
  url: string
  media_type: string
  date: string
}

const HomePage = () => {
  const [apodData, setApodData] = useState<APODData | null>(null)
  const [loading, setLoading] = useState(true)
  const { apiKey } = useAPIKey()

  useEffect(() => {
    const loadAPOD = async () => {
      try {
        const data = await fetchAPOD(apiKey)
        setApodData(data)
      } catch (error) {
        console.error('Failed to load APOD:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAPOD()
  }, [apiKey])

  const features = [
    {
      icon: Eye,
      title: 'Astronomy Picture of the Day',
      description: 'Discover stunning space images with detailed explanations from NASA astronomers.',
      href: '/apod',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Camera,
      title: 'Mars Rover Photos',
      description: 'Explore the Red Planet through the eyes of NASA\'s Mars rovers.',
      href: '/mars-rover',
      color: 'from-red-500 to-orange-600'
    },
    {
      icon: Globe,
      title: 'Near Earth Asteroids',
      description: 'Track asteroids approaching Earth with real-time data.',
      href: '/asteroids',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Thermometer,
      title: 'Mars Weather',
      description: 'Check current weather conditions on Mars from InSight lander.',
      href: '/mars-weather',
      color: 'from-yellow-500 to-red-600'
    },
    {
      icon: Search,
      title: 'Media Search',
      description: 'Search NASA\'s vast collection of space images and videos.',
      href: '/search-media',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Lightbulb,
      title: 'Tech Transfer',
      description: 'Explore NASA patents and technology innovations.',
      href: '/tech-transfer',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Earth Events',
      description: 'Monitor natural disasters and events happening on Earth.',
      href: '/events',
      color: 'from-emerald-500 to-cyan-600'
    },
    {
      icon: Satellite,
      title: 'Earth Imagery',
      description: 'View full-disc Earth images from DSCOVR\'s EPIC camera.',
      href: '/earth-imagery',
      color: 'from-blue-500 to-green-600'
    },
    {
      icon: Microscope,
      title: 'Space Biology',
      description: 'Explore NASA\'s Open Science Data Repository for space biology and life sciences research.',
      href: '/space-biology',
      color: 'from-violet-500 to-purple-600'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Explore NASA</span>
            <br />
            <span className="text-white">Space Data Explorer</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover the wonders of space through NASA's public APIs. 
            Explore astronomy pictures, Mars rover photos, asteroids, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apod" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Start Exploring</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a 
              href="https://api.nasa.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50 inline-flex items-center space-x-2"
            >
              <span>Get API Key</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Live APOD Banner */}
      {apodData && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl transition-all duration-300 hover:bg-gray-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">Today's Astronomy Picture</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {apodData.title}
                  </h2>
                  <p className="text-gray-300 mb-6 overflow-hidden">
                    {apodData.explanation}
                  </p>
                  <Link href="/apod" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
                    <span>View Full Image</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
                  {apodData.media_type === 'image' ? (
                    <Image
                      src={apodData.url}
                      alt={apodData.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">Video Content</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8">Explore Space Data</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access NASA's vast collection of space data through our modern, 
              user-friendly interface designed for space enthusiasts and researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link key={index} href={feature.href}>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl transition-all duration-300 hover:bg-gray-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 group h-full">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">7+</div>
              <div className="text-gray-300">NASA APIs Integrated</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">1000+</div>
              <div className="text-gray-300">Daily API Requests</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">∞</div>
              <div className="text-gray-300">Space Discoveries</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage