'use client'

import React from 'react'
import { Shield, Eye, Lock, Database, Globe, AlertCircle } from 'lucide-react'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-space-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-space-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Privacy <span className="text-space-400">Policy</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Information We Collect */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <Database className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">NASA API Keys</h3>
                <p className="text-gray-300 leading-relaxed">
                  We store your NASA API key locally in your browser to access NASA's data services. 
                  This key is never transmitted to our servers and remains on your device.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">Usage Data</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may collect anonymous usage statistics to improve the application, including:
                </p>
                <ul className="text-gray-300 mt-3 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                    Pages visited and features used
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                    Search queries and filters applied
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-space-400 rounded-full mr-3"></div>
                    Device type and browser information
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <Eye className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">How We Use Your Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3 mt-2"></div>
                <p className="text-gray-300">To provide access to NASA's space data and imagery</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3 mt-2"></div>
                <p className="text-gray-300">To improve the user experience and application performance</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3 mt-2"></div>
                <p className="text-gray-300">To analyze usage patterns and optimize features</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3 mt-2"></div>
                <p className="text-gray-300">To ensure the security and stability of our services</p>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <Lock className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Data Protection</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">Local Storage</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your NASA API key and preferences are stored locally in your browser using localStorage. 
                  This data never leaves your device and is not accessible to us or third parties.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">Secure Connections</h3>
                <p className="text-gray-300 leading-relaxed">
                  All communications with NASA APIs are conducted over secure HTTPS connections to protect 
                  your data in transit.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">No Personal Data Collection</h3>
                <p className="text-gray-300 leading-relaxed">
                  We do not collect, store, or process any personal information such as names, email addresses, 
                  or contact details.
                </p>
              </div>
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <Globe className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Third-Party Services</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">NASA APIs</h3>
                <p className="text-gray-300 leading-relaxed">
                  This application uses NASA's public APIs to fetch space data. Please refer to 
                  <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-space-400 hover:text-space-300 underline ml-1">
                    NASA's API Terms of Use
                  </a> for their data usage policies.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-space-300 mb-3">Analytics</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may use privacy-focused analytics tools to understand how users interact with our application. 
                  These tools are configured to respect user privacy and do not track personal information.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <AlertCircle className="h-8 w-8 text-space-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Your Rights</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3 mt-2"></div>
                <p className="text-gray-300">You can clear your locally stored data at any time through your browser settings</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3 mt-2"></div>
                <p className="text-gray-300">You can use the application without providing an API key (with limited functionality)</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-space-400 rounded-full mr-3 mt-2"></div>
                <p className="text-gray-300">You can disable analytics tracking through your browser settings</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-space-800/50 to-purple-800/50 backdrop-blur-md rounded-xl p-8 border border-space-500/50">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Contact Us</h2>
            <p className="text-gray-300 text-center leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
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
              </div>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-white mb-3">Policy Updates</h3>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page 
              with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage