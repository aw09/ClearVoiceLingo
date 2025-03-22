// Utility functions for Text-to-Speech functionality

// Get available voices and filter by language
export function getVoices(lang) {
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

// Speak text with the specified voice
export function speak(text, voice, rate = 1, pitch = 1, volume = 1) {
  return new Promise((resolve, reject) => {
    if (!text) {
      reject(new Error('No text provided'))
      return
    }

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Set voice if provided
    if (voice) {
      utterance.voice = voice
    }
    
    // Set speech parameters
    utterance.rate = rate      // Speed of speech (0.1 to 10)
    utterance.pitch = pitch    // Pitch of speech (0 to 2)
    utterance.volume = volume  // Volume of speech (0 to 1)
    
    // Set event handlers
    utterance.onend = () => resolve()
    utterance.onerror = (error) => reject(error)
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    // Speak the text
    window.speechSynthesis.speak(utterance)
  })
}

// Stop any ongoing speech
export function stopSpeaking() {
  window.speechSynthesis.cancel()
}

// Check if browser supports speech synthesis
export function isSpeechSynthesisSupported() {
  return 'speechSynthesis' in window
}