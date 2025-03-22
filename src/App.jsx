import React, { useState, useEffect } from 'react'
import { isSpeechSynthesisSupported } from './utils/tts'
import TTSGenerator from './components/TTSGenerator'
import FlashcardViewer from './components/FlashcardViewer'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [activeTab, setActiveTab] = useState('tts')
  const [isTTSSupported, setIsTTSSupported] = useState(true)

  useEffect(() => {
    // Check if browser supports speech synthesis
    setIsTTSSupported(isSpeechSynthesisSupported())
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
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === 'tts' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('tts')}
            >
              Text-to-Speech
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === 'flashcards' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('flashcards')}
            >
              Flashcards
            </button>
          </div>
        </div>
        
        {activeTab === 'tts' ? (
          <TTSGenerator />
        ) : (
          <FlashcardViewer />
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default App