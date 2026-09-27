import { useRef } from "react";
import type { LetterTileModel } from "../utils/shuffleLetters";

interface LetterTileProps {
  tile: LetterTileModel;
  onDoubleClick: () => void;
  onActivity?: () => void;
}

export function LetterTile({ tile, onDoubleClick, onActivity }: LetterTileProps) {
  const lastActivation = useRef(0);

  function handleActivation() {
    const now = Date.now();
    if (now - lastActivation.current <= 600) {
      lastActivation.current = 0;
      onDoubleClick();
      return;
    }
    lastActivation.current = now;
  }

  return (
    <button
      className="letter-tile"
      onClick={handleActivation}
      onPointerDown={onActivity}
      draggable
      onDragStart={(event) => {
        onActivity?.();
        event.dataTransfer.setData("text/plain", tile.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      aria-label={`Літера ${tile.letter}. Натисніть двічі або перетягніть.`}
    >
      {tile.letter}
    </button>
  );
}
