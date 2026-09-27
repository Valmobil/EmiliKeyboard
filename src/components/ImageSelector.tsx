import { useState } from "react";
import type { ImageResult } from "../models/Word";
import { imageSearchProvider } from "../services/imageSearch";

interface ImageSelectorProps {
  query: string;
  selectedUrl: string;
  onSelect: (result: ImageResult) => void;
}

export function ImageSelector({ query, selectedUrl, onSelect }: ImageSelectorProps) {
  const [results, setResults] = useState<ImageResult[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const found = await imageSearchProvider.search(query.trim());
      setResults(found);
      setIndex(0);
      if (!found.length) setError("Зображень не знайдено. Спробуйте інше слово.");
    } catch {
      setError("Не вдалося завантажити зображення. Перевірте інтернет і спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  const current = results[index];

  return (
    <section className="image-selector" aria-label="Вибір зображення">
      <div className="selector-heading">
        <div>
          <h2>Зображення</h2>
          <p>Пошук у Wikimedia Commons</p>
        </div>
        <button className="secondary-button" onClick={search} disabled={!query.trim() || loading}>
          {loading ? "Шукаємо…" : "Знайти зображення"}
        </button>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      {current ? (
        <div className="image-browser">
          <button
            className="image-arrow"
            onClick={() => setIndex((index - 1 + results.length) % results.length)}
            aria-label="Попереднє зображення"
          >
            ←
          </button>
          <figure>
            <img src={current.thumbnailUrl} alt={current.title} />
            <figcaption>
              <span>{index + 1} / {results.length}</span>
              <small>{current.attribution || current.title}</small>
            </figcaption>
          </figure>
          <button
            className="image-arrow"
            onClick={() => setIndex((index + 1) % results.length)}
            aria-label="Наступне зображення"
          >
            →
          </button>
          <button
            className={selectedUrl === current.url ? "selected-image-button" : "primary-button"}
            onClick={() => onSelect(current)}
          >
            {selectedUrl === current.url ? "✓ Вибрано" : "Вибрати"}
          </button>
        </div>
      ) : selectedUrl ? (
        <div className="current-image">
          <img src={selectedUrl} alt="Поточне зображення" />
          <span>Поточне зображення</span>
        </div>
      ) : (
        <div className="image-placeholder">Введіть слово та почніть пошук</div>
      )}
    </section>
  );
}
