import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type ScrollRegion, useScrollRegion } from "@/hooks/useScrollRegion";
import { cssRule, cssValue, parseCss } from "@/test/css";

import { ScrollContainer, type ScrollContainerProps } from "./ScrollContainer";

const CSS = "src/components/scroll-container/ScrollContainer.module.css";
const value = (selector: string, prop: string, parents?: string[]) =>
  cssValue(cssRule(CSS, selector, parents), prop);

describe("ScrollContainer", () => {
  it("рендерит дочерний контент", () => {
    render(<ScrollContainer>scroll-me</ScrollContainer>);
    expect(screen.getByText("scroll-me")).toBeInTheDocument();
  });

  it("поддерживает as=main", () => {
    render(<ScrollContainer as="main">main</ScrollContainer>);
    expect(screen.getByRole("main")).toHaveTextContent("main");
  });

  it("forwards ref and native attributes", () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <ScrollContainer ref={ref} aria-label="Список" tabIndex={0} role="region">
        items
      </ScrollContainer>,
    );
    expect(ref.current).toBe(screen.getByRole("region", { name: "Список" }));
    expect(ref.current).toHaveAttribute("tabindex", "0");
  });

  /** jsdom has no layout: give the region a scroll size along both axes. */
  function size(node: HTMLElement, scroll: { w?: number; h?: number }, client = 100) {
    Object.defineProperty(node, "scrollHeight", { configurable: true, value: scroll.h ?? client });
    Object.defineProperty(node, "clientHeight", { configurable: true, value: client });
    Object.defineProperty(node, "scrollWidth", { configurable: true, value: scroll.w ?? client });
    Object.defineProperty(node, "clientWidth", { configurable: true, value: client });
  }

  it("fades by default and marks the hidden edges as the region scrolls (once per frame)", async () => {
    render(<ScrollContainer data-testid="scroll">items</ScrollContainer>);
    const node = screen.getByTestId("scroll");
    expect(node).toHaveAttribute("data-edges", "fade");
    expect(node).not.toHaveAttribute("data-overflow-top");

    size(node, { h: 300 });
    node.scrollTop = 0;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-bottom", "true"));
    expect(node).not.toHaveAttribute("data-overflow-top");

    node.scrollTop = 100;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-top", "true"));
    expect(node).toHaveAttribute("data-overflow-bottom", "true");

    node.scrollTop = 200;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).not.toHaveAttribute("data-overflow-bottom"));
    expect(node).toHaveAttribute("data-overflow-top", "true");
    // A vertical region never marks the inline edges.
    expect(node).not.toHaveAttribute("data-overflow-start");
    expect(node).not.toHaveAttribute("data-overflow-end");
  });

  it("writes the fade depth capped at the deepest fade, and only while it changes", async () => {
    render(<ScrollContainer data-testid="scroll">items</ScrollContainer>);
    const node = screen.getByTestId("scroll");
    size(node, { h: 1000 });
    const write = vi.spyOn(node.style, "setProperty");
    node.scrollTop = 10;
    fireEvent.scroll(node);
    await waitFor(() => expect(node.style.getPropertyValue("--edge-top")).toBe("10px"));
    expect(node.style.getPropertyValue("--edge-bottom")).toBe("32px");

    // Far from both edges: the depths stay at the cap, so a scroll frame writes nothing.
    node.scrollTop = 400;
    fireEvent.scroll(node);
    await waitFor(() => expect(node.style.getPropertyValue("--edge-top")).toBe("32px"));
    write.mockClear();
    node.scrollTop = 500;
    fireEvent.scroll(node);
    await act(() => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))));
    expect(write).not.toHaveBeenCalled();
  });

  it("CSS: the fade depth is not inherited, so a scroll restyles the region, not its content", () => {
    const inherits = new Map<string, string | undefined>();
    parseCss(CSS).walkAtRules("property", (rule) => {
      const decl = rule.nodes?.find((node) => node.type === "decl" && node.prop === "inherits");
      inherits.set(rule.params, decl?.type === "decl" ? decl.value : undefined);
    });
    for (const edge of ["top", "bottom", "start", "end"]) {
      for (const name of [`--edge-${edge}`, `--fade-${edge}`]) {
        expect(inherits.get(name)).toBe("false");
      }
    }
  });

  it("axis=both marks the edges of both axes", async () => {
    render(
      <ScrollContainer axis="both" data-testid="scroll">
        items
      </ScrollContainer>,
    );
    const node = screen.getByTestId("scroll");
    size(node, { w: 300, h: 300 });
    node.scrollTop = 100;
    node.scrollLeft = 100;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-start", "true"));
    for (const edge of ["top", "bottom", "start", "end"]) {
      expect(node).toHaveAttribute(`data-overflow-${edge}`, "true");
    }
  });

  it("reads the RTL scroll position (negative scrollLeft) as distance from the start", async () => {
    render(
      <div dir="rtl">
        <ScrollContainer axis="horizontal" data-testid="scroll">
          items
        </ScrollContainer>
      </div>,
    );
    const node = screen.getByTestId("scroll");
    size(node, { w: 300 });
    node.scrollLeft = -200;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-start", "true"));
    expect(node).not.toHaveAttribute("data-overflow-end");
  });

  it("re-measures when children are added later", async () => {
    const ROWS = ["Первая", "Вторая", "Третья"];
    function Growing({ count }: { count: number }) {
      return (
        <ScrollContainer data-testid="scroll">
          {ROWS.slice(0, count).map((row) => (
            <p key={row}>{row}</p>
          ))}
        </ScrollContainer>
      );
    }
    const { rerender } = render(<Growing count={1} />);
    const node = screen.getByTestId("scroll");
    expect(node).not.toHaveAttribute("data-overflow-bottom");
    size(node, { h: 300 });
    rerender(<Growing count={3} />);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-bottom", "true"));
  });

  it("edges=shadow is drawn by CSS alone and edges=none draws nothing: neither measures", async () => {
    const { rerender } = render(
      <ScrollContainer edges="shadow" data-testid="scroll">
        items
      </ScrollContainer>,
    );
    const node = screen.getByTestId("scroll");
    expect(node).toHaveAttribute("data-edges", "shadow");
    size(node, { h: 300 });
    node.scrollTop = 100;
    fireEvent.scroll(node);
    await act(() => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))));
    expect(node).not.toHaveAttribute("data-overflow-top");
    expect(node.style.getPropertyValue("--edge-top")).toBe("");
    rerender(
      <ScrollContainer edges="none" data-testid="scroll">
        items
      </ScrollContainer>,
    );
    expect(node).not.toHaveAttribute("data-edges");
    // The shadow: covers that scroll with the content over shadows fixed to the view.
    expect(value('.vertical[data-edges="shadow"]', "background-attachment")).toBe(
      "local, local, scroll, scroll",
    );
  });

  it("scrollbar=hidden hides the bar; thin is the default", () => {
    const { rerender } = render(<ScrollContainer data-testid="scroll">items</ScrollContainer>);
    const node = screen.getByTestId("scroll");
    const thin = node.className;
    rerender(
      <ScrollContainer scrollbar="hidden" data-testid="scroll">
        items
      </ScrollContainer>,
    );
    expect(node.className).not.toBe(thin);
    expect(value(".scrollbarHidden", "scrollbar-width")).toBe("none");
    expect(value(".root", "scrollbar-width")).toBe("thin");
  });

  it("lock: the region keeps its place and takes no scrolling", () => {
    const { rerender } = render(
      <ScrollContainer lock data-testid="scroll">
        items
      </ScrollContainer>,
    );
    const node = screen.getByTestId("scroll");
    expect(node).toHaveAttribute("data-lock", "true");
    expect(value(".root[data-lock]", "overflow")).toBe("hidden");
    rerender(<ScrollContainer data-testid="scroll">items</ScrollContainer>);
    expect(node).not.toHaveAttribute("data-lock");
  });

  it("by default the scroll chains on up and down and holds sideways", () => {
    render(<ScrollContainer data-testid="scroll">items</ScrollContainer>);
    const node = screen.getByTestId("scroll");
    expect(node.className).not.toMatch(/overscroll/);
    expect(value(".root", "--overscroll-block")).toBe("auto");
    expect(value(".root", "--overscroll-inline")).toBe("none");
  });

  it("contain and none hold both axes, set only along the region's own axes", () => {
    const { rerender } = render(
      <ScrollContainer overscrollBehavior="contain" data-testid="scroll">
        items
      </ScrollContainer>,
    );
    expect(screen.getByTestId("scroll").className).toMatch(/overscrollContain/);
    rerender(
      <ScrollContainer overscrollBehavior="none" data-testid="scroll">
        items
      </ScrollContainer>,
    );
    expect(screen.getByTestId("scroll").className).toMatch(/overscrollNone/);
    expect(value(".overscrollContain", "--overscroll-block")).toBe("contain");
    expect(value(".overscrollContain", "--overscroll-inline")).toBe("contain");
    expect(value(".overscrollNone", "--overscroll-block")).toBe("none");
    expect(value(".vertical", "overscroll-behavior-block")).toBe("var(--overscroll-block)");
    const sets = (selector: string, prop: string) =>
      cssRule(CSS, selector).decls.some((decl) => decl.prop === prop);
    expect(sets(".vertical", "overscroll-behavior-inline")).toBe(false);
    expect(value(".horizontal", "overscroll-behavior-inline")).toBe("var(--overscroll-inline)");
    expect(sets(".horizontal", "overscroll-behavior-block")).toBe(false);
  });

  it("snap: proximity or mandatory snapping along the axis, children rest on their start", () => {
    const { rerender } = render(
      <ScrollContainer axis="horizontal" snap data-testid="scroll">
        items
      </ScrollContainer>,
    );
    const node = screen.getByTestId("scroll");
    expect(node).toHaveAttribute("data-snap", "proximity");
    rerender(
      <ScrollContainer axis="horizontal" snap="mandatory" data-testid="scroll">
        items
      </ScrollContainer>,
    );
    expect(node).toHaveAttribute("data-snap", "mandatory");
    rerender(<ScrollContainer data-testid="scroll">items</ScrollContainer>);
    expect(node).not.toHaveAttribute("data-snap");
    // The children are the rest points; the browser never snaps (no `scroll-snap-type`).
    expect(value(".root[data-snap] > *", "scroll-snap-align")).toBe("start");
    expect(parseCss(CSS)).not.toContain("scroll-snap-type");
  });

  it("a named region is a region landmark; its own role wins, an unnamed one has none", () => {
    const { rerender } = render(<ScrollContainer aria-label="Журнал">items</ScrollContainer>);
    expect(screen.getByRole("region", { name: "Журнал" })).toBeInTheDocument();
    rerender(
      <ScrollContainer aria-label="Журнал" role="log">
        items
      </ScrollContainer>,
    );
    expect(screen.getByRole("log", { name: "Журнал" })).toBeInTheDocument();
    rerender(<ScrollContainer data-testid="plain">items</ScrollContainer>);
    expect(screen.getByTestId("plain")).not.toHaveAttribute("role");
  });

  it("the fade depth is one public hook: the mask, the scroll padding and the measured depth", () => {
    expect(value(":where(.root)", "--scroll-fade-depth")).toBe("var(--prime-space-8)");
    expect(value('.horizontal[data-edges="fade"]', "scroll-padding-inline")).toBe(
      "var(--scroll-fade-depth)",
    );
    expect(value('.root[data-edges="fade"][data-overflow-end="true"]', "--fade-end")).toBe(
      "min(var(--scroll-fade-depth), var(--edge-end, var(--scroll-fade-depth)))",
    );
  });

  it("keyboard: a region with tabIndex takes focus (native arrow / Page / Home / End scrolling) with an inset ring", () => {
    render(
      <ScrollContainer tabIndex={0} aria-label="Журнал" role="region">
        items
      </ScrollContainer>,
    );
    const region = screen.getByRole("region", { name: "Журнал" });
    region.focus();
    expect(region).toHaveFocus();
    expect(value(".root:focus-visible", "outline-offset")).toBe("var(--prime-focus-offset-inset)");
  });

  describe("wheel on a sideways strip", () => {
    /** Event time: 10ms apart within a test (one gesture), far apart between tests. */
    let clock = 0;
    /** The glide's frames, run on demand. */
    let frames: FrameRequestCallback[] = [];
    beforeEach(() => {
      clock += 10_000;
      frames = [];
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
        frames.push(callback);
        return frames.length;
      });
      vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {
        frames = [];
      });
    });
    afterEach(() => vi.restoreAllMocks());

    /** Runs the glide to its end. */
    function settle() {
      for (let i = 0; i < 100 && frames.length > 0; i++) {
        const run = frames;
        frames = [];
        for (const callback of run) callback(performance.now() + 60_000);
      }
    }

    /** A mouse notch (`wheelDeltaY` in whole notches) or a trackpad (−3 × its fine `deltaY`). */
    function wheel(
      node: HTMLElement,
      init: WheelEventInit & { trackpad?: boolean; timeStamp?: number },
    ) {
      const event = new WheelEvent("wheel", { bubbles: true, cancelable: true, ...init });
      clock += 10;
      Object.defineProperty(event, "timeStamp", { value: init.timeStamp ?? clock });
      const deltaY = init.deltaY ?? 0;
      Object.defineProperty(event, "wheelDeltaY", {
        value: init.trackpad ? -3 * deltaY : -Math.sign(deltaY) * 120,
      });
      node.dispatchEvent(event);
      return event;
    }

    function strip(props: Partial<ScrollContainerProps> = {}) {
      render(
        <ScrollContainer axis="horizontal" data-testid="scroll" {...props}>
          items
        </ScrollContainer>,
      );
      const node = screen.getByTestId("scroll");
      size(node, { w: 500 });
      return node;
    }

    it("a mouse wheel glides the strip sideways on the kit's own frames", () => {
      const node = strip();
      expect(wheel(node, { deltaY: 100 }).defaultPrevented).toBe(true);
      expect(frames.length).toBe(1);
      settle();
      expect(node.scrollLeft).toBe(100);
    });

    it("a trackpad, a sideways wheel and Shift stay native", () => {
      const node = strip();
      expect(wheel(node, { deltaY: 8, trackpad: true }).defaultPrevented).toBe(false);
      expect(wheel(node, { deltaX: 40, deltaY: 5 }).defaultPrevented).toBe(false);
      expect(wheel(node, { deltaY: 100, shiftKey: true }).defaultPrevented).toBe(false);
      expect(node.scrollLeft).toBe(0);
    });

    it("a trackpad gesture is left to the browser until it ends, even a notch-sized event", () => {
      const node = strip();
      wheel(node, { deltaY: 8, trackpad: true });
      expect(wheel(node, { deltaY: 100 }).defaultPrevented).toBe(false);
    });

    it("the person takes over a glide at once: a press or a trackpad scroll stops it", () => {
      const node = strip();
      wheel(node, { deltaY: 100 });
      expect(frames.length).toBe(1);
      fireEvent.pointerDown(node);
      expect(frames.length).toBe(0);
      fireEvent.pointerUp(window);
      clock += 1000;
      wheel(node, { deltaY: 100 });
      expect(frames.length).toBe(1);
      wheel(node, { deltaY: 8, trackpad: true });
      expect(frames.length).toBe(0);
    });

    it("at the edge the wheel chains to the page, and a vertical region is left alone", () => {
      const node = strip();
      expect(wheel(node, { deltaY: -100 }).defaultPrevented).toBe(false);
      cleanup();
      render(<ScrollContainer data-testid="scroll">items</ScrollContainer>);
      const vertical = screen.getByTestId("scroll");
      expect(wheel(vertical, { deltaY: 100 }).defaultPrevented).toBe(false);
    });

    it("a page scroll passing over the strip keeps scrolling the page", () => {
      const node = strip();
      wheel(document.body, { deltaY: 100 });
      expect(wheel(node, { deltaY: 100 }).defaultPrevented).toBe(false);
    });

    it("a locked strip ignores the wheel", () => {
      const node = strip({ lock: true });
      expect(wheel(node, { deltaY: 100 }).defaultPrevented).toBe(false);
    });

    describe("on a strip that snaps", () => {
      /** Four 300-wide snap areas at 0 · 300 · 600 · 900 in a 400-wide view: rest points 0 · 300 · 600 · 800. */
      function snappingStrip(snap: "mandatory" | true = "mandatory") {
        render(
          <ScrollContainer axis="horizontal" snap={snap} edges="none" data-testid="scroll">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} data-testid={`area-${index}`} data-snap-area="" />
            ))}
          </ScrollContainer>,
        );
        const node = screen.getByTestId("scroll");
        size(node, { w: 1200 }, 400);
        node.getBoundingClientRect = () => new DOMRect(0, 0, 400, 100);
        for (const index of [0, 1, 2, 3]) {
          screen.getByTestId(`area-${index}`).getBoundingClientRect = () =>
            new DOMRect(index * 300 - node.scrollLeft, 0, 300, 100);
        }
        // jsdom knows no `scroll-snap-align`: the areas report it here.
        const computed = window.getComputedStyle.bind(window);
        vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
          const style = computed(element, pseudo);
          if (!(element as HTMLElement).hasAttribute("data-snap-area")) return style;
          return new Proxy(style, {
            get: (target, key) =>
              key === "scrollSnapAlign" ? "start" : Reflect.get(target, key, target),
          });
        });
        return node;
      }

      /** The person scrolls natively to `at`, then lets go: the scroll ends a moment later. */
      function scrollTo(node: HTMLElement, at: number) {
        node.scrollLeft = at;
        fireEvent.scroll(node);
        vi.advanceTimersByTime(200);
        settle();
      }

      beforeEach(() => {
        vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
      });
      afterEach(() => {
        vi.useRealTimers();
      });

      it("once a native scroll ends, the strip glides to the nearest rest point", () => {
        const node = snappingStrip();
        scrollTo(node, 420);
        expect(node.scrollLeft).toBe(300);
        scrollTo(node, 470);
        expect(node.scrollLeft).toBe(600);
      });

      it("nothing settles while the scroll goes on or the person holds the strip", () => {
        const node = snappingStrip();
        node.scrollLeft = 420;
        fireEvent.scroll(node);
        vi.advanceTimersByTime(60);
        node.scrollLeft = 520;
        fireEvent.scroll(node);
        vi.advanceTimersByTime(60);
        expect(frames.length, "while scrolling").toBe(0);
        fireEvent.pointerDown(node);
        vi.advanceTimersByTime(500);
        expect(frames.length, "while held").toBe(0);
        fireEvent.pointerUp(window);
        vi.advanceTimersByTime(200);
        settle();
        expect(node.scrollLeft).toBe(600);
      });

      it("the person takes over a settling glide at once", () => {
        const node = snappingStrip();
        node.scrollLeft = 420;
        fireEvent.scroll(node);
        vi.advanceTimersByTime(200);
        expect(frames.length).toBe(1);
        wheel(node, { deltaX: 30 });
        expect(frames.length).toBe(0);
        expect(node.scrollLeft).toBe(420);
      });

      it("a trackpad's momentum tail that stops a glide is followed by a settle once it is quiet", () => {
        const node = snappingStrip();
        node.scrollLeft = 420;
        fireEvent.scroll(node);
        vi.advanceTimersByTime(200);
        expect(frames.length).toBe(1);
        // A late momentum event that moves nothing: the glide stops, no scroll follows.
        wheel(node, { deltaX: 0.4, trackpad: true });
        expect(frames.length).toBe(0);
        vi.advanceTimersByTime(200);
        settle();
        expect(node.scrollLeft).toBe(300);
      });

      it("`snap` (proximity) settles only near a rest point", () => {
        const node = snappingStrip(true);
        scrollTo(node, 450);
        expect(node.scrollLeft).toBe(450);
        scrollTo(node, 560);
        expect(node.scrollLeft).toBe(600);
      });

      it("every notch of a mouse wheel steps to the next rest point", () => {
        const node = snappingStrip();
        wheel(node, { deltaY: 100 });
        settle();
        expect(node.scrollLeft).toBe(300);
        wheel(node, { deltaY: 100 });
        wheel(node, { deltaY: 100 });
        settle();
        expect(node.scrollLeft).toBe(800);
      });

      it("a turn the other way goes back at once, from where the glide is heading", () => {
        const node = snappingStrip();
        wheel(node, { deltaY: 100 });
        wheel(node, { deltaY: 100 });
        // The glide is on its way to 600: the step back counts from there.
        wheel(node, { deltaY: -100 });
        settle();
        expect(node.scrollLeft).toBe(300);
      });

      it("past the last rest point the wheel chains to the page", () => {
        const node = snappingStrip();
        expect(wheel(node, { deltaY: -100 }).defaultPrevented).toBe(false);
      });

      it("a drag of a list inside (Dnd carrying) never settles", () => {
        const node = snappingStrip();
        node.setAttribute("data-dnd-carrying", "");
        const carrying = document.createElement("span");
        carrying.setAttribute("data-dnd-carrying", "");
        node.append(carrying);
        scrollTo(node, 420);
        expect(node.scrollLeft).toBe(420);
      });
    });
  });
});

