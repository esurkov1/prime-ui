import { describe, expect, it } from "vitest";

import fieldTier from "./fieldTier.module.css";
import { iconBoxClass, iconBoxStyles, iconSlotClass } from "./iconBox";

describe("iconBoxClass", () => {
  it("an explicit size takes the global icon scale and never the host size", () => {
    const classes = iconBoxClass("l", "s").split(" ");
    expect(classes).toContain(iconBoxStyles.box);
    expect(classes).toContain(iconBoxStyles.l);
    expect(classes).not.toContain(iconBoxStyles.inherit);
  });

  it("without a size follows the host icon size, else the tier's control icon, else m", () => {
    const classes = iconBoxClass(undefined, "s").split(" ");
    expect(classes).toEqual(expect.arrayContaining([iconBoxStyles.box, iconBoxStyles.inherit]));
    expect(classes).toContain(fieldTier.iconS);
    expect(classes).not.toContain(iconBoxStyles.s);
    expect(iconBoxClass(undefined, undefined).split(" ")).toContain(fieldTier.iconM);
  });

  it("the glyph slot is a class of its own", () => {
    expect(iconSlotClass).toBe(iconBoxStyles.slot);
    expect(iconSlotClass).toBeTruthy();
  });
});
