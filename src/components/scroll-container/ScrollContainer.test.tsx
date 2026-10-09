import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollContainer, type ScrollContainerProps } from "./ScrollContainer";
import { type ScrollRegion, useScrollRegion } from "./useScrollEdges";

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
    const css = readFileSync(join(__dirname, "ScrollContainer.module.css"), "utf8");
    for (const edge of ["top", "bottom", "start", "end"]) {
      for (const name of [`--edge-${edge}`, `--fade-${edge}`]) {
        expect(css).toMatch(new RegExp(`@property ${name} \\{[^}]*inherits: false`));
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
    const css = readFileSync(join(__dirname, "ScrollContainer.module.css"), "utf8");
    // The shadow: covers that scroll with the content over shadows fixed to the view.
    expect(css).toMatch(
      /\.vertical\[data-edges="shadow"\] \{[^}]*background-attachment: local, local, scroll, scroll/,
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
    const css = readFileSync(join(__dirname, "ScrollContainer.module.css"), "utf8");
    expect(css).toMatch(/\.scrollbarHidden \{[^}]*scrollbar-width: none/);
    expect(css).toMatch(/\.root \{[^}]*scrollbar-width: thin/);
  });

  it("lock: the region keeps its place and takes no scrolling", () => {
    const { rerender } = render(
      <ScrollContainer lock data-testid="scroll">
        items
      </ScrollContainer>,
    );
    const node = screen.getByTestId("scroll");
    expect(node).toHaveAttribute("data-lock", "true");
    const css = readFileSync(join(__dirname, "ScrollContainer.module.css"), "utf8");
    expect(css).toMatch(/\.root\[data-lock\] \{[^}]*overflow: hidden/);
    rerender(<ScrollContainer data-testid="scroll">items</ScrollContainer>);
    expect(node).not.toHaveAttribute("data-lock");
  });

  it("snap: proximity snapping along the axis, children rest on their start", () => {
    render(
      <ScrollContainer axis="horizontal" snap data-testid="scroll">
        items
      </ScrollContainer>,
    );
    expect(screen.getByTestId("scroll")).toHaveAttribute("data-snap", "true");
    const css = readFileSync(join(__dirname, "ScrollContainer.module.css"), "utf8");
    expect(css).toMatch(/\.horizontal\[data-snap\] \{[^}]*scroll-snap-type: x proximity/);
    expect(css).toMatch(/\.root\[data-snap\] > \* \{[^}]*scroll-snap-align: start/);
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
    const css = readFileSync(join(__dirname, "ScrollContainer.module.css"), "utf8");
    expect(css).toMatch(
      /\.root:focus-visible \{[^}]*outline-offset: var\(--prime-focus-offset-inset\)/,
    );
  });

  describe("wheel on a sideways strip", () => {
    function wheel(node: HTMLElement, init: WheelEventInit & { timeStamp?: number }) {
      const event = new WheelEvent("wheel", { bubbles: true, cancelable: true, ...init });
      node.dispatchEvent(event);
      return event;
    }

    it("a vertical wheel scrolls the strip sideways; a sideways wheel stays native", () => {
      render(
        <ScrollContainer axis="horizontal" data-testid="scroll">
          items
        </ScrollContainer>,
      );
      const node = screen.getByTestId("scroll");
      size(node, { w: 500 });
      const scrollTo = vi.fn();
      node.scrollTo = scrollTo as typeof node.scrollTo;
      const down = wheel(node, { deltaY: 100 });
      expect(down.defaultPrevented).toBe(true);
      expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ left: 100 }));
      const sideways = wheel(node, { deltaX: 40, deltaY: 5 });
      expect(sideways.defaultPrevented).toBe(false);
    });

    it("at the edge the wheel chains to the page, and a vertical region is left alone", () => {
      const { rerender } = render(
        <ScrollContainer axis="horizontal" data-testid="scroll">
          items
        </ScrollContainer>,
      );
      const node = screen.getByTestId("scroll");
      size(node, { w: 500 });
      node.scrollTo = vi.fn() as typeof node.scrollTo;
      expect(wheel(node, { deltaY: -100 }).defaultPrevented).toBe(false);
      rerender(<ScrollContainer data-testid="scroll">items</ScrollContainer>);
      expect(wheel(node, { deltaY: 100 }).defaultPrevented).toBe(false);
    });

    it("a page scroll passing over the strip keeps scrolling the page", () => {
      render(
        <ScrollContainer axis="horizontal" data-testid="scroll">
          items
        </ScrollContainer>,
      );
      const node = screen.getByTestId("scroll");
      size(node, { w: 500 });
      node.scrollTo = vi.fn() as typeof node.scrollTo;
      wheel(document.body, { deltaY: 100 });
      expect(wheel(node, { deltaY: 100 }).defaultPrevented).toBe(false);
    });

    it("a locked strip ignores the wheel", () => {
      render(
        <ScrollContainer axis="horizontal" lock data-testid="scroll">
          items
        </ScrollContainer>,
      );
      const node = screen.getByTestId("scroll");
      size(node, { w: 500 });
      expect(wheel(node, { deltaY: 100 }).defaultPrevented).toBe(false);
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
    const css = readFileSync(join(__dirname, "ScrollContainer.module.css"), "utf8");
    expect(css).toMatch(/\.root\[data-anchor\] \{\s*overflow-anchor: none;/);
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
      await waitFor(() => expect(node.scrollTop).toBe(1400), { timeout: 2000 });
      expect(region.current?.atEnd()).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("hold: a change in place at the end grows past the edge, the view stays", async () => {
    const region = { current: null as ScrollRegion | null };
    const { rerender } = render(
      <ScrollContainer data-testid="region" anchor="end">
        <ul>
          <li data-id="Сообщение">Сообщение</li>
        </ul>
        <Probe into={region} />
      </ScrollContainer>,
    );
    const node = screen.getByTestId("region");
    expect(node.scrollTop).toBe(800);
    act(() => region.current?.hold(10_000));
    expect(region.current?.atEnd()).toBe(false);
    // The last message opens its transcript: the content grows below the view.
    metrics.scrollHeight = 1100;
    rerender(
      <ScrollContainer data-testid="region" anchor="end">
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
