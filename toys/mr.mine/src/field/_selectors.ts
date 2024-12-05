import { FieldState, FieldTile } from "./types";

export const getTileIndex = (state: FieldState, x: number, y: number): number => {
  if (x < 0 || x >= state.width) {
    return -1;
  } else if (y < 0 || y >= state.height) {
    return -1;
  }

  return y * state.width + x;
};

export const getTileAt = (state: FieldState, x: number, y: number): FieldTile | null => {
  const idx = getTileIndex(state, x, y);
  if (idx < 0) {
    return null;
  }

  return state.tiles[idx];
};
