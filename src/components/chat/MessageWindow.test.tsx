import { act, fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Message } from "@/components/message/Message";
import { type ScrollRegion, ScrollRegionContext } from "@/hooks/useScrollRegion";

import { MessageList } from "./MessageList";

type Row = { id: string; text: string; mine?: boolean };

const ROWS: Row[] = Array.from({ length: 500 }, (_, index) => ({
  id: `m${index}`,
  text: `Счёт INV-${3000 + index} выставлен`,
  mine: index % 3 === 0,
}));

function fakeRegion(): ScrollRegion {
  return {
    element: () => document.querySelector<HTMLElement>("[data-testid=scroller]"),
    atEnd: () => false,
    subscribe: () => () => {},
    scrollToEnd: vi.fn(),
    scrollToElement: vi.fn(),
    hold: vi.fn(),
  };
}

function Conversation({
  rows,
  region,
  ...rest
}: Omit<React.ComponentProps<typeof MessageList>, "children"> & {
  rows: Row[];
  region: ScrollRegion;
}) {
  return (
    <ScrollRegionContext.Provider value={region}>
      <div data-testid="scroller" style={{ overflowY: "auto" }}>
        <MessageList aria-label="Переписка" {...rest}>
          {rows.map((row) => (
            <Message.Root
              key={row.id}
              value={row.id}
              direction={row.mine ? "outgoing" : "incoming"}
            >
              <Message.Text>{row.text}</Message.Text>
            </Message.Root>
          ))}
        </MessageList>
      </div>
    </ScrollRegionContext.Provider>
  );
}

const articles = () => Array.from(document.querySelectorAll<HTMLElement>("[data-message-article]"));
const article = (id: string) => articles().find((item) => item.dataset.messageValue === id) ?? null;
const gaps = () =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-skip][aria-hidden]"));

/**
 * The scroller shows 640px; rows are not measured in jsdom, so each stands at its estimate. The
 * list sits at the top of the scroller's content: it moves up as the scroller scrolls.
 */
function sized() {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.dataset.testid === "scroller" ? 640 : 0;
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const top = this.getAttribute("role") === "log" ? -screen.getByTestId("scroller").scrollTop : 0;
    return { top, bottom: top, left: 0, right: 0, width: 0, height: 0, x: 0, y: top } as DOMRect;
  });
}

