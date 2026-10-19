import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import type { MessageStatus } from "@/components/message/Message";
import { Send } from "@/icons/glyphs/send";

import { ChatList, type ChatListRootProps, formatChatTime } from "./ChatList";

type Dialog = {
  id: string;
  name: string;
  preview?: string;
  unread?: number;
  muted?: boolean;
  pinned?: boolean;
  mention?: boolean;
  typing?: boolean | string;
  draft?: string;
  status?: MessageStatus;
  time?: string;
};

const DIALOGS: Dialog[] = [
  { id: "vector", name: "ООО «Вектор»", preview: "Счёт не выгружается", unread: 2, time: "14:32" },
  { id: "granit", name: "ООО «Гранит»", preview: "Акт сверки подписан" },
  { id: "kozlov", name: "ИП Козлов", preview: "Подключите ЭДО" },
];

type Props = Omit<Partial<ChatListRootProps<Dialog>>, "renderItem"> & {
  onDelete?: (id: string) => void;
};

function Dialogs({ items = DIALOGS, onDelete, ...props }: Props) {
  return (
    <ChatList.Root
      items={items}
      getKey={(item) => item.id}
      {...props}
      renderItem={(item) => (
        <ChatList.Item
          time={item.time}
          unread={item.unread}
          muted={item.muted}
          pinned={item.pinned}
          mention={item.mention}
          typing={item.typing}
          draft={item.draft}
          status={item.status}
        >
          <ChatList.ItemText>{item.name}</ChatList.ItemText>
          {item.preview ? (
            <ChatList.ItemDescription>{item.preview}</ChatList.ItemDescription>
          ) : null}
          {onDelete ? (
            <ChatList.ItemMenu>
              <Dropdown.Item tone="danger" onSelect={() => onDelete(item.id)}>
                Удалить
              </Dropdown.Item>
            </ChatList.ItemMenu>
          ) : null}
        </ChatList.Item>
      )}
    />
  );
}

const row = (name: RegExp) => screen.getByRole("button", { name });

