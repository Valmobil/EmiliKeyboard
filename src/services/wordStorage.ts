import type { Word } from "../models/Word";

const STORAGE_KEY = "emili.words.v1";

function isWord(value: unknown): value is Word {
  if (!value || typeof value !== "object") return false;
  const word = value as Partial<Word>;
  return (
    typeof word.id === "string" &&
    typeof word.text === "string" &&
    typeof word.imageUrl === "string" &&
    typeof word.createdAt === "string"
  );
}

export function loadWords(): Word[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter(isWord).map((word) => ({
          ...word,
          originalText: word.originalText || word.text,
        }))
      : [];
  } catch {
    return [];
  }
}

export function saveWords(words: Word[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}
