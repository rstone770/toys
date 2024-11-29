import { describe, expect, it } from "vitest";
import { tokenizer } from "./tokenizer";

describe("tokenizer", () => {
  it("matches tokens with a given pattern", () => {
    const foo = tokenizer("foo", /foo/);

    expect(foo("bar")).toBeNull();
    expect(foo("FOO")).toBeNull();
    expect(foo("foo")).toEqual({ type: "foo", value: "foo", range: [0, 3] });
    expect(foo("foo foo", 4)).toEqual({ type: "foo", value: "foo", range: [4, 7] });
  });

  it("honors ignoreCase", () => {
    const foo = tokenizer("foo", /foo/i);
    expect(foo("bar")).toBeNull();
    expect(foo("FOO")).toEqual({ type: "foo", value: "FOO", range: [0, 3] });
  });

  it("maps values", () => {
    const foo = tokenizer("foo", /foo/, (match) => match[0].toUpperCase());
    expect(foo("foo")).toEqual({ type: "foo", value: "FOO", range: [0, 3] });
  });
});
