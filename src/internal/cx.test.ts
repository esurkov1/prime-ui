// @vitest-environment node
import { describe, expect, it } from "vitest";

import { cx } from "./cx";

describe("cx", () => {
  it("joins the class names that are set, in order", () => {
    expect(cx("root", false, "tier", null, undefined, "", "focus")).toBe("root tier focus");
  });

  it("is empty when nothing is set", () => {
    expect(cx(false, null, undefined)).toBe("");
  });
});
