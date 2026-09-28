import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { LetterTileModel } from "../utils/shuffleLetters";

interface LetterTileProps {
  tile: LetterTileModel;
  onDoubleClick: () => void;
  onActivity?: () => void;
  onDropInSlot: (slotIndex: number) => void;
}

export function LetterTile({ tile, onDoubleClick, onActivity, onDropInSlot }: LetterTileProps) {
  const lastActivation = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isTouchDragging = useRef(false);
  const suppressClick = useRef(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  function handleActivation() {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    const now = Date.now();
    if (now - lastActivation.current <= 600) {
      lastActivation.current = 0;
      onDoubleClick();
      return;
    }
    lastActivation.current = now;
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    onActivity?.();
    if (event.pointerType === "mouse") return;
    touchStart.current = { x: event.clientX, y: event.clientY };
    isTouchDragging.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const start = touchStart.current;
    if (!start || event.pointerType === "mouse") return;
    const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (distance < 8 && !isTouchDragging.current) return;
    isTouchDragging.current = true;
    setDragPosition({ x: event.clientX, y: event.clientY });
  }

  function finishTouchDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!touchStart.current || event.pointerType === "mouse") return;
    if (isTouchDragging.current) {
      suppressClick.current = true;
      const target = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest<HTMLElement>("[data-slot-index]");
      const slotIndex = Number(target?.dataset.slotIndex);
      if (target && Number.isInteger(slotIndex)) onDropInSlot(slotIndex);
    }
    touchStart.current = null;
    isTouchDragging.current = false;
    setDragPosition(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <button
      className="letter-tile"
      onClick={handleActivation}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishTouchDrag}
      onPointerCancel={finishTouchDrag}
      draggable
      onDragStart={(event) => {
        onActivity?.();
        event.dataTransfer.setData("text/plain", tile.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      aria-label={`Літера ${tile.letter}. Натисніть двічі або перетягніть.`}
    >
      {tile.letter}
      {dragPosition && (
        <span
          className="letter-drag-ghost"
          style={{ left: dragPosition.x, top: dragPosition.y }}
          aria-hidden="true"
        >
          {tile.letter}
        </span>
      )}
    </button>
  );
}
