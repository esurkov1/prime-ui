import { describe, expect, it } from "vitest";

import { PLACEHOLDER, withoutReactionData } from "./contract-utils";

describe("placeholder check", () => {
  it("lets an emoji through only as the `emoji` of reaction data", () => {
    const source = 'const REACTIONS = [{ emoji: "👍", count: 3 }, { emoji: "🔥", count: 1 }];';
    expect(withoutReactionData(source)).not.toMatch(PLACEHOLDER);
  });

  it("still catches a decorative emoji in text", () => {
    const source = '<Message.Text>Сделка закрыта 🎉</Message.Text>\nconst R = [{ emoji: "👍" }];';
    expect(withoutReactionData(source)).toMatch(PLACEHOLDER);
  });

  it("still catches an emoji in another field or constant", () => {
    expect(withoutReactionData('const TITLE = { label: "🚀 Релиз" };')).toMatch(PLACEHOLDER);
  });
});
