import { act, createEvent, fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Message } from "@/components/message/Message";
import {
  type ScrollRegion,
  ScrollRegionContext,
} from "@/components/scroll-container/useScrollEdges";

import { Chat } from "./Chat";
import { MessageList } from "./MessageList";

type Row = { id: string; from: "me" | "client"; text: string };

const HISTORY: Row[] = [
  { id: "m1", from: "client", text: "Счёт INV-2048 не выгружается" },
  { id: "m2", from: "me", text: "Проверим реквизиты" },
];

function fakeRegion(atEnd = true) {
  const listeners = new Set<() => void>();
  const state = { atEnd };
  const region: ScrollRegion & { set: (next: boolean) => void } = {
    element: () => null,
    atEnd: () => state.atEnd,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    scrollToEnd: vi.fn(),
    scrollToElement: vi.fn(),
    hold: vi.fn(),
    set(next) {
      state.atEnd = next;
      for (const listener of listeners) listener();
    },
  };
  return region;
}

type ConversationProps = Omit<React.ComponentProps<typeof MessageList>, "children"> & {
  rows: Row[];
  region?: ScrollRegion | null;
};

function Conversation({ rows, region = null, ...rest }: ConversationProps) {
  const group = (
    <MessageList aria-label="Переписка" {...rest}>
      {rows.map((row) => (
        <Message.Root
          key={row.id}
          value={row.id}
          direction={row.from === "me" ? "outgoing" : "incoming"}
        >
          <Message.Text>{row.text}</Message.Text>
        </Message.Root>
      ))}
    </MessageList>
  );
  return region ? (
    <ScrollRegionContext.Provider value={region}>{group}</ScrollRegionContext.Provider>
  ) : (
    group
  );
}

const article = (id: string) => {
  const found = document.querySelector<HTMLElement>(`[data-message-value="${id}"]`);
  if (!found) throw new Error(`no ${id}`);
  return found;
};

const group = () => {
  const found = document
    .querySelector<HTMLElement>("[data-message-article]")
    ?.closest<HTMLElement>("[role=log], [role=listbox]");
  if (!found) throw new Error("no group");
  return found;
};

/** jsdom has no AnimationEvent: an `animationend` with its name set by hand. */
const animationEnd = (target: Element, animationName: string) => {
  const event = createEvent.animationEnd(target);
  Object.defineProperty(event, "animationName", { value: animationName });
  fireEvent(target, event);
};

