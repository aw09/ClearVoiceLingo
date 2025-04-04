import { getHiraganaMnemonic, HiraganaMnemonic } from './hiragana';
// We can add imports for other writing systems in the future
// import { getKatakanaMnemonic } from './katakana';
// import { getChineseMnemonic } from './chinese';
// import { getCyrillicMnemonic } from './cyrillic';

export interface Mnemonic {
  character: string;
  sound: string;
  mnemonic: string;
}

export const getMnemonicForCharacter = (
  character: string,
  writingSystemId: string
): Mnemonic | undefined => {
  switch (writingSystemId) {
    case 'hiragana':
      return getHiraganaMnemonic(character);
    // We can add support for other writing systems in the future
    // case 'katakana':
    //   return getKatakanaMnemonic(character);
    // case 'chinese':
    //   return getChineseMnemonic(character);
    // case 'cyrillic':
    //   return getCyrillicMnemonic(character);
    default:
      return undefined;
  }
};
