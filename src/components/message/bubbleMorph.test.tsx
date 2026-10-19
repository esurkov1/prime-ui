import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createBubbleMorph } from "./bubbleMorph";

type Rect = { left: number; top: number; width: number; height: number };

/** A fake running animation: its eased progress is set by the test. */
type FakeAnimation = {
  element: Element;
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
  progress: number;
  cancel: ReturnType<typeof vi.fn>;
};

let animations: FakeAnimation[] = [];
const boxes = new Map<Element, Rect | (() => Rect)>();

function fakeAnimate(this: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
  const record: FakeAnimation = { element: this, keyframes, options, progress: 0, cancel: vi.fn() };
  animations.push(record);
  return {
    get playState() {
      return "running";
    },
    effect: { getComputedTiming: () => ({ progress: record.progress }) },
    cancel: record.cancel,
    finished: new Promise(() => {}),
    onfinish: null,
    oncancel: null,
  } as unknown as Animation;
}

const place = (element: Element, rect: Rect | (() => Rect)) => boxes.set(element, rect);

/** A message as the morph sees it: a row, the column, the bubble with its fill and parts. */
function message() {
  const row = document.createElement("div");
  const column = document.createElement("div");
  const bubble = document.createElement("div");
  const fill = document.createElement("span");
  fill.setAttribute("data-morph-skip", "");
  const text = document.createElement("div");
  const meta = document.createElement("span");
  const slot = document.createElement("div");
  slot.setAttribute("data-morph-skip", "");
  bubble.append(fill, text, slot, meta);
  column.append(bubble);
  row.append(column);
  document.body.append(row);
  const hold = vi.fn();
  /** The conversation's scroller, once the message stands in one (`inScroller`). */
  const view: { scroller: HTMLElement | null } = { scroller: null };
  const morph = createBubbleMorph(() => ({
    column,
    bubble,
    fill,
    row,
    scroller: view.scroller,
    hold,
  }));
  return { row, column, bubble, fill, text, meta, slot, morph, hold, view };
}

const clipOf = (animation: FakeAnimation) =>
  (animation.keyframes[0] as { clipPath: string }).clipPath;

beforeEach(() => {
  animations = [];
  boxes.clear();
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
  document.documentElement.style.setProperty("--prime-message-morph-duration", "300ms");
  Element.prototype.animate = fakeAnimate as unknown as Element["animate"];
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    const value = boxes.get(this) ?? { left: 0, top: 0, width: 0, height: 0 };
    const rect = typeof value === "function" ? value() : value;
    return { ...rect, right: rect.left + rect.width, bottom: rect.top + rect.height } as DOMRect;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.documentElement.style.removeProperty("--prime-message-morph-duration");
  delete (Element.prototype as Partial<Element>).animate;
  document.body.innerHTML = "";
});

