// @vitest-environment node
import { describe, expect, it } from "vitest";

import { compactTier, controlSizes, stepDown, tierMappings } from "./states";

describe("tier mappings", () => {
  it("stepDown goes n tiers smaller and never under xs", () => {
    expect(controlSizes.map((size) => stepDown(size))).toEqual(["xs", "xs", "s", "m", "l"]);
    expect(controlSizes.map((size) => stepDown(size, 2))).toEqual(["xs", "xs", "xs", "s", "m"]);
  });

  it("compactTier keeps a fixed small control: xs up to m, s for l and xl", () => {
    expect(controlSizes.map(compactTier)).toEqual(["xs", "xs", "xs", "s", "s"]);
    // Not a step down: in an m host a step down would read as one of the host's own actions.
    expect(compactTier("m")).not.toBe(stepDown("m"));
  });

  it("every named mapping covers every tier and never grows the tier", () => {
    for (const [name, mapping] of Object.entries(tierMappings)) {
      expect(Object.keys(mapping), name).toEqual([...controlSizes]);
      for (const size of controlSizes) {
        expect(controlSizes.indexOf(mapping[size]), `${name}.${size}`).toBeLessThanOrEqual(
          controlSizes.indexOf(size),
        );
      }
    }
  });
});
