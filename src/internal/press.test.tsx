import { fireEvent, render, screen } from "@testing-library/react";

import { cssRules, cssValue } from "@/test/css";

import { holdPress, press } from "./press";

const CSS = "src/internal/press.module.css";

/** States that never give under a press: on the element, or on a host around it. */
const SELF = [
  ":disabled",
  '[aria-disabled="true"]',
  '[data-disabled="true"]',
  '[data-readonly="true"]',
  '[aria-readonly="true"]',
  '[data-loading="true"]',
  '[aria-busy="true"]',
];
const HOST =
  ':is(:disabled, [aria-disabled="true"], [data-disabled="true"], [data-readonly="true"]) *';

const pressRules = () => cssRules(CSS).filter((rule) => rule.decls.some((d) => d.prop === "scale"));
const activeRules = () => pressRules().filter((rule) => rule.selector.includes(":active"));

/** The distances as the theme gives them, on the element itself (jsdom has no cascade of ours). */
const DISTANCES = {
  "--prime-motion-press-distance": "2px",
  "--prime-motion-press-distance-compact": "1px",
};

/** A pressable of a given box: jsdom lays nothing out, so the box is what layout would report. */
function sized(el: HTMLElement, width: number, height: number) {
  Object.defineProperty(el, "offsetWidth", { configurable: true, value: width });
  Object.defineProperty(el, "offsetHeight", { configurable: true, value: height });
  for (const [name, value] of Object.entries(DISTANCES)) el.style.setProperty(name, value);
  return el;
}

const scaleOf = (el: HTMLElement) => Number(el.style.getPropertyValue("--press-scale"));
/** How far each edge of the longer side comes in at that scale. */
const giveOf = (el: HTMLElement) =>
  ((1 - scaleOf(el)) * Math.max(el.offsetWidth, el.offsetHeight)) / 2;

describe("press: the stylesheet", () => {
  it("each pressable scales by its measured scale, else by the press token (compact for the compact ones)", () => {
    const scales = Object.fromEntries(
      activeRules()
        .filter((rule) => !rule.selector.startsWith(".pressHost"))
        .map((rule) => [rule.selector.split(":active")[0], cssValue(rule, "scale")]),
    );
    expect(scales).toEqual({
      ".press": "var(--press-scale, var(--prime-motion-press-scale))",
      ".pressCompact": "var(--press-scale, var(--prime-motion-press-scale-compact))",
    });
    const parts = activeRules().filter((rule) => rule.selector.startsWith(".pressHost"));
    expect(
      parts.map((rule) => [rule.selector.split(") ").at(-1), cssValue(rule, "scale")]),
    ).toEqual([
      [".pressPart", "var(--press-scale, var(--prime-motion-press-scale))"],
      [".pressPartCompact", "var(--press-scale, var(--prime-motion-press-scale-compact))"],
    ]);
    const held = pressRules().find((rule) => rule.selector === ".pressHeld[data-pressed]");
    expect(held && cssValue(held, "scale")).toBe(
      "var(--press-scale, var(--prime-motion-press-scale))",
    );
  });

  it("only on :active, and never disabled, read-only, loading, busy or inside a disabled host", () => {
    for (const rule of activeRules()) {
      expect(rule.selector).toContain(":active:not(");
      for (const state of [...SELF, HOST]) expect(rule.selector).toContain(state);
    }
  });

  it("the scale goes and returns on the fast clock; a host's own transition wins", () => {
    const base = cssRules(CSS).find((rule) => rule.selector.startsWith(":where(.press,"));
    expect(base && cssValue(base, "transition")).toBe(
      "scale var(--prime-motion-duration-fast) var(--prime-motion-easing-standard)",
    );
  });
});

