import { katakanaCharacters } from './katakana';
import { hiraganaCharacters } from './hiragana';
import { chineseCharacters } from './chinese';
import { cyrillicCharacters } from './cyrillic';

export interface Character {
  character: string;
  romaji: string; // Pronunciation in Latin alphabet
  soundUrl?: string;
}

export interface WritingSystem {
  id: string;
  name: string;
  description: string;
  characters: Character[];
  language: string; // ISO language code for TTS
}

// Collection of writing systems
export const writingSystems: WritingSystem[] = [
  {
    id: 'katakana',
    name: 'Katakana',
    description: 'Japanese syllabary used for foreign words and emphasis',
    characters: katakanaCharacters,
    language: 'ja'
  },
  {
    id: 'hiragana',
    name: 'Hiragana',
    description: 'Japanese syllabary used for native words and grammar',
    characters: hiraganaCharacters,
    language: 'ja'
  },
  {
    id: 'chinese',
    name: 'Chinese Characters',
    description: 'Common Chinese characters (Hanzi/Kanji)',
    characters: chineseCharacters,
    language: 'zh'
  },
  {
    id: 'cyrillic',
    name: 'Cyrillic Alphabet',
    description: 'Used in Russian and many Slavic languages',
    characters: cyrillicCharacters,
    language: 'ru'
  }
];

// Function to get a writing system by ID
export function getWritingSystemById(id: string): WritingSystem | undefined {
  return writingSystems.find(system => system.id === id);
}
