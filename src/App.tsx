import React, { useEffect, useState } from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import TTSGenerator from './components/TTSGenerator'
import FlashcardViewer from './components/FlashcardViewer'
import Settings from './components/Settings'
import { initSpeechSynthesis, isSpeechSynthesisSupported } from './utils/tts'
import { getSetting } from './utils/db'
import { configureApi } from './utils/api'

type TabType = 'tts' | 'flashcards' | 'settings';

function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('flashcards')
  const [isTTSSupported, setIsTTSSupported] = useState<boolean>(true)

  useEffect(() => {
    // Check if browser supports speech synthesis
    const supported = 'speechSynthesis' in window
    setIsTTSSupported(supported)
    
    // Initialize speech synthesis engine
    if (supported) {
      initSpeechSynthesis()
    }
    
    // Load API configuration on startup
    const loadApiConfig = async () => {
      try {
        // Get the saved API provider
        const savedApiProvider = await getSetting('api_provider')
        if (!savedApiProvider) return // No provider configured yet
        
        // Get the API key for the provider
        const keyName = `${savedApiProvider}_api_key`
        const savedApiKey = await getSetting(keyName)
        if (!savedApiKey) return // No API key configured yet
        
        // Get provider-specific settings
        const selectedModel = savedApiProvider === 'openai' ? 'gpt-4' :
                             savedApiProvider === 'azure' ? 'gpt4o-copilot' :
                             savedApiProvider === 'deepseek' ? 'deepseek-chat' :
                             savedApiProvider === 'anthropic' ? 'claude-3-haiku-20240307' : 'gpt-4'
        
        // Create base configuration
        const baseConfig = {
          provider: savedApiProvider,
          apiKey: savedApiKey,
          model: selectedModel
        }
        
        // Add provider-specific properties if needed
        if (savedApiProvider === 'azure') {
          configureApi({
            ...baseConfig,
            provider: 'azure',
            azureEndpoint: await getSetting('azure_api_base'),
            azureInstanceName: await getSetting('azure_instance_name'),
            azureDeployment: 'gpt4o-copilot',
            azureApiVersion: await getSetting('azure_api_version'),
          })
        } else {
          // For other providers, use the base configuration
          configureApi(baseConfig as any)
        }
        
        console.log('API configured successfully on startup')
        console.log('API configuration:', baseConfig)
      } catch (err) {
        console.error('Error loading API configuration on startup:', err)
      }
    }
    
    loadApiConfig()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {!isTTSSupported && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>Your browser doesn't support Text-to-Speech functionality. Please try a different browser.</p>
          </div>
        )}
        
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'tts' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${activeTab === 'tts' ? '' : 'border-r border-gray-200'} rounded-l-lg`}
              onClick={() => setActiveTab('tts')}
            >
              Text-to-Speech
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'flashcards' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${activeTab === 'flashcards' ? '' : 'border-r border-gray-200'}`}
              onClick={() => setActiveTab('flashcards')}
            >
              Flashcards
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === 'settings' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
        </div>
        
        {activeTab === 'tts' ? (
          <TTSGenerator />
        ) : activeTab === 'flashcards' ? (
          <FlashcardViewer />
        ) : (
          <Settings />
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default App