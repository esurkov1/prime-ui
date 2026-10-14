import { describe, expect, it } from "vitest";

import { iconBoxClass, iconBoxStyles, iconSlotClass } from "./iconBox";

describe("iconBoxClass", () => {
  it("an explicit size takes the global icon scale and never the host size", () => {
    const classes = iconBoxClass("l", "s").split(" ");
    expect(classes).toContain(iconBoxStyles.box);
    expect(classes).toContain(iconBoxStyles.l);
    expect(classes).not.toContain(iconBoxStyles.inherit);
  });

  it("without a size follows the host icon size, else the tier, else m", () => {
    expect(iconBoxClass(undefined, "s").split(" ")).toEqual(
      expect.arrayContaining([iconBoxStyles.box, iconBoxStyles.s, iconBoxStyles.inherit]),
    );
    expect(iconBoxClass(undefined, undefined).split(" ")).toContain(iconBoxStyles.m);
  });

  it("the glyph slot is a class of its own", () => {
    expect(iconSlotClass).toBe(iconBoxStyles.slot);
    expect(iconSlotClass).toBeTruthy();
  });
});