const bubble = (id: string) => {
  const found = article(id).querySelector<HTMLElement>("[data-message-bubble]");
  if (!found) throw new Error(`no bubble of ${id}`);
  return found;
};

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("The message list: new messages", () => {
  it("only a message added at the end enters and is reported; history never", () => {
    const onNewMessage = vi.fn();
    const { rerender } = render(<Conversation rows={HISTORY} onNewMessage={onNewMessage} />);
    expect(article("m1")).not.toHaveAttribute("data-enter");
    expect(article("m2")).not.toHaveAttribute("data-enter");

    const incoming: Row = { id: "m3", from: "client", text: "Спасибо" };
    rerender(<Conversation rows={[...HISTORY, incoming]} onNewMessage={onNewMessage} />);
    expect(article("m3")).toHaveAttribute("data-enter", "incoming");
    expect(onNewMessage).toHaveBeenCalledWith("m3", { direction: "incoming" });

    const older: Row[] = [
      { id: "o1", from: "client", text: "Добрый день" },
      { id: "o2", from: "me", text: "Здравствуйте" },
    ];
    rerender(<Conversation rows={[...older, ...HISTORY, incoming]} onNewMessage={onNewMessage} />);
    expect(article("o1")).not.toHaveAttribute("data-enter");
    expect(article("o2")).not.toHaveAttribute("data-enter");
    expect(onNewMessage).toHaveBeenCalledTimes(1);

    const mine: Row = { id: "m4", from: "me", text: "Пожалуйста" };
    rerender(
      <Conversation rows={[...older, ...HISTORY, incoming, mine]} onNewMessage={onNewMessage} />,
    );
    expect(article("m4")).toHaveAttribute("data-enter", "outgoing");
    expect(onNewMessage).toHaveBeenLastCalledWith("m4", { direction: "outgoing" });

    // The enter plays once: the attribute goes with its animation.
    fireEvent.animationEnd(article("m4"));
    expect(article("m4")).not.toHaveAttribute("data-enter");
  });

  it("a sent message keeps its node from sending to confirmed and enters once", () => {
    const Sent = ({ status }: { status?: "sending" | "sent" | "read" }) => (
      <MessageList aria-label="Переписка">
        <Message.Root value="m1">
          <Message.Text>Пришлите акт</Message.Text>
        </Message.Root>
        {status ? (
          <Message.Root value="m2" direction="outgoing" status={status}>
            <Message.Text>Отправил</Message.Text>
          </Message.Root>
        ) : null}
      </MessageList>
    );
    const { rerender } = render(<Sent />);
    rerender(<Sent status="sending" />);
    const node = article("m2");
    const text = node.querySelector("[data-message-bubble] > *");
    expect(node).toHaveAttribute("data-enter", "outgoing");
    fireEvent.animationEnd(node.querySelector(":scope > *") as Element);
    expect(node).not.toHaveAttribute("data-enter");
    rerender(<Sent status="sent" />);
    rerender(<Sent status="read" />);
    expect(article("m2")).toBe(node);
    expect(node.querySelector("[data-message-bubble] > *")).toBe(text);
    expect(node).not.toHaveAttribute("data-enter");
  });

  it("nothing enters when the group mounts with its history", () => {
    render(<Conversation rows={[...HISTORY, { id: "m3", from: "me", text: "Готово" }]} />);
    expect(document.querySelectorAll("[data-enter]")).toHaveLength(0);
  });

  it("a status change of a sent message does not enter it again", () => {
    const { rerender } = render(<Conversation rows={HISTORY} />);
    const mine: Row = { id: "m3", from: "me", text: "Отправляю" };
    rerender(<Conversation rows={[...HISTORY, mine]} />);
    fireEvent.animationEnd(article("m3"));
    rerender(<Conversation rows={[...HISTORY, { ...mine, text: "Отправляю акт" }]} />);
    expect(article("m3")).not.toHaveAttribute("data-enter");
  });

  it("my message brings the reader to the end; theirs counts on the «новых» button", () => {
    const region = fakeRegion(false);
    const { rerender } = render(<Conversation rows={HISTORY} region={region} />);
    const jump = screen.getByRole("button", { name: "К последним сообщениям" });

    rerender(
      <Conversation
        rows={[...HISTORY, { id: "m3", from: "client", text: "Ещё вопрос" }]}
        region={region}
      />,
    );
    expect(jump).toHaveAccessibleName("Новых сообщений: 1. К последним сообщениям");
    expect(region.scrollToEnd).not.toHaveBeenCalled();

    fireEvent.click(jump);
    expect(region.scrollToEnd).toHaveBeenCalledWith("smooth");

    rerender(
      <Conversation
        rows={[
          ...HISTORY,
          { id: "m3", from: "client", text: "Ещё вопрос" },
          { id: "m4", from: "me", text: "Отвечаю" },
        ]}
        region={region}
      />,
    );
    expect(region.scrollToEnd).toHaveBeenCalledTimes(2);

    // At the end the button leaves (closing, or gone at once under reduced motion).
    act(() => region.set(true));
    expect(
      screen.queryByRole("button", { name: /К последним/ })?.closest("[data-state='open']") ?? null,
    ).toBeNull();
  });
});

