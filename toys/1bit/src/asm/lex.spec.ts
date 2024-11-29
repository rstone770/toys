import { expect, it, describe } from "vitest";
import { whitespace, comment, identifier, numeric, keyword, lex } from "./lex";
import { AnyToken } from "./tokenizer";

describe("whitespace", () => {
  it("matches whitespace", () => {
    expect(whitespace(" \t")).toEqual({ type: "ws", value: " \t", range: [0, 2] });
    expect(whitespace("test test", 4)).toEqual({ type: "ws", value: " ", range: [4, 5] });
  });

  it("does not match non-whitespace", () => {
    expect(whitespace("foo")).toBeNull();
    expect(whitespace("foo", 1)).toBeNull();
  });
});

describe("comment", () => {
  it("matches comments", () => {
    expect(comment("; foo")).toEqual({ type: "comment", value: " foo", range: [0, 5] });
    expect(comment("test ; foo", 5)).toEqual({ type: "comment", value: " foo", range: [5, 10] });
  });

  it("does not match non-comments", () => {
    expect(comment("foo")).toBeNull();
    expect(comment("foo", 1)).toBeNull();
  });
});

describe("identifier", () => {
  it("matches identifiers", () => {
    expect(identifier("FOO")).toEqual({ type: "identifier", value: "foo", range: [0, 3] });
    expect(identifier("foo bar", 4)).toEqual({ type: "identifier", value: "bar", range: [4, 7] });
  });

  it("does not match non-identifiers", () => {
    expect(identifier("1 foo")).toBeNull();
    expect(identifier("f1", 1)).toBeNull();
  });
});

describe("numeric", () => {
  it("matches numbers", () => {
    expect(numeric("0x64")).toEqual({
      type: "numeric",
      value: { value: 100, format: "hex" },
      range: [0, 4]
    });
    expect(numeric("0b111")).toEqual({
      type: "numeric",
      value: { value: 7, format: "bin" },
      range: [0, 5]
    });
  });

  it("does not match non-numbers", () => {
    expect(numeric("foo")).toBeNull();
    expect(numeric("foo", 1)).toBeNull();
  });
});

describe("keyword", () => {
  it("matches keywords", () => {
    expect(keyword("equ")).toEqual({ type: "keyword", value: "equ", range: [0, 3] });
  });

  it("does not match non-keywords", () => {
    expect(keyword("foo")).toBeNull();
    expect(keyword("foo", 1)).toBeNull();
  });
});

describe("lex", () => {
  const input = "foo equ 0x64 ; comment";

  it("lexes the input", () => {
    const tokens: AnyToken[] = [];
    for (let i = lex(input, 0); i != null; i = lex(input, i.range[1])) {
      tokens.push(i);
    }

    expect(tokens).toMatchSnapshot;
  });
});
