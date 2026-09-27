import { useMemo, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { WordCard } from "../components/WordCard";
import type { Word } from "../models/Word";

interface LessonSetupPageProps {
  words: Word[];
  onBack: () => void;
  onAddWord: () => void;
  onStart: (words: Word[]) => void;
}

export function LessonSetupPage({ words, onBack, onAddWord, onStart }: LessonSetupPageProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedWords = useMemo(
    () => selectedIds.flatMap((id) => words.find((word) => word.id === id) ?? []),
    [selectedIds, words],
  );

  function toggle(id: string) {
    setSelectedIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  }

  function move(index: number, direction: -1 | 1) {
    setSelectedIds((ids) => {
      const target = index + direction;
      if (target < 0 || target >= ids.length) return ids;
      const reordered = [...ids];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered;
    });
  }

  if (!words.length) {
    return (
      <div className="page-shell">
        <AppHeader title="Новий урок" onBack={onBack} />
        <main className="content-page">
          <section className="empty-state">
            <div className="empty-letters">1 · 2 · 3</div>
            <h2>Спочатку додайте слова</h2>
            <p>Для уроку потрібне хоча б одне слово із зображенням.</p>
            <button className="primary-button" onClick={onAddWord}>+ Додати слово</button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <AppHeader title="Новий урок" onBack={onBack} />
      <main className="setup-page">
        <section>
          <p className="eyebrow">Крок 1</p>
          <h2>Оберіть слова</h2>
          <p className="section-copy">Натискайте на всю картку. Вибрано: <strong>{selectedIds.length}</strong></p>
          <div className="word-grid selectable-grid">
            {words.map((word) => (
              <WordCard
                key={word.id}
                word={word}
                selectable
                selected={selectedIds.includes(word.id)}
                onToggle={() => toggle(word.id)}
              />
            ))}
          </div>
        </section>

        {selectedWords.length > 0 && (
          <section className="lesson-order">
            <p className="eyebrow">Крок 2</p>
            <h2>Порядок уроку</h2>
            <p className="section-copy">Змініть порядок стрілками, якщо потрібно.</p>
            <ol>
              {selectedWords.map((word, index) => (
                <li key={word.id}>
                  <span className="order-number">{index + 1}</span>
                  <img src={word.imageUrl} alt="" />
                  <strong>{word.text}</strong>
                  <span className="order-actions">
                    <button onClick={() => move(index, -1)} disabled={index === 0} aria-label={`${word.text} вище`}>↑</button>
                    <button onClick={() => move(index, 1)} disabled={index === selectedWords.length - 1} aria-label={`${word.text} нижче`}>↓</button>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
      <footer className="sticky-footer">
        <span>{selectedIds.length ? `Урок: ${selectedIds.length}` : "Оберіть слова"}</span>
        <button
          className="primary-button"
          disabled={!selectedIds.length}
          onClick={() => onStart(selectedWords)}
        >
          Почати урок →
        </button>
      </footer>
    </div>
  );
}
