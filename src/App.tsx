import React, { useEffect, useState } from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import TTSGenerator from './components/TTSGenerator'
import FlashcardViewer from './components/FlashcardViewer'
import Settings from './components/Settings'
import { initSpeechSynthesis, isSpeechSynthesisSupported } from './utils/tts'

type TabType = 'tts' | 'flashcards' | 'settings';

function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('tts')
  const [isTTSSupported, setIsTTSSupported] = useState<boolean>(true)

  useEffect(() => {
    // Check if browser supports speech synthesis
    const supported = 'speechSynthesis' in window
    setIsTTSSupported(supported)
    
    // Initialize speech synthesis engine
    if (supported) {
      initSpeechSynthesis()
    }
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