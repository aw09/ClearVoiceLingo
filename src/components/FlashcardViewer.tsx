import React, { useState, useEffect } from 'react'
import { getLanguagePairs, deleteLanguagePair, LanguagePair } from '../utils/db'
import { speak, stopSpeaking } from '../utils/tts'

function FlashcardViewer(): React.ReactElement {
  const [pairs, setPairs] = useState<LanguagePair[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isFlipped, setIsFlipped] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [filterLang, setFilterLang] = useState<string>('')

  // Load language pairs from IndexedDB
  useEffect(() => {
    const loadPairs = async () => {
      try {
        setIsLoading(true)
        const savedPairs = await getLanguagePairs()
        setPairs(savedPairs)
      } catch (err) {
        setError('Failed to load flashcards. Please try again.')
        console.error('Error loading flashcards:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPairs()
  }, [])

  // Filter pairs by language
  const filteredPairs = filterLang
    ? pairs.filter(pair => pair.sourceLang === filterLang || pair.targetLang === filterLang)
    : pairs

  // Get current flashcard
  const currentPair = filteredPairs[currentIndex] || null

  // Handle card flip
  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  // Navigate to next card
  const nextCard = () => {
    stopSpeaking()
    setIsSpeaking(false)
    setIsFlipped(false)
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= filteredPairs.length - 1) return 0
      return prevIndex + 1
    })
  }

  // Navigate to previous card
  const prevCard = () => {
    stopSpeaking()
    setIsSpeaking(false)
    setIsFlipped(false)
    setCurrentIndex((prevIndex) => {
      if (prevIndex <= 0) return filteredPairs.length - 1
      return prevIndex - 1
    })
  }

  // Speak the current card text
  const speakText = async () => {
    if (!currentPair) return
    
    setIsSpeaking(true)
    
    try {
      const text = isFlipped ? currentPair.targetText : currentPair.sourceText
      await speak(text)
    } catch (err) {
      console.error('Error speaking text:', err)
    } finally {
      setIsSpeaking(false)
    }
  }

  // Delete the current flashcard
  const deleteCard = async () => {
    if (!currentPair) return
    
    try {
      await deleteLanguagePair(currentPair.id)
      
      // Update the local state
      setPairs(prevPairs => prevPairs.filter(pair => pair.id !== currentPair.id))
      
      // Adjust current index if needed
      if (currentIndex >= filteredPairs.length - 1) {
        setCurrentIndex(Math.max(0, filteredPairs.length - 2))
      }
    } catch (err) {
      setError('Failed to delete flashcard. Please try again.')
      console.error('Error deleting flashcard:', err)
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Flashcards</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="filterLang" className="block text-sm font-medium text-gray-700 mb-1">Filter by Language</label>
        <select
          id="filterLang"
          className="select w-full"
          value={filterLang}
          onChange={(e) => {
            setFilterLang(e.target.value)
            setCurrentIndex(0)
            setIsFlipped(false)
          }}
        >
          <option value="">All Languages</option>
          <option value="en-US">English (US)</option>
          <option value="es-ES">Spanish (Spain)</option>
          <option value="fr-FR">French (France)</option>
          <option value="de-DE">German (Germany)</option>
          <option value="it-IT">Italian (Italy)</option>
          <option value="ja-JP">Japanese (Japan)</option>
          <option value="ko-KR">Korean (Korea)</option>
          <option value="zh-CN">Chinese (China)</option>
        </select>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : filteredPairs.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No flashcards</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterLang ? 'No flashcards match your filter.' : 'Generate some language pairs in the Text-to-Speech tab to get started.'}
          </p>
        </div>
      ) : (
        <div>
          <div 
            className={`relative h-64 w-full cursor-pointer transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={flipCard}
          >
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 border-2 rounded-lg ${isFlipped ? 'hidden' : 'block'} ${isSpeaking ? 'border-primary-500' : 'border-gray-200'}`}>
              <p className="text-sm text-gray-500 mb-2">{currentPair?.sourceLang}</p>
              <p className="text-xl text-center">{currentPair?.sourceText}</p>
              <p className="text-sm text-gray-500 mt-4">Tap to flip</p>
            </div>
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 border-2 rounded-lg ${isFlipped ? 'block' : 'hidden'} ${isSpeaking ? 'border-primary-500' : 'border-gray-200'}`}>
              <p className="text-sm text-gray-500 mb-2">{currentPair?.targetLang}</p>
              <p className="text-xl text-center">{currentPair?.targetText}</p>
              <p className="text-sm text-gray-500 mt-4">Tap to flip</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="flex space-x-2">
              <button
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={prevCard}
                title="Previous Card"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={nextCard}
                title="Next Card"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-500">
              {filteredPairs.length > 0 ? `${currentIndex + 1} / ${filteredPairs.length}` : '0 / 0'}
            </p>
            
            <div className="flex space-x-2">
              <button
                className={`p-2 rounded-full ${isSpeaking ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={isSpeaking ? stopSpeaking : speakText}
                title={isSpeaking ? 'Stop Speaking' : 'Speak'}
                disabled={!currentPair}
              >
                {isSpeaking ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button
                className="p-2 rounded-full bg-gray-100 text-red-600 hover:bg-red-100"
                onClick={deleteCard}
                title="Delete Card"
                disabled={!currentPair}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlashcardViewer