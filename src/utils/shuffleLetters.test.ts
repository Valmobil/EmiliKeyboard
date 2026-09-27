import { describe, expect, it } from "vitest";
import { shuffleLetters } from "./shuffleLetters";

describe("shuffleLetters", () => {
  it("keeps every repeated letter as a uniquely identified tile", () => {
    const tiles = shuffleLetters("МАМА");
    expect(tiles.map((tile) => tile.letter).sort()).toEqual(["А", "А", "М", "М"]);
    expect(new Set(tiles.map((tile) => tile.id)).size).toBe(4);
  });

  it("does not return the source order when another order is possible", () => {
    expect(shuffleLetters("РОЗА").map((tile) => tile.letter).join(""))
      .not.toBe("РОЗА");
  });
});
