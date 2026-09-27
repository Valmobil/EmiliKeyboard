import { AppHeader } from "../components/AppHeader";
import { WordCard } from "../components/WordCard";
import type { Word } from "../models/Word";

interface WordsPageProps {
  words: Word[];
  onBack: () => void;
  onAdd: () => void;
  onEdit: (word: Word) => void;
  onDelete: (word: Word) => void;
}

export function WordsPage({ words, onBack, onAdd, onEdit, onDelete }: WordsPageProps) {
  return (
    <div className="page-shell">
      <AppHeader title="Мої слова" onBack={onBack} action={
        <button className="header-button" onClick={onAdd}>+ Додати</button>
      } />
      <main className="content-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Бібліотека</p>
            <h2>{words.length ? `${words.length} ${wordCountLabel(words.length)}` : "Додайте перше слово"}</h2>
          </div>
        </div>
        {words.length ? (
          <div className="word-grid">
            {words.map((word) => (
              <WordCard
                key={word.id}
                word={word}
                onEdit={() => onEdit(word)}
                onDelete={() => onDelete(word)}
              />
            ))}
          </div>
        ) : (
          <section className="empty-state">
            <div className="empty-letters">А Б В</div>
            <h2>Бібліотека поки порожня</h2>
            <p>Підготуйте слова й картинки один раз, а потім швидко складайте з них уроки.</p>
            <button className="primary-button" onClick={onAdd}>+ Додати слово</button>
          </section>
        )}
      </main>
    </div>
  );
}

function wordCountLabel(count: number) {
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return "слів";
  if (last === 1) return "слово";
  if (last >= 2 && last <= 4) return "слова";
  return "слів";
}
