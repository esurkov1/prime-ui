import { describe, expect, it } from "vitest";

import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
  it("groups digits and uses a decimal comma", () => {
    expect(formatNumber(12480).replace(/\s/g, " ")).toBe("12 480");
    expect(formatNumber(0.5)).toBe("0,5");
  });

  it("caps the decimals", () => {
    expect(formatNumber(12.456, 1)).toBe("12,5");
    expect(formatNumber(12.456)).toBe("12,456");
    expect(formatNumber(3, 1)).toBe("3");
  });
});
