import { describe, expect, it } from "vitest";

import { hasContent } from "./hasContent";

describe("hasContent", () => {
  it("is false for nodes that draw nothing", () => {
    for (const node of [null, undefined, true, false, "", [], [null, false, ""]]) {
      expect(hasContent(node)).toBe(false);
    }
  });

  it("is true for text, numbers (0 too), elements and lists with one of them", () => {
    for (const node of ["Счёт", 0, <span key="a" />, [null, "Счёт"]]) {
      expect(hasContent(node)).toBe(true);
    }
  });
});
