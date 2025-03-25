import { z } from 'zod';

export const SupportedLanguages = [
  {
    name: 'English',
    code: 'en',
  },
  {
     name: 'Indonesian',
     code: 'id', 
  },
  {
    name: 'Japanese',
    code: 'ja',
  },
  {
    name: 'Chinese',
    code: 'zh',
  },
  {
    name: 'Korean',
    code: 'ko', 
  },
  {
    name: 'Spanish',
    code: 'es', 
  },
  {
    name: 'French',
    code: 'fr',
  },
  {
    name: 'German',
    code: 'de', 
  },
  {
    name: 'Italian',
    code: 'it', 
  },
]

export interface LanguageResponse {
  id: string;
  sourceText: string;
  targetText: string;
  category: {
    level: string;
    place: string;
    situation: string;
  };
  pronunciation: {
    romaji?: string;
    guide: string;
  };
}

export const LanguageResponseSchema = z.object({
  result: z.array(
    z.object({
      id: z.string().describe('Unique identifier for the translation'),
      sourceText: z.string().describe('Original text in source language'),
      targetText: z.string().describe('Translated text in target language'), 
      category: z.object({
        level: z.string().describe('Proficiency level (N1-N5 for Japanese/HSK for Chinese/CEFR for others)'),
        place: z.string().describe('Location or context where this phrase would be used'),
        situation: z.string().describe('Usage context (formal/casual/business etc)')
      }),
      pronunciation: z.object({
        romaji: z.string().optional().describe('Romanized text for target language'),
        guide: z.string().describe('Pronunciation explanation for target language'), 
      })
    }) 
  )
})

export type SupportedLanguageCode = typeof SupportedLanguages[number]['code'];

export interface Language {
  code: SupportedLanguageCode;
  name: string;
}

export interface LanguageResponse {
  sourceText: string;
  targetText: string;
  category: {
    level: string;
    place: string;
    situation: string;
  };
  pronunciation: {
    romaji?: string;
    guide: string;
  };
}
