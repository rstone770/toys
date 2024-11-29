export type SourceRange = [number, number];

export interface Token<Type extends string, Value> {
  type: Type;
  value: Value;
  range: SourceRange;
}

export type AnyToken = Token<string, unknown>;

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
