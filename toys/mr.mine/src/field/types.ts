export type FieldTileState = "closed" | "opened" | "flagged" | "unknown";

export interface FieldTile {
  state: FieldTileState;
  isMine: boolean;
}

export interface FieldState {
  opened: number;
  mines: number;
  width: number;
  height: number;
  tiles: FieldTile[];
}

export interface FieldTileUpdated {
  tile: FieldTile;
  x: number;
  y: number;
}

export interface FieldTilesUpdated {
  tiles: FieldTileUpdated[];
  target?: FieldTileUpdated;
}