describe("bubbleMorph", () => {
  it("plays a size change as one clip of the bubble: width and height in one effect", () => {
    const m = message();
    // An outgoing one-line text: 480 × 36. A reaction makes it 420 × 72, grown up into the
    // reserve; the bottom-end corner and the meta stay.
    place(m.column, { left: 100, top: 100, width: 480, height: 36 });
    place(m.bubble, { left: 100, top: 100, width: 480, height: 36 });
    place(m.text, { left: 112, top: 108, width: 400, height: 20 });
    place(m.meta, { left: 530, top: 112, width: 38, height: 16 });
    m.morph.capture({ anchor: "end" });
    place(m.column, { left: 160, top: 64, width: 420, height: 72 });
    place(m.bubble, { left: 160, top: 64, width: 420, height: 72 });
    place(m.text, { left: 172, top: 72, width: 396, height: 20 });
    m.morph.play();

    const clips = animations.filter((a) => a.element === m.bubble);
    expect(clips).toHaveLength(1);
    // From the old box inside the new one: 36 px lower, 60 px wider to the start.
    expect(clipOf(clips[0] as FakeAnimation)).toMatch(/^inset\(36px 0px 0px -60px/);
    expect((clips[0]?.keyframes[1] as { clipPath: string }).clipPath).toMatch(
      /^inset\(0px 0px 0px 0px/,
    );
    // The text glides from where it was; the meta did not move, so it has no animation.
    const text = animations.find((a) => a.element === m.text);
    expect(text?.keyframes[0]).toEqual({ transform: "translate(-60px, 36px)" });
    expect(animations.some((a) => a.element === m.meta)).toBe(false);
    // One clock: every part runs on the bubble's duration and easing.
    for (const a of animations) expect(a.options.duration).toBe(300);
  });

  it("touches nothing on a commit that moves nothing, even mid-flight", () => {
    const m = message();
    place(m.bubble, { left: 0, top: 0, width: 200, height: 36 });
    place(m.text, { left: 12, top: 8, width: 150, height: 20 });
    m.morph.capture();
    place(m.bubble, { left: 0, top: -36, width: 200, height: 72 });
    m.morph.play();
    const running = [...animations];
    expect(running.length).toBeGreaterThan(0);
    for (const a of running) a.progress = 0.5;
    // A render for anything else (a hover, a status) commits the same layout.
    m.morph.capture();
    m.morph.play();
    expect(animations).toHaveLength(running.length);
    for (const a of running) expect(a.cancel).not.toHaveBeenCalled();
  });

  it("retargets from the current look, never from the start", () => {
    const m = message();
    place(m.bubble, { left: 0, top: 0, width: 200, height: 36 });
    m.morph.capture();
    place(m.bubble, { left: 0, top: -36, width: 200, height: 72 });
    m.morph.play();
    const first = animations.find((a) => a.element === m.bubble) as FakeAnimation;
    expect(clipOf(first)).toMatch(/^inset\(36px 0px 0px 0px/);
    // Half way (eased), the reaction is taken back: the box shrinks again.
    first.progress = 0.5;
    m.morph.capture();
    place(m.bubble, { left: 0, top: 0, width: 200, height: 36 });
    m.morph.play();
    expect(first.cancel).toHaveBeenCalled();
    const second = animations.filter((a) => a.element === m.bubble).at(-1) as FakeAnimation;
    // It shows 18 px of the 36 still: the new clip starts 18 px above the new box.
    expect(clipOf(second)).toMatch(/^inset\(-18px 0px 0px 0px/);
    // The fill reaches over the old, taller box for the stroke.
    const reach = animations.filter((a) => a.element === m.fill).at(-1);
    expect(reach?.keyframes[0]).toMatchObject({ inset: "-18px 0px 0px 0px" });
  });

  it("fades a part that went out where it stood, out of flow, and a part that came in", () => {
    const m = message();
    const chip = document.createElement("span");
    chip.setAttribute("data-morph-item", "");
    m.slot.append(chip);
    place(m.bubble, { left: 0, top: -36, width: 200, height: 72 });
    place(chip, { left: 12, top: 0, width: 60, height: 28 });
    m.morph.capture();
    chip.remove();
    const other = document.createElement("span");
    other.setAttribute("data-morph-item", "");
    m.slot.append(other);
    place(other, { left: 12, top: 0, width: 50, height: 28 });
    place(m.bubble, { left: 0, top: -36, width: 200, height: 72 });
    m.morph.play();
    // The node that went is back in the bubble, out of flow, at its old place, fading out.
    expect(chip.parentElement).toBe(m.bubble);
    expect(chip).toHaveAttribute("data-morph-ghost");
    expect(chip).toHaveAttribute("aria-hidden", "true");
    expect(chip.style.position).toBe("absolute");
    expect(chip.style.left).toBe("12px");
    const out = animations.find((a) => a.element === chip);
    expect(out?.keyframes.at(-1)).toMatchObject({ opacity: 0 });
    expect(out?.options.fill).toBe("forwards");
    // The one that came fades in where it stands.
    const fadeIn = animations.find((a) => a.element === other);
    expect(fadeIn?.keyframes[0]).toMatchObject({ opacity: 0 });
    expect(fadeIn?.keyframes.at(-1)).toMatchObject({ opacity: 1 });
  });

  /** A message in a scroller of 600 px, between a row above it and a row below. */
  function inScroller(rowTop: number) {
    const m = message();
    const scroller = document.createElement("div");
    m.view.scroller = scroller;
    let scrollTop = 1000;
    Object.defineProperty(scroller, "scrollTop", {
      get: () => scrollTop,
      set: (value: number) => {
        scrollTop = value;
      },
    });
    const above = document.createElement("div");
    const below = document.createElement("div");
    document.body.append(scroller);
    scroller.append(above, m.row, below);
    place(scroller, { left: 0, top: 0, width: 300, height: 600 });
    // Laid out in the content: the view shows content from `scrollTop` on.
    const at = (contentTop: number, height: number) => () => ({
      left: 0,
      top: contentTop - scrollTop,
      width: 300,
      height,
    });
    let rowHeight = 80;
    place(above, at(1000 + rowTop - 100, 100));
    place(m.row, () => at(1000 + rowTop, rowHeight)());
    place(below, () => at(1000 + rowTop + rowHeight, 100)());
    place(m.bubble, () => at(1000 + rowTop + 4, rowHeight - 8)());
    return {
      ...m,
      above,
      below,
      scroller,
      grow: (by: number) => {
        rowHeight += by;
      },
      scrollTop: () => scrollTop,
    };
  }

  it("grows a message on screen from its bottom: the view gives way, the rows above glide as one", () => {
    const s = inScroller(300);
    s.morph.capture({ anchor: "end" });
    s.grow(36);
    s.morph.play();
    // The view scrolled by the change in the same frame: the bubble's bottom and the row below
    // stay where they were; the row above glides up from its old place on the same clock.
    expect(s.scrollTop()).toBe(1036);
    // The conversation's own anchoring holds while the message keeps the view itself.
    expect(s.hold).toHaveBeenCalled();
    expect(animations.some((a) => a.element === s.below)).toBe(false);
    const glide = animations.find((a) => a.element === s.above);
    expect(glide?.keyframes[0]).toEqual({ transform: "translate(0px, 36px)" });
    expect(glide?.options).toMatchObject({ duration: 300, composite: "add" });
    // The bubble opens upward: its clip starts 36 px down, its bottom never moves.
    const clip = animations.find((a) => a.element === s.bubble) as FakeAnimation;
    expect(clipOf(clip)).toMatch(/^inset\(36px 0px 0px 0px/);
  });

  it("gives way with every row, not only messages: a band in the message's own row glides too", () => {
    // A list row holding the unread band and the message (a fragment row), between a date above
    // and the typing row below.
    const scroller = document.createElement("div");
    let scrollTop = 1000;
    Object.defineProperty(scroller, "scrollTop", {
      get: () => scrollTop,
      set: (value: number) => {
        scrollTop = value;
      },
    });
    const date = document.createElement("div");
    const listRow = document.createElement("div");
    const band = document.createElement("div");
    const article = document.createElement("article");
    const column = document.createElement("div");
    const bubble = document.createElement("div");
    const fill = document.createElement("span");
    fill.setAttribute("data-morph-skip", "");
    bubble.append(fill, document.createElement("div"));
    column.append(bubble);
    article.append(column);
    listRow.append(band, article);
    const typing = document.createElement("div");
    scroller.append(date, listRow, typing);
    document.body.append(scroller);
    const morph = createBubbleMorph(() => ({
      column,
      bubble,
      fill,
      row: listRow,
      scroller,
      hold: vi.fn(),
    }));
    place(scroller, { left: 0, top: 0, width: 300, height: 600 });
    const at = (contentTop: number, height: number) => () => ({
      left: 0,
      top: contentTop - scrollTop,
      width: 300,
      height,
    });
    let grown = 0;
    place(date, at(1200, 40));
    place(band, at(1240, 30));
    place(listRow, () => at(1240, 110 + grown)());
    place(article, () => at(1270, 80 + grown)());
    place(bubble, () => at(1274, 72 + grown)());
    place(typing, () => at(1350 + grown, 40)());
    morph.capture({ anchor: "end" });
    grown = 36;
    morph.play();
    // The message grows from its bottom: the view scrolls by the change, and everything above the
    // message — the band in its own row and the date before it — glides on the same clock.
    expect(scrollTop).toBe(1036);
    for (const element of [band, date]) {
      expect(animations.find((a) => a.element === element)?.keyframes[0]).toEqual({
        transform: "translate(0px, 36px)",
      });
    }
    expect(animations.some((a) => a.element === typing)).toBe(false);
  });

  it("grows a transcript from the top: the rows below glide; off screen the view stays still", () => {
    const s = inScroller(300);
    s.morph.capture({ anchor: "start" });
    s.grow(84);
    s.morph.play();
    expect(s.scrollTop()).toBe(1000);
    expect(animations.find((a) => a.element === s.below)?.keyframes[0]).toEqual({
      transform: "translate(0px, -84px)",
    });
    expect(animations.some((a) => a.element === s.above)).toBe(false);

    // A message above the view: the view scrolls by the change, nothing glides.
    const t = inScroller(-400);
    animations = [];
    t.morph.capture({ anchor: "end" });
    t.grow(36);
    t.morph.play();
    expect(t.scrollTop()).toBe(1036);
    expect(animations.some((a) => a.element === t.above || a.element === t.below)).toBe(false);
  });

  it("in a short conversation pushed to the end, a growth moves the rows above once and nothing below", () => {
    // The list stands at the end of a pane it does not fill (its auto top margin): nothing scrolls,
    // and a row that grows moves its top up — the rows above with it — while its bottom stays.
    const s = inScroller(300);
    let lift = 0;
    place(s.above, () => ({ left: 0, top: 200 - lift, width: 300, height: 100 }));
    place(s.row, () => ({ left: 0, top: 300 - lift, width: 300, height: 80 + lift }));
    place(s.below, { left: 0, top: 380, width: 300, height: 100 });
    place(s.bubble, () => ({ left: 0, top: 304 - lift, width: 300, height: 72 + lift }));
    s.morph.capture({ anchor: "end" });
    lift = 36;
    s.morph.play();
    // Nothing to scroll: the row's bottom never moved.
    expect(s.scrollTop()).toBe(1000);
    // The row above glides from where it was, once; the row below never moves.
    expect(animations.find((a) => a.element === s.above)?.keyframes[0]).toEqual({
      transform: "translate(0px, 36px)",
    });
    expect(animations.some((a) => a.element === s.below)).toBe(false);
  });

  it("a shrink at the end: the rows above settle down once, a date stuck at the top never moves", () => {
    const s = inScroller(300);
    // A date stuck at the top of the view: it stands there whatever the scroll.
    const date = document.createElement("div");
    s.scroller.prepend(date);
    place(date, { left: 0, top: 8, width: 300, height: 32 });
    s.morph.capture({ anchor: "end" });
    // A reaction taken back at the end: the content shrinks and the browser clamps the scroll.
    s.grow(-36);
    s.scroller.scrollTop = 964;
    s.morph.play();
    // The row's bottom stayed: nothing to scroll; the row above glides down from where it was.
    expect(s.scrollTop()).toBe(964);
    expect(animations.find((a) => a.element === s.above)?.keyframes[0]).toEqual({
      transform: "translate(0px, -36px)",
    });
    expect(animations.some((a) => a.element === date)).toBe(false);
  });

  it("closes a disclosed block like a disclosure: its fade spans the whole stroke", () => {
    const m = message();
    const block = document.createElement("div");
    block.setAttribute("data-morph-item", "");
    m.text.append(block);
    place(m.bubble, { left: 0, top: 0, width: 200, height: 152 });
    place(block, { left: 12, top: 64, width: 176, height: 80 });
    m.morph.capture({ anchor: "start" });
    block.remove();
    place(m.bubble, { left: 0, top: 0, width: 200, height: 64 });
    m.morph.play();
    const fade = animations.find((a) => a.element === block);
    // Opacity 1 → 0 over the whole stroke (its last stop at the end), on the box's clock.
    expect(fade?.keyframes[0]).toMatchObject({ opacity: 1 });
    expect(fade?.keyframes[1]).toMatchObject({ opacity: 0, offset: 1 });
    expect(fade?.options.easing).toBe(
      animations.find((a) => a.element === m.bubble)?.options.easing,
    );
  });

  /** Text line boxes for the morph's ink: each text node draws its parent's placed box. */
  function inkFromBoxes() {
    Range.prototype.getClientRects = function (this: Range) {
      const parent = this.startContainer.parentElement;
      const value = parent ? boxes.get(parent) : undefined;
      if (!value) return [] as unknown as DOMRectList;
      const rect = typeof value === "function" ? value() : value;
      return [
        { ...rect, right: rect.left + rect.width, bottom: rect.top + rect.height },
      ] as unknown as DOMRectList;
    };
    return () => Reflect.deleteProperty(Range.prototype, "getClientRects");
  }

  it("dips a meta that stays while text passes through its place; the text keeps one path", () => {
    const restore = inkFromBoxes();
    try {
      const m = message();
      m.text.textContent = "Реквизиты склада пришлю после сверки с бухгалтерией.";
      m.meta.textContent = "14:26";
      m.meta.setAttribute("data-message-meta", "");
      // An outgoing one-line text: its end 22 px before the meta on the same line. A reaction
      // narrows the bubble by 60 and grows it up by 36: the text goes up and right, the meta stays.
      place(m.bubble, { left: 100, top: 100, width: 480, height: 36 });
      place(m.text, { left: 112, top: 108, width: 396, height: 20 });
      place(m.meta, { left: 530, top: 112, width: 38, height: 16 });
      m.morph.capture({ anchor: "end" });
      place(m.bubble, { left: 160, top: 64, width: 420, height: 72 });
      place(m.text, { left: 172, top: 72, width: 396, height: 20 });
      m.morph.play();
      // One straight glide with the bubble's top-start corner: its padding kept all the way.
      const glides = animations.filter((a) => a.element === m.text);
      expect(glides).toHaveLength(1);
      expect(glides[0]?.keyframes[0]).toEqual({ transform: "translate(-60px, 36px)" });
      // The meta never moves; it fades out before the text reaches it and back once it has left.
      const dip = animations.find((a) => a.element === m.meta);
      expect(dip?.keyframes.map((k) => k.opacity)).toEqual([1, 0, 0, 1]);
      const [, gone, back] = (dip?.keyframes ?? []).map((k) => k.offset as number);
      expect(gone).toBeLessThan(0.35);
      expect(back).toBeGreaterThan(0.4);
      expect(
        animations.some((a) => a.element === m.meta && "transform" in (a.keyframes[0] ?? {})),
      ).toBe(false);
    } finally {
      restore();
    }
  });

  it("changes a meta's place across text by a cross-fade, never a glide over it", () => {
    const restore = inkFromBoxes();
    try {
      const m = message();
      const block = document.createElement("p");
      block.setAttribute("data-morph-item", "");
      block.textContent = "Посмотрела форму: поле пустое.";
      m.text.append(block);
      m.meta.textContent = "09:14";
      m.meta.setAttribute("data-message-meta", "");
      place(m.bubble, { left: 0, top: 0, width: 268, height: 64 });
      place(m.text, { left: 12, top: 8, width: 244, height: 48 });
      place(m.meta, { left: 214, top: 40, width: 34, height: 16 });
      m.morph.capture({ anchor: "start" });
      // The transcript opens under the player; the meta goes to the end of its last line.
      place(m.bubble, { left: 0, top: 0, width: 268, height: 152 });
      place(m.text, { left: 12, top: 8, width: 244, height: 136 });
      place(block, { left: 12, top: 64, width: 200, height: 60 });
      place(m.meta, { left: 214, top: 128, width: 34, height: 16 });
      m.morph.play();
      // No glide of the meta; it fades in where it goes, and a copy fades out where it was.
      expect(
        animations.some((a) => a.element === m.meta && "transform" in (a.keyframes[0] ?? {})),
      ).toBe(false);
      const into = animations.find((a) => a.element === m.meta);
      expect(into?.keyframes[1]).toMatchObject({ opacity: 0, offset: 0.6 });
      const copy = m.bubble.querySelector("[data-morph-meta]");
      expect(copy).toHaveTextContent("09:14");
      expect(copy).toHaveAttribute("aria-hidden", "true");
      expect(animations.find((a) => a.element === copy)?.keyframes[1]).toMatchObject({
        opacity: 0,
        offset: 0.4,
      });
    } finally {
      restore();
    }
  });

  it("is instant under reduced motion, the view still given way", () => {
    const s = inScroller(300);
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: true, media: query }));
    s.morph.capture({ anchor: "end" });
    s.grow(36);
    s.morph.play();
    expect(animations).toHaveLength(0);
    expect(s.scrollTop()).toBe(1036);
  });
});
