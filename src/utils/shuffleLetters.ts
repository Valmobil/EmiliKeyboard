export interface LetterTileModel {
  id: string;
  letter: string;
}

export function lettersForWord(word: string): LetterTileModel[] {
  return Array.from(word).map((letter, index) => ({
    id: `${index}-${crypto.randomUUID()}`,
    letter,
  }));
}

export function shuffleLetters(word: string): LetterTileModel[] {
  const original = lettersForWord(word);
  if (new Set(original.map(({ letter }) => letter)).size < 2) return original;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const shuffled = [...original];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[index],
      ];
    }
    if (shuffled.some((tile, index) => tile.letter !== original[index].letter)) {
      return shuffled;
    }
  }

  const firstDifferent = original.findIndex(
    (tile) => tile.letter !== original[0].letter,
  );
  return [...original.slice(firstDifferent), ...original.slice(0, firstDifferent)];
}
