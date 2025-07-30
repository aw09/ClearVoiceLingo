// Database utility functions for storing and retrieving language pairs
import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { LanguageResponse } from '../models/languages';

// Define types for quiz progress
export interface QuizProgress {
  id: string; // writing system id
  writingSystem: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  lastPlayed: string;
  bestAccuracy: number;
  streak: number; // current correct streak
  totalSessions: number;
}

// Define types for database schema
interface ClearVoiceDB extends DBSchema {
  languagePairs: {
    key: string;
    value: LanguageResponse;
    indexes: { timestamp: string };
  };
  ttsPairs: {
    key: string;
    value: TTSPair;
    indexes: { timestamp: string };
  };
  quizProgress: {
    key: string;
    value: QuizProgress;
    indexes: { lastPlayed: string };
  };
  settings: {
    key: string;
    value: {
      id: string;
      value: any;
    };
  };
}

// Define types for TTS pairs
export interface TTSPair {
  id: string;
  text: string;
  voice: {
    name: string;
    lang: string;
  };
  rate: number;
  timestamp: string;
}



// Database name and version
const DB_NAME = 'clearvoicelingo-db'
const DB_VERSION = 3

// Open the database connection
async function openDatabase(): Promise<IDBPDatabase<ClearVoiceDB>> {
  return openDB<ClearVoiceDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('languagePairs')) {
        const pairsStore = db.createObjectStore('languagePairs', { keyPath: 'id' })
        pairsStore.createIndex('timestamp', 'timestamp')
      }

      if (!db.objectStoreNames.contains('ttsPairs')) {
        const ttsStore = db.createObjectStore('ttsPairs', { keyPath: 'id' })
        ttsStore.createIndex('timestamp', 'timestamp')
      }

      if (!db.objectStoreNames.contains('quizProgress')) {
        const progressStore = db.createObjectStore('quizProgress', { keyPath: 'id' })
        progressStore.createIndex('lastPlayed', 'lastPlayed')
      }
      
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' })
      }
    }
  })
}

// Save language pairs to IndexedDB
export async function saveLanguagePairs(pairs: LanguageResponse[]): Promise<boolean> {
  const db = await openDatabase()
  const tx = db.transaction('languagePairs', 'readwrite')
  const store = tx.objectStore('languagePairs')
  
  // Add each pair to the store
  for (const pair of pairs) {
    await store.put(pair)
  }
  
  await tx.done
  return true
}

// Get all language pairs from IndexedDB
export async function getLanguagePairs(): Promise<LanguageResponse[]> {
  const db = await openDatabase()
  return db.getAll('languagePairs')
}

// Get language pairs by source language
export async function getPairsBySourceLang(lang: string): Promise<LanguageResponse[]> {
  const db = await openDatabase()
  const tx = db.transaction('languagePairs', 'readonly')
  const store = tx.objectStore('languagePairs')
  const pairs = await store.getAll()
  
  return pairs.filter(pair => pair.sourceText === lang)
}

// Get language pairs by target language
export async function getPairsByTargetLang(lang: string): Promise<LanguageResponse[]> {
  const db = await openDatabase()
  const tx = db.transaction('languagePairs', 'readonly')
  const store = tx.objectStore('languagePairs')
  const pairs = await store.getAll()
  
  return pairs.filter(pair => pair.targetText === lang)
}

// Delete a language pair by ID
export async function deleteLanguagePair(id: string): Promise<boolean> {
  const db = await openDatabase()
  await db.delete('languagePairs', id)
  return true
}

// Save a setting to IndexedDB
export async function saveSetting(key: string, value: any): Promise<boolean> {
  const db = await openDatabase()
  const tx = db.transaction('settings', 'readwrite')
  const store = tx.objectStore('settings')
  await store.put({ id: key, value })
  await tx.done
  return true
}

// Get a setting from IndexedDB
export async function getSetting(key: string): Promise<any> {
  const db = await openDatabase()
  const setting = await db.get('settings', key)
  return setting ? setting.value : null
}

// Save TTS pair to IndexedDB
export async function saveTTSPair(pair: TTSPair): Promise<boolean> {
  const db = await openDatabase()
  const tx = db.transaction('ttsPairs', 'readwrite')
  const store = tx.objectStore('ttsPairs')
  await store.put(pair)
  await tx.done
  return true
}

// Get all TTS pairs from IndexedDB
export async function getTTSPairs(): Promise<TTSPair[]> {
  const db = await openDatabase()
  return db.getAll('ttsPairs')
}

// Delete a TTS pair by ID
export async function deleteTTSPair(id: string): Promise<boolean> {
  const db = await openDatabase()
  await db.delete('ttsPairs', id)
  return true
}

// Save quiz progress to IndexedDB
export async function saveQuizProgress(progress: QuizProgress): Promise<boolean> {
  const db = await openDatabase()
  const tx = db.transaction('quizProgress', 'readwrite')
  const store = tx.objectStore('quizProgress')
  await store.put(progress)
  await tx.done
  return true
}

// Get quiz progress by writing system ID
export async function getQuizProgress(writingSystemId: string): Promise<QuizProgress | null> {
  const db = await openDatabase()
  const progress = await db.get('quizProgress', writingSystemId)
  return progress || null
}

// Get all quiz progress
export async function getAllQuizProgress(): Promise<QuizProgress[]> {
  const db = await openDatabase()
  return db.getAll('quizProgress')
}

// Update quiz statistics after a question
export async function updateQuizStats(
  writingSystemId: string, 
  writingSystemName: string, 
  isCorrect: boolean
): Promise<QuizProgress> {
  const existing = await getQuizProgress(writingSystemId)
  
  const now = new Date().toISOString()
  
  let progress: QuizProgress
  
  if (existing) {
    // Update existing progress
    const newTotalQuestions = existing.totalQuestions + 1
    const newCorrectAnswers = existing.correctAnswers + (isCorrect ? 1 : 0)
    const newAccuracy = Math.round((newCorrectAnswers / newTotalQuestions) * 100)
    const newStreak = isCorrect ? existing.streak + 1 : 0
    
    progress = {
      ...existing,
      totalQuestions: newTotalQuestions,
      correctAnswers: newCorrectAnswers,
      accuracy: newAccuracy,
      lastPlayed: now,
      bestAccuracy: Math.max(existing.bestAccuracy, newAccuracy),
      streak: newStreak
    }
  } else {
    // Create new progress
    progress = {
      id: writingSystemId,
      writingSystem: writingSystemName,
      totalQuestions: 1,
      correctAnswers: isCorrect ? 1 : 0,
      accuracy: isCorrect ? 100 : 0,
      lastPlayed: now,
      bestAccuracy: isCorrect ? 100 : 0,
      streak: isCorrect ? 1 : 0,
      totalSessions: 1
    }
  }
  
  await saveQuizProgress(progress)
  return progress
}