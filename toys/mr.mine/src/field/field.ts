import { tryCycleTile } from "./_cycle";
import { FieldState, FieldTilesUpdated, FieldTileUpdated } from "./types";

export interface FieldEvents {
  onTileUpdated: (tile: FieldTileUpdated) => void;
  onTilesUpdated: (tiles: FieldTilesUpdated) => void;
}

export class Field {
  public state: FieldState;
  public events: FieldEvents;

  public constructor(state: FieldState, events: FieldEvents) {
    this.state = state;
    this.events = events;
  }

  public cycle(x: number, y: number): void {
    const update = tryCycleTile(this.state, x, y);
    if (update !== null) {
      this.events.onTileUpdated(update);
    }
  }
}
