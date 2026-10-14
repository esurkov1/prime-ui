/**
 * The shared test harness itself: the CSS parser never passes on a missing rule, and the motion
 * harness records animations and is undone after each test.
 */
import { cssRule, cssRules, cssValue } from "./css";
import { withMotion } from "./motion";

describe("css", () => {
  const file = "src/internal/touchTarget.module.css";

  it("finds a rule with its at-rule context", () => {
    const inside = cssRules(file).filter((rule) => rule.parents[0]?.startsWith("@media"));
    expect(inside.length).toBeGreaterThan(0);
    const rule = inside[0];
    expect(cssRule(file, rule.selector, [rule.parents[0]])).toBe(rule);
  });

  it("throws on a selector the file does not have", () => {
    expect(() => cssRule(file, ".no-such-rule")).toThrow(/no rule/);
  });

  it("throws on a property the rule does not set", () => {
    const [rule] = cssRules(file);
    expect(() => cssValue(rule, "no-such-property")).toThrow(/sets no/);
  });
});

describe("withMotion", () => {
  it("turns motion on and records animations", () => {
    const motion = withMotion();
    expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(false);
    const node = document.createElement("div");
    const onFinish = vi.fn();
    const animation = node.animate([{ opacity: 0 }, { opacity: 1 }], 200);
    animation.addEventListener("finish", onFinish);
    expect(motion.on(node)).toHaveLength(1);
    motion.finishAll();
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("is undone after the test", () => {
    expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(true);
    expect("animate" in Element.prototype).toBe(false);
  });
});
