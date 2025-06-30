'use client'

import React from 'react'
import { FileText, Scale, AlertTriangle, CheckCircle, Users, Gavel } from 'lucide-react'

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-space-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <FileText className="h-16 w-16 text-space-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Terms of <span className="text-space-400">Service</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Please read these terms carefully before using NASA Space Data Explorer.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Acceptance of Terms */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <CheckCircle className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Acceptance of Terms</h2>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              By accessing and using NASA Space Data Explorer ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p className="text-gray-300 leading-relaxed">
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          {/* Description of Service */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <Scale className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Description of Service</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                NASA Space Data Explorer is a web application that provides access to NASA's public APIs and data services, including:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                  Astronomy Picture of the Day (APOD)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                  Mars Rover imagery and weather data
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                  Earth imagery and natural events
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                  Asteroid tracking information
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                  Space biology research data
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                  NASA technology transfer database
                </li>
              </ul>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">User Responsibilities</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">API Key Usage</h3>
                <p className="text-gray-300 leading-relaxed">
                  If you choose to use your own NASA API key, you are responsible for:
                </p>
                <ul className="text-gray-300 mt-3 space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-space-400 rounded-full mr-3 mt-2"></div>
                    Keeping your API key secure and confidential
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-space-400 rounded-full mr-3 mt-2"></div>
                    Complying with NASA's API usage policies and rate limits
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-space-400 rounded-full mr-3 mt-2"></div>
                    Any consequences of API key misuse or abuse
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">Acceptable Use</h3>
                <p className="text-gray-300 leading-relaxed">
                  You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
                </p>
                <ul className="text-gray-300 mt-3 space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></div>
                    Attempt to gain unauthorized access to any part of the Service
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></div>
                    Use the Service to transmit malicious code or harmful content
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></div>
                    Interfere with or disrupt the Service or servers
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></div>
                    Violate any applicable laws or regulations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <Gavel className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Intellectual Property</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">NASA Data</h3>
                <p className="text-gray-300 leading-relaxed">
                  All NASA data, images, and content accessed through this Service are subject to NASA's 
                  <a href="https://www.nasa.gov/news/releases/2017/image-use-policy/" target="_blank" rel="noopener noreferrer" className="text-space-400 hover:text-space-300 underline ml-1">
                    Image and Data Usage Policy
                  </a>. 
                  Most NASA content is in the public domain and free to use.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">Application Code</h3>
                <p className="text-gray-300 leading-relaxed">
                  The source code and design of this application are the intellectual property of the creator. 
                  The application is provided as-is for educational and informational purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-yellow-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Disclaimers</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">Service Availability</h3>
                <p className="text-gray-300 leading-relaxed">
                  The Service is provided "as is" without any guarantees of availability, reliability, or performance. 
                  We do not warrant that the Service will be uninterrupted or error-free.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">Data Accuracy</h3>
                <p className="text-gray-300 leading-relaxed">
                  While we strive to provide accurate and up-to-date information from NASA's APIs, we cannot 
                  guarantee the accuracy, completeness, or timeliness of any data displayed.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">Third-Party Services</h3>
                <p className="text-gray-300 leading-relaxed">
                  The Service relies on NASA's APIs and other third-party services. We are not responsible for 
                  the availability, content, or policies of these external services.
                </p>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <Scale className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Limitation of Liability</h2>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              In no event shall the creator or contributors of NASA Space Data Explorer be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including without limitation, loss of profits, 
              data, use, goodwill, or other intangible losses.
            </p>
            <p className="text-gray-300 leading-relaxed">
              This limitation applies regardless of the legal theory on which the claim is based, whether in contract, 
              tort, negligence, strict liability, or otherwise.
            </p>
          </div>

          {/* Modifications */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Modifications to Terms</h2>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately 
              upon posting to this page. Your continued use of the Service after any such changes constitutes your 
              acceptance of the new Terms of Service.
            </p>
          </div>

          {/* Governing Law */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <Gavel className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Governing Law</h2>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              These Terms of Service and any disputes arising out of or related to the use of the Service shall be 
              governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-space-800/50 to-purple-800/50 backdrop-blur-md rounded-xl p-8 border border-space-500/50">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Contact Information</h2>
            <p className="text-gray-300 text-center leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="text-center mt-6">
              <p className="text-space-300 font-semibold">Md Kashif Ali</p>
              <div className="flex justify-center space-x-4 mt-3">
                <a href="https://github.com/techfireco" target="_blank" rel="noopener noreferrer" className="text-space-400 hover:text-space-300">
                  GitHub: @techfireco
                </a>
                <span className="text-gray-500">|</span>
                <a href="https://instagram.com/techfireco" target="_blank" rel="noopener noreferrer" className="text-space-400 hover:text-space-300">
                  Instagram: @techfireco
                </a>
                <span className="text-gray-500">|</span>
                <a href="https://youtube.com/@techfireco" target="_blank" rel="noopener noreferrer" className="text-space-400 hover:text-space-300">
                  YouTube: @techfireco
                </a>
              </div>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-white mb-3">Acknowledgment</h3>
            <p className="text-gray-300 leading-relaxed">
              By using NASA Space Data Explorer, you acknowledge that you have read this Terms of Service agreement 
              and agree to be bound by its terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage