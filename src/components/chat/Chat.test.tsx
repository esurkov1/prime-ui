import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Message } from "@/components/message/Message";
import { cssRule, cssValue } from "@/test/css";

import { Chat } from "./Chat";

const CSS = "src/components/chat/Chat.module.css";

/** The place of the match as the live region says it (the visible count is `aria-hidden`). */
const ANNOUNCED = { ignore: "[aria-hidden='true'], [aria-hidden='true'] *" };

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
  it("an inline chat without a header puts its search on the host's top edge", () => {
    const first = cssRule(CSS, '.root[data-variant="inline"] > .search:not(.header ~ .search)');
    expect(cssValue(first, "padding-block-start")).toBe("0");
    // After a header the search keeps its own air above it.
    expect(cssValue(cssRule(CSS, ".search"), "padding")).toBe(
      "var(--prime-space-2) var(--prime-space-3)",
    );
  });

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

  it("reads the days, the runs and the message times in timeZone", () => {
    const utc = (day: number, hour: number) => new Date(Date.UTC(2026, 9, day, hour, 0));
    const items: Item[] = [
      { id: "z1", from: "anna", at: utc(7, 12), text: "Машина вышла" },
      { id: "z2", from: "anna", at: utc(7, 15), text: "Водитель на месте" },
    ];
    render(
      <Chat.Root>
        <Chat.Messages
          aria-label="Переписка"
          items={items}
          getKey={(item) => item.id}
          getAuthor={(item) => item.from}
          getDate={(item) => item.at}
          renderMessage={(item) => (
            <Message.Root time={item.at}>
              <Message.Text>{item.text}</Message.Text>
            </Message.Root>
          )}
          now={utc(8, 3)}
          timeZone="Asia/Vladivostok"
        />
      </Chat.Root>,
    );
    const log = screen.getByRole("log", { name: "Переписка" });
    expect(within(log).getByText("Вчера")).toBeInTheDocument();
    expect(within(log).getByText("Сегодня")).toBeInTheDocument();
    expect(article("z1")).toHaveAttribute("data-position", "single");
    expect(article("z2").querySelector("[data-message-meta] time")).toHaveTextContent("01:00");
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
    expect(screen.getByText("2 из 2", ANNOUNCED)).toBeInTheDocument();
    expect(document.querySelectorAll("mark")).toHaveLength(2);
    const log = screen.getByRole("log");
    expect(log).toHaveAttribute("data-pointing", "current");
    expect(article("m3")).toHaveAttribute("data-pointed");
    fireEvent.keyDown(field, { key: "Enter" });
    expect(screen.getByText("1 из 2", ANNOUNCED)).toBeInTheDocument();
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
    expect(screen.getByText("Нет совпадений", ANNOUNCED)).toBeInTheDocument();
  });

  it("a pinned message's press brings it into view and blinks it", () => {
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

  it("puts every child that is not the text or the actions side by side in one lead", () => {
    render(
      <Chat.Root>
        <Chat.Header data-testid="header">
          <button type="button">Назад</button>
          <React.Fragment key="who">
            <span data-testid="avatar">ИБ</span>
            <span>Клиент</span>
          </React.Fragment>
          <Chat.Title>ООО «Вектор»</Chat.Title>
          <Chat.Description>в сети</Chat.Description>
          <Chat.Actions>
            <Chat.SearchButton />
          </Chat.Actions>
        </Chat.Header>
        <Chat.Messages />
      </Chat.Root>,
    );
    const header = screen.getByTestId("header");
    const lead = header.firstElementChild as HTMLElement;
    // One wrapper holds the back button and the avatar, in the order written.
    expect(within(lead).getByRole("button", { name: "Назад" })).toBeInTheDocument();
    expect(within(lead).getByTestId("avatar")).toBeInTheDocument();
    expect(lead.children).toHaveLength(3);
    // The text column and the actions follow the lead as direct children of the header.
    expect(header.children).toHaveLength(3);
    expect(header).toHaveAttribute("data-lines", "two");
    expect(header.children[1]).toContainElement(
      screen.getByRole("heading", { name: "ООО «Вектор»" }),
    );
  });

  it("has no lead without a leading child", () => {
    render(
      <Chat.Root>
        <Chat.Header data-testid="header">
          <Chat.Title>ООО «Вектор»</Chat.Title>
        </Chat.Header>
        <Chat.Messages />
      </Chat.Root>,
    );
    expect(screen.getByTestId("header").children).toHaveLength(1);
    expect(screen.getByTestId("header")).toHaveAttribute("data-lines", "one");
  });

  it("stands placeholders in the list's place while loading, busy and announced, then shows the list", () => {
    const view = (loading: boolean) => (
      <Chat.Root>
        <Chat.Messages aria-label="Переписка с ООО «Вектор»" loading={loading}>
          <Message.Root value="a" time="10:00">
            <Message.Text>Счёт оплачен</Message.Text>
          </Message.Root>
        </Chat.Messages>
      </Chat.Root>
    );
    const { rerender } = render(view(true));
    expect(screen.queryByRole("log")).toBeNull();
    expect(screen.queryByText("Счёт оплачен")).toBeNull();
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Загрузка сообщений");
    rerender(view(false));
    expect(screen.getByRole("log", { name: "Переписка с ООО «Вектор»" })).toBeInTheDocument();
    expect(screen.getByText("Счёт оплачен")).toBeInTheDocument();
    expect(document.querySelector('[aria-busy="true"]')).toBeNull();
    expect(screen.queryByText("Загрузка сообщений")).toBeNull();
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
