import { css } from "@linaria/core";

// Write your styles in `css` tag
export const DrawingBoard = css`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
`;

export const HorizontalRule = css`
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  background-color: red;
  height: 1rem;
`;

export const VerticalRule = css`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  background-color: blue;
  width: 1rem;
`;

export const Canvas = css`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  background-color: green;
  min-height: 200px;
`;
