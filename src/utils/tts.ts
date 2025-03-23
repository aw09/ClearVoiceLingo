// Utility functions for Text-to-Speech functionality

// Define types for speech synthesis
interface SpeechOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

// Get available voices and filter by language
export function getVoices(lang?: string): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    // Function to get and filter voices
    const getVoiceList = () => {
      const voices = window.speechSynthesis.getVoices()
      if (lang) {
        return voices.filter(voice => voice.lang.includes(lang))
      }
      return voices
    }

    // Check if voices are already loaded
    const voices = getVoiceList()
    if (voices.length > 0) {
      resolve(voices)
      return
    }

    // If voices aren't loaded yet, wait for the voiceschanged event
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(getVoiceList())
    }
  })
}

// Initialize speech synthesis - call this early to warm up the speech engine
export function initSpeechSynthesis(): void {
  if ('speechSynthesis' in window) {
    // Create a silent utterance to initialize the speech synthesis engine
    const initUtterance = new SpeechSynthesisUtterance('')
    window.speechSynthesis.speak(initUtterance)
    window.speechSynthesis.cancel() // Cancel it immediately
    
    // Force load voices
    window.speechSynthesis.getVoices()
  }
}

// Speech queue to manage multiple utterances
let speechQueue: SpeechSynthesisUtterance[] = []
let isSpeaking = false

// Process the speech queue
function processSpeechQueue() {
  if (speechQueue.length === 0 || isSpeaking) return
  
  isSpeaking = true
  const utterance = speechQueue.shift()!
  
  utterance.onend = () => {
    isSpeaking = false
    processSpeechQueue() // Process next item in queue
  }
  
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event)
    isSpeaking = false
    processSpeechQueue() // Try next item in queue
  }
  
  // Ensure speech synthesis is active
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
  }
  
  window.speechSynthesis.speak(utterance)
}

// Speak text with the specified voice
// Add at the top of the file
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, voice?: SpeechSynthesisVoice, rate = 1, pitch = 1, volume = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!text) {
      reject(new Error('No text provided'))
      return
    }
    
    // Cancel any ongoing speech
    if (currentUtterance) {
      window.speechSynthesis.cancel()
      currentUtterance = null
    }
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    currentUtterance = utterance
    
    if (voice) {
      utterance.voice = voice
    }
    
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume
    
    let retryCount = 0
    const maxRetries = 3
    
    const startSpeech = () => {
      utterance.onend = () => {
        console.log('Speech completed:', text)
        currentUtterance = null
        resolve()
      }
      
      utterance.onerror = (error) => {
        console.error('Speech error:', error)
        if (error.error === 'interrupted' && retryCount < maxRetries) {
          retryCount++
          console.log(`Retrying speech attempt ${retryCount}...`)
          setTimeout(startSpeech, 300)
        } else {
          currentUtterance = null
          reject(error)
        }
      }
      
      try {
        window.speechSynthesis.speak(utterance)
      } catch (err) {
        console.error('Speech synthesis error:', err)
        currentUtterance = null
        reject(err)
      }
    }
    
    // Start speech after a small delay
    setTimeout(startSpeech, 100)
  })
}

export function stopSpeaking(): void {
  if (currentUtterance) {
    window.speechSynthesis.cancel()
    currentUtterance = null
  }
}

// Check if browser supports speech synthesis
export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window
}