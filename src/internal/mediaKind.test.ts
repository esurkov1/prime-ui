import { describe, expect, it } from "vitest";

import { mediaKind } from "./mediaKind";

describe("mediaKind", () => {
  it("reads the MIME type first", () => {
    expect(mediaKind({ type: "image/png", name: "a.bin" })).toBe("image");
    expect(mediaKind({ type: "video/mp4", name: "a.bin" })).toBe("video");
    expect(mediaKind({ type: "application/pdf", name: "a.jpg" })).toBeNull();
  });

  it("falls back to the extension when there is no type", () => {
    expect(mediaKind({ type: "", name: "Склад.JPG" })).toBe("image");
    expect(mediaKind({ type: "", name: "обзор.mov" })).toBe("video");
    expect(mediaKind({ type: "", name: "Договор.pdf" })).toBeNull();
    expect(mediaKind({ type: "", name: "README" })).toBeNull();
  });
});
