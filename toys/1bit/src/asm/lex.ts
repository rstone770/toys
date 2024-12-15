import { AnyToken, Token, regex, TokenizerReturnType, IsTokenType } from "./tokenizer";

export const [whitespace, isWhitespace] = regex("ws", /[ \t]+/);
export const [endOfLine, isEndOfLine] = regex("eol", /\r?\n/);
export const [comment, isComment] = regex("comment", /;(.*)/, (match) => match[1]);
export const [identifier, isIdentifier] = regex("identifier", /[A-Z_][A-Z0-9_]*/i, (match) =>
  match[0].toLowerCase()
);

export type EndOfStream = Token<"eos", null>;
export const isEndOfStream = (token: AnyToken): token is EndOfStream => token.type === "eos";
export const endOfStream = (input: string, offset: number): EndOfStream | null => {
  if (offset >= input.length) {
    return {
      type: "eos",
      value: null,
      range: [input.length, input.length]
    };
  }

  return null;
};

export type NumberFormat = "dec" | "hex" | "bin";
export interface Numeric {
  value: number;
  format: NumberFormat;
}
export const [numeric, isNumeric] = regex(
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

export const [equ, isEqu] = regex("equ", /EQU/i, (match) => match[0].toLowerCase());

export const isParam = (token: AnyToken) => isIdentifier(token) || isNumeric(token);
export const isEndOfStatement = (token: AnyToken) =>
  isEndOfStream(token) || isEndOfLine(token) || isComment(token);

export type WhitespaceToken = TokenizerReturnType<typeof whitespace>;
export type EndOfLineToken = TokenizerReturnType<typeof endOfLine>;
export type CommentToken = TokenizerReturnType<typeof comment>;
export type IdentifierToken = TokenizerReturnType<typeof identifier>;
export type NumericToken = TokenizerReturnType<typeof numeric>;
export type EquToken = TokenizerReturnType<typeof equ>;

export type KnownToken =
  | WhitespaceToken
  | EndOfLineToken
  | CommentToken
  | IdentifierToken
  | NumericToken
  | EquToken;

export const lex = (input: string, offset = 0): KnownToken | null => {
  if (offset >= input.length) {
    return null;
  }

  if (offset < 0) {
    return null;
  }

  return (
    whitespace(input, offset) ??
    endOfLine(input, offset) ??
    comment(input, offset) ??
    numeric(input, offset) ??
    equ(input, offset) ??
    identifier(input, offset)
  );
};
