import { getTileAt } from "./_selectors";
import { FieldState, FieldTileUpdated } from "./types";

export const tryCycleTile = (target: FieldState, x: number, y: number): FieldTileUpdated | null => {
  const tile = getTileAt(target, x, y);
  if (tile === null) {
    return null;
  }

  if (tile.state === "opened") {
    return null;
  }

  switch (tile.state) {
    case "closed":
      tile.state = "flagged";
      break;
    case "flagged":
      tile.state = "unknown";
      break;
    case "unknown":
      tile.state = "closed";
      break;
  }

  return {
    tile,
    x,
    y
  };
};
