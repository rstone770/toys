import { tokenizer, TokenizerReturnType } from "./tokenizer";

export const whitespace = tokenizer("ws", /\s+/);
export const comment = tokenizer("comment", /;(.*)/, (match) => match[1]);
export const identifier = tokenizer("identifier", /[A-Z_][A-Z0-9_]*/i, (match) =>
  match[0].toLowerCase()
);

export type NumberFormat = "dec" | "hex" | "bin";
export interface Numeric {
  value: number;
  format: NumberFormat;
}
export const numeric = tokenizer(
  "numeric",
  /0x(?<hex>[0-9A-F]+)|0b(?<bin>[01]+)|[0-9]+/,
  (match): Numeric => {
    if (match.groups?.hex != null) {
      return {
        format: "hex",
        value: parseInt(match.groups.hex, 16)
      };
    }

    if (match.groups?.bin != null) {
      return {
        format: "bin",
        value: parseInt(match.groups.bin, 2)
      };
    }

    return {
      format: "dec",
      value: parseInt(match[0], 10)
    };
  }
);

export type KeywordType = "equ";
export const keyword = tokenizer(
  "keyword",
  /EQU/i,
  (match): KeywordType => match[0].toLowerCase() as KeywordType
);

export type WhitespaceToken = TokenizerReturnType<typeof whitespace>;
export type CommentToken = TokenizerReturnType<typeof comment>;
export type IdentifierToken = TokenizerReturnType<typeof identifier>;
export type NumericToken = TokenizerReturnType<typeof numeric>;
export type KeywordToken = TokenizerReturnType<typeof keyword>;

export type KnownToken =
  | WhitespaceToken
  | CommentToken
  | IdentifierToken
  | NumericToken
  | KeywordToken;

export const lex = (input: string, offset = 0): KnownToken | null => {
  if (offset >= input.length) {
    return null;
  }

  if (offset < 0) {
    return null;
  }

  return (
    whitespace(input, offset) ??
    comment(input, offset) ??
    numeric(input, offset) ??
    keyword(input, offset) ??
    identifier(input, offset)
  );
};