describe("press: the measured scale", () => {
  it("gives the same distance on a 40px, a 300px and a 1200px wide pressable", () => {
    render(
      <>
        <button type="button" className={press.press} data-testid="40" />
        <button type="button" className={press.press} data-testid="300" />
        <button type="button" className={press.press} data-testid="1200" />
      </>,
    );
    for (const width of [40, 300, 1200]) {
      const el = sized(screen.getByTestId(String(width)), width, 32);
      fireEvent.pointerDown(el, { button: 0 });
      expect(giveOf(el)).toBeCloseTo(2, 1);
      fireEvent.pointerUp(el, { button: 0 });
    }
  });

  it("takes the longer side, so a tall element gives by the same distance", () => {
    render(<div className={press.press} data-testid="tall" />);
    const el = sized(screen.getByTestId("tall"), 40, 400);
    fireEvent.pointerDown(el, { button: 0 });
    expect(scaleOf(el)).toBeCloseTo(0.99, 4);
  });

  it("the compact ones give by the compact distance", () => {
    render(<button type="button" className={press.pressCompact} data-testid="icon" />);
    const el = sized(screen.getByTestId("icon"), 32, 32);
    fireEvent.pointerDown(el, { button: 0 });
    expect(giveOf(el)).toBeCloseTo(1, 2);
  });

  it("is written on every pressable of the pressed chain and cleared on release", () => {
    render(
      <div className={press.press} data-testid="card">
        <button type="button" className={press.pressCompact} data-testid="icon" />
      </div>,
    );
    const card = sized(screen.getByTestId("card"), 320, 200);
    const icon = sized(screen.getByTestId("icon"), 32, 32);
    fireEvent.pointerDown(icon, { button: 0 });
    expect(scaleOf(card)).toBeCloseTo(1 - 4 / 320, 4);
    expect(scaleOf(icon)).toBeCloseTo(1 - 2 / 32, 4);
    fireEvent.pointerUp(icon, { button: 0 });
    expect(card.style.getPropertyValue("--press-scale")).toBe("");
    expect(icon.style.getPropertyValue("--press-scale")).toBe("");
  });

  it("is cleared when the press is cancelled", () => {
    render(<div className={press.press} data-testid="row" />);
    const el = sized(screen.getByTestId("row"), 600, 48);
    fireEvent.pointerDown(el, { button: 0 });
    expect(el.style.getPropertyValue("--press-scale")).not.toBe("");
    fireEvent.pointerCancel(el);
    expect(el.style.getPropertyValue("--press-scale")).toBe("");
  });

  it("a secondary button presses nothing", () => {
    render(<div className={press.press} data-testid="row" />);
    const el = sized(screen.getByTestId("row"), 600, 48);
    fireEvent.pointerDown(el, { button: 2 });
    expect(el.style.getPropertyValue("--press-scale")).toBe("");
  });

  it("a host measures its own parts, not the parts of a host inside it", () => {
    render(
      <div className={press.pressHost} data-testid="row">
        <span className={press.pressPartCompact} data-testid="box" />
        <span className={press.pressHost}>
          <span className={press.pressPart} data-testid="inner" />
        </span>
      </div>,
    );
    const box = sized(screen.getByTestId("box"), 20, 20);
    const inner = sized(screen.getByTestId("inner"), 100, 20);
    fireEvent.pointerDown(screen.getByTestId("row"), { button: 0 });
    expect(scaleOf(box)).toBeCloseTo(0.9, 4);
    expect(inner.style.getPropertyValue("--press-scale")).toBe("");
  });

  it("Space and Enter press the focused element, and a key up lets it go", () => {
    render(<button type="button" className={press.press} data-testid="button" />);
    const el = sized(screen.getByTestId("button"), 200, 32);
    for (const key of [" ", "Enter"]) {
      fireEvent.keyDown(el, { key });
      expect(scaleOf(el)).toBeCloseTo(0.98, 4);
      fireEvent.keyUp(el, { key });
      expect(el.style.getPropertyValue("--press-scale")).toBe("");
    }
  });

  it("Space typed in a text field presses nothing around it", () => {
    render(
      <div className={press.press} data-testid="field">
        <input aria-label="Поиск" />
      </div>,
    );
    const field = sized(screen.getByTestId("field"), 300, 40);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: " " });
    expect(field.style.getPropertyValue("--press-scale")).toBe("");
  });

  it("without the theme's distance nothing is written: the CSS fallback scale stands", () => {
    render(<div className={press.press} data-testid="bare" />);
    const el = screen.getByTestId("bare");
    Object.defineProperty(el, "offsetWidth", { configurable: true, value: 300 });
    fireEvent.pointerDown(el, { button: 0 });
    expect(el.style.getPropertyValue("--press-scale")).toBe("");
  });

  it("under reduced motion (distance 0) the scale is 1", () => {
    render(<div className={press.press} data-testid="still" />);
    const el = sized(screen.getByTestId("still"), 300, 40);
    el.style.setProperty("--prime-motion-press-distance", "0");
    fireEvent.pointerDown(el, { button: 0 });
    expect(scaleOf(el)).toBe(1);
  });

  it("holdPress presses a surface by hand, measured, until it is let go", () => {
    render(<div className={press.pressHeld} data-testid="message" />);
    const el = sized(screen.getByTestId("message"), 280, 400);
    holdPress(el, true);
    expect(el).toHaveAttribute("data-pressed");
    expect(scaleOf(el)).toBeCloseTo(0.99, 4);
    holdPress(el, false);
    expect(el).not.toHaveAttribute("data-pressed");
    expect(el.style.getPropertyValue("--press-scale")).toBe("");
  });
});