async function scrollTo(top: number) {
  const scroller = screen.getByTestId("scroller");
  scroller.scrollTop = top;
  await act(async () => {
    fireEvent.scroll(scroller);
    await new Promise((resolve) => window.setTimeout(resolve, 10));
  });
}

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 0),
  );
  vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("The message list in a scroller: a window of rows", () => {
  it("renders a bounded window from the end, numbered among all the messages", () => {
    render(<Conversation rows={ROWS} region={fakeRegion()} />);
    const shown = articles();
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.length).toBeLessThanOrEqual(30);
    expect(shown.at(-1)?.dataset.messageValue).toBe("m499");
    expect(shown.at(-1)).toHaveAttribute("aria-posinset", "500");
    expect(shown.at(-1)).toHaveAttribute("aria-setsize", "500");
    // The rows the window does not render stand as one spacer above; rows are never transformed.
    expect(gaps()).toHaveLength(1);
    for (const row of articles()) expect(row.style.transform).toBe("");
  });

  it("without a scroller every row renders (a short conversation in a page)", () => {
    render(
      <MessageList aria-label="Переписка">
        {ROWS.slice(0, 60).map((row) => (
          <Message.Root key={row.id} value={row.id}>
            <Message.Text>{row.text}</Message.Text>
          </Message.Root>
        ))}
      </MessageList>,
    );
    expect(articles()).toHaveLength(60);
    expect(gaps()).toHaveLength(0);
  });

  it("keeps its spacers' nodes while the window moves, so the scroll position never collapses", async () => {
    sized();
    render(<Conversation rows={ROWS} region={fakeRegion()} />);
    const [top] = gaps();
    await scrollTo(20000);
    expect(gaps()[0]).toBe(top);
    expect(article("m499")).toBeNull();
    await scrollTo(10000);
    expect(gaps()[0]).toBe(top);
  });

  it("rows that come into view by scrolling never enter; a message added out of view is still heard", async () => {
    sized();
    const onNewMessage = vi.fn();
    const region = fakeRegion();
    const { rerender } = render(
      <Conversation rows={ROWS} region={region} onNewMessage={onNewMessage} />,
    );
    await scrollTo(0);
    expect(article("m0")).not.toBeNull();
    expect(document.querySelectorAll("[data-enter]")).toHaveLength(0);
    expect(articles().length).toBeLessThanOrEqual(40);

    rerender(
      <Conversation
        rows={[...ROWS, { id: "m500", text: "Оплачено" }]}
        region={region}
        onNewMessage={onNewMessage}
      />,
    );
    expect(onNewMessage).toHaveBeenCalledWith("m500", { direction: "incoming" });
    expect(document.querySelectorAll("[data-enter]")).toHaveLength(0);
  });

  it("a message added while the window holds the end is rendered and enters once; history never", () => {
    const onNewMessage = vi.fn();
    const region = fakeRegion();
    const { rerender } = render(
      <Conversation rows={ROWS} region={region} onNewMessage={onNewMessage} />,
    );
    const more = [...ROWS, { id: "m500", text: "Оплачено", mine: true }];
    rerender(<Conversation rows={more} region={region} onNewMessage={onNewMessage} />);
    expect(article("m500")).toHaveAttribute("data-enter", "outgoing");
    expect(onNewMessage).toHaveBeenCalledTimes(1);
    expect(onNewMessage).toHaveBeenCalledWith("m500", { direction: "outgoing" });
    // Older history above is not new.
    const older = [{ id: "o1", text: "Добрый день" }, ...more];
    rerender(<Conversation rows={older} region={region} onNewMessage={onNewMessage} />);
    expect(onNewMessage).toHaveBeenCalledTimes(1);
  });

  it("a jump to a message the window does not hold renders it, jumps there and marks its bubble", async () => {
    sized();
    const region = fakeRegion();
    const { rerender } = render(<Conversation rows={ROWS} region={region} />);
    expect(article("m3")).toBeNull();
    rerender(<Conversation rows={ROWS} region={region} jumpTo="m3" />);
    // The browser reports the jump's scroll: the window moves there.
    await act(async () => {
      fireEvent.scroll(screen.getByTestId("scroller"));
      await new Promise((resolve) => window.setTimeout(resolve, 10));
    });
    const target = article("m3");
    expect(target).not.toBeNull();
    expect(region.scrollToElement).toHaveBeenCalledWith(target, "auto");
    // The target blinks; the others stay still.
    expect(target).toHaveAttribute("data-pointed");
    expect(target?.closest("[role=log]")).toHaveAttribute("data-pointing", "a");
  });

  it("Home reaches the first message although it is not rendered, and focuses it", async () => {
    sized();
    const region = fakeRegion();
    render(<Conversation rows={ROWS} region={region} />);
    const last = article("m499") as HTMLElement;
    last.focus();
    fireEvent.keyDown(last, { key: "Home" });
    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 10));
    });
    expect(article("m0")).toHaveFocus();
    fireEvent.keyDown(article("m0") as HTMLElement, { key: "End" });
    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 10));
    });
    expect(article("m499")).toHaveFocus();
  });

  it("a Shift range runs over the messages the window does not render", async () => {
    sized();
    const onSelectedChange = vi.fn();
    render(
      <Conversation
        rows={ROWS}
        region={fakeRegion()}
        defaultSelected={[]}
        onSelectedChange={onSelectedChange}
      />,
    );
    fireEvent.click(article("m499") as HTMLElement, { detail: 1 });
    await scrollTo(0);
    fireEvent.click(article("m0") as HTMLElement, { detail: 1, shiftKey: true });
    const last = onSelectedChange.mock.calls.at(-1)?.[0] as string[];
    expect(last).toHaveLength(500);
  });
});
