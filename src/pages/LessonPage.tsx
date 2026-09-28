import { useEffect, useMemo, useState, type CSSProperties } from "react";
import confetti from "canvas-confetti";
import { LetterTile } from "../components/LetterTile";
import type { Word } from "../models/Word";
import { shuffleLetters, type LetterTileModel } from "../utils/shuffleLetters";

const saluteParticles = [
  [-150, -58], [-120, -112], [-72, -138], [-18, -152], [42, -146],
  [96, -120], [140, -76], [162, -18], [150, 42], [118, 92],
  [66, 126], [12, 142], [-48, 132], [-102, 102], [-142, 58], [-162, 4],
];

const saluteColors = ["#f4c95d", "#f2866f", "#297768", "#64a8d8", "#a96bc6"];

interface LessonPageProps {
  words: Word[];
  onFinish: () => void;
}

export function LessonPage({ words, onFinish }: LessonPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastLetterActivity, setLastLetterActivity] = useState(0);
  const word = words[Math.min(currentIndex, words.length - 1)];
  const [available, setAvailable] = useState<LetterTileModel[]>(() => shuffleLetters(word.text));
  const [slots, setSlots] = useState<Array<LetterTileModel | null>>(() => Array.from({ length: Array.from(word.text).length }, () => null));

  const targetLetters = useMemo(() => Array.from(word.text), [word.text]);
  const complete = slots.every(Boolean);
  const correct = complete && slots.every((tile, index) => tile?.letter === targetLetters[index]);

  useEffect(() => {
    function exitWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onFinish();
    }
    window.addEventListener("keydown", exitWithEscape);
    return () => window.removeEventListener("keydown", exitWithEscape);
  }, [onFinish]);

  useEffect(() => {
    if (!complete || correct) return;

    const timeout = window.setTimeout(() => {
      const misplaced = slots.filter(
        (tile, index): tile is LetterTileModel =>
          Boolean(tile && tile.letter !== targetLetters[index]),
      );
      setSlots((items) =>
        items.map((tile, index) =>
          tile?.letter === targetLetters[index] ? tile : null,
        ),
      );
      setAvailable((items) => [...items, ...misplaced]);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [complete, correct, lastLetterActivity, slots, targetLetters]);

  useEffect(() => {
    if (!correct) return;

    const colors = ["#ffd447", "#ff5d73", "#00b894", "#34a7ff", "#b95cff", "#ff8c42"];
    const timers = [
      window.setTimeout(() => {
        void confetti({
          particleCount: 180, spread: 125, startVelocity: 58, gravity: 0.85,
          scalar: 1.25, ticks: 230, origin: { x: 0.5, y: 0.68 }, colors,
          disableForReducedMotion: true,
        });
      }, 0),
      window.setTimeout(() => {
        void confetti({
          particleCount: 90, angle: 58, spread: 70, startVelocity: 68,
          gravity: 0.9, scalar: 1.15, ticks: 210,
          origin: { x: 0.03, y: 0.8 }, colors, disableForReducedMotion: true,
        });
        void confetti({
          particleCount: 90, angle: 122, spread: 70, startVelocity: 68,
          gravity: 0.9, scalar: 1.15, ticks: 210,
          origin: { x: 0.97, y: 0.8 }, colors, disableForReducedMotion: true,
        });
      }, 180),
      window.setTimeout(() => {
        void confetti({
          particleCount: 80, spread: 150, startVelocity: 42, gravity: 0.72,
          scalar: 1.35, ticks: 250, origin: { x: 0.5, y: 0.35 }, colors,
          disableForReducedMotion: true,
        });
      }, 420),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [correct, currentIndex]);

  function registerLetterActivity() {
    setLastLetterActivity(Date.now());
  }

  function placeTile(tileId: string, slotIndex?: number) {
    registerLetterActivity();
    const tile = available.find((item) => item.id === tileId);
    if (!tile) return;
    const destination = slotIndex ?? slots.findIndex((item) => item === null);
    if (destination < 0) return;
    setAvailable((items) => items.filter((item) => item.id !== tileId));
    setSlots((items) => {
      const next = [...items];
      if (next[destination]) setAvailable((current) => [...current, next[destination]!]);
      next[destination] = tile;
      return next;
    });
  }

  function returnTile(slotIndex: number) {
    registerLetterActivity();
    const tile = slots[slotIndex];
    if (!tile) return;
    setSlots((items) => items.map((item, index) => index === slotIndex ? null : item));
    setAvailable((items) => [...items, tile]);
  }

  function nextWord() {
    if (currentIndex === words.length - 1) {
      setCurrentIndex(words.length);
      return;
    }
    const nextIndex = currentIndex + 1;
    const nextWord = words[nextIndex];
    setCurrentIndex(nextIndex);
    setAvailable(shuffleLetters(nextWord.text));
    setSlots(Array.from({ length: Array.from(nextWord.text).length }, () => null));
  }

  if (currentIndex >= words.length) {
    return (
      <main className="lesson-finished">
        <button className="floating-back-button" onClick={onFinish} aria-label="До головного меню">
          ←
        </button>
        <div className="success-check">✓</div>
        <p className="eyebrow">Готово</p>
        <h1>Урок завершено</h1>
        <button className="primary-button large" onClick={onFinish}>Завершити</button>
      </main>
    );
  }

  return (
    <main className={`lesson-page ${correct ? "is-correct" : ""}`}>
      <button className="floating-back-button" onClick={onFinish} aria-label="До головного меню">
        ←
      </button>
      <div className="lesson-picture-wrap">
        <img className="lesson-picture" src={word.imageUrl} alt="" draggable={false} />
        {correct && <div className="success-check overlay" aria-label="Правильно">✓</div>}
      </div>

      <div className="letter-bank" aria-label="Доступні літери">
        {available.map((tile) => (
          <LetterTile
            key={tile.id}
            tile={tile}
            onActivity={registerLetterActivity}
            onDoubleClick={() => placeTile(tile.id)}
            onDropInSlot={(slotIndex) => placeTile(tile.id, slotIndex)}
          />
        ))}
      </div>

      <div className="word-slots" aria-label="Складене слово">
        {correct && (
          <div className="success-salute" aria-hidden="true">
            {saluteParticles.map(([x, y], index) => (
              <span
                key={index}
                style={{
                  "--salute-x": `${x}px`,
                  "--salute-y": `${y}px`,
                  "--salute-color": saluteColors[index % saluteColors.length],
                  "--salute-delay": `${(index % 4) * 35}ms`,
                } as CSSProperties}
              />
            ))}
          </div>
        )}
        {slots.map((tile, index) => {
          const wrong = complete && tile?.letter !== targetLetters[index];
          return (
            <button
              key={index}
              data-slot-index={index}
              className={`word-slot ${tile ? "filled" : ""} ${wrong ? "wrong" : ""}`}
              onClick={() => returnTile(index)}
              onPointerDown={registerLetterActivity}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                placeTile(event.dataTransfer.getData("text/plain"), index);
              }}
              aria-label={tile ? `Позиція ${index + 1}, літера ${tile.letter}. Натисніть, щоб повернути.` : `Порожня позиція ${index + 1}`}
            >
              {tile?.letter}
            </button>
          );
        })}
      </div>

      <div className="lesson-feedback" aria-live="polite">
        {correct ? (
          <button className="next-button" onClick={nextWord}>
            {currentIndex === words.length - 1 ? "Завершити" : "Наступне →"}
          </button>
        ) : complete ? (
          <span>Спробуй переставити підсвічені літери</span>
        ) : null}
      </div>
    </main>
  );
}
