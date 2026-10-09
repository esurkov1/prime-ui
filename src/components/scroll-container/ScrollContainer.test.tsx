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

  it("marks the hidden edges while fade is on (measured once per frame)", async () => {
    render(
      <ScrollContainer fade data-testid="scroll">
        items
      </ScrollContainer>,
    );
    const node = screen.getByTestId("scroll");
    expect(node).toHaveAttribute("data-fade", "vertical");
    expect(node).not.toHaveAttribute("data-overflow-start");

    // jsdom has no layout: give the region a scroll size, then scroll to the middle.
    Object.defineProperty(node, "scrollHeight", { configurable: true, value: 300 });
    Object.defineProperty(node, "clientHeight", { configurable: true, value: 100 });
    node.scrollTop = 0;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-end", "true"));
    expect(node).not.toHaveAttribute("data-overflow-start");

    node.scrollTop = 100;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-start", "true"));
    expect(node).toHaveAttribute("data-overflow-end", "true");

    node.scrollTop = 200;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).not.toHaveAttribute("data-overflow-end"));
    expect(node).toHaveAttribute("data-overflow-start", "true");
    // The fade's depth: how far the hidden content reaches on each side.
    expect(node.style.getPropertyValue("--edge-start")).toBe("200px");
    expect(node.style.getPropertyValue("--edge-end")).toBe("0px");
  });

  it("CSS: the fade depth is not inherited, so a scroll restyles the region, not its content", () => {
    const css = readFileSync(join(__dirname, "ScrollContainer.module.css"), "utf8");
    for (const name of ["--edge-start", "--edge-end", "--fade-start", "--fade-end"]) {
      expect(css).toMatch(new RegExp(`@property ${name} \\{[^}]*inherits: false`));
    }
  });

  it("reads the RTL scroll position (negative scrollLeft) as distance from the start", async () => {
    render(
      <div dir="rtl">
        <ScrollContainer axis="horizontal" fade data-testid="scroll">
          items
        </ScrollContainer>
      </div>,
    );
    const node = screen.getByTestId("scroll");
    Object.defineProperty(node, "scrollWidth", { configurable: true, value: 300 });
    Object.defineProperty(node, "clientWidth", { configurable: true, value: 100 });
    node.scrollLeft = -200;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-start", "true"));
    expect(node).not.toHaveAttribute("data-overflow-end");
  });

  it("re-measures when children are added later", async () => {
    const ROWS = ["Первая", "Вторая", "Третья"];
    function Growing({ count }: { count: number }) {
      return (
        <ScrollContainer fade data-testid="scroll">
          {ROWS.slice(0, count).map((row) => (
            <p key={row}>{row}</p>
          ))}
        </ScrollContainer>
      );
    }
    const { rerender } = render(<Growing count={1} />);
    const node = screen.getByTestId("scroll");
    expect(node).not.toHaveAttribute("data-overflow-end");
    Object.defineProperty(node, "scrollHeight", { configurable: true, value: 300 });
    Object.defineProperty(node, "clientHeight", { configurable: true, value: 100 });
    rerender(<Growing count={3} />);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-end", "true"));
  });

  it("fades along the horizontal axis for axis=horizontal and sets nothing without fade", () => {
    const { rerender } = render(
      <ScrollContainer axis="horizontal" fade data-testid="scroll">
        items
      </ScrollContainer>,
    );
    expect(screen.getByTestId("scroll")).toHaveAttribute("data-fade", "horizontal");
    rerender(
      <ScrollContainer axis="horizontal" data-testid="scroll">
        items
      </ScrollContainer>,
    );
    expect(screen.getByTestId("scroll")).not.toHaveAttribute("data-fade");
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
