'use client'

import React from 'react'
import { Github, Instagram, Youtube, Rocket, Star, Globe } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-space-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Rocket className="h-16 w-16 text-space-400 animate-pulse" />
              <Star className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            About <span className="text-space-400">NASA Space Explorer</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the wonders of space through NASA's comprehensive data and imagery. 
            Explore planets, asteroids, weather patterns, and cutting-edge space technology.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <Globe className="h-12 w-12 text-space-400 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To make NASA's vast collection of space data accessible and engaging for everyone. 
              From stunning astronomy pictures to real-time Mars weather data, we bring the cosmos 
              to your fingertips through an intuitive and beautiful interface.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <Star className="h-12 w-12 text-yellow-400 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">What We Offer</h2>
            <ul className="text-gray-300 space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                Astronomy Picture of the Day (APOD)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                Mars Rover Images and Weather Data
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                Earth Imagery and Natural Events
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                Asteroid Tracking and Information
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                Space Biology Research Data
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                NASA Technology Transfer Database
              </li>
            </ul>
          </div>
        </div>

        {/* Creator Section */}
        <div className="bg-gradient-to-r from-space-800/50 to-purple-800/50 backdrop-blur-md rounded-xl p-8 border border-space-500/50 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Created By</h2>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-space-300 mb-2">Md Kashif Ali</h3>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                A passionate developer dedicated to making space exploration accessible through technology. 
                Combining expertise in web development with a love for astronomy and space science.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-6">
              <a 
                href="https://instagram.com/techfireco" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Instagram className="h-5 w-5" />
                <span>Instagram</span>
              </a>
              
              <a 
                href="https://youtube.com/@techfireco" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Youtube className="h-5 w-5" />
                <span>YouTube</span>
              </a>
              
              <a 
                href="https://github.com/techfireco" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Built With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-space-300 font-semibold mb-2">Next.js 14</h3>
              <p className="text-gray-400 text-sm">React Framework</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-space-300 font-semibold mb-2">TypeScript</h3>
              <p className="text-gray-400 text-sm">Type Safety</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-space-300 font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-gray-400 text-sm">Styling</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-space-300 font-semibold mb-2">NASA APIs</h3>
              <p className="text-gray-400 text-sm">Data Source</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage