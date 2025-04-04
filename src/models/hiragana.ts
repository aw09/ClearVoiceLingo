export interface HiraganaCharacter {
  character: string;
  romaji: string;
  soundUrl?: string;
}

export interface HiraganaMnemonic {
  character: string;
  sound: string;
  mnemonic: string;
}

export const hiraganaCharacters: HiraganaCharacter[] = [
  { character: 'あ', romaji: 'a' },
  { character: 'い', romaji: 'i' },
  { character: 'う', romaji: 'u' },
  { character: 'え', romaji: 'e' },
  { character: 'お', romaji: 'o' },
  { character: 'か', romaji: 'ka' },
  { character: 'き', romaji: 'ki' },
  { character: 'く', romaji: 'ku' },
  { character: 'け', romaji: 'ke' },
  { character: 'こ', romaji: 'ko' },
  { character: 'さ', romaji: 'sa' },
  { character: 'し', romaji: 'shi' },
  { character: 'す', romaji: 'su' },
  { character: 'せ', romaji: 'se' },
  { character: 'そ', romaji: 'so' },
  { character: 'た', romaji: 'ta' },
  { character: 'ち', romaji: 'chi' },
  { character: 'つ', romaji: 'tsu' },
  { character: 'て', romaji: 'te' },
  { character: 'と', romaji: 'to' },
  { character: 'な', romaji: 'na' },
  { character: 'に', romaji: 'ni' },
  { character: 'ぬ', romaji: 'nu' },
  { character: 'ね', romaji: 'ne' },
  { character: 'の', romaji: 'no' },
  { character: 'は', romaji: 'ha' },
  { character: 'ひ', romaji: 'hi' },
  { character: 'ふ', romaji: 'fu' },
  { character: 'へ', romaji: 'he' },
  { character: 'ほ', romaji: 'ho' },
  { character: 'ま', romaji: 'ma' },
  { character: 'み', romaji: 'mi' },
  { character: 'む', romaji: 'mu' },
  { character: 'め', romaji: 'me' },
  { character: 'も', romaji: 'mo' },
  { character: 'や', romaji: 'ya' },
  { character: 'ゆ', romaji: 'yu' },
  { character: 'よ', romaji: 'yo' },
  { character: 'ら', romaji: 'ra' },
  { character: 'り', romaji: 'ri' },
  { character: 'る', romaji: 'ru' },
  { character: 'れ', romaji: 're' },
  { character: 'ろ', romaji: 'ro' },
  { character: 'わ', romaji: 'wa' },
  { character: 'を', romaji: 'wo' },
  { character: 'ん', romaji: 'n' },
  { character: 'が', romaji: 'ga' },
  { character: 'ぎ', romaji: 'gi' },
  { character: 'ぐ', romaji: 'gu' },
  { character: 'げ', romaji: 'ge' },
  { character: 'ご', romaji: 'go' },
  { character: 'ざ', romaji: 'za' },
  { character: 'じ', romaji: 'ji' },
  { character: 'ず', romaji: 'zu' },
  { character: 'ぜ', romaji: 'ze' },
  { character: 'ぞ', romaji: 'zo' },
  { character: 'だ', romaji: 'da' },
  { character: 'ぢ', romaji: 'ji' },
  { character: 'づ', romaji: 'zu' },
  { character: 'で', romaji: 'de' },
  { character: 'ど', romaji: 'do' },
  { character: 'ば', romaji: 'ba' },
  { character: 'び', romaji: 'bi' },
  { character: 'ぶ', romaji: 'bu' },
  { character: 'べ', romaji: 'be' },
  { character: 'ぼ', romaji: 'bo' },
  { character: 'ぱ', romaji: 'pa' },
  { character: 'ぴ', romaji: 'pi' },
  { character: 'ぷ', romaji: 'pu' },
  { character: 'ぺ', romaji: 'pe' },
  { character: 'ぽ', romaji: 'po' },
];

