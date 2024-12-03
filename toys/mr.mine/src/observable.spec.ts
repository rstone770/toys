import { describe, it, expect, vi } from "vitest";
import { Subject } from "./observable";

describe("Subject", () => {
  it("emits values to subscribers", () => {
    const numbers = new Subject<number>();
    const next = vi.fn();
    numbers.subscribe(next);

    numbers.next(1);
    numbers.next(2);
    numbers.next(3);

    expect(next).toHaveBeenNthCalledWith(1, 1);
    expect(next).toHaveBeenNthCalledWith(2, 2);
    expect(next).toHaveBeenNthCalledWith(3, 3);
  });

  it("unsubscribes", () => {
    const numbers = new Subject<number>();
    const next = vi.fn();
    const sub = numbers.subscribe(next);

    numbers.next(1);
    numbers.next(2);
    numbers.next(3);
    sub.unsubscribe();
    numbers.next(4);

    expect(next).toHaveBeenCalledTimes(3);
    expect(next).toHaveBeenNthCalledWith(1, 1);
    expect(next).toHaveBeenNthCalledWith(2, 2);
    expect(next).toHaveBeenNthCalledWith(3, 3);
  });

  it("properly flushes values in sequence", () => {
    const numbers = new Subject<number>();
    const next = vi.fn((n: number) => {
      for (let i = n - 1; i >= 0; i--) {
        numbers.next(i);
      }
    });

    numbers.subscribe(next);
    numbers.next(3); // should call 8 times

    expect(next).toHaveBeenCalledTimes(8);
    expect(next).toHaveBeenNthCalledWith(1, 3);
    expect(next).toHaveBeenNthCalledWith(2, 2);
    expect(next).toHaveBeenNthCalledWith(3, 1);
    expect(next).toHaveBeenNthCalledWith(4, 0);
    expect(next).toHaveBeenNthCalledWith(5, 1);
    expect(next).toHaveBeenNthCalledWith(6, 0);
    expect(next).toHaveBeenNthCalledWith(7, 0);
    expect(next).toHaveBeenNthCalledWith(8, 0);
  });
});
