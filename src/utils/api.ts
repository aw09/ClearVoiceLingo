// API utility functions for OpenAI and Azure OpenAI
import { getSetting } from './db'

// Define types for language pairs
export interface LanguagePair {
  id?: string;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
}

// Define types for API responses
interface OpenAIResponse {
  choices: {
    message?: {
      content?: string;
    };
  }[];
  error?: {
    message?: string;
  };
}

interface AzureOpenAIResponse {
  choices: {
    message?: {
      content?: string;
    };
  }[];
  error?: {
    message?: string;
  };
}

// Check if API keys are configured
export async function isApiConfigured() {
  const provider = await getSetting('api_provider') || 'openai'
  
  if (provider === 'openai') {
    const apiKey = await getSetting('openai_api_key')
    return !!apiKey
  } else if (provider === 'azure') {
    const apiKey = await getSetting('azure_api_key')
    const region = await getSetting('azure_region')
    return !!apiKey && !!region
  }
  
  return false
}

// Generate language pair using OpenAI API
export async function generateLanguagePair(sourceText: string, sourceLang: LanguageCode, targetLang: LanguageCode): Promise<{sourceText: string, targetText: string, sourceLang: string, targetLang: string, timestamp: string}> {
  try {
    const provider = await getSetting('api_provider') || 'openai'
    
    if (provider === 'openai') {
      return await generateWithOpenAI(sourceText, sourceLang, targetLang)
    } else if (provider === 'azure') {
      return await generateWithAzure(sourceText, sourceLang, targetLang)
    } else {
      throw new Error('Invalid API provider')
    }
  } catch (error) {
    console.error('Error generating language pair:', error)
    throw error
  }
}

// Generate using OpenAI API
async function generateWithOpenAI(sourceText: string, sourceLang: LanguageCode, targetLang: LanguageCode): Promise<{sourceText: string, targetText: string, sourceLang: string, targetLang: string, timestamp: string}> {
  const apiKey = await getSetting('openai_api_key')
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a language translation assistant. Translate the given text from ${getLanguageName(sourceLang)} to ${getLanguageName(targetLang)}. Provide only the translation, no explanations.`
        },
        {
          role: 'user',
          content: sourceText
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
  }
  
  const data = await response.json()
  const translatedText = data.choices[0]?.message?.content?.trim()
  
  if (!translatedText) {
    throw new Error('Failed to generate translation')
  }
  
  return {
    sourceText,
    targetText: translatedText,
    sourceLang,
    targetLang,
    timestamp: new Date().toISOString()
  }
}

// Generate using Azure OpenAI API
async function generateWithAzure(sourceText: string, sourceLang: LanguageCode, targetLang: LanguageCode): Promise<{sourceText: string, targetText: string, sourceLang: string, targetLang: string, timestamp: string}> {
  const apiKey = await getSetting('azure_api_key')
  const region = await getSetting('azure_region')
  
  if (!apiKey || !region) {
    throw new Error('Azure OpenAI API configuration incomplete')
  }
  
  // Azure OpenAI endpoint (adjust deployment name as needed)
  const deploymentName = 'gpt-35-turbo' // This should be configurable in a production app
  const endpoint = `https://${region}.api.cognitive.microsoft.com/openai/deployments/${deploymentName}/chat/completions?api-version=2023-05-15`
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: `You are a language translation assistant. Translate the given text from ${getLanguageName(sourceLang)} to ${getLanguageName(targetLang)}. Provide only the translation, no explanations.`
        },
        {
          role: 'user',
          content: sourceText
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Azure OpenAI API error: ${error.error?.message || 'Unknown error'}`)
  }
  
  const data = await response.json()
  const translatedText = data.choices[0]?.message?.content?.trim()
  
  if (!translatedText) {
    throw new Error('Failed to generate translation')
  }
  
  return {
    sourceText,
    targetText: translatedText,
    sourceLang,
    targetLang,
    timestamp: new Date().toISOString()
  }
}

// Helper function to get language name from code
const languages = {
    'en-US': 'English',
    'es-ES': 'Spanish',
    'fr-FR': 'French',
    'de-DE': 'German',
    'it-IT': 'Italian',
    'ja-JP': 'Japanese',
    'ko-KR': 'Korean',
    'zh-CN': 'Chinese'
  } as const

  type LanguageCode = keyof typeof languages

  function getLanguageName(langCode: LanguageCode): string {
  return languages[langCode] || 'Unknown';
}

export type { LanguageCode }