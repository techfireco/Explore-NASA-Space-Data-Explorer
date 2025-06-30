'use client'

import React from 'react'
import Link from 'next/link'
import { Rocket, Github, ExternalLink, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group mb-4">
              <Rocket className="h-8 w-8 text-space-400 group-hover:text-space-300 transition-colors" />
              <span className="text-xl font-bold text-gradient">Explore NASA</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover the wonders of space through NASA's public APIs. Explore astronomy pictures, 
              Mars rover photos, asteroids, and more in this modern space data explorer.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span>for space enthusiasts</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/apod" className="text-gray-400 hover:text-space-400 transition-colors">
                  Astronomy Picture
                </Link>
              </li>
              <li>
                <Link href="/mars-rover" className="text-gray-400 hover:text-space-400 transition-colors">
                  Mars Rover Photos
                </Link>
              </li>
              <li>
                <Link href="/asteroids" className="text-gray-400 hover:text-space-400 transition-colors">
                  Near Earth Objects
                </Link>
              </li>
              <li>
                <Link href="/mars-weather" className="text-gray-400 hover:text-space-400 transition-colors">
                  Mars Weather
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-space-400 transition-colors">
                  Earth Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://api.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-space-400 transition-colors flex items-center space-x-1"
                >
                  <span>NASA APIs</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-space-400 transition-colors flex items-center space-x-1"
                >
                  <span>NASA Official Site</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/nasa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-space-400 transition-colors flex items-center space-x-1"
                >
                  <span>NASA on GitHub</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://eonet.gsfc.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-space-400 transition-colors flex items-center space-x-1"
                >
                  <span>EONET</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 sm:mb-0">
            © {currentYear} Explore NASA. Built with NASA's Open Data APIs.
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </a>
            <div className="text-xs text-gray-500">
              Data provided by NASA
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer