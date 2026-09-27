import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { ImageSelector } from "../components/ImageSelector";
import type { ImageResult, Word } from "../models/Word";

interface WordEditorPageProps {
  word?: Word;
  onCancel: () => void;
  onSave: (word: Word, addAnother: boolean) => void;
}

export function WordEditorPage({ word, onCancel, onSave }: WordEditorPageProps) {
  const [originalText, setOriginalText] = useState(word?.originalText ?? word?.text ?? "");
  const [imageUrl, setImageUrl] = useState(word?.imageUrl ?? "");
  const [imageAttribution, setImageAttribution] = useState(word?.imageAttribution ?? "");
  const [attempted, setAttempted] = useState(false);
  const normalized = normalizeWord(originalText);

  function selectImage(image: ImageResult) {
    setImageUrl(image.url);
    setImageAttribution(image.attribution);
  }

  function save(addAnother = false) {
    setAttempted(true);
    if (!normalized || !imageUrl) return;
    onSave({
      id: word?.id ?? crypto.randomUUID(),
      text: normalized,
      originalText: originalText.trim(),
      imageUrl,
      imageAttribution,
      createdAt: word?.createdAt ?? new Date().toISOString(),
    }, addAnother);
    if (addAnother) {
      setOriginalText("");
      setImageUrl("");
      setImageAttribution("");
      setAttempted(false);
    }
  }

  return (
    <div className="page-shell">
      <AppHeader title={word ? "Редагувати слово" : "Нове слово"} onBack={onCancel} />
      <main className="editor-page">
        <section className="editor-form">
          <label htmlFor="word-input">Слово</label>
          <input
            id="word-input"
            className="word-input"
            value={originalText}
            onChange={(event) => setOriginalText(event.target.value)}
            placeholder="Наприклад, роза"
            autoFocus
            maxLength={24}
          />
          {normalized && <p className="normalization">У вправі: <strong>{normalized}</strong></p>}
          {attempted && !normalized && <p className="form-error">Введіть слово.</p>}
          <p className="field-help">Пробіли на початку й у кінці буде прибрано, літери стануть великими.</p>
        </section>

        <ImageSelector query={originalText} selectedUrl={imageUrl} onSelect={selectImage} />
        {attempted && !imageUrl && <p className="form-error centered">Виберіть зображення для слова.</p>}

        <div className="editor-actions">
          <button className="primary-button large" onClick={() => save(false)}>
            {word ? "Зберегти зміни" : "Зберегти слово"}
          </button>
          {!word && (
            <button className="secondary-button large" onClick={() => save(true)}>
              Зберегти й додати наступне
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function normalizeWord(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleUpperCase("uk-UA");
}
