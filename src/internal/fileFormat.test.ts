// @vitest-environment node
import { describe, expect, it } from "vitest";

import { extensionOf, formatColor } from "./fileFormat";

describe("extensionOf", () => {
  it("is the final extension in lower case", () => {
    expect(extensionOf("Счёт-2048.final.PDF")).toBe("pdf");
  });

  it("is empty for a name without an extension and for a dotfile", () => {
    expect(extensionOf("README")).toBe("");
    expect(extensionOf(".env")).toBe("");
    expect(extensionOf("архив.")).toBe("");
  });
});

describe("formatColor", () => {
  it("gives each format family its hue", () => {
    expect(["pdf", "docx", "xlsx", "pptx", "zip", "mov", "mp3"].map(formatColor)).toEqual([
      "red",
      "blue",
      "green",
      "orange",
      "yellow",
      "purple",
      "pink",
    ]);
  });

  it("is gray for any other format", () => {
    expect(formatColor("sketch")).toBe("gray");
    expect(formatColor("")).toBe("gray");
  });
});
