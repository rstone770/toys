export type SourceRange = [number, number];

export interface Token<Type extends string, Value> {
  type: Type;
  value: Value;
  range: SourceRange;
}

export type AnyToken = Token<string, unknown>;
export type LiteralToken<Type extends string> = Token<Type, string>;
export type TokenType<T extends AnyToken> = T["type"];
export type TokenValue<T extends AnyToken> = T["value"];

export type Tokenizer<T extends AnyToken> = (input: string, offset?: number) => T | null;
export type TokenizerReturnType<T extends Tokenizer<AnyToken>> = NonNullable<ReturnType<T>>;

export type CreateRegexTokenizer = {
  <Type extends string>(
    type: Type,
    pattern: RegExp,
    map?: (match: RegExpMatchArray) => string | null
  ): Tokenizer<LiteralToken<Type>>;
  <Type extends string, Value>(
    type: Type,
    pattern: RegExp,
    map: (match: RegExpMatchArray) => Value | null
  ): Tokenizer<Token<Type, Value>>;
};

export const regex: CreateRegexTokenizer = <Type extends string, Value = string>(
  type: Type,
  pattern: RegExp,
  map?: (match: RegExpMatchArray) => Value | null
): Tokenizer<Token<Type, Value>> => {
  const flags = pattern.ignoreCase ? "yi" : "y";
  const exp = new RegExp(pattern, flags);

  return (input: string, offset: number = 0): Token<Type, Value> | null => {
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
      value,
      range: [offset, offset + match[0].length]
    } as Token<Type, Value>;
  };
};
