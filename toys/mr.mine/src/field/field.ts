import { tryCycleTile } from "./_tryCycleTile";
import { tryOpenTile } from "./_tryOpenTile";
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
    const cycled = tryCycleTile(this.state, x, y);
    if (cycled != null) {
      this.events.onTileUpdated(cycled);
    }
  }

  public open(x: number, y: number): void {
    const opened = tryOpenTile(this.state, x, y);
    if (opened != null) {
      this.events.onTilesUpdated(opened);
    }
  }
}
