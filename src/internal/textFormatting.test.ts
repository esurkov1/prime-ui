import { describe, expect, it } from "vitest";

import { applyFormat, diffRange, formatForKey, shortcutText } from "./textFormatting";

const sel = (text: string, start: number, end = start) => ({ text, start, end });

describe("applyFormat", () => {
  it("wraps the selection and keeps it selected", () => {
    expect(applyFormat(sel("Счёт оплачен", 5, 12), "bold")).toEqual(sel("Счёт **оплачен**", 7, 14));
    expect(applyFormat(sel("срок", 0, 4), "italic")).toEqual(sel("_срок_", 1, 5));
    expect(applyFormat(sel("срок", 0, 4), "strikethrough")).toEqual(sel("~~срок~~", 2, 6));
    expect(applyFormat(sel("npm ci", 0, 6), "code")).toEqual(sel("`npm ci`", 1, 7));
    expect(applyFormat(sel("сумма 120 000 ₽", 6, 15), "spoiler")).toEqual(
      sel("сумма ||120 000 ₽||", 8, 17),
    );
  });

  it("unwraps markers around or inside the selection", () => {
    expect(applyFormat(sel("**срок**", 2, 6), "bold")).toEqual(sel("срок", 0, 4));
    expect(applyFormat(sel("a **срок** b", 2, 10), "bold")).toEqual(sel("a срок b", 2, 6));
    expect(applyFormat(sel("||пароль||", 2, 8), "spoiler")).toEqual(sel("пароль", 0, 6));
  });

  it("puts the caret between new markers when nothing is selected", () => {
    expect(applyFormat(sel("Итог: ", 6), "bold")).toEqual(sel("Итог: ****", 8, 8));
  });

  it("fences a multi-line selection on lines of its own", () => {
    const result = applyFormat(sel("Лог:a\nb", 4, 7), "code");
    expect(result.text).toBe("Лог:\n```\na\nb\n```");
    expect(result.text.slice(result.start, result.end)).toBe("a\nb");
  });

  it("makes a link and selects its address", () => {
    const result = applyFormat(sel("смета", 0, 5), "link");
    expect(result.text).toBe("[смета](https://)");
    expect(result.text.slice(result.start, result.end)).toBe("https://");
    const url = applyFormat(sel("https://example.com", 0, 19), "link");
    expect(url.text).toBe("[](https://example.com)");
    expect(url.start).toBe(1);
  });

  it("quotes every touched line and unquotes them again", () => {
    const quoted = applyFormat(sel("первая\nвторая", 2, 9), "quote");
    expect(quoted.text).toBe("> первая\n> вторая");
    expect(applyFormat(sel(quoted.text, 3, 12), "quote").text).toBe("первая\nвторая");
  });
});

describe("diffRange", () => {
  it("finds the one span that changed", () => {
    expect(diffRange("a срок b", "a **срок** b")).toEqual({ start: 2, end: 6, insert: "**срок**" });
    expect(diffRange("a **срок** b", "a срок b")).toEqual({ start: 2, end: 10, insert: "срок" });
  });
});

describe("formatForKey", () => {
  const key = (
    code: string,
    mods: Partial<Record<"meta" | "ctrl" | "shift" | "alt", boolean>>,
  ) => ({
    key: "",
    code,
    metaKey: Boolean(mods.meta),
    ctrlKey: Boolean(mods.ctrl),
    shiftKey: Boolean(mods.shift),
    altKey: Boolean(mods.alt),
  });

  it("reads the physical key, so a Russian layout works", () => {
    expect(formatForKey({ ...key("KeyB", { ctrl: true }), key: "и" })).toBe("bold");
    expect(formatForKey(key("KeyI", { meta: true }))).toBe("italic");
    expect(formatForKey(key("KeyX", { meta: true, shift: true }))).toBe("strikethrough");
    expect(formatForKey(key("KeyE", { ctrl: true }))).toBe("code");
    expect(formatForKey(key("KeyK", { ctrl: true }))).toBe("link");
    expect(formatForKey(key("Digit9", { ctrl: true, shift: true }))).toBe("quote");
    expect(formatForKey({ ...key("KeyH", { meta: true, shift: true }), key: "Р" })).toBe("spoiler");
  });

  it("ignores keys without Mod and other combinations", () => {
    expect(formatForKey(key("KeyB", {}))).toBeNull();
    expect(formatForKey(key("KeyX", { ctrl: true }))).toBeNull();
    expect(formatForKey(key("KeyB", { ctrl: true, alt: true }))).toBeNull();
    expect(formatForKey(key("KeyH", { ctrl: true }))).toBeNull();
  });

  it("names the shortcut for the platform", () => {
    expect(shortcutText("strikethrough", true)).toBe("⌘⇧X");
    expect(shortcutText("bold", false)).toBe("Ctrl+B");
    expect(shortcutText("spoiler", false)).toBe("Ctrl+Shift+H");
  });
});
