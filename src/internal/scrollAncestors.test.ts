import { getScrollContainers, scrollAxes, scrollableAncestors } from "./scrollAncestors";

function box(overflowX: string, overflowY: string, parent: Element = document.body) {
  const node = document.createElement("div");
  node.style.overflowX = overflowX;
  node.style.overflowY = overflowY;
  parent.append(node);
  return node;
}

describe("scrollAncestors", () => {
  afterEach(() => document.body.replaceChildren());

  it("reads the axes a person can scroll; hidden and clip are not scrolling", () => {
    expect(scrollAxes(box("auto", "hidden"))).toEqual({ x: true, y: false });
    expect(scrollAxes(box("clip", "scroll"))).toEqual({ x: false, y: true });
  });

  it("walks from the element up, innermost first, skipping boxes that do not scroll", () => {
    const outer = box("hidden", "auto");
    const locked = box("hidden", "hidden", outer);
    const inner = box("auto", "visible", locked);
    const leaf = box("visible", "visible", inner);
    expect(scrollableAncestors(leaf)).toEqual([inner, outer]);
    expect(scrollableAncestors(inner)).toEqual([inner, outer]);
    expect(scrollableAncestors(null)).toEqual([]);
  });

  it("a fixed layer listens on the window, the anchor's scrolling ancestors and the viewport", () => {
    const outer = box("hidden", "auto");
    const anchor = box("auto", "auto", outer);
    const targets = getScrollContainers(anchor);
    expect(targets[0]).toBe(window);
    // The anchor itself is not among them: it scrolls its own content, not itself.
    expect(targets).not.toContain(anchor);
    expect(targets).toContain(outer);
  });
});
