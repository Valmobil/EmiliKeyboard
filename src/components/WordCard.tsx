import type { Word } from "../models/Word";

interface WordCardProps {
  word: Word;
  selected?: boolean;
  selectable?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WordCard({
  word,
  selected,
  selectable,
  onToggle,
  onEdit,
  onDelete,
}: WordCardProps) {
  const content = (
    <>
      {selectable && (
        <span className={`selection-mark ${selected ? "selected" : ""}`} aria-hidden="true">
          {selected ? "✓" : ""}
        </span>
      )}
      <img src={word.imageUrl} alt="" />
      <strong>{word.text}</strong>
      {!selectable && (
        <span className="card-actions">
          <button className="small-button" onClick={onEdit} aria-label={`Редагувати ${word.text}`}>
            Редагувати
          </button>
          <button className="small-button danger" onClick={onDelete} aria-label={`Видалити ${word.text}`}>
            Видалити
          </button>
        </span>
      )}
    </>
  );

  return selectable ? (
    <button
      className={`word-card selectable ${selected ? "is-selected" : ""}`}
      onClick={onToggle}
      aria-pressed={selected}
    >
      {content}
    </button>
  ) : (
    <article className="word-card">{content}</article>
  );
}
