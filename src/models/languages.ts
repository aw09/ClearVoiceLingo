
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

export type SupportedLanguageCode = (typeof SupportedLanguages)[number]['code'];
