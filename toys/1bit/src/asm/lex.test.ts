import { expect, test } from "vitest";
import { lex } from "./lex";

test("returns null for empty input", () => {
  expect(lex("", 0)).toBeNull();
});

test("returns null for offset past end of input", () => {
  expect(lex("foo", 3)).toBeNull();
  expect(lex("foo", -1)).toBeNull();
});

const SOURCE = ["LED EQU 0x01", "; a comment", "LD 1", "OR 0b10"].join("\r\n");

test("returns tokens for valid input", () => {
  const led = lex(SOURCE, 0);
  expect(led).toEqual({ type: "identifier", value: "LED", offset: 0, length: 3 });

  const ws = lex(SOURCE, 3);
  expect(ws).toEqual({ type: "ws", value: " ", offset: 3, length: 1 });

  const equ = lex(SOURCE, 4);
  expect(equ).toEqual({ type: "keyword", value: "EQU", offset: 4, length: 3 });

  const hex = lex(SOURCE, 8); // skip whitespace
  expect(hex).toEqual({ type: "number", value: "0x01", offset: 8, length: 4 });

  const newline = lex(SOURCE, 12);
  expect(newline).toEqual({ type: "ws", value: "\r\n", offset: 12, length: 2 });

  const comment = lex(SOURCE, 14);
  expect(comment).toEqual({ type: "comment", value: " a comment", offset: 14, length: 11 });

  const dec = lex(SOURCE, 30);
  expect(dec).toEqual({ type: "number", value: "1", offset: 30, length: 1 });

  const bin = lex(SOURCE, 36);
  expect(bin).toEqual({ type: "number", value: "0b10", offset: 36, length: 4 });
});
