// @vitest-environment node
import { describe, expect, it } from "vitest";

import { toDataAttributes } from "./data-attributes";

describe("toDataAttributes", () => {
  it("prefixes each key with data- and writes every value as a string", () => {
    expect(toDataAttributes({ size: "m", open: false, count: 3, invalid: true })).toEqual({
      "data-size": "m",
      "data-open": "false",
      "data-count": "3",
      "data-invalid": "true",
    });
  });

  it("leaves out undefined values, so no attribute is rendered for them", () => {
    expect(toDataAttributes({ size: undefined, tone: "danger" })).toEqual({
      "data-tone": "danger",
    });
  });
});
