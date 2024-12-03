export interface FieldTile {
  state: "closed" | "opened" | "flagged" | "unknown";
  isMine: boolean;
}

export interface FieldState {
  opened: number;
  mines: number;
  width: number;
  height: number;
  tiles: FieldTile[];
}

export const toTileIndex = (state: FieldState, x: number, y: number): number => {
  if (x < 0 || x >= state.width) {
    return -1;
  } else if (y < 0 || y >= state.height) {
    return -1;
  }

  return y * state.width + x;
};

const getTileAt = (state: FieldState, x: number, y: number): FieldTile | null => {
  const idx = toTileIndex(state, x, y);

  if (idx === -1) {
    return null;
  }

  return state.tiles[idx];
};

export const cycle = (state: FieldState, x: number, y: number): FieldState => {
  const tile = getTileAt(state, x, y);

  if (tile == null) {
    return state;
  }

  if (tile.state === "opened") {
    return state;
  }

  const tiles = state.tiles.map((t) => {
    if (t !== tile) {
      return t;
    }

    switch (t.state) {
      case "closed":
        return { ...t, state: "flagged" } satisfies FieldTile;
      case "flagged":
        return { ...t, state: "unknown" } satisfies FieldTile;
      case "unknown":
        return { ...t, state: "closed" } satisfies FieldTile;
    }

    return t;
  });

  return { ...state, tiles };
};
