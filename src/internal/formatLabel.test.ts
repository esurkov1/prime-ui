import { describe, expect, it } from "vitest";

import { formatLabel } from "./formatLabel";

describe("formatLabel", () => {
  it("replaces every token with its value", () => {
    expect(formatLabel("{current} из {max} символов", { current: 3, max: 40 })).toBe(
      "3 из 40 символов",
    );
  });

  it("replaces repeated tokens", () => {
    expect(formatLabel("{n} → {n}", { n: "a" })).toBe("a → a");
  });

  it("leaves unknown tokens as written", () => {
    expect(formatLabel("Страница {page} из {total}", { page: 2 })).toBe("Страница 2 из {total}");
  });

  it("does not read inherited keys", () => {
    expect(formatLabel("{toString}", {})).toBe("{toString}");
  });
});