export const hiraganaMnemonics: Record<string, HiraganaMnemonic> = {
  'あ': { character: 'あ', sound: 'a', mnemonic: 'Looks like an "Antenna" on a house.' },
  'い': { character: 'い', sound: 'i', mnemonic: 'Two people standing together, saying "ii" (いい = good in Japanese).' },
  'う': { character: 'う', sound: 'u', mnemonic: 'Looks like a "U"-shaped worm.' },
  'え': { character: 'え', sound: 'e', mnemonic: 'Looks like an "Energetic" person doing a dance.' },
  'お': { character: 'お', sound: 'o', mnemonic: 'Looks like an "Olympic" runner with a medal.' },
  
  'か': { character: 'か', sound: 'ka', mnemonic: 'Looks like a "Kite" flying in the sky.' },
  'き': { character: 'き', sound: 'ki', mnemonic: 'Looks like a "Key" with teeth at the bottom.' },
  'く': { character: 'く', sound: 'ku', mnemonic: 'Looks like a bird\'s beak saying "Coo!".' },
  'け': { character: 'け', sound: 'ke', mnemonic: 'Looks like a "Keg" with a spout.' },
  'こ': { character: 'こ', sound: 'ko', mnemonic: 'Looks like two "Coiled" worms.' },
  
  'さ': { character: 'さ', sound: 'sa', mnemonic: 'Looks like a "Sail" on a boat.' },
  'し': { character: 'し', sound: 'shi', mnemonic: 'Looks like a "Sheep\'s" head with a curved horn.' },
  'す': { character: 'す', sound: 'su', mnemonic: 'Looks like a "Swing" hanging from a tree.' },
  'せ': { character: 'せ', sound: 'se', mnemonic: 'Looks like a "Sail" with a wave underneath.' },
  'そ': { character: 'そ', sound: 'so', mnemonic: 'Looks like a "Sewing" thread curling.' },
  
  'た': { character: 'た', sound: 'ta', mnemonic: 'Looks like a "Taco" with a line on top.' },
  'ち': { character: 'ち', sound: 'chi', mnemonic: 'Looks like a "Cheese wedge" with a bite taken out.' },
  'つ': { character: 'つ', sound: 'tsu', mnemonic: 'Looks like a "Tsunami" wave.' },
  'て': { character: 'て', sound: 'te', mnemonic: 'Looks like a "Tennis racket" swinging.' },
  'と': { character: 'と', sound: 'to', mnemonic: 'Looks like a "Toe" with a nail sticking out.' },
  
  'な': { character: 'な', sound: 'na', mnemonic: 'Looks like a "Knot" tied in a rope.' },
  'に': { character: 'に', sound: 'ni', mnemonic: 'Looks like a "Knee" bending while kneeling.' },
  'ぬ': { character: 'ぬ', sound: 'nu', mnemonic: 'Looks like a "Noodle" with a loop.' },
  'ね': { character: 'ね', sound: 'ne', mnemonic: 'Looks like a "Net" catching fish.' },
  'の': { character: 'の', sound: 'no', mnemonic: 'Looks like the letter "NO" as a swirling motion.' },
  
  'は': { character: 'は', sound: 'ha', mnemonic: 'Looks like "Hawaii" where the sun sets on the beach.' },
  'ひ': { character: 'ひ', sound: 'hi', mnemonic: 'Looks like a "Hee-hee" smile.' },
  'ふ': { character: 'ふ', sound: 'fu', mnemonic: 'Looks like a "Fuji" mountain with wind blowing.' },
  'へ': { character: 'へ', sound: 'he', mnemonic: 'Looks like a "Hill" (へ also means "direction" or "to" in Japanese).' },
  'ほ': { character: 'ほ', sound: 'ho', mnemonic: 'Looks like a "Hot" fire with flames.' },
  
  'ま': { character: 'ま', sound: 'ma', mnemonic: 'Looks like a "Mama" holding a baby.' },
  'み': { character: 'み', sound: 'mi', mnemonic: 'Looks like a "Meat skewer" with two sticks.' },
  'む': { character: 'む', sound: 'mu', mnemonic: 'Looks like a "Moose" with curled antlers.' },
  'め': { character: 'め', sound: 'me', mnemonic: 'Looks like an "Eye" (め means "eye" in Japanese).' },
  'も': { character: 'も', sound: 'mo', mnemonic: 'Looks like a "Fishing hook" catching something.' },
  
  'や': { character: 'や', sound: 'ya', mnemonic: 'Looks like a "Yak" with curved horns.' },
  'ゆ': { character: 'ゆ', sound: 'yu', mnemonic: 'Looks like a "U-turn" sign.' },
  'よ': { character: 'よ', sound: 'yo', mnemonic: 'Looks like a "Yoga" person stretching.' },
  
  'ら': { character: 'ら', sound: 'ra', mnemonic: 'Looks like a "Rabbit" with long ears.' },
  'り': { character: 'り', sound: 'ri', mnemonic: 'Looks like two "Reeds" growing in water.' },
  'る': { character: 'る', sound: 'ru', mnemonic: 'Looks like a "Loop" of thread.' },
  'れ': { character: 'れ', sound: 're', mnemonic: 'Looks like a "Ledge" sticking out of a wall.' },
  'ろ': { character: 'ろ', sound: 'ro', mnemonic: 'Looks like a "Road" turning at an angle.' },
  
  'わ': { character: 'わ', sound: 'wa', mnemonic: 'Looks like a "Wasp" buzzing around.' },
  'を': { character: 'を', sound: 'wo (o)', mnemonic: 'Looks like a "Warped road" curving.' },
  
  'ん': { character: 'ん', sound: 'n', mnemonic: 'Looks like an "End" of a road curving down.' },
  
  // Voiced Consonants (Dakuten)
  'が': { character: 'が', sound: 'ga', mnemonic: 'A "Kite" that caught a "Gust" of wind (か + dakuten).' },
  'ぎ': { character: 'ぎ', sound: 'gi', mnemonic: 'A "Key" that\'s "Gleaming" (き + dakuten).' },
  'ぐ': { character: 'ぐ', sound: 'gu', mnemonic: 'A bird saying "Good!" instead of "Coo!" (く + dakuten).' },
  'げ': { character: 'げ', sound: 'ge', mnemonic: 'A "Keg" being opened, making a "Geyser" (け + dakuten).' },
  'ご': { character: 'ご', sound: 'go', mnemonic: 'Two worms that are "Going" somewhere (こ + dakuten).' },
  
  'ざ': { character: 'ざ', sound: 'za', mnemonic: 'A "Sail" caught in a "Zippy" wind (さ + dakuten).' },
  'じ': { character: 'じ', sound: 'ji', mnemonic: 'A "Sheep" making a "Jittery" movement (し + dakuten).' },
  'ず': { character: 'ず', sound: 'zu', mnemonic: 'A "Swing" making a "Zoom" sound (す + dakuten).' },
  'ぜ': { character: 'ぜ', sound: 'ze', mnemonic: 'A "Sail" in a "Zephyr" wind (せ + dakuten).' },
  'ぞ': { character: 'ぞ', sound: 'zo', mnemonic: 'A "Sewing" thread in a "Zone" (そ + dakuten).' },
  
  'だ': { character: 'だ', sound: 'da', mnemonic: 'A "Taco" with "Daring" toppings (た + dakuten).' },
  'ぢ': { character: 'ぢ', sound: 'ji', mnemonic: 'A "Cheese wedge" on a "Dinner" plate (ち + dakuten).' },
  'づ': { character: 'づ', sound: 'zu', mnemonic: 'A "Tsunami" going down a "Drain" (つ + dakuten).' },
  'で': { character: 'で', sound: 'de', mnemonic: 'A "Tennis racket" in a "Demo" match (て + dakuten).' },
  'ど': { character: 'ど', sound: 'do', mnemonic: 'A "Toe" with a "Door" nail (と + dakuten).' },
  
  'ば': { character: 'ば', sound: 'ba', mnemonic: '"Hawaii" with "Bamboo" trees (は + dakuten).' },
  'び': { character: 'び', sound: 'bi', mnemonic: 'A "Hee-hee" smile saying "Bee-bee" (ひ + dakuten).' },
  'ぶ': { character: 'ぶ', sound: 'bu', mnemonic: '"Fuji" mountain with a "Bull" climbing it (ふ + dakuten).' },
  'べ': { character: 'べ', sound: 'be', mnemonic: 'A "Hill" with a "Bell" on top (へ + dakuten).' },
  'ぼ': { character: 'ぼ', sound: 'bo', mnemonic: 'A "Hot" fire in a "Boat" (ほ + dakuten).' },
  
  'ぱ': { character: 'ぱ', sound: 'pa', mnemonic: '"Hawaii" with "Palm" trees (は + handakuten).' },
  'ぴ': { character: 'ぴ', sound: 'pi', mnemonic: 'A "Hee-hee" smile saying "Pee-pee" (ひ + handakuten).' },
  'ぷ': { character: 'ぷ', sound: 'pu', mnemonic: '"Fuji" mountain with a "Puff" of smoke (ふ + handakuten).' },
  'ぺ': { character: 'ぺ', sound: 'pe', mnemonic: 'A "Hill" with a "Peg" on top (へ + handakuten).' },
  'ぽ': { character: 'ぽ', sound: 'po', mnemonic: 'A "Hot" fire in a "Pot" (ほ + handakuten).' },
};

// Helper function to get a mnemonic for a hiragana character
export function getHiraganaMnemonic(character: string): HiraganaMnemonic | undefined {
  return hiraganaMnemonics[character];
}
