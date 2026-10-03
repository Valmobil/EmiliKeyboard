import { useCallback, useEffect, useState } from "react";
import { trackScreenView } from "./services/analytics";
import type { Word } from "./models/Word";
import { HomePage } from "./pages/HomePage";
import { LessonPage } from "./pages/LessonPage";
import { LessonSetupPage } from "./pages/LessonSetupPage";
import { WordEditorPage } from "./pages/WordEditorPage";
import { WordsPage } from "./pages/WordsPage";
import { loadWords, saveWords } from "./services/wordStorage";

type Page = "home" | "words" | "editor" | "lesson-setup" | "lesson";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [words, setWords] = useState<Word[]>(loadWords);
  const [editingWord, setEditingWord] = useState<Word>();
  const [lessonWords, setLessonWords] = useState<Word[]>([]);

  useEffect(() => saveWords(words), [words]);
  useEffect(() => trackScreenView(page), [page]);

  const goHome = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    setPage("home");
  }, []);

  function openEditor(word?: Word) {
    setEditingWord(word);
    setPage("editor");
  }

  function upsertWord(word: Word, addAnother: boolean) {
    setWords((current) => current.some((item) => item.id === word.id)
      ? current.map((item) => item.id === word.id ? word : item)
      : [...current, word]);
    setEditingWord(undefined);
    if (!addAnother) setPage("words");
  }

  function deleteWord(word: Word) {
    if (window.confirm(`Видалити слово «${word.text}»?`)) {
      setWords((current) => current.filter((item) => item.id !== word.id));
    }
  }

  function startLesson(selected: Word[]) {
    setLessonWords(selected);
    setPage("lesson");
    void document.documentElement.requestFullscreen?.().catch(() => undefined);
  }

  if (page === "words") {
    return <WordsPage words={words} onBack={goHome} onAdd={() => openEditor()} onEdit={openEditor} onDelete={deleteWord} />;
  }
  if (page === "editor") {
    return <WordEditorPage word={editingWord} onCancel={goHome} onSave={upsertWord} />;
  }
  if (page === "lesson-setup") {
    return <LessonSetupPage words={words} onBack={goHome} onAddWord={() => openEditor()} onStart={startLesson} />;
  }
  if (page === "lesson" && lessonWords.length) {
    return <LessonPage words={lessonWords} onFinish={goHome} />;
  }
  return <HomePage onWords={() => setPage("words")} onLesson={() => setPage("lesson-setup")} />;
}
