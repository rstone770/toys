import * as style from "./main.styles";

const root = document.getElementById("app");

const grid = document.createElement("div");
grid.className = style.DrawingBoard;

const hr = document.createElement("div");
hr.className = style.HorizontalRule;

const vr = document.createElement("div");
vr.className = style.VerticalRule;

const canvas = document.createElement("div");
canvas.className = style.Canvas;

grid.appendChild(hr);
grid.appendChild(vr);
grid.appendChild(canvas);

if (root != null) {
  root.appendChild(grid);
} else {
  throw new Error("Root element not found");
}
