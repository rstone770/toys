import { expect, test } from "vitest";
import {
  isSemanticToken,
  isTriviaToken,
  AnyToken,
  TriviaTokenType,
  SemanticTokenType
} from "./tokens";

const trivia = (type: TriviaTokenType): AnyToken => ({
  type,
  value: "",
  offset: 0,
  length: 0
});

const semantic = (type: SemanticTokenType): AnyToken => ({
  type,
  value: "",
  offset: 0,
  length: 0
});

test("isTriviaToken", () => {
  expect(isTriviaToken(null)).toBe(false);
  expect(isTriviaToken(trivia("comment"))).toBe(true);
  expect(isTriviaToken(trivia("ws"))).toBe(true);
  expect(isTriviaToken(semantic("identifier"))).toBe(false);
});

test("isSemanticToken", () => {
  expect(isSemanticToken(null)).toBe(false);
  expect(isSemanticToken(semantic("identifier"))).toBe(true);
  expect(isSemanticToken(semantic("number"))).toBe(true);
  expect(isSemanticToken(semantic("keyword"))).toBe(true);
  expect(isSemanticToken(trivia("comment"))).toBe(false);
});
