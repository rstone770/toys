export type TokenType = "comment" | "identifier" | "number" | "keyword" | "ws";

export interface Token {
  type: TokenType;
  value: string;
  offset: number;
  length: number;
}

export const lex = (input: string, offset: number): Token | null => {
  if (offset < 0) {
    return null;
  }

  if (offset >= input.length) {
    return null;
  }

  const token =
    whitespace(input, offset) ??
    comment(input, offset) ??
    number(input, offset) ??
    keyword(input, offset) ??
    identifier(input, offset);

  return token;
};

const match = (
  type: TokenType,
  pattern: RegExp,
  map?: (match: RegExpMatchArray) => string | null
) => {
  const flags = pattern.ignoreCase ? "yi" : "y";
  const exp = new RegExp(pattern, flags);

  return (input: string, offset: number): Token | null => {
    exp.lastIndex = offset;

    const match = exp.exec(input);
    if (match == null) {
      return null;
    }

    const value = map == null ? match[0] : map(match);
    if (value == null) {
      return null;
    }

    return {
      type,
      value,
      offset,
      length: match[0].length
    };
  };
};

const identifier = match("identifier", /[A-Z_][A-Z0-9_]*/i);
const number = match("number", /0x[0-9A-F]+|0b[01]+|[0-9]+/i);
const keyword = match("keyword", /EQU/i);
const comment = match("comment", /;(.*)/, (match) => match[1]);
const whitespace = match("ws", /\s+/);
