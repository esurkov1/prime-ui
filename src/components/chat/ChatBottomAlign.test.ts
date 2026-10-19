import { describe, expect, it } from "vitest";

import { cssRule, cssValue } from "@/test/css";

const CSS = "src/components/chat/Chat.module.css";

describe("Chat.Messages bottom alignment", () => {
  it("the scroller is a column and the list takes an auto start margin", () => {
    const scroller = cssRule(CSS, ".scroller");
    expect(cssValue(scroller, "display")).toBe("flex");
    expect(cssValue(scroller, "flex-direction")).toBe("column");
    const list = cssRule(CSS, ".list");
    expect(cssValue(list, "margin-block-start")).toBe("auto");
    expect(cssValue(list, "flex")).toBe("none");
  });
});
