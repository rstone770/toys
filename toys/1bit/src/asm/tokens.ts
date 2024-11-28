export type SourceRange = [number, number];

export interface Token<Type extends string, Value> {
  type: Type;
  value: Value;
  range: SourceRange;
}

export type Tokenizer<Type extends string, Value> = (
  input: string,
  offset?: number
) => Token<Type, Value> | null;

export type TokenizerFactory = {
  <Type extends string, Value>(
    type: Type,
    pattern: RegExp,
    map: (match: RegExpMatchArray) => Value | null
  ): Tokenizer<Type, Value>;
  <Type extends string>(
    type: Type,
    pattern: RegExp,
    map?: (match: RegExpMatchArray) => string | null
  ): Tokenizer<Type, string>;
};

export type TokenizerReturnType<T extends Tokenizer<string, unknown>> = NonNullable<ReturnType<T>>;

export const tokenizer: TokenizerFactory = <Type extends string, Value>(
  type: Type,
  pattern: RegExp,
  map?: (match: RegExpMatchArray) => Value | null
): Tokenizer<Type, Value> => {
  const flags = pattern.ignoreCase ? "yi" : "y";
  const exp = new RegExp(pattern, flags);

  return (input: string, offset: number = 0) => {
    exp.lastIndex = offset;

    const match = exp.exec(input);
    if (match == null) {
      return null;
    }

    const value = map ? map(match) : match[0];
    if (value == null) {
      return null;
    }

    return {
      type,
      value: value as Value,
      range: [offset, offset + match[0].length]
    };
  };
};

export const whitespace = tokenizer("ws", /\s+/);
export type WhitespaceToken = TokenizerReturnType<typeof whitespace>;

export const comment = tokenizer("comment", /;(.*)/, (match) => match[1]);
export type CommentToken = TokenizerReturnType<typeof comment>;

export const identifier = tokenizer("identifier", /[A-Z_][A-Z0-9_]*/i, (match) =>
  match[0].toLowerCase()
);
export type IdentifierToken = TokenizerReturnType<typeof identifier>;

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

export type NumericToken = TokenizerReturnType<typeof numeric>;

export type KeywordType = "equ";
export const keyword = tokenizer(
  "keyword",
  /EQU/i,
  (match): KeywordType => match[0].toLowerCase() as KeywordType
);
export type KeywordToken = TokenizerReturnType<typeof keyword>;
