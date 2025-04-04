export interface CyrillicCharacter {
  character: string;
  romaji: string; // Romanized pronunciation
  soundUrl?: string;
}

export const cyrillicCharacters: CyrillicCharacter[] = [
  { character: 'А', romaji: 'a' },
  { character: 'Б', romaji: 'b' },
  { character: 'В', romaji: 'v' },
  { character: 'Г', romaji: 'g' },
  { character: 'Д', romaji: 'd' },
  { character: 'Е', romaji: 'ye' },
  { character: 'Ё', romaji: 'yo' },
  { character: 'Ж', romaji: 'zh' },
  { character: 'З', romaji: 'z' },
  { character: 'И', romaji: 'i' },
  { character: 'Й', romaji: 'y' },
  { character: 'К', romaji: 'k' },
  { character: 'Л', romaji: 'l' },
  { character: 'М', romaji: 'm' },
  { character: 'Н', romaji: 'n' },
  { character: 'О', romaji: 'o' },
  { character: 'П', romaji: 'p' },
  { character: 'Р', romaji: 'r' },
  { character: 'С', romaji: 's' },
  { character: 'Т', romaji: 't' },
  { character: 'У', romaji: 'u' },
  { character: 'Ф', romaji: 'f' },
  { character: 'Х', romaji: 'kh' },
  { character: 'Ц', romaji: 'ts' },
  { character: 'Ч', romaji: 'ch' },
  { character: 'Ш', romaji: 'sh' },
  { character: 'Щ', romaji: 'shch' },
  { character: 'Ъ', romaji: '"hard sign"' },
  { character: 'Ы', romaji: 'y' },
  { character: 'Ь', romaji: '"soft sign"' },
  { character: 'Э', romaji: 'e' },
  { character: 'Ю', romaji: 'yu' },
  { character: 'Я', romaji: 'ya' },
];
