import { describe, expect, it } from "vitest";

import { formatFileSize } from "./fileSize";

describe("formatFileSize", () => {
  it("prints bytes and kilobytes whole, megabytes and up with one decimal", () => {
    expect(formatFileSize(0)).toBe("0 Б");
    expect(formatFileSize(512)).toBe("512 Б");
    expect(formatFileSize(820 * 1024)).toBe("820 КБ");
    expect(formatFileSize(1.25 * 1024 * 1024)).toMatch(/^1,[23] МБ$/);
    expect(formatFileSize(3 * 1024 ** 3)).toBe("3 ГБ");
  });

  it("rounds before it picks the unit: a size that rounds to 1024 moves up", () => {
    expect(formatFileSize(1023.6)).toBe("1 КБ");
    expect(formatFileSize(1023.6 * 1024)).toBe("1 МБ");
    expect(formatFileSize(1023.96 * 1024 * 1024)).toBe("1 ГБ");
  });

  it("never prints a negative size", () => {
    expect(formatFileSize(-5)).toBe("0 Б");
  });
});
