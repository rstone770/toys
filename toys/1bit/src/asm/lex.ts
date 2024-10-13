import { regex, Token, Tokenizer, TokenizerReturnType } from "./tokenizer";

const eos: Tokenizer<EndOfStreamToken> = (input, offset = 0) => {
  if (offset < input.length) {
    return null;
  }

  return {
    type: "eos",
    value: "",
    range: [input.length, input.length]
  };
};

const eol = regex("eol", /(\r?\n)+/);
const ws = regex("ws", /[ \t]+/);
const comma = regex("comma", /,/);
const comment = regex("comment", /;(.*)/, (match) => match[1]);
const equ = regex("equ", /equ/i);
const db = regex("db", /db/i);
const identifier = regex("identifier", /[a-z_][a-z0-9_]*/i, (match) => match[0].toLowerCase());

const numeric = regex(
  "numeric",
  /(0x(?<hex>[0-9a-f]+)|(0b(?<bin>)[0-1]+)|(?<dec>[0-9]+))/i,
  (match) => {
    const groups = match.groups;
    if (groups == null) {
      return null;
    }

    if (groups.hex != null) {
      return parseInt(groups.hex, 16);
    } else if (groups.bin != null) {
      return parseInt(groups.bin, 2);
    }

    return parseInt(groups.dec, 10);
  }
);

export type EndOfLineToken = TokenizerReturnType<typeof eol>;
export type EndOfStreamToken = Token<"eos", string>;
export type WhiteSpaceToken = TokenizerReturnType<typeof ws>;
export type CommaToken = Token<"comma", string>;
export type CommentToken = TokenizerReturnType<typeof comment>;
export type EquToken = TokenizerReturnType<typeof equ>;
export type DbToken = TokenizerReturnType<typeof db>;
export type IdentifierToken = TokenizerReturnType<typeof identifier>;
export type NumericToken = TokenizerReturnType<typeof numeric>;
export type KnownToken =
  | EndOfStreamToken
  | EndOfLineToken
  | WhiteSpaceToken
  | CommaToken
  | CommentToken
  | EquToken
  | DbToken
  | IdentifierToken
  | NumericToken;

export const lex = (input, offset = 0): KnownToken => {
  if (offset < 0) {
    throw new Error("Offset must be non-negative");
  }

  const token =
    eos(input, offset) ??
    eol(input, offset) ??
    ws(input, offset) ??
    comment(input, offset) ??
    comma(input, offset) ??
    equ(input, offset) ??
    db(input, offset) ??
    identifier(input, offset) ??
    numeric(input, offset);

  if (token == null) {
    throw new Error(`Unexpected character '${input[offset]}' at offset ${offset}.`);
  }

  return token;
};