describe("ChatList", () => {
  it("renders a named list of dialog rows, the open one current", () => {
    render(<Dialogs defaultValue="granit" />);
    const list = screen.getByRole("list", { name: "Диалоги" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(row(/Гранит/)).toHaveAttribute("aria-current", "true");
    expect(row(/Вектор/)).not.toHaveAttribute("aria-current");
  });

  it("names a row by its name, preview, time and a spoken unread count", () => {
    render(<Dialogs />);
    expect(
      screen.getByRole("button", {
        name: "ООО «Вектор» Счёт не выгружается 14:32 непрочитанных: 2",
      }),
    ).toBeInTheDocument();
  });

  it("opens a dialog on click and reports the new value first", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Dialogs defaultValue="vector" onValueChange={onValueChange} />);
    await user.click(row(/Козлов/));
    expect(onValueChange).toHaveBeenCalledWith("kozlov");
    expect(row(/Козлов/)).toHaveAttribute("aria-current", "true");
  });

  it("keeps the value of a controlled list", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Dialogs value="vector" onValueChange={onValueChange} />);
    await user.click(row(/Гранит/));
    expect(onValueChange).toHaveBeenCalledWith("granit");
    expect(row(/Вектор/)).toHaveAttribute("aria-current", "true");
  });

  it("is one Tab stop: arrows, Home and End move the focus, Enter opens", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Dialogs defaultValue="granit" onValueChange={onValueChange} />);
    await user.tab();
    expect(row(/Гранит/)).toHaveFocus();
    expect(row(/Вектор/)).toHaveAttribute("tabindex", "-1");
    await user.keyboard("{ArrowDown}");
    expect(row(/Козлов/)).toHaveFocus();
    // The focus does not open a dialog.
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard("{ArrowDown}");
    expect(row(/Козлов/)).toHaveFocus();
    await user.keyboard("{Home}");
    expect(row(/Вектор/)).toHaveFocus();
    await user.keyboard("{End}");
    expect(row(/Козлов/)).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(row(/Гранит/)).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard("{ArrowUp}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("vector");
    await user.keyboard("{ArrowDown}");
    await user.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith("granit");
    await user.keyboard("{ArrowUp}");
    // The Tab stop follows the focus: Tab leaves the list.
    expect(row(/Вектор/)).toHaveAttribute("tabindex", "0");
    expect(row(/Гранит/)).toHaveAttribute("tabindex", "-1");
  });

  it("shows the search field for the search triad, marks matches and moves into the list", async () => {
    const user = userEvent.setup();
    function Search() {
      const [query, setQuery] = React.useState("");
      const needle = query.toLowerCase();
      const items = DIALOGS.filter(
        (item) =>
          item.name.toLowerCase().includes(needle) ||
          (item.preview ?? "").toLowerCase().includes(needle),
      );
      return <Dialogs items={items} search={query} onSearchChange={setQuery} />;
    }
    render(<Search />);
    const field = screen.getByRole("searchbox", { name: "Поиск по диалогам" });
    await user.type(field, "акт");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    const mark = row(/Гранит/).querySelector("mark");
    expect(mark).toHaveTextContent("Акт");
    expect(screen.getByRole("status")).toHaveTextContent("Найдено: 1");
    await user.keyboard("{ArrowDown}");
    expect(row(/Гранит/)).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(field).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(field).toHaveValue("");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("stands its actions between the search and the dialogs, sized from the list's tier", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const { container, rerender } = render(
      <Dialogs search="" onSearchChange={() => {}} size="s">
        <ChatList.Actions data-testid="actions">
          <Button.Root fullWidth onClick={onCreate}>
            Новый чат
          </Button.Root>
        </ChatList.Actions>
      </Dialogs>,
    );
    const root = container.firstElementChild as HTMLElement;
    const actions = screen.getByTestId("actions");
    const create = screen.getByRole("button", { name: "Новый чат" });
    expect(actions.previousElementSibling).toContainElement(screen.getByRole("searchbox"));
    // The search and the actions are one block over the list.
    expect(actions.parentElement).toContainElement(screen.getByRole("searchbox"));
    expect(actions.parentElement?.nextElementSibling).toContainElement(screen.getByRole("list"));
    expect(create).toHaveAttribute("data-size", "s");
    await user.click(screen.getByRole("searchbox"));
    await user.tab();
    expect(create).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onCreate).toHaveBeenCalledTimes(1);
    // Without a search the actions open the pane.
    rerender(
      <Dialogs>
        <ChatList.Actions data-testid="actions">
          <Button.Root>Новый чат</Button.Root>
        </ChatList.Actions>
      </Dialogs>,
    );
    expect(root.firstElementChild).toBe(screen.getByTestId("actions").parentElement);
    expect(root.firstElementChild?.firstElementChild).toBe(screen.getByTestId("actions"));
  });

  it("shows nothing found for an empty search and its own empty state otherwise", () => {
    const { unmount } = render(<Dialogs items={[]} defaultSearch="склад" />);
    expect(screen.getByRole("heading", { name: "Ничего не найдено" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Ничего не найдено");
    expect(screen.queryByRole("list", { name: "Диалоги" })).toBeNull();
    unmount();
    render(<Dialogs items={[]} empty={<p>Диалогов пока нет</p>} />);
    expect(screen.getByText("Диалогов пока нет")).toBeInTheDocument();
  });

  it("stands placeholder rows in while loading, then swaps to the dialogs", () => {
    const { container, rerender } = render(<Dialogs items={[]} loading />);
    const scroller = container.querySelector("[aria-busy='true']");
    expect(scroller).not.toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Загрузка диалогов");
    expect(screen.queryByRole("list", { name: "Диалоги" })).toBeNull();
    expect(container.querySelectorAll("ul[inert] li")).toHaveLength(6);
    rerender(<Dialogs />);
    expect(screen.getByRole("list", { name: "Диалоги" })).toBeInTheDocument();
    expect(row(/Вектор/)).toBeInTheDocument();
    expect(container.querySelector("[aria-busy='true']")).toBeNull();
  });

  it("ends the list with a placeholder row and loads more near the end", () => {
    const onLoadMore = vi.fn();
    const { container } = render(<Dialogs hasMore onLoadMore={onLoadMore} />);
    expect(container.querySelectorAll("ul[inert] li")).toHaveLength(1);
  });

  it("turns the preview into «печатает…» and a draft, the hidden layers out of the name", () => {
    const { rerender } = render(<Dialogs items={[{ ...DIALOGS[1], typing: true } as Dialog]} />);
    expect(row(/Гранит/)).toHaveAccessibleName("ООО «Гранит» печатает…");
    rerender(<Dialogs items={[{ ...DIALOGS[1], typing: "Анна" } as Dialog]} />);
    expect(row(/Гранит/)).toHaveAccessibleName("ООО «Гранит» Анна печатает…");
    rerender(<Dialogs items={[{ ...DIALOGS[1], draft: "Отправлю вечером" } as Dialog]} />);
    expect(row(/Гранит/)).toHaveAccessibleName("ООО «Гранит» Черновик: Отправлю вечером");
    rerender(<Dialogs items={[DIALOGS[1] as Dialog]} />);
    expect(row(/Гранит/)).toHaveAccessibleName("ООО «Гранит» Акт сверки подписан");
  });

  it("names the delivery mark, the muted and pinned glyphs and the mention", () => {
    render(
      <Dialogs
        items={[
          {
            id: "a",
            name: "Склад",
            status: "read",
            time: "09:00",
            muted: true,
            unread: 3,
            mention: true,
          },
          { id: "b", name: "Лето", status: "failed", pinned: true },
        ]}
      />,
    );
    expect(row(/Склад/)).toHaveAccessibleName(
      "Склад Без звука Прочитано 09:00 упоминание непрочитанных: 3",
    );
    expect(row(/Лето/)).toHaveAccessibleName("Лето Не отправлено Закреплён");
    expect(row(/Склад/)).toHaveAttribute("data-muted", "true");
  });

  it("names a glyph after the name by the part's aria-label, whatever icon it holds", () => {
    render(
      <ChatList.Root
        items={["a"]}
        getKey={(item) => item}
        renderItem={() => (
          <ChatList.Item>
            <ChatList.ItemText>Орлов</ChatList.ItemText>
            <ChatList.ItemIcon aria-label="Telegram-бот @way2ride_bot">
              <Send />
            </ChatList.ItemIcon>
            <ChatList.ItemIcon>
              <Send />
            </ChatList.ItemIcon>
          </ChatList.Item>
        )}
      />,
    );
    const mark = screen.getByRole("img", { name: "Telegram-бот @way2ride_bot" });
    expect(mark.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(row(/Орлов/)).toHaveAccessibleName("Орлов Telegram-бот @way2ride_bot");
  });

  it("writes the media word, the length and the author into the preview", () => {
    render(
      <ChatList.Root
        items={["a"]}
        getKey={(item) => item}
        renderItem={() => (
          <ChatList.Item>
            <ChatList.ItemText>Орлов</ChatList.ItemText>
            <ChatList.ItemDescription author="Вы" kind="voice" duration={42} />
          </ChatList.Item>
        )}
      />,
    );
    expect(row(/Орлов/)).toHaveAccessibleName("Орлов Вы: Голосовое сообщение 0:42");
  });

  it("opens the row menu on right click and from the keyboard, focus returning to the row", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Dialogs onDelete={onDelete} />);
    const vector = row(/Вектор/);
    expect(vector).toHaveAttribute("aria-keyshortcuts", "Shift+F10");
    fireEvent.contextMenu(vector, { clientX: 20, clientY: 30 });
    const item = await screen.findByRole("menuitem", { name: "Удалить" });
    await user.click(item);
    expect(onDelete).toHaveBeenCalledWith("vector");

    row(/Гранит/).focus();
    await user.keyboard("{Shift>}{F10}{/Shift}");
    expect(await screen.findByRole("menuitem", { name: "Удалить" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    expect(row(/Гранит/)).toHaveFocus();

    await user.keyboard("{ContextMenu}");
    expect(await screen.findByRole("menuitem", { name: "Удалить" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    expect(row(/Гранит/)).toHaveFocus();
  });

  it("opens the menu on a long press and does not open the dialog", () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(<Dialogs onDelete={() => {}} onValueChange={onValueChange} />);
    const granit = row(/Гранит/);
    fireEvent.pointerDown(granit, { pointerType: "touch", clientX: 10, clientY: 10 });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    fireEvent.pointerUp(granit, { pointerType: "touch" });
    fireEvent.click(granit);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("menuitem", { name: "Удалить" })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("keeps a dialog's row when it moves to the top; a new dialog rises in, a removed one leaves", () => {
    const { rerender } = render(<Dialogs />);
    const kozlov = row(/Козлов/);
    const reordered = [DIALOGS[2], DIALOGS[0], DIALOGS[1]] as Dialog[];
    rerender(<Dialogs items={reordered} />);
    expect(row(/Козлов/)).toBe(kozlov);
    expect(screen.getAllByRole("button").map((node) => node.dataset.dndItem)).toEqual([
      "kozlov",
      "vector",
      "granit",
    ]);
    expect(kozlov.className).not.toMatch(/enter/);
    rerender(<Dialogs items={[{ id: "leto", name: "ООО «Лето»" }, ...reordered]} />);
    expect(row(/Лето/).className).toMatch(/enter/);
    rerender(<Dialogs items={reordered} />);
    expect(screen.queryByRole("button", { name: /Лето/ })).toBeNull();
  });

  it("throws when an item is rendered outside the root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ChatList.Item>x</ChatList.Item>)).toThrow(/ChatList.Root/);
    vi.restoreAllMocks();
  });
});

describe("formatChatTime", () => {
  const now = new Date(2026, 9, 14, 15, 0);
  it("shows the time today, the weekday this week, the date before", () => {
    expect(formatChatTime(new Date(2026, 9, 14, 9, 5), now)).toBe("09:05");
    expect(formatChatTime(new Date(2026, 9, 13, 23, 0), now)).toBe("вт");
    expect(formatChatTime(new Date(2026, 9, 8, 12, 0), now)).toBe("чт");
    expect(formatChatTime(new Date(2026, 9, 7, 12, 0), now)).toBe("7 окт");
    expect(formatChatTime(new Date(2025, 2, 12, 12, 0), now)).toBe("12.03.2025");
  });

  it("reads today, the weekday and the clock in timeZone", () => {
    const now = new Date(Date.UTC(2026, 9, 15, 4, 0));
    const lateEvening = new Date(Date.UTC(2026, 9, 14, 14, 30));
    expect(formatChatTime(lateEvening, now, "Europe/Moscow")).toBe("ср");
    expect(formatChatTime(lateEvening, now, "Asia/Vladivostok")).toBe("00:30");
  });
});

/** A router link as a router draws it: the owner's `onClick` first, then its own navigation. */
function RouterLink({
  to,
  navigate,
  onClick,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; navigate: (to: string) => void }) {
  return (
    <a
      {...rest}
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        navigate(to);
      }}
    />
  );
}

describe("ChatList.Item asChild", () => {
  it("renders the consumer's element as the row with the parts inside it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const navigate = vi.fn();
    render(
      <ChatList.Root
        items={DIALOGS}
        getKey={(item) => item.id}
        onValueChange={onValueChange}
        renderItem={(item) => (
          <ChatList.Item asChild unread={item.unread}>
            <RouterLink to={`/chats/${item.id}`} navigate={navigate}>
              <ChatList.ItemText>{item.name}</ChatList.ItemText>
              <ChatList.ItemDescription>{item.preview}</ChatList.ItemDescription>
            </RouterLink>
          </ChatList.Item>
        )}
      />,
    );
    const row = screen.getByRole("link", { name: /ООО «Вектор»/ });
    expect(row).toHaveAttribute("href", "/chats/vector");
    expect(within(row).getByText("Счёт не выгружается")).toBeInTheDocument();
    await user.click(row);
    expect(onValueChange).toHaveBeenCalledWith("vector");
    expect(navigate).toHaveBeenCalledWith("/chats/vector");
    expect(row).toHaveAttribute("aria-current", "page");
    // Enter on the focused link opens it the same way.
    const next = screen.getByRole("link", { name: /ООО «Гранит»/ });
    next.focus();
    await user.keyboard("{Enter}");
    expect(navigate).toHaveBeenLastCalledWith("/chats/granit");
  });

  it("shows the row times in the root's timeZone", () => {
    const sent = new Date(Date.UTC(2026, 9, 14, 23, 30));
    render(
      <ChatList.Root
        items={DIALOGS.slice(0, 1)}
        getKey={(item) => item.id}
        now={new Date(Date.UTC(2026, 9, 15, 2, 0))}
        timeZone="Asia/Vladivostok"
        renderItem={(item) => (
          <ChatList.Item time={sent}>
            <ChatList.ItemText>{item.name}</ChatList.ItemText>
          </ChatList.Item>
        )}
      />,
    );
    expect(screen.getByText("09:30")).toHaveAttribute("datetime", sent.toISOString());
  });

  it("draws the record status as badges on a line under the preview", () => {
    render(
      <ChatList.Root
        items={DIALOGS.slice(0, 1)}
        getKey={(item) => item.id}
        renderItem={(item) => (
          <ChatList.Item>
            <ChatList.ItemText>{item.name}</ChatList.ItemText>
            <ChatList.ItemDescription>{item.preview}</ChatList.ItemDescription>
            <ChatList.ItemStatus data-testid="record">
              <Badge.Root color="yellow">Бронь</Badge.Root>
              <Badge.Root tone="warning">Ждёт человека</Badge.Root>
            </ChatList.ItemStatus>
          </ChatList.Item>
        )}
      />,
    );
    const row = screen.getByRole("button", { name: /ООО «Вектор»/ });
    const record = within(row).getByTestId("record");
    const preview = within(row).getByText("Счёт не выгружается");
    expect(record).toHaveTextContent("Бронь");
    expect(record).toHaveTextContent("Ждёт человека");
    // Name, then the preview, then the badges.
    expect(preview.compareDocumentPosition(record) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // The compact tier, in one line with a «+N» badge behind them.
    const group = record.querySelector("[data-overflow]");
    expect(group).toHaveAttribute("data-overflow", "count");
    expect(group).toHaveAttribute("data-tier", "xs");
    expect(row).toHaveAttribute("data-record", "true");
  });
});
