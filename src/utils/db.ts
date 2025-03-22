// Database utility functions for storing and retrieving language pairs
import { openDB, DBSchema, IDBPDatabase } from 'idb'

// Define types for database schema
interface ClearVoiceDB extends DBSchema {
  languagePairs: {
    key: string;
    value: LanguagePair;
    indexes: { timestamp: string };
  };
  settings: {
    key: string;
    value: {
      id: string;
      value: any;
    };
  };
}

// Define types for language pairs
export interface LanguagePair {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
}

// Database name and version
const DB_NAME = 'clearvoicelingo-db'
const DB_VERSION = 1

// Open the database connection
async function openDatabase(): Promise<IDBPDatabase<ClearVoiceDB>> {
  return openDB<ClearVoiceDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('languagePairs')) {
        const pairsStore = db.createObjectStore('languagePairs', { keyPath: 'id' })
        pairsStore.createIndex('timestamp', 'timestamp')
      }
      
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' })
      }
    }
  })
}

// Save language pairs to IndexedDB
export async function saveLanguagePairs(pairs: LanguagePair[]): Promise<boolean> {
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
export async function getLanguagePairs(): Promise<LanguagePair[]> {
  const db = await openDatabase()
  return db.getAll('languagePairs')
}

// Get language pairs by source language
export async function getPairsBySourceLang(lang: string): Promise<LanguagePair[]> {
  const db = await openDatabase()
  const tx = db.transaction('languagePairs', 'readonly')
  const store = tx.objectStore('languagePairs')
  const pairs = await store.getAll()
  
  return pairs.filter(pair => pair.sourceLang === lang)
}

// Get language pairs by target language
export async function getPairsByTargetLang(lang: string): Promise<LanguagePair[]> {
  const db = await openDatabase()
  const tx = db.transaction('languagePairs', 'readonly')
  const store = tx.objectStore('languagePairs')
  const pairs = await store.getAll()
  
  return pairs.filter(pair => pair.targetLang === lang)
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
  await db.put('settings', { id: key, value })
  return true
}

// Get a setting from IndexedDB
export async function getSetting(key: string): Promise<any> {
  const db = await openDatabase()
  const setting = await db.get('settings', key)
  return setting ? setting.value : null
}