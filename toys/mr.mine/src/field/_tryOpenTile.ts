import { getTileAt } from "./_selectors";
import { FieldState, FieldTilesUpdated } from "./types";

export const tryOpenTile = (state: FieldState, x: number, y: number): FieldTilesUpdated | null => {
  const tile = getTileAt(state, x, y);
  if (tile === null) {
    return null;
  }

  if (tile.state === "opened") {
    return null;
  }

  return null;
};
