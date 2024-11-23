export interface AnyToken {
  type: string;
  value: string;
  offset: number;
  length: number;
}

export interface TokenOfType<Type extends string> extends AnyToken {
  type: Type;
}

export type TriviaTokenType = "comment" | "ws";
export type TriviaToken = TokenOfType<TriviaTokenType>;

export const isTriviaToken = (token: AnyToken | null): token is TriviaToken => {
  if (token == null) {
    return false;
  }

  return token.type === "comment" || token.type === "ws";
};

export type SemanticTokenType = "identifier" | "number" | "keyword";
export type SemanticToken = TokenOfType<SemanticTokenType>;

export const isSemanticToken = (token: AnyToken | null): token is SemanticToken => {
  if (token == null) {
    return false;
  }

  return !isTriviaToken(token);
};

export type Token = TriviaToken | SemanticToken;
