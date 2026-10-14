// @vitest-environment node
import { describe, expect, it } from "vitest";

import { iconLayout } from "./iconLayout";

function Glyph() {
  return null;
}

describe("iconLayout", () => {
  it("is icon-only when every child is the control's icon part, blank text aside", () => {
    expect(iconLayout([<Glyph key="a" />, " ", <Glyph key="b" />], Glyph)).toEqual({
      iconOnly: true,
      leadingIcon: false,
      trailingIcon: false,
    });
  });

  it("finds an icon before or after the text", () => {
    expect(iconLayout([<Glyph key="a" />, "Сохранить"], Glyph)).toEqual({
      iconOnly: false,
      leadingIcon: true,
      trailingIcon: false,
    });
    expect(iconLayout(["Дальше", <Glyph key="a" />], Glyph)).toEqual({
      iconOnly: false,
      leadingIcon: false,
      trailingIcon: true,
    });
  });

  it("counts only the control's own icon part, not any element", () => {
    expect(iconLayout([<span key="a" />, "Сохранить"], Glyph)).toEqual({
      iconOnly: false,
      leadingIcon: false,
      trailingIcon: false,
    });
  });

  it("is plain for text alone and for no children", () => {
    expect(iconLayout("Сохранить", Glyph).iconOnly).toBe(false);
    expect(iconLayout(null, Glyph)).toEqual({
      iconOnly: false,
      leadingIcon: false,
      trailingIcon: false,
    });
  });
});
