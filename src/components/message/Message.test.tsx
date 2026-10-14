import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/button/Button";
import { ChatSeparator, ChatService, ChatUnread } from "@/components/chat/ChatRows";
import { ChatSelectionBar, MessageList } from "@/components/chat/MessageList";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { VideoNote } from "@/components/video-note/VideoNote";

import { Message } from "./Message";

function Chat({ children }: { children: React.ReactNode }) {
  return <MessageList aria-label="Переписка с клиентом">{children}</MessageList>;
}

describe("Message", () => {
  it("is an article named by its author and time inside a log", () => {
    render(
      <Chat>
        <Message.Root time="10:12">
          <Message.Author color="green">Анна Котова</Message.Author>
          <Message.Text>Счёт отправлен</Message.Text>
        </Message.Root>
        <Message.Root direction="outgoing" time="10:14" status="read">
          <Message.Text>Спасибо</Message.Text>
        </Message.Root>
      </Chat>,
    );
    expect(screen.getByRole("log", { name: "Переписка с клиентом" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Анна Котова, 10:12" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Вы, 10:14" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Прочитано" })).toBeInTheDocument();
  });

  it("sets direction and position on the row and a time element", () => {
    const at = new Date(2026, 9, 8, 9, 5);
    render(
      <Chat>
        <Message.Root direction="outgoing" position="last" time={at}>
          <Message.Text>Готово</Message.Text>
        </Message.Root>
      </Chat>,
    );
    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("data-direction", "outgoing");
    expect(article).toHaveAttribute("data-position", "last");
    expect(article.querySelector("time:not([aria-hidden] time)")).toHaveAttribute(
      "datetime",
      at.toISOString(),
    );
    // One visible time; the spacers that hold its room are hidden copies.
    expect(
      within(article)
        .getAllByText("09:05")
        .filter((node) => !node.closest("[aria-hidden='true']")),
    ).toHaveLength(1);
  });

  it("reserves the meta at the end of the last line of the last part", () => {
    render(
      <Message.Root time="10:00" edited>
        <Message.Text>Первая строка</Message.Text>
      </Message.Root>,
    );
    const paragraph = screen.getByText("Первая строка");
    const reserve = paragraph.lastElementChild;
    expect(reserve).toHaveAttribute("aria-hidden", "true");
    expect(reserve).toHaveTextContent("изменено10:00");
    expect(screen.getByRole("article").querySelector("[data-meta]")).toHaveAttribute(
      "data-meta",
      "inline",
    );
  });

  it("puts the meta on its own row after content that keeps no reserve", () => {
    render(
      <Message.Root time="10:00">
        <div>Своё содержимое</div>
      </Message.Root>,
    );
    expect(screen.getByRole("article").querySelector("[data-meta]")).toHaveAttribute(
      "data-meta",
      "block",
    );
  });

  it("renders the Markdown of a text as elements, never HTML", () => {
    render(
      <Message.Root>
        <Message.Text>{"**важно** <b>нет</b> https://prime.app"}</Message.Text>
      </Message.Root>,
    );
    expect(screen.getByText("важно").tagName).toBe("STRONG");
    expect(screen.queryByText("нет")?.tagName).not.toBe("B");
    expect(screen.getByRole("link", { name: "https://prime.app" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("retries a failed message: sending while the promise runs, failed after a rejection", async () => {
    let reject: (reason: Error) => void = () => {};
    const onRetry = vi.fn(
      () =>
        new Promise<void>((_resolve, rejectPromise) => {
          reject = rejectPromise;
        }),
    );
    render(
      <Message.Root direction="outgoing" time="10:00" status="failed" onRetry={onRetry}>
        <Message.Text>Акт сверки</Message.Text>
      </Message.Root>,
    );
    expect(screen.getByRole("img", { name: "Не отправлено" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Повторить отправку" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("img", { name: "Отправляется" })).toBeInTheDocument();
    await act(async () => reject(new Error("offline")));
    expect(screen.getByRole("img", { name: "Не отправлено" })).toBeInTheDocument();
  });

  it("opens the reply's original through its button", async () => {
    const onClick = vi.fn();
    render(
      <Message.Root>
        <Message.Reply author="Олег" onClick={onClick}>
          Макет готов
        </Message.Reply>
        <Message.Text>Согласовано</Message.Text>
      </Message.Root>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Ответ на сообщение.*Олег.*Макет готов/ }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows a reaction toggle at once, in the same event, while its request runs", async () => {
    let reject: (reason: Error) => void = () => {};
    const onReactionToggle = vi.fn(
      () =>
        new Promise<void>((_resolve, rejectPromise) => {
          reject = rejectPromise;
        }),
    );
    render(
      <Message.Root onReactionToggle={onReactionToggle}>
        <Message.Text>Сделка закрыта</Message.Text>
        <Message.Reactions items={[{ emoji: "+1", count: 2, selected: true }]} />
      </Message.Root>,
    );
    const chip = screen.getByRole("button", { name: "+1: 2" });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    // Synchronous: no await between the press and the new state.
    act(() => {
      fireEvent.click(chip);
    });
    expect(onReactionToggle).toHaveBeenCalledWith("+1");
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(chip).toHaveAttribute("aria-label", "+1: 1");
    expect(chip).toHaveAttribute("aria-busy", "true");
    await act(async () => reject(new Error("offline")));
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(chip).not.toHaveAttribute("aria-busy");
  });

  describe("reaction chips with reactors", () => {
    const ME = { id: "me", name: "Вы" };
    const PEOPLE = ["Анна", "Пётр", "Мария", "Олег", "Ирина"].map((name, index) => ({
      id: `u${index}`,
      name,
    }));
    const avatarsOf = (chip: HTMLElement) =>
      chip.querySelectorAll('[data-part="avatars"] [data-color]').length;
    const tailOf = (chip: HTMLElement) =>
      chip.querySelector("[data-show]")?.getAttribute("data-show");

    it("shows up to three avatars, from four on two and a «+N» circle, the count without users", () => {
      render(
        <Message.Root>
          <Message.Text>Релиз в четверг</Message.Text>
          <Message.Reactions
            items={[
              { emoji: "A", count: 1, users: PEOPLE.slice(0, 1) },
              { emoji: "B", count: 3, users: PEOPLE.slice(0, 3) },
              { emoji: "C", count: 5, users: PEOPLE },
              { emoji: "D", count: 2 },
            ]}
          />
        </Message.Root>,
      );
      const one = screen.getByRole("button", { name: /^A 1:/ });
      expect(tailOf(one)).toBe("avatars");
      expect(avatarsOf(one)).toBe(1);
      const three = screen.getByRole("button", { name: /^B 3:/ });
      expect(avatarsOf(three)).toBe(3);
      const five = screen.getByRole("button", { name: /^C 5:/ });
      expect(avatarsOf(five)).toBe(2);
      expect(five.querySelector('[data-part="avatars"]')).toHaveTextContent("+3");
      const plain = screen.getByRole("button", { name: "D: 2" });
      expect(tailOf(plain)).toBe("count");
      // The avatars are decoration inside the button: its name says who.
      expect(five.querySelector("[data-show]")).toHaveAttribute("aria-hidden", "true");
    });

    it("names the chip with who reacted, and how many more when not everyone is listed", () => {
      render(
        <Message.Root>
          <Message.Text>Релиз в четверг</Message.Text>
          <Message.Reactions
            items={[
              { emoji: "❤️", count: 3, users: PEOPLE.slice(0, 3) },
              { emoji: "🔥", count: 7, users: PEOPLE.slice(0, 2) },
            ]}
          />
        </Message.Root>,
      );
      expect(screen.getByRole("button", { name: "❤️ 3: Анна, Пётр, Мария" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "🔥 7: Анна, Пётр, ещё 5" })).toBeInTheDocument();
    });

    it("adds the reader to the stack at once while the toggle runs, and takes them back", async () => {
      let resolve: () => void = () => {};
      const onReactionToggle = vi.fn(
        () =>
          new Promise<void>((done) => {
            resolve = done;
          }),
      );
      render(
        <MessageList aria-label="Чат" reader={ME}>
          <Message.Root onReactionToggle={onReactionToggle}>
            <Message.Text>Релиз в четверг</Message.Text>
            <Message.Reactions items={[{ emoji: "+1", count: 2, users: PEOPLE.slice(0, 2) }]} />
          </Message.Root>
        </MessageList>,
      );
      const chip = screen.getByRole("button", { name: "+1 2: Анна, Пётр" });
      act(() => {
        fireEvent.click(chip);
      });
      expect(chip).toHaveAttribute("aria-label", "+1 3: Анна, Пётр, Вы");
      expect(chip).toHaveAttribute("aria-pressed", "true");
      expect(avatarsOf(chip)).toBe(3);
      await act(async () => resolve());
      // The owner's data did not change: the reader leaves again.
      expect(chip).toHaveAttribute("aria-label", "+1 2: Анна, Пётр");
    });

    it("enters only a reaction new on the message, never on mount, and keeps the other chips", () => {
      const onReactionToggle = vi.fn(() => new Promise<void>(() => {}));
      render(
        <MessageList aria-label="Чат" quickReaction="🎉" reader={ME}>
          <Message.Root onReactionToggle={onReactionToggle}>
            <Message.Text>Релиз в четверг</Message.Text>
            <Message.Reactions
              items={[
                { emoji: "+1", count: 2, users: PEOPLE.slice(0, 2) },
                { emoji: "!", count: 4 },
              ]}
            />
          </Message.Root>
        </MessageList>,
      );
      const plus = screen.getByRole("button", { name: /^\+1 2/ });
      const bang = screen.getByRole("button", { name: "!: 4" });
      // The entrance is the message's morph (`bubbleMorph`): a recorded `animate`.
      const entered = new Set<Element>();
      const animate = vi.fn(function (this: Element) {
        entered.add(this);
        return { cancel() {}, finished: Promise.resolve(), effect: null } as unknown as Animation;
      });
      Element.prototype.animate = animate as unknown as Element["animate"];
      document.documentElement.style.setProperty("--prime-message-morph-duration", "300ms");
      vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
      try {
        // Toggling one chip changes it in place: no chip remounts, none takes the entrance.
        act(() => {
          fireEvent.click(plus);
        });
        expect(screen.getByRole("button", { name: /^\+1 3/ })).toBe(plus);
        expect(screen.getByRole("button", { name: "!: 4" })).toBe(bang);
        expect(entered.size).toBe(0);

        // A reaction new on the message enters, once; the others stay as they were.
        fireEvent.doubleClick(screen.getByText("Релиз в четверг"));
        const party = screen.getByRole("button", { name: "🎉 1: Вы" });
        expect(entered.has(party.parentElement as Element)).toBe(true);
        expect(entered.has(plus.parentElement as Element)).toBe(false);
        expect(screen.getByRole("button", { name: "!: 4" })).toBe(bang);
      } finally {
        delete (Element.prototype as Partial<Element>).animate;
        document.documentElement.style.removeProperty("--prime-message-morph-duration");
        vi.unstubAllGlobals();
      }
    });

    it("opens the held row with the first reaction and closes it with the last, at once", async () => {
      vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
      try {
        let resolve: () => void = () => {};
        const onReactionToggle = vi.fn(
          () =>
            new Promise<void>((done) => {
              resolve = done;
            }),
        );
        render(
          <MessageList aria-label="Чат" quickReaction="🎉">
            <Message.Root onReactionToggle={onReactionToggle}>
              <Message.Text>Релиз в четверг</Message.Text>
            </Message.Root>
          </MessageList>,
        );
        // Every message holds the row's place, closed.
        const slot = document.querySelector("[data-message-reactions]");
        expect(slot).toHaveAttribute("data-state", "closed");
        const bubble = document.querySelector("[data-message-bubble]");
        expect(bubble).not.toHaveAttribute("data-reactions");
        fireEvent.doubleClick(screen.getByText("Релиз в четверг"));
        // The same row opens in place; the bubble hands the meta to the row.
        expect(document.querySelector("[data-message-reactions]")).toBe(slot);
        expect(slot).toHaveAttribute("data-state", "open");
        expect(bubble).toHaveAttribute("data-reactions");
        expect(screen.getByRole("button", { name: "🎉: 1" })).toBeInTheDocument();
        // The owner's data never took it: the chip goes and the row closes in the same commit.
        await act(async () => resolve());
        expect(document.querySelector("[data-message-chip]")).toBeNull();
        expect(slot).toHaveAttribute("data-state", "closed");
        expect(bubble).not.toHaveAttribute("data-reactions");
        expect(document.querySelector("[data-message-reactions]")).toBe(slot);
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });

  it("puts the quick reaction on a double tap and on L, and announces it", async () => {
    const onReactionToggle = vi.fn();
    render(
      <MessageList aria-label="Чат" quickReaction="+1">
        <Message.Root time="10:00" onReactionToggle={onReactionToggle}>
          <Message.Text>Счёт отправлен</Message.Text>
        </Message.Root>
      </MessageList>,
    );
    const article = screen.getByRole("article");
    // The row's empty width is not the message.
    fireEvent.doubleClick(article);
    expect(onReactionToggle).not.toHaveBeenCalled();
    fireEvent.doubleClick(screen.getByText("Счёт отправлен"));
    expect(onReactionToggle).toHaveBeenLastCalledWith("+1");
    expect(screen.getByRole("status")).toHaveTextContent("Реакция +1 поставлена");
    article.focus();
    await userEvent.keyboard("l");
    expect(onReactionToggle).toHaveBeenCalledTimes(2);
  });

  it("keeps a double click from selecting a word, but not a single press or a link", () => {
    render(
      <MessageList aria-label="Чат">
        <Message.Root time="10:00" onReactionToggle={() => {}}>
          <Message.Text>Счёт на https://prime.app отправлен</Message.Text>
        </Message.Root>
        <Message.Root time="10:01">
          <Message.Text>Без реакций</Message.Text>
        </Message.Root>
      </MessageList>,
    );
    const text = screen.getByText(/Счёт на/);
    // `fireEvent` returns `false` when the default was prevented.
    expect(fireEvent.mouseDown(text, { detail: 1 })).toBe(true);
    expect(fireEvent.mouseDown(text, { detail: 2 })).toBe(false);
    expect(fireEvent.mouseDown(screen.getByRole("link"), { detail: 2 })).toBe(true);
    // Without a quick reaction a double click selects the word as usual.
    expect(fireEvent.mouseDown(screen.getByText("Без реакций"), { detail: 2 })).toBe(true);
  });

  it("lets only the text of a message select", () => {
    render(
      <Message.Root time="10:00" status="read">
        <Message.Author>Анна</Message.Author>
        <Message.Text>Счёт отправлен</Message.Text>
      </Message.Root>,
    );
    expect(screen.getByText("Анна")).toHaveAttribute("data-message-selectable");
    expect(screen.getByText("Счёт отправлен").closest("[data-message-selectable]")).not.toBeNull();
    expect(
      screen.getByRole("img", { name: "Прочитано" }).closest("[data-message-selectable]"),
    ).toBe(null);
  });

  it("opens the reaction bar from the keyboard: arrows move, Enter picks and closes", async () => {
    const onReactionToggle = vi.fn();
    render(
      <MessageList
        aria-label="Чат"
        reactionOptions={[
          { emoji: "+1", label: "Нравится" },
          { emoji: "fire", label: "Огонь" },
        ]}
      >
        <Message.Root time="10:00" onReactionToggle={onReactionToggle}>
          <Message.Text>Счёт отправлен</Message.Text>
        </Message.Root>
      </MessageList>,
    );
    screen.getByRole("article").focus();
    await userEvent.keyboard("r");
    const bar = await screen.findByRole("toolbar", { name: "Реакции" });
    expect(within(bar).getByRole("button", { name: "Нравится" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}{Enter}");
    expect(onReactionToggle).toHaveBeenCalledWith("fire");
    await vi.waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull());
    expect(screen.getByRole("article")).toHaveFocus();
  });

  it("closes the bar at once, without its exit, when the chat scrolls", async () => {
    render(
      <div>
        <div data-testid="aside" />
        <div data-testid="chat">
          <MessageList aria-label="Чат">
            <Message.Root time="10:00" onReactionToggle={() => {}}>
              <Message.Text>Счёт отправлен</Message.Text>
            </Message.Root>
          </MessageList>
        </div>
      </div>,
    );
    screen.getByRole("article").focus();
    await userEvent.keyboard("r");
    await screen.findByRole("toolbar", { name: "Реакции" });
    // A scroll of a region that doesn't hold the message leaves it open.
    fireEvent.scroll(screen.getByTestId("aside"));
    expect(screen.getByRole("toolbar", { name: "Реакции" })).toBeInTheDocument();
    fireEvent.scroll(screen.getByTestId("chat"));
    expect(screen.queryByRole("toolbar")).toBeNull();
  });

  it("a press during a long hover cancels the bar: it never opens over what the press opened", () => {
    vi.useFakeTimers();
    const matchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("hover"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as never;
    try {
      render(
        <MessageList aria-label="Чат">
          <Message.Root time="10:00" onReactionToggle={() => {}}>
            <Message.Text>Счёт отправлен</Message.Text>
          </Message.Root>
        </MessageList>,
      );
      const text = screen.getByText("Счёт отправлен");
      fireEvent.pointerEnter(text, { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(200));
      fireEvent.pointerDown(text, { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(1000));
      expect(screen.queryByRole("toolbar")).toBeNull();
    } finally {
      window.matchMedia = matchMedia;
      vi.useRealTimers();
    }
  });

  it("shows the bar after a long hover and the bar with the menu after a long press", () => {
    vi.useFakeTimers();
    const matchMedia = window.matchMedia;
    // A pointer that hovers, on a wide screen (the menu stays anchored, not a sheet).
    window.matchMedia = ((query: string) => ({
      matches: query.includes("hover"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as never;
    try {
      render(
        <MessageList aria-label="Чат">
          <Message.Root time="10:00" onReactionToggle={() => {}}>
            <Message.Text>Счёт отправлен</Message.Text>
            <Message.Menu>
              <Dropdown.Item>Ответить</Dropdown.Item>
            </Message.Menu>
          </Message.Root>
        </MessageList>,
      );
      const article = screen.getByRole("article");
      const text = screen.getByText("Счёт отправлен");
      // Resting on the row beside the bubble opens nothing.
      fireEvent.pointerEnter(article, { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(1000));
      expect(screen.queryByRole("toolbar")).toBeNull();
      fireEvent.contextMenu(article);
      expect(screen.queryByRole("menu")).toBeNull();
      // Resting on the bubble opens the bar alone.
      fireEvent.pointerEnter(text, { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(500));
      expect(screen.getByRole("toolbar", { name: "Реакции" })).toBeInTheDocument();
      expect(screen.queryByRole("menu")).toBeNull();
      // React derives leave from `pointerout` to an element outside the message.
      fireEvent.pointerOut(text, { pointerType: "mouse", relatedTarget: document.body });
      act(() => vi.advanceTimersByTime(1000));
      // Closed: unmounted, or still playing its exit.
      expect(screen.queryByRole("toolbar")?.getAttribute("data-state") ?? "closed").toBe("closed");

      fireEvent.pointerDown(screen.getByText("Счёт отправлен"), {
        pointerType: "touch",
        clientX: 10,
        clientY: 10,
      });
      act(() => vi.advanceTimersByTime(500));
      expect(screen.getByRole("toolbar", { name: "Реакции" })).toBeInTheDocument();
      expect(screen.getByRole("menu")).toBeInTheDocument();
    } finally {
      window.matchMedia = matchMedia;
      vi.useRealTimers();
    }
  });

  it("opens the menu with a right click and from the keyboard, and returns focus", async () => {
    render(
      <Chat>
        <Message.Root time="12:30">
          <Message.Text>Когда документы?</Message.Text>
          <Message.Menu>
            <Dropdown.Item>Ответить</Dropdown.Item>
          </Message.Menu>
        </Message.Root>
      </Chat>,
    );
    const article = screen.getByRole("article");
    fireEvent.contextMenu(screen.getByText("Когда документы?"), { clientX: 10, clientY: 10 });
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(article).toHaveFocus();
    await userEvent.keyboard("{Shift>}{F10}{/Shift}");
    expect(await screen.findByRole("menuitem", { name: "Ответить" })).toBeInTheDocument();
  });

  it("puts an inline keyboard under the bubble: rows in order, Tab reaches each button, no tail", async () => {
    const onConfirm = vi.fn();
    render(
      <Chat>
        <Message.Root value="bot" time="15:02">
          <Message.Actions data-testid="row-1">
            <Button.Root variant="soft" tone="neutral" onClick={onConfirm}>
              Подтвердить заказ
            </Button.Root>
            <Button.Root variant="soft" tone="neutral">
              Изменить
            </Button.Root>
          </Message.Actions>
          <Message.Text>Заказ № 4821 собран.</Message.Text>
          <Message.Actions data-testid="row-2">
            <Button.Root variant="soft" tone="neutral" asChild>
              <a href="https://vector.example/invoices/4821">Открыть счёт</a>
            </Button.Root>
          </Message.Actions>
        </Message.Root>
      </Chat>,
    );
    const message = screen.getByRole("article");
    const bubble = message.querySelector("[data-message-bubble]") as HTMLElement;
    const rows = [screen.getByTestId("row-1"), screen.getByTestId("row-2")];
    // Both rows stand after the bubble, in the column, in the order written.
    for (const row of rows) {
      expect(row.parentElement).toBe(bubble.parentElement);
      expect(bubble.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(bubble.contains(row)).toBe(false);
    }
    expect(rows[0]?.compareDocumentPosition(rows[1] as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(bubble.parentElement).toHaveAttribute("data-actions");
    expect(bubble).not.toHaveAttribute("data-tail");
    // The keyboard: Tab goes from the message to each button, then to the link.
    await userEvent.tab();
    expect(message).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Подтвердить заказ" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Изменить" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Открыть счёт" })).toHaveFocus();
  });

  it("moves between messages with the arrows and keeps one tab stop", async () => {
    render(
      <Chat>
        <Message.Root time="10:00">
          <Message.Text>Первое</Message.Text>
        </Message.Root>
        <Message.Root time="10:01">
          <Message.Text>Второе</Message.Text>
        </Message.Root>
      </Chat>,
    );
    const [first, second] = screen.getAllByRole("article");
    expect(first).toHaveAttribute("tabindex", "-1");
    expect(second).toHaveAttribute("tabindex", "0");
    await userEvent.tab();
    expect(second).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    expect(first).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(second).toHaveFocus();
  });

  it("starts selection from the menu, toggles by a press, leaves on Escape", async () => {
    const onSelectedChange = vi.fn();
    function Selectable() {
      const [selected, setSelected] = React.useState<readonly string[] | null>(null);
      return (
        <MessageList
          aria-label="Чат"
          selected={selected}
          onSelectedChange={(next) => {
            onSelectedChange(next);
            setSelected(next);
          }}
        >
          <Message.Root value="a" time="10:00">
            <Message.Text>Отгрузка задерживается</Message.Text>
            <Message.Menu>
              <Dropdown.Item>Ответить</Dropdown.Item>
            </Message.Menu>
          </Message.Root>
          <Message.Root value="b" time="10:01">
            <Message.Text>Новая дата — 10 октября</Message.Text>
          </Message.Root>
          <ChatSelectionBar />
        </MessageList>
      );
    }
    render(<Selectable />);
    fireEvent.contextMenu(screen.getByText("Отгрузка задерживается"));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Выбрать" }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(["a"]);
    const list = screen.getByRole("listbox", { name: "Чат" });
    expect(list).toHaveAttribute("aria-multiselectable", "true");
    const [first, second] = screen.getAllByRole("option");
    expect(first).toHaveAttribute("aria-selected", "true");
    await userEvent.click(second);
    expect(onSelectedChange).toHaveBeenLastCalledWith(["a", "b"]);
    expect(screen.getByRole("toolbar", { name: "Выбрано: 2" })).toBeInTheDocument();
    // A double tap in selection mode adds nothing (no quick reaction, no extra toggle).
    const calls = onSelectedChange.mock.calls.length;
    fireEvent.doubleClick(second);
    expect(onSelectedChange).toHaveBeenCalledTimes(calls);
    second.focus();
    await userEvent.keyboard("{Escape}");
    expect(onSelectedChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  it("lifts the «к последним» button above the selection bar while it is shown", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const height = this.getAttribute("role") === "toolbar" ? 56 : 0;
      return { top: 0, left: 0, right: 0, bottom: height, width: 0, height } as DOMRect;
    });
    function Chat({ selected }: { selected: readonly string[] | null }) {
      return (
        <MessageList aria-label="Чат" selected={selected}>
          <Message.Root value="a" time="10:00">
            <Message.Text>Отгрузка задерживается</Message.Text>
          </Message.Root>
          <ChatSelectionBar />
        </MessageList>
      );
    }
    const { rerender, container } = render(<Chat selected={null} />);
    const group = container.querySelector<HTMLElement>("[aria-label='Чат']");
    expect(group?.style.getPropertyValue("--message-bottom-bar")).toBe("");
    rerender(<Chat selected={["a"]} />);
    // The bar's height goes to the group in the commit it appears in: the button rises over it.
    expect(group?.style.getPropertyValue("--message-bottom-bar")).toBe("56px");
    rerender(<Chat selected={null} />);
    expect(group?.style.getPropertyValue("--message-bottom-bar")).toBe("");
    const flat = readFileSync(join(__dirname, "../chat/Chat.module.css"), "utf8").replace(
      /\s+/g,
      " ",
    );
    expect(flat).toContain("translate: 0 calc(-1 * var(--message-bottom-bar, 0px));");
    vi.restoreAllMocks();
  });

  it.each([
    "mouse",
    "touch",
  ])("selects like a table: Shift range from the anchor, a %s drag paints", (pointerType) => {
    const onSelectedChange = vi.fn();
    render(
      <MessageList aria-label="Чат" defaultSelected={[]} onSelectedChange={onSelectedChange}>
        {["a", "b", "c", "d"].map((value) => (
          <Message.Root key={value} value={value} time="10:00">
            <Message.Text>{`Сообщение ${value}`}</Message.Text>
          </Message.Root>
        ))}
      </MessageList>,
    );
    const options = screen.getAllByRole("option");
    fireEvent.click(options[0], { detail: 1 });
    fireEvent.click(options[2], { detail: 1, shiftKey: true });
    expect(onSelectedChange).toHaveBeenLastCalledWith(["a", "b", "c"]);

    // Drag from «d» (unselected → select) over «b»: b…d end up selected.
    fireEvent.click(options[1], { detail: 1 });
    const original = document.elementFromPoint;
    document.elementFromPoint = () => options[1];
    try {
      fireEvent.pointerDown(options[3], { pointerType, button: 0 });
      act(() => {
        window.dispatchEvent(new MouseEvent("pointermove", { clientX: 1, clientY: 1 }));
        window.dispatchEvent(new MouseEvent("pointerup"));
      });
      fireEvent.click(options[1], { detail: 1 });
    } finally {
      document.elementFromPoint = original;
    }
    const last = onSelectedChange.mock.calls.at(-1)?.[0] as string[];
    expect([...last].sort()).toEqual(["a", "b", "c", "d"]);
  });

  it("puts reactions under a picture, outside the shape, and inside a caption bubble", () => {
    const reactions = [{ emoji: "+1", count: 1 }];
    render(
      <>
        <Message.Root time="09:15">
          <Message.Media items={[{ src: "/photo.jpg", alt: "Склад" }]} />
          <Message.Reactions items={reactions} />
        </Message.Root>
        <Message.Root time="09:16">
          <Message.Media items={[{ src: "/photo.jpg", alt: "Склад" }]} />
          <Message.Text>Подпись</Message.Text>
          <Message.Reactions items={reactions} />
        </Message.Root>
      </>,
    );
    const [media, caption] = screen.getAllByRole("article");
    const mediaShell = media.querySelector("[data-shell]");
    expect(mediaShell?.querySelector('[role="group"]')).toBeNull();
    expect(within(media).getByRole("group", { name: "Реакции" })).toBeInTheDocument();
    expect(mediaShell).toHaveAttribute("data-meta", "overlay");
    expect(caption.querySelector("[data-shell]")?.querySelector('[role="group"]')).not.toBeNull();
  });

  it("draws a tail only on the last bubble of a run, never on a picture or a circle", () => {
    const album = [
      { src: "/a.jpg", alt: "Склад" },
      { src: "/b.jpg", alt: "Стеллаж" },
    ];
    render(
      <MessageList group aria-label="Чат">
        <Message.Root time="13:40" position="first">
          <Message.Text>Первое</Message.Text>
        </Message.Root>
        <Message.Root time="13:41" position="middle">
          <Message.Text>Второе</Message.Text>
        </Message.Root>
        <Message.Root time="13:42" position="last">
          <Message.Text>Последнее</Message.Text>
        </Message.Root>
        <Message.Root time="13:43" direction="outgoing">
          <Message.File name="Акт.pdf" fileSize={1024} />
        </Message.Root>
        <Message.Root time="13:48">
          <Message.Avatar>АК</Message.Avatar>
          <VideoNote src="/note.mp4" duration={6} />
        </Message.Root>
        <Message.Root time="13:49">
          <Message.Media items={[{ src: "/photo.jpg", alt: "Склад" }]} />
        </Message.Root>
        <Message.Root time="13:49">
          <Message.Media items={album} />
        </Message.Root>
        <Message.Root time="13:50">
          <Message.Media items={[{ src: "/photo.jpg", alt: "Склад" }]} />
          <Message.Text>Подпись</Message.Text>
        </Message.Root>
      </MessageList>,
    );
    const articles = screen.getAllByRole("article");
    const shells = articles.map((article) => article.querySelector<HTMLElement>("[data-shell]"));
    const tails = articles.map((article) =>
      article.querySelector("[aria-hidden='true'][data-depth]"),
    );
    const [first, middle, last, file, round, media, albumShell, caption] = shells;
    expect(first).not.toHaveAttribute("data-tail");
    expect(middle).not.toHaveAttribute("data-tail");
    expect(last).toHaveAttribute("data-tail");
    expect(file).toHaveAttribute("data-tail");
    expect(tails.map(Boolean)).toEqual([false, false, true, true, false, false, false, false]);
    expect(round).toHaveAttribute("data-shell", "round");
    expect(round).toHaveAttribute("data-meta", "overlay");
    expect(round).not.toHaveAttribute("data-tail");
    expect(media).toHaveAttribute("data-shell", "media");
    expect(media).not.toHaveAttribute("data-tail");
    expect(albumShell).not.toHaveAttribute("data-tail");
    expect(caption).toHaveAttribute("data-shell", "bubble");
    expect(caption).not.toHaveAttribute("data-tail");
    expect(articles[4]).toHaveAttribute("data-avatars", "true");
  });

  it("lays out an album and names the tiles that open the viewer", async () => {
    const onIndexChange = vi.fn();
    const items = Array.from({ length: 5 }, (_, i) => ({
      src: `/photo-${i}.jpg`,
      alt: `Стеллаж ${i + 1}`,
    }));
    render(
      <Message.Root time="09:15">
        <Message.Media items={items} viewer={false} onIndexChange={onIndexChange} />
      </Message.Root>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Открыть: Стеллаж 3" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole("article").querySelector("[data-meta]")).toHaveAttribute(
      "data-meta",
      "overlay",
    );
  });

  it("shows a file transfer with its share and a cancel", async () => {
    const onCancel = vi.fn();
    render(
      <Message.Root>
        <Message.File
          name="Спецификация.xlsx"
          fileSize={2048}
          transfer="loading"
          transferProgress={0.5}
          onCancel={onCancel}
        />
      </Message.Root>,
    );
    expect(screen.getByText("1 КБ из 2 КБ")).toBeInTheDocument();
    const cancel = screen.getByRole("button", { name: "Отменить отправку" });
    expect(cancel).toHaveAccessibleDescription("Отправка 50%");
    await userEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("links a finished file for download", () => {
    render(
      <Message.Root>
        <Message.File name="Договор.pdf" fileSize={1_258_291} href="/contract.pdf" />
      </Message.Root>,
    );
    expect(screen.getByRole("link", { name: "Скачать Договор.pdf" })).toHaveAttribute(
      "href",
      "/contract.pdf",
    );
    expect(screen.getByText("1,2 МБ")).toBeInTheDocument();
  });

  it("renders a location, a contact and a link preview", () => {
    render(
      <>
        <Message.Root>
          <Message.Location
            src="/map.png"
            href="https://maps"
            title="Склад"
            address="ул. Складочная, 1"
            live
          />
        </Message.Root>
        <Message.Root>
          <Message.Contact name="Ирина Белова" phone="+7 916 204-18-77">
            <button type="button">Написать</button>
          </Message.Contact>
        </Message.Root>
        <Message.Root>
          <Message.LinkPreview href="https://prime.app/blog" site="Блог" title="Кейс" />
        </Message.Root>
      </>,
    );
    expect(screen.getByRole("link", { name: "Открыть на карте: Склад" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByText("Трансляция")).toBeInTheDocument();
    expect(screen.getByText("ИБ")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Блог.*Кейс/ })).toHaveAttribute(
      "href",
      "https://prime.app/blog",
    );
  });

  it("measures nothing and writes no size without a layout to read (the hug waits for one)", () => {
    // Without a layout engine (no observer, no line boxes) the bubble keeps its CSS width.
    const lines = vi.fn(() => [] as unknown as DOMRectList);
    Range.prototype.getClientRects = lines;
    try {
      const { rerender } = render(
        <>
          <Message.Root time="10:00">
            <Message.Text>Две строки текста, перенесённые по ширине</Message.Text>
          </Message.Root>
          <Message.Root time="10:01" onReactionToggle={() => {}}>
            <Message.Text>Счёт оплачен</Message.Text>
            <Message.Reactions items={[{ emoji: "+1", count: 1 }]} />
          </Message.Root>
        </>,
      );
      rerender(
        <>
          <Message.Root time="10:00">
            <Message.Text>Две строки текста, перенесённые по ширине</Message.Text>
          </Message.Root>
          <Message.Root time="10:01" onReactionToggle={() => {}}>
            <Message.Text>Счёт оплачен</Message.Text>
          </Message.Root>
        </>,
      );
      expect(lines).not.toHaveBeenCalled();
      // No size is written into a bubble: its width and height are its content's.
      for (const bubble of document.querySelectorAll<HTMLElement>("[data-message-bubble]")) {
        expect(bubble.getAttribute("style")).toBeNull();
      }
    } finally {
      Reflect.deleteProperty(Range.prototype, "getClientRects");
    }
  });

  it("mounts the message menu on its first open, not with every message", async () => {
    const user = userEvent.setup();
    render(
      <Chat>
        <Message.Root value="m1" time="10:00">
          <Message.Text>Счёт оплачен</Message.Text>
          <Message.Menu>
            <Dropdown.Item>Ответить</Dropdown.Item>
          </Message.Menu>
        </Message.Root>
      </Chat>,
    );
    expect(
      screen.queryByRole("button", { name: "Действия с сообщением", hidden: true }),
    ).toBeNull();
    const article = screen.getByRole("article");
    article.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("renders separators, service lines and the unread band", () => {
    render(
      <Chat>
        <ChatSeparator>Сегодня</ChatSeparator>
        <ChatService>Анна добавила Олега</ChatService>
        <ChatUnread />
        <Message.Forwarded from="Ирина" />
      </Chat>,
    );
    expect(screen.getByText("Сегодня")).toBeInTheDocument();
    expect(screen.getByText("Анна добавила Олега")).toBeInTheDocument();
    expect(screen.getByText("Непрочитанные сообщения")).toBeInTheDocument();
    expect(screen.getByText("Ирина").tagName).toBe("STRONG");
  });
});

describe("Message shells and layout contract", () => {
  const css = readFileSync(join(__dirname, "Message.module.css"), "utf8");
  const shellOf = (index: number) =>
    screen.getAllByRole("article")[index]?.querySelector("[data-message-bubble]");

  it("decides the shell from the parts through fragments, ignoring empty children", () => {
    const photo = [{ src: "/photo.jpg", alt: "Склад", width: 800, height: 600 }];
    render(
      <React.Fragment>
        <Message.Root>
          <React.Fragment key="parts-1">
            <Message.Media items={photo} />
          </React.Fragment>
        </Message.Root>
        <Message.Root>
          <React.Fragment key="parts-2">
            {null}
            {false}
            <VideoNote src="/note.mp4" duration={6} />
          </React.Fragment>
        </Message.Root>
        <Message.Root>
          <React.Fragment key="parts-3">
            <Message.Media items={photo} />
            <Message.Text>Подпись</Message.Text>
          </React.Fragment>
        </Message.Root>
        <Message.Root>
          {null}
          <Message.Media items={photo} />
          {false}
        </Message.Root>
      </React.Fragment>,
    );
    expect(shellOf(0)).toHaveAttribute("data-shell", "media");
    expect(shellOf(1)).toHaveAttribute("data-shell", "round");
    expect(shellOf(2)).toHaveAttribute("data-shell", "bubble");
    expect(shellOf(3)).toHaveAttribute("data-shell", "media");
  });

  it("hands the meta to the reactions row: a bubble that fits its text drops the text's spacer", () => {
    render(
      <Message.Root time="14:26" direction="outgoing" status="read">
        <Message.Text>Реквизиты склада пришлю после сверки с бухгалтерией.</Message.Text>
        <Message.Reactions items={[{ emoji: "👍", count: 1 }]} />
      </Message.Root>,
    );
    const bubble = document.querySelector("[data-message-bubble]");
    expect(bubble).toHaveAttribute("data-reactions");
    expect(bubble).not.toHaveAttribute("data-sized");
    // The row carries its own spacer for the meta; the text's one leaves the layout.
    const row = screen.getByRole("group", { name: "Реакции" });
    expect(row.lastElementChild).toHaveAttribute("aria-hidden", "true");
    expect(row.lastElementChild).toHaveTextContent("14:26");
    const flat = css.replace(/\s+/g, " ");
    expect(flat).toContain(".bubble[data-reactions]:not([data-sized]) .spacer { display: none; }");
  });

  it("keeps a card's content still when the reactions row comes: its spacer stays", () => {
    render(
      <Message.Root time="10:07">
        <Message.Location src="/map.png" title="Склад" address="ул. Складочная, 1" />
        <Message.Reactions items={[{ emoji: "👍", count: 1 }]} />
      </Message.Root>,
    );
    const bubble = document.querySelector("[data-message-bubble]");
    expect(bubble).toHaveAttribute("data-sized");
    expect(bubble).toHaveAttribute("data-reactions");
  });

  it("lays a size change out at once; the morph alone moves it (no layout transitions)", () => {
    const flat = css.replace(/\s+/g, " ");
    const spacer = flat.match(/ \.spacer \{([^}]*)\}/)?.[1] ?? "";
    expect(spacer).not.toContain("transition");
    // One line of where it stands: dropping it never changes a row's height.
    expect(spacer).toContain("block-size: 1lh;");
    expect(flat).toMatch(/\.reactionsSlot \{ --disclosure-duration: 0s;/);
    const slot = flat.match(/ \.chipSlot \{([^}]*)\}/)?.[1] ?? "";
    expect(slot).not.toContain("transition");
    expect(flat).not.toContain("@starting-style { .chipSlot");
  });

  it("keeps the run's rhythm (no room held for reactions) and grows on the standard clock", () => {
    const flat = css.replace(/\s+/g, " ");
    // Half a run's gap on each side of a row, nothing else: 8 inside a run, 16 between runs.
    expect(flat).toContain("padding-block: calc(var(--prime-message-group-gap) / 2);");
    expect(flat).not.toContain("--message-reserve");
    expect(flat).toContain("--message-morph-ease: var(--prime-motion-easing-standard);");
    // The meta stands on the chips' line bottom, where it stands without them: never moved.
    expect(flat).not.toMatch(/\[data-reactions\] > \.meta \{ translate/);
  });

  it("paints a still bubble's fill on the bubble; the fill layer exists only while it morphs", () => {
    const flat = css.replace(/\s+/g, " ");
    expect(flat).toContain('.bubble[data-shell="bubble"] { background: var(--message-fill); }');
    expect(flat).toMatch(/\.fill \{[^}]*display: none;/);
    expect(flat).toContain("[data-morphing] .fill { display: block; }");
  });

  it("marks selection and pointing by the others stepping back, from one list attribute", () => {
    const flat = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");
    const back = ".root:not([data-selected]) > :is(.gutter, .column, .retry)";
    expect(flat).toContain(`[data-message-list][data-selecting] ${back}`);
    expect(flat).toContain(
      '[data-message-list][data-pointing="current"] .root:not([data-pointed])',
    );
    expect(flat).toContain("opacity: var(--prime-message-dim-opacity);");
    expect(flat).toContain("filter: saturate(var(--prime-message-dim-saturation));");
    // Nothing drawn on the message: no outline, wash or ring of a selected or pointed bubble.
    expect(flat).not.toMatch(/data-(flash|current)/);
    expect(flat).not.toMatch(/\[data-selected\][^{]*::(before|after)/);
    expect(flat).not.toContain(":has(");
  });

  it("gives a picture message no backing, and an album neutral gaps in both directions", () => {
    const album = [
      { src: "/a.jpg", alt: "Склад", width: 800, height: 600 },
      { src: "/b.jpg", alt: "Стеллаж", width: 800, height: 600 },
    ];
    render(
      <MessageList aria-label="Чат">
        <Message.Root value="in">
          <Message.Media items={album} />
        </Message.Root>
        <Message.Root value="out" direction="outgoing">
          <Message.Media items={album} />
        </Message.Root>
      </MessageList>,
    );
    const [incoming, outgoing] = screen.getAllByRole("article");
    const gapsOf = (article: HTMLElement | undefined) =>
      article?.querySelector("[data-message-bubble] [data-depth]")?.getAttribute("data-depth");
    // The outgoing album's gaps stand on an incoming surface, never the tinted outgoing fill.
    expect(gapsOf(outgoing)).toBe(gapsOf(incoming));
    expect(gapsOf(outgoing)).not.toBe("tinted");
    expect(css).toMatch(/\.bubble\[data-shell="media"\] \{\s*padding: 0;\s*background: none;/);
  });

  it("marks only real text as selectable", () => {
    render(
      <Message.Root time="10:00" status="read" onReactionToggle={() => {}}>
        <Message.Text>Счёт отправлен</Message.Text>
        <Message.Reactions items={[{ emoji: "+1", count: 1 }]} />
      </Message.Root>,
    );
    const article = screen.getByRole("article");
    expect(
      screen.getByRole("button", { name: "+1: 1" }).closest("[data-message-selectable]"),
    ).toBeNull();
    // The meta (the visible one; its spacer copies are hidden and never selectable in CSS).
    const meta = article.querySelector("[data-message-meta]");
    expect(meta?.closest("[data-message-selectable]")).toBeNull();
    expect(css).toMatch(/\.meta \{[^}]*user-select: none;/);
  });
});
