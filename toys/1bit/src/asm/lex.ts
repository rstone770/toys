import { SemanticTokenType, Token, TokenOfType, TriviaTokenType } from "./tokens";

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

const match = <Type extends string>(
  type: Type,
  pattern: RegExp,
  map?: (match: RegExpMatchArray) => string | null
) => {
  const flags = pattern.ignoreCase ? "yi" : "y";
  const exp = new RegExp(pattern, flags);

  return (input: string, offset: number): TokenOfType<Type> | null => {
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

const identifier = match<SemanticTokenType>("identifier", /[A-Z_][A-Z0-9_]*/i);
const number = match<SemanticTokenType>("number", /0x[0-9A-F]+|0b[01]+|[0-9]+/i);
const keyword = match<SemanticTokenType>("keyword", /EQU/i);
const comment = match<TriviaTokenType>("comment", /;(.*)/, (match) => match[1]);
const whitespace = match<TriviaTokenType>("ws", /\s+/);
