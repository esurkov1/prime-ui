import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Message } from "@/components/message/Message";

import { Chat } from "./Chat";

type Item = { id: string; from: "anna" | "me"; at: Date; text: string; service?: boolean };

const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const ITEMS: Item[] = [
  { id: "m1", from: "anna", at: at(7, 9, 0), text: "Счёт INV-2048 выставлен" },
  { id: "m2", from: "anna", at: at(7, 9, 1), text: "Проверьте реквизиты" },
  { id: "s1", from: "anna", at: at(8, 9, 0), text: "Анна закрепила счёт", service: true },
  { id: "m3", from: "me", at: at(8, 9, 5), text: "Счёт оплачен" },
  { id: "m4", from: "anna", at: at(8, 9, 6), text: "Спасибо!" },
];

const NOW = at(8, 12, 0);

function Thread({
  items = ITEMS,
  render: renderMessage,
  ...rest
}: Omit<React.ComponentProps<typeof Chat.Root>, "children"> & {
  items?: Item[];
  render?: (item: Item) => React.ReactElement;
}) {
  const draw = React.useCallback(
    (item: Item) =>
      item.service ? (
        <Chat.Service>{item.text}</Chat.Service>
      ) : (
        <Message.Root direction={item.from === "me" ? "outgoing" : "incoming"} time={item.at}>
          <Message.Text>{item.text}</Message.Text>
          <Message.Menu>
            <span />
          </Message.Menu>
        </Message.Root>
      ),
    [],
  );
  return (
    <Chat.Root {...rest}>
      <Chat.Header>
        <Chat.Title>Анна Котова</Chat.Title>
        <Chat.Description>в сети</Chat.Description>
        <Chat.Actions>
          <Chat.SearchButton />
        </Chat.Actions>
      </Chat.Header>
      <Chat.Search />
      <Chat.Pinned items={[{ value: "m1", text: "Счёт INV-2048 выставлен" }]} />
      <Chat.Messages
        items={items}
        getKey={(item) => item.id}
        getAuthor={(item) => item.from}
        getDate={(item) => item.at}
        isService={(item) => item.service === true}
        renderMessage={renderMessage ?? draw}
        unread="m4"
        now={NOW}
      />
      <Chat.Footer>
        <textarea aria-label="Сообщение" />
      </Chat.Footer>
    </Chat.Root>
  );
}