describe("ScrollContainer anchor and edges", () => {
  /** jsdom has no layout: the region's sizes and its children's offsets come from here. */
  const metrics = { scrollHeight: 1000, clientHeight: 200, offsets: new Map<string, number>() };

  beforeEach(() => {
    metrics.scrollHeight = 1000;
    metrics.clientHeight = 200;
    metrics.offsets.clear();
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.testid === "region" ? metrics.scrollHeight : 0;
    });
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.testid === "region" ? metrics.clientHeight : 0;
    });
    // The region sits at 0; the list inside it is as long as the content and scrolls; a message
    // sits at its offset in the list, 40 high.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const box = (top: number, height: number) =>
        ({ top, bottom: top + height, left: 0, right: 100, width: 100, height }) as DOMRect;
      if (this.dataset.testid === "region") return box(0, metrics.clientHeight);
      const region = this.closest<HTMLElement>("[data-testid='region']");
      if (!region) return box(0, 0);
      const id = this.dataset.id;
      if (!id) return box(-region.scrollTop, metrics.scrollHeight);
      return box((metrics.offsets.get(id) ?? 0) - region.scrollTop, 40);
    });
  });

  afterEach(() => vi.restoreAllMocks());

  function Chat({ messages, ...props }: { messages: string[] } & ScrollContainerProps) {
    return (
      <ScrollContainer data-testid="region" {...props}>
        <ul>
          {messages.map((text) => (
            <li key={text} data-id={text}>
              {text}
            </li>
          ))}
        </ul>
      </ScrollContainer>
    );
  }

  it('anchor="end" starts at the end and stays there while messages arrive', async () => {
    const { rerender } = render(<Chat anchor="end" messages={["Привет"]} />);
    const region = screen.getByTestId("region");
    expect(region.scrollTop).toBe(800);
    expect(region).toHaveAttribute("data-anchor", "end");
    metrics.scrollHeight = 1240;
    rerender(<Chat anchor="end" messages={["Привет", "Счёт отправлен"]} />);
    await waitFor(() => expect(region.scrollTop).toBe(1040));
  });

  it("a late scroll event of its own correction, while content still grows, keeps the pin", async () => {
    const { rerender } = render(<Chat anchor="end" messages={["Привет"]} />);
    const region = screen.getByTestId("region");
    expect(region.scrollTop).toBe(800);
    // The correction's scroll event lands after an animated height grew by 6 px more.
    metrics.scrollHeight = 1006;
    fireEvent.scroll(region);
    metrics.scrollHeight = 1246;
    rerender(<Chat anchor="end" messages={["Привет", "Печатает"]} />);
    await waitFor(() => expect(region.scrollTop).toBe(1046));
    // The reader scrolls back: now the view stays.
    region.scrollTop = 900;
    fireEvent.scroll(region);
    metrics.scrollHeight = 1300;
    rerender(<Chat anchor="end" messages={["Привет", "Печатает", "Ответ"]} />);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(region.scrollTop).toBe(900);
  });

  it("scrolled away from the end, a new message keeps the view where it is", async () => {
    metrics.offsets.set("Первое", 0).set("Второе", 300);
    const { rerender } = render(<Chat anchor="end" messages={["Первое", "Второе"]} />);
    const region = screen.getByTestId("region");
    region.scrollTop = 300;
    fireEvent.scroll(region);
    metrics.scrollHeight = 1240;
    rerender(<Chat anchor="end" messages={["Первое", "Второе", "Третье"]} />);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(region.scrollTop).toBe(300);
  });

  it("older messages prepended above keep the visible message in place", async () => {
    metrics.offsets.set("Сегодня", 0);
    const onReachStart = vi.fn();
    const { rerender } = render(
      <Chat anchor="end" onReachStart={onReachStart} messages={["Сегодня"]} />,
    );
    const region = screen.getByTestId("region");
    region.scrollTop = 0;
    fireEvent.scroll(region);
    // Two older messages land above: the visible one moves 600 down in the content.
    metrics.offsets.set("Позавчера", 0).set("Вчера", 300).set("Сегодня", 600);
    metrics.scrollHeight = 1600;
    rerender(
      <Chat
        anchor="end"
        onReachStart={onReachStart}
        messages={["Позавчера", "Вчера", "Сегодня"]}
      />,
    );
    await waitFor(() => expect(region.scrollTop).toBe(600));
  });

  it("onReachStart fires once near the start, waits for its promise, then asks again", async () => {
    let resolve = () => {};
    const onReachStart = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    render(<Chat messages={["Сегодня"]} onReachStart={onReachStart} />);
    const region = screen.getByTestId("region");
    // The region opens at its start: it asks at once.
    expect(onReachStart).toHaveBeenCalledTimes(1);
    expect(region).toHaveAttribute("aria-busy", "true");
    region.scrollTop = 30;
    fireEvent.scroll(region);
    expect(onReachStart).toHaveBeenCalledTimes(1);
    // Nothing came and the view never left the zone: no repeat.
    await act(async () => resolve());
    expect(region).not.toHaveAttribute("aria-busy");
    expect(onReachStart).toHaveBeenCalledTimes(1);

    region.scrollTop = 400;
    fireEvent.scroll(region);
    region.scrollTop = 60;
    fireEvent.scroll(region);
    expect(onReachStart).toHaveBeenCalledTimes(2);
    metrics.scrollHeight = 1400;
    await act(async () => resolve());
    // The content grew and the view is still near the start: the next page is asked for.
    expect(onReachStart).toHaveBeenCalledTimes(3);
  });

  it("onReachEnd fires near the end and again only after leaving the zone", () => {
    const onReachEnd = vi.fn();
    render(<Chat messages={["Заказ № 1040"]} onReachEnd={onReachEnd} />);
    const region = screen.getByTestId("region");
    expect(onReachEnd).not.toHaveBeenCalled();
    region.scrollTop = 750;
    fireEvent.scroll(region);
    region.scrollTop = 790;
    fireEvent.scroll(region);
    expect(onReachEnd).toHaveBeenCalledTimes(1);
    region.scrollTop = 200;
    fireEvent.scroll(region);
    region.scrollTop = 800;
    fireEvent.scroll(region);
    expect(onReachEnd).toHaveBeenCalledTimes(2);
  });

  it("CSS: the kit's own anchoring turns the browser's off", () => {
    expect(value(".root[data-anchor]", "overflow-anchor")).toBe("none");
  });

  it("a date stuck to the top is never the anchor: the row under it is", async () => {
    metrics.offsets.set("Вчера", 0).set("Сегодня", 300).set("Ответ", 340);
    const { rerender } = render(
      <ScrollContainer data-testid="region" anchor="end">
        <ul>
          <li data-id="Вчера">Вчера</li>
          <li data-id="Сегодня" data-scroll-skip="">
            Сегодня
          </li>
          <li data-id="Ответ">Ответ</li>
        </ul>
      </ScrollContainer>,
    );
    const region = screen.getByTestId("region");
    region.scrollTop = 320;
    fireEvent.scroll(region);
    // Something above grows by 100: the row under the edge moves down, the stuck date does not.
    metrics.offsets.set("Сегодня", 320).set("Ответ", 440);
    metrics.scrollHeight = 1100;
    rerender(
      <ScrollContainer data-testid="region" anchor="end">
        <ul>
          <li data-id="Вчера">Вчера, длиннее</li>
          <li data-id="Сегодня" data-scroll-skip="">
            Сегодня
          </li>
          <li data-id="Ответ">Ответ</li>
        </ul>
      </ScrollContainer>,
    );
    await waitFor(() => expect(region.scrollTop).toBe(420));
  });
  /** Hands the region to the test (what a chat list inside the region gets). */
  function Probe({ into }: { into: { current: ScrollRegion | null } }) {
    into.current = useScrollRegion();
    return null;
  }

  it("a glide to the end follows the end as it grows on the way, and lands on it", async () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
    try {
      const region = { current: null as ScrollRegion | null };
      const { rerender } = render(
        <ScrollContainer data-testid="region" anchor="end">
          <ul>
            <li data-id="Первое">Первое</li>
          </ul>
          <Probe into={region} />
        </ScrollContainer>,
      );
      const node = screen.getByTestId("region");
      node.scrollTop = 0;
      fireEvent.scroll(node);
      act(() => region.current?.scrollToEnd("smooth"));
      // Rows render on the way and the end moves further.
      metrics.scrollHeight = 1600;
      rerender(
        <ScrollContainer data-testid="region" anchor="end">
          <ul>
            <li data-id="Первое">Первое</li>
            <li data-id="Второе">Второе</li>
          </ul>
          <Probe into={region} />
        </ScrollContainer>,
      );
      // The glide runs on real frames: a slow runner needs longer than a laptop.
      await waitFor(() => expect(node.scrollTop).toBe(1400), { timeout: 5000 });
      expect(region.current?.atEnd()).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("hold: a change in place at the end grows past the edge, the view stays", async () => {
    const region = { current: null as ScrollRegion | null };
    // The clock of the change, read on the region.
    const clock = { "--prime-message-morph-duration": "10s" } as React.CSSProperties;
    const { rerender } = render(
      <ScrollContainer data-testid="region" anchor="end" style={clock}>
        <ul>
          <li data-id="Сообщение">Сообщение</li>
        </ul>
        <Probe into={region} />
      </ScrollContainer>,
    );
    const node = screen.getByTestId("region");
    expect(node.scrollTop).toBe(800);
    act(() => region.current?.hold("--prime-message-morph-duration"));
    expect(region.current?.atEnd()).toBe(false);
    // The last message opens its transcript: the content grows below the view.
    metrics.scrollHeight = 1100;
    rerender(
      <ScrollContainer data-testid="region" anchor="end" style={clock}>
        <ul>
          <li data-id="Сообщение">Сообщение с расшифровкой</li>
        </ul>
        <Probe into={region} />
      </ScrollContainer>,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(node.scrollTop).toBe(800);
  });
});
