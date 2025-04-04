export interface ChineseCharacter {
  character: string;
  romaji: string; // Pinyin pronunciation
  soundUrl?: string;
}

export const chineseCharacters: ChineseCharacter[] = [
  { character: '你', romaji: 'nǐ' },
  { character: '好', romaji: 'hǎo' },
  { character: '我', romaji: 'wǒ' },
  { character: '是', romaji: 'shì' },
  { character: '人', romaji: 'rén' },
  { character: '他', romaji: 'tā' },
  { character: '她', romaji: 'tā' },
  { character: '的', romaji: 'de' },
  { character: '了', romaji: 'le' },
  { character: '不', romaji: 'bù' },
  { character: '在', romaji: 'zài' },
  { character: '有', romaji: 'yǒu' },
  { character: '这', romaji: 'zhè' },
  { character: '个', romaji: 'gè' },
  { character: '们', romaji: 'men' },
  { character: '来', romaji: 'lái' },
  { character: '去', romaji: 'qù' },
  { character: '和', romaji: 'hé' },
  { character: '就', romaji: 'jiù' },
  { character: '说', romaji: 'shuō' },
];