describe("The message list: jump, search, read receipts", () => {
  it("Message.Reply target brings the original into view, focuses and points at it", () => {
    const region = fakeRegion();
    render(
      <ScrollRegionContext.Provider value={region}>
        <MessageList aria-label="Переписка">
          <Message.Root value="m1">
            <Message.Text>Пришлите акт</Message.Text>
          </Message.Root>
          <Message.Root value="m2" direction="outgoing">
            <Message.Reply author="Анна" target="m1">
              Пришлите акт
            </Message.Reply>
            <Message.Text>Отправил</Message.Text>
          </Message.Root>
        </MessageList>
      </ScrollRegionContext.Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Ответ на сообщение/ }));
    expect(region.scrollToElement).toHaveBeenCalledWith(article("m1"), "smooth");
    expect(article("m1")).toHaveFocus();
    // The group points (the others step back and forth), the original stays at full strength.
    expect(group()).toHaveAttribute("data-pointing", "a");
    expect(article("m1")).toHaveAttribute("data-pointed");
    expect(article("m2")).not.toHaveAttribute("data-pointed");
  });

  it("highlight marks every match; current brings the result into view without taking focus", () => {
    const region = fakeRegion();
    const search = document.createElement("input");
    document.body.append(search);
    search.focus();
    const { rerender } = render(<Conversation rows={HISTORY} region={region} highlight="рек" />);
    expect(document.querySelector("mark")).toHaveTextContent("рек");
    rerender(<Conversation rows={HISTORY} region={region} highlight="рек" current="m2" />);
    expect(region.scrollToElement).toHaveBeenCalledWith(article("m2"), "smooth");
    // While a search match is current the others stay stepped back, with no blink.
    expect(group()).toHaveAttribute("data-pointing", "current");
    expect(article("m2")).toHaveAttribute("data-pointed");
    expect(search).toHaveFocus();
    rerender(<Conversation rows={HISTORY} region={region} highlight="рек" current="m1" />);
    expect(article("m2")).not.toHaveAttribute("data-pointed");
    expect(article("m1")).toHaveAttribute("data-pointed");
    expect(group()).toHaveAttribute("data-pointing", "current");
    rerender(<Conversation rows={HISTORY} region={region} highlight="рек" current={null} />);
    expect(group()).not.toHaveAttribute("data-pointing");
    expect(article("m1")).not.toHaveAttribute("data-pointed");
    search.remove();
  });

  it("a jump outside a search blinks the target, again on a repeated jump", () => {
    const region = fakeRegion();
    const { rerender } = render(<Conversation rows={HISTORY} region={region} />);
    rerender(<Conversation rows={HISTORY} region={region} current="m1" />);
    expect(group()).toHaveAttribute("data-pointing", "a");
    expect(article("m1")).toHaveAttribute("data-pointed");
    // Nothing is drawn on the message itself.
    expect(bubble("m1")).not.toHaveAttribute("data-flash");
    // A jump to the same message restarts the blink (the value flips, so CSS replays it).
    rerender(<Conversation rows={HISTORY} region={region} current={null} />);
    rerender(<Conversation rows={HISTORY} region={region} current="m1" />);
    expect(group()).toHaveAttribute("data-pointing", "b");
    // Another animation ending (a message entering) leaves the blink running.
    animationEnd(bubble("m2"), "_messageEnter_x1");
    expect(group()).toHaveAttribute("data-pointing", "b");
    animationEnd(bubble("m2"), "_messagePointingB_x1");
    expect(group()).not.toHaveAttribute("data-pointing");
    expect(article("m1")).not.toHaveAttribute("data-pointed");
  });

  it("onRead reports the incoming messages that were seen, once", () => {
    let callback: IntersectionObserverCallback = () => {};
    const observed: Element[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb;
        }
        observe(element: Element) {
          observed.push(element);
        }
        unobserve() {}
        disconnect() {}
      },
    );
    const onRead = vi.fn();
    render(<Conversation rows={HISTORY} onRead={onRead} />);
    // Only the incoming message is watched.
    expect(observed).toEqual([article("m1")]);
    act(() =>
      callback(
        [
          {
            target: article("m1"),
            isIntersecting: true,
            intersectionRatio: 1,
            intersectionRect: { height: 40 } as DOMRectReadOnly,
            rootBounds: { height: 400 } as DOMRectReadOnly,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      ),
    );
    expect(onRead).toHaveBeenCalledWith(["m1"]);
  });
});

describe("Message.Typing", () => {
  it("gives way at once to the reply that arrives with the end of typing", () => {
    const Thread = ({ typing, rows }: { typing: boolean; rows: Row[] }) => (
      <MessageList aria-label="Переписка">
        {rows.map((row) => (
          <Message.Root key={row.id} value={row.id}>
            <Message.Text>{row.text}</Message.Text>
          </Message.Root>
        ))}
        <Message.Typing active={typing} />
      </MessageList>
    );
    const { rerender } = render(<Thread typing rows={HISTORY} />);
    rerender(
      <Thread typing={false} rows={[...HISTORY, { id: "m3", from: "client", text: "Да" }]} />,
    );
    expect(document.querySelector("[role='status'][data-state]")).toBeNull();
  });

  it("is a polite status while active and leaves when typing stops", () => {
    const { rerender } = render(
      <MessageList aria-label="Переписка">
        <Message.Typing />
      </MessageList>,
    );
    const status = screen.getByText("Собеседник печатает").closest("[role='status']");
    expect(status).toHaveAttribute("data-state", "open");
    rerender(
      <MessageList aria-label="Переписка">
        <Message.Typing active={false} />
      </MessageList>,
    );
    expect(screen.queryByText("Собеседник печатает")).toBeNull();
    const closing = document.querySelector<HTMLElement>("[role='status'][data-state='closed']");
    if (closing) fireEvent.transitionEnd(closing, { propertyName: "grid-template-rows" });
    expect(document.querySelector("[role='status'][data-state]")).toBeNull();
  });
});

describe("Chat.Pinned", () => {
  const PINNED = [
    { value: "m1", text: "Реквизиты для оплаты" },
    { value: "m5", text: "Акт сверки за квартал" },
  ];

  it("shows the newest; a press shows it in the chat and steps to the older one", () => {
    const onSelect = vi.fn();
    const onRemove = vi.fn();
    render(
      <Chat.Root>
        <Chat.Pinned items={PINNED} onSelect={onSelect} onRemove={onRemove} />
      </Chat.Root>,
    );
    const bar = screen.getByRole("button", { name: /Закреплённое 2 из 2/ });
    expect(bar).toHaveTextContent("Акт сверки за квартал");
    fireEvent.click(bar);
    expect(onSelect).toHaveBeenCalledWith("m5");
    expect(screen.getByRole("button", { name: /Закреплённое 1 из 2/ })).toHaveTextContent(
      "Реквизиты для оплаты",
    );
    fireEvent.click(screen.getByRole("button", { name: "Открепить" }));
    expect(onRemove).toHaveBeenCalledWith("m1");
  });

  it("renders nothing without pinned messages", () => {
    const { container } = render(
      <Chat.Root>
        <Chat.Pinned items={[]} />
      </Chat.Root>,
    );
    expect(container.firstElementChild).toBeEmptyDOMElement();
  });
});