const article = (id: string) =>
  document.querySelector<HTMLElement>(`[data-message-value="${id}"]`) as HTMLElement;

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Chat: the conversation assembled", () => {
  it("builds the rows from items: dates, runs, the unread band, values and positions", () => {
    render(<Thread />);
    const log = screen.getByRole("log", { name: "Анна Котова" });
    expect(within(log).getByText("Вчера")).toBeInTheDocument();
    expect(within(log).getByText("Сегодня")).toBeInTheDocument();
    expect(within(log).getByText("Анна закрепила счёт")).toBeInTheDocument();
    // The run of two: first and last; the service line breaks runs around it.
    expect(article("m1")).toHaveAttribute("data-position", "first");
    expect(article("m2")).toHaveAttribute("data-position", "last");
    expect(article("m3")).toHaveAttribute("data-position", "single");
    // The band stands right above the first unread message.
    const band = within(log).getByText("Непрочитанные сообщения");
    expect(band.compareDocumentPosition(article("m4")) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(article("m4")).toHaveAttribute("aria-posinset", "4");
    expect(article("m4")).toHaveAttribute("aria-setsize", "4");
  });

  it("takes the text of the unread band from Chat.Root labels", () => {
    render(<Thread labels={{ unread: "Новые" }} />);
    expect(screen.getByText("Новые")).toBeInTheDocument();
    expect(screen.queryByText("Непрочитанные сообщения")).toBeNull();
  });

  it("renders an item again only when its data or its place changed", () => {
    const draw = vi.fn((item: Item) => (
      <Message.Root time={item.at}>
        <Message.Text>{item.text}</Message.Text>
      </Message.Root>
    ));
    const { rerender } = render(<Thread render={draw} />);
    // Four messages and the service line.
    const first = draw.mock.calls.length;
    expect(first).toBe(5);
    rerender(<Thread render={draw} />);
    expect(draw.mock.calls.length).toBe(first);
    const edited = ITEMS.map((item) => (item.id === "m3" ? { ...item, text: "Оплачено" } : item));
    rerender(<Thread render={draw} items={edited} />);
    expect(draw.mock.calls.length).toBe(first + 1);
    expect(article("m3")).toHaveTextContent("Оплачено");
  });

  it("turns the status into «печатает…» and ends the list with the typing bubble", () => {
    const { rerender } = render(<Thread />);
    expect(screen.getByText("в сети")).toBeInTheDocument();
    expect(screen.queryByText("Собеседник печатает")).toBeNull();
    rerender(<Thread typing />);
    expect(screen.getAllByText("печатает…").length).toBeGreaterThan(0);
    expect(screen.getByText("Собеседник печатает")).toBeInTheDocument();
  });

  it("searches: the button opens the bar, matches are marked and counted, Enter steps, Escape closes", async () => {
    render(<Thread />);
    await userEvent.click(screen.getByRole("button", { name: "Поиск по переписке" }));
    const field = screen.getByRole("searchbox", { name: "Поиск по переписке" });
    expect(field).toHaveFocus();
    await userEvent.type(field, "счёт");
    // m1 and m3 hold the query; the newest is current.
    expect(screen.getByText("2 из 2")).toBeInTheDocument();
    expect(document.querySelectorAll("mark")).toHaveLength(2);
    const log = screen.getByRole("log");
    expect(log).toHaveAttribute("data-pointing", "current");
    expect(article("m3")).toHaveAttribute("data-pointed");
    fireEvent.keyDown(field, { key: "Enter" });
    expect(screen.getByText("1 из 2")).toBeInTheDocument();
    expect(article("m1")).toHaveAttribute("data-pointed");
    // Focus stays in the field while the chat moves.
    expect(field).toHaveFocus();
    fireEvent.keyDown(field, { key: "Escape" });
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(screen.getByRole("button", { name: "Поиск по переписке" })).toHaveFocus();
    expect(document.querySelectorAll("mark")).toHaveLength(0);
  });

  it("says when nothing matches", async () => {
    render(<Thread defaultSearch="накладная" />);
    expect(screen.getByText("Нет совпадений")).toBeInTheDocument();
  });

  it("a pinned message's press brings it into view and blinks the others", () => {
    render(<Thread />);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /Закреплённое сообщение/ }));
    });
    expect(article("m1")).toHaveAttribute("data-pointed");
    expect(screen.getByRole("log")).toHaveAttribute("data-pointing", "a");
  });

  it("offers selection only when the root owns a selection", async () => {
    const onSelectedChange = vi.fn();
    const { unmount } = render(<Thread />);
    fireEvent.contextMenu(within(article("m3")).getByText("Счёт оплачен"));
    expect(screen.queryByRole("menuitem", { name: "Выбрать" })).toBeNull();
    unmount();
    render(<Thread selected={null} onSelectedChange={onSelectedChange} />);
    fireEvent.contextMenu(within(article("m3")).getByText("Счёт оплачен"));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Выбрать" }));
    expect(onSelectedChange).toHaveBeenCalledWith(["m3"]);
  });

  it("names the list by its title, or by its label without one", () => {
    render(
      <Chat.Root>
        <Chat.Messages>
          <Message.Root value="a" time="10:00">
            <Message.Text>Без шапки</Message.Text>
          </Message.Root>
        </Chat.Messages>
      </Chat.Root>,
    );
    expect(screen.getByRole("log", { name: "Переписка" })).toBeInTheDocument();
  });
});
