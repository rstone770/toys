export type SourceRange = [start: number, end: number];

export interface AnyNode {
  type: string;
  range: SourceRange;
}

export interface NodeOfType<Type extends string> extends AnyNode {
  type: Type;
}

export interface PortOperationNode<Type extends string> extends AnyNode {
  type: Type;
  port: number;
  name?: string;
}

export type LoadOperationNode = PortOperationNode<"LD" | "LDC">;
export type StoreOperationNode = PortOperationNode<"STO" | "STC">;
export type OutputEnableOperationNode = PortOperationNode<"OEN">;
export type InputEnableOperationNode = PortOperationNode<"IEN">;
export type AndOperationNode = PortOperationNode<"AND" | "ANDC">;
export type OrOperationNode = PortOperationNode<"OR" | "ORC">;
export type XorOperationNode = PortOperationNode<"XNOR">;

export interface EquateNode extends AnyNode {
  type: "EQU";
  name: string;
  value: number;
  parent?: EquateNode;
}

export interface JumpOperationNode extends AnyNode {
  type: "JMP";
  address: number;
}

export type ReturnOperationNode = NodeOfType<"RET">;
export type SkipOperationNode = NodeOfType<"SKZ">;
export type NopOperationNode = NodeOfType<"NOP0" | "NOPF">;

export type OperationNode =
  | LoadOperationNode
  | StoreOperationNode
  | OutputEnableOperationNode
  | InputEnableOperationNode
  | AndOperationNode
  | OrOperationNode
  | XorOperationNode
  | JumpOperationNode
  | ReturnOperationNode
  | SkipOperationNode
  | NopOperationNode;

export interface CommentNode extends AnyNode {
  type: "comment";
  text: string;
}

export type ProgramChildrenNode = OperationNode | EquateNode | CommentNode;

export interface Program {
  children: ProgramChildrenNode[];
  operations: OperationNode[];
  equates: EquateNode[];
  trivia: CommentNode[];
}

export const parse = (source: string): Program | null => {
  const trivia: CommentNode[] = [];
  const operations: OperationNode[] = [];
  const equates: EquateNode[] = [];
  const children: ProgramChildrenNode[] = [];

  let i = 0;
  while (i < source.length) {}
};

export type MatcherTransform<T> = (match: RegExpMatchArray, range: SourceRange) => T | null;
export type MatcherResult<T> = [value: T, range: SourceRange];
export type Matcher<T> = (source: string, index?: number) => MatcherResult<T> | null;
export type InferMatcherType<M extends Matcher<any>> = M extends Matcher<infer T> ? T : never;
export type InferMatcherTypes<M extends Matcher<any>[]> = {
  [I in keyof M]: M[I] extends Matcher<infer T> ? T : never;
};

const match = (pattern: RegExp): Matcher<string> => {
  const flags = pattern.ignoreCase ? "yi" : "y";
  const exp = new RegExp(pattern, flags);

  return (source, index = 0) => {
    exp.lastIndex = index;

    const match = exp.exec(source);
    if (match == null) {
      return null;
    }

    const result: MatcherResult<string> = [match[0], [index, index + match[0].length]];

    return result;
  };
};

const bind = <T>(pattern: RegExp, fn: MatcherTransform<T>): Matcher<T> => {
  const flags = pattern.ignoreCase ? "yi" : "y";
  const regex = new RegExp(pattern, flags);

  return (source: string, index: number = 0) => {
    regex.lastIndex = index;

    const match = regex.exec(source);
    if (match == null) {
      return null;
    }

    const range = [index, index + match[0].length] satisfies SourceRange;
    const value = fn(match, range);
    if (value == null) {
      return null;
    }

    return [value, range] satisfies MatcherResult<T>;
  };
};

const identifier = match(/[A-Z_][A-Z0-9_]*/i);

interface Numeric {
  value: number;
  type: "dec" | "hex" | "bin";
  range: SourceRange;
}

const numeric = bind<Numeric>(
  /(?<dec>[0-9]+)|0x(?<hex>[0-9A-F]+)|0b(?<bin>[01]+)/i,
  (match, range) => {
    const hex = match.groups?.hex;
    if (hex != null) {
      return {
        value: parseInt(hex, 16),
        type: "hex",
        range
      };
    }

    const bin = match.groups?.bin;
    if (bin != null) {
      return {
        value: parseInt(bin, 2),
        type: "bin",
        range
      };
    }

    const dec = match.groups?.dec;
    if (dec != null) {
      return {
        value: parseInt(dec, 10),
        type: "dec",
        range
      };
    }

    return null;
  }
);

const equ = (source: string, index: number = 0) => {
  const sep = match(/\s+EQU\s+/i);
  const id = identifier(source, index);
  if (id == null) {
    return null;
  }

  const keyword = sep(source, id[1][1]);
  if (keyword == null) {
    return null;
  }

  const value = numeric(source, keyword[1][1]) ?? identifier(source, keyword[1][1]);
  if (value == null) {
    return null;
  }

  return {
    type: "equ",
    name: id[0],
    value: value[0],
    range: [index, value[1][1]] satisfies SourceRange
  };
};
