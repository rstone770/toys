import { getTileAt } from "./_selectors";
import { FieldState, FieldTilesUpdated } from "./types";

export const tryPopulateField = (
  isMine: (x: number, y: number) => boolean,
  state: FieldState,
  x: number,
  y: number
): FieldTilesUpdated | null => {
  if (state.opened > 0) {
    return null;
  }

  const target = getTileAt(state, x, y);
  if (target === null) {
    return null;
  }

  const updates: FieldTilesUpdated = {
    tiles: []
  };

  for (let xx = 0; xx < state.width; xx++) {
    for (let yy = 0; yy < state.height; yy++) {
      const tile = getTileAt(state, xx, yy);
      if (tile === null) {
        continue;
      }

      tile.state = "closed";
      tile.isMine = isMine(xx, yy);

      updates.tiles.push({
        tile,
        x: xx,
        y: yy
      });
    }
  }

  return updates;
};