describe("Message.Reactions motion", () => {
  const REACTIONS = [
    { emoji: "👍", count: 1 },
    { emoji: "🔥", count: 1 },
    { emoji: "👌", count: 1 },
  ];
  const Note = ({ reactions }: { reactions: typeof REACTIONS }) => (
    <Message.Root value="m1" time="10:30">
      <Message.Text>Акт подписан</Message.Text>
      {reactions.length > 0 ? <Message.Reactions items={reactions} /> : null}
    </Message.Root>
  );
  const chip = (emoji: string) =>
    Array.from(document.querySelectorAll<HTMLElement>("[data-message-chip]")).find(
      (element) => element.dataset.reaction === emoji,
    ) ?? null;

  // Motion on: the test setup runs with reduced motion, where nothing stays to leave.
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
  });

  const slotOf = (emoji: string) => chip(emoji)?.parentElement ?? null;

  it("a chip taken from the middle goes at once; its neighbours keep their nodes", () => {
    const { rerender } = render(<Note reactions={REACTIONS} />);
    const [first, , last] = REACTIONS.map((reaction) => chip(reaction.emoji));
    rerender(<Note reactions={[REACTIONS[0], REACTIONS[2]]} />);
    expect(chip("🔥")).toBeNull();
    expect(chip("👍")).toBe(first);
    expect(chip("👌")).toBe(last);
  });

  it("the text and the row keep their nodes while the reactions come and go", () => {
    const { rerender } = render(<Note reactions={[]} />);
    const text = screen.getByText("Акт подписан");
    const slot = document.querySelector("[data-message-reactions]");
    expect(slot).toHaveAttribute("data-state", "closed");
    rerender(<Note reactions={[REACTIONS[0]]} />);
    expect(screen.getByText("Акт подписан")).toBe(text);
    expect(document.querySelector("[data-message-reactions]")).toBe(slot);
    expect(slot).toHaveAttribute("data-state", "open");
    rerender(<Note reactions={[]} />);
    expect(slot).toHaveAttribute("data-state", "closed");
    expect(chip("👍")).toBeNull();
    expect(screen.getByText("Акт подписан")).toBe(text);
    expect(document.querySelector("[data-message-reactions]")).toBe(slot);
  });

  it("chips on a message's first render never enter", () => {
    render(<Note reactions={REACTIONS} />);
    for (const emoji of ["👍", "🔥", "👌"]) expect(slotOf(emoji)).not.toHaveAttribute("data-fresh");
  });

  it("changes size in layout only: no script animation, no size written into the message", () => {
    const animate = vi.fn();
    Element.prototype.animate = animate as never;
    try {
      const { rerender } = render(<Note reactions={[]} />);
      rerender(<Note reactions={REACTIONS} />);
      rerender(<Note reactions={[REACTIONS[1]]} />);
      rerender(<Note reactions={[]} />);
      expect(animate).not.toHaveBeenCalled();
      const article = document.querySelector<HTMLElement>("[data-message-article]");
      expect(article?.getAttribute("style")).toBeNull();
      expect(article?.querySelector("[data-message-bubble]")?.getAttribute("style")).toBeNull();
    } finally {
      Reflect.deleteProperty(Element.prototype, "animate");
    }
  });

  it("holds the conversation only while a message gives way (a change that moves no box holds nothing)", () => {
    // A row that changes its height holds the region from the message's morph (bubbleMorph.test);
    // jsdom lays nothing out, so a change of reactions here moves no box and holds nothing.
    const region = fakeRegion();
    const Held = ({ reactions }: { reactions: typeof REACTIONS }) => (
      <ScrollRegionContext.Provider value={region}>
        <MessageList aria-label="Переписка">
          <Note reactions={reactions} />
        </MessageList>
      </ScrollRegionContext.Provider>
    );
    const { rerender } = render(<Held reactions={[]} />);
    expect(region.hold).not.toHaveBeenCalled();
    rerender(<Held reactions={[REACTIONS[0]]} />);
    rerender(<Held reactions={[REACTIONS[0], REACTIONS[1]]} />);
    rerender(<Held reactions={[]} />);
    expect(region.hold).not.toHaveBeenCalled();
  });
});
