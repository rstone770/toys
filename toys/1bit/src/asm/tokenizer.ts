export type SourceRange = [number, number];

export interface Token<Type extends string, Value> {
  type: Type;
  value: Value;
  range: SourceRange;
}

export type AnyToken = Token<string, unknown>;
export type StringToken<Type extends string> = Token<Type, string>;

export type Tokenize<T extends AnyToken> = (input: string, offset?: number) => T | null;
export type IsTokenType<T extends AnyToken> = (token: AnyToken) => token is T;
export type Tokenizer<T extends AnyToken> = [Tokenize<T>, IsTokenType<T>];
export type TokenizerReturnType<T extends Tokenize<AnyToken>> = NonNullable<ReturnType<T>>;

export type CreateRegexTokenizer = {
  <Type extends string, Value>(
    type: Type,
    pattern: RegExp,
    map: (match: RegExpMatchArray) => Value | null
  ): Tokenizer<Token<Type, Value>>;
  <Type extends string>(
    type: Type,
    pattern: RegExp,
    map?: (match: RegExpMatchArray) => string | null
  ): Tokenizer<StringToken<Type>>;
};

export const regex: CreateRegexTokenizer = <Type extends string, Value>(
  type: Type,
  pattern: RegExp,
  map?: (match: RegExpMatchArray) => Value | null
): Tokenizer<Token<Type, Value>> => {
  const flags = pattern.ignoreCase ? "yi" : "y";
  const exp = new RegExp(pattern, flags);

  const tokenize = (input: string, offset: number = 0): Token<Type, Value> | null => {
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

  const isTokenType = (token): token is Token<Type, Value> => {
    return token.type === type;
  };

  return [tokenize, isTokenType];
};

export const next = <T extends AnyToken>(
  tokenizer: (input: string, offset: number) => T | null,
  input: string,
  current: T | null
): T | null => {
  if (current == null) {
    return null;
  }

  return tokenizer(input, current.range[1]);
};
