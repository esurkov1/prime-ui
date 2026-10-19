import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Dnd } from "@/components/dnd/Dnd";
import { withMotion } from "@/test/motion";

import { Kanban, type KanbanColumn, type KanbanMove, type KanbanValue } from "./Kanban";

type Task = { id: string; title: string };

const TASKS: Task[] = [
  { id: "a", title: "Счёт для «Севера»" },
  { id: "b", title: "Отчёт по складу" },
  { id: "c", title: "Онбординг" },
  { id: "d", title: "Тариф для партнёров" },
];

const COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "К выполнению" },
  { id: "doing", title: "В работе" },
  { id: "done", title: "Готово" },
];

const PLACEMENT: KanbanValue = { todo: ["a", "b"], doing: ["c"], done: [] };

type BoardProps = Partial<React.ComponentProps<typeof Kanban.Root<Task>>>;

function Board(props: BoardProps) {
  return (
    <Kanban.Root
      aria-label="Доска"
      columns={COLUMNS}
      items={TASKS}
      getId={(task) => task.id}
      getLabel={(task) => task.title}
      defaultValue={PLACEMENT}
      renderItem={(task) => (
        <Kanban.Item data-testid={`card-${task.id}`}>
          <Kanban.ItemTitle>{task.title}</Kanban.ItemTitle>
        </Kanban.Item>
      )}
      {...props}
    />
  );
}

const column = (title: string) => within(screen.getByRole("list", { name: title }));
const titles = (title: string) =>
  column(title)
    .queryAllByRole("listitem")
    .map((item) => item.textContent);

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("Kanban", () => {
  it("draws every column as a list named by its heading, with its cards and count", () => {
    render(<Board />);
    // The named board is a group.
    expect(screen.getByRole("group", { name: "Доска" })).toHaveAttribute("data-variant");
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);
    expect(titles("В работе")).toEqual(["Онбординг"]);
    expect(screen.getByRole("heading", { name: "В работе" })).toBeInTheDocument();
    expect(screen.getByText("Карточек: 2")).toBeInTheDocument();
    // The card the data has but no column holds is not drawn.
    expect(screen.queryByText("Тариф для партнёров")).toBeNull();
  });

  it("shows the empty state in a column without cards: the text alone", () => {
    render(<Board />);
    const done = screen.getByRole("list", { name: "Готово" }).parentElement as HTMLElement;
    expect(within(done).getByText("Нет карточек").parentElement).toHaveTextContent(
      /^Нет карточек$/,
    );
  });

  it("reads a WIP limit as count of limit", () => {
    render(
      <Board
        columns={[COLUMNS[0] as KanbanColumn, { id: "doing", title: "В работе", limit: 1 }]}
      />,
    );
    expect(screen.getByText("Карточек: 1 из 1")).toBeInTheDocument();
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
    expect(document.querySelector('[data-kanban-column="doing"]')).toHaveAttribute("data-full");
  });

  it("moves a card to the next column with Alt+→, reports the move, keeps focus on it and announces it", () => {
    const onValueChange = vi.fn();
    render(<Board onValueChange={onValueChange} />);
    const card = screen.getByTestId("card-b");
    card.focus();
    fireEvent.keyDown(card, { key: "ArrowRight", altKey: true });

    const move: KanbanMove = { id: "b", from: "todo", to: "doing", index: 1 };
    expect(onValueChange).toHaveBeenCalledWith({ todo: ["a"], doing: ["c", "b"], done: [] }, move);
    expect(titles("В работе")).toEqual(["Онбординг", "Отчёт по складу"]);
    expect(document.activeElement).toBe(screen.getByTestId("card-b"));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Отчёт по складу: «В работе», позиция 2 из 2",
    );
  });

  it("keeps the row: the first card lands first in the next column, Alt+← brings it back", () => {
    render(<Board />);
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowRight", altKey: true });
    expect(titles("В работе")).toEqual(["Счёт для «Севера»", "Онбординг"]);
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowLeft", altKey: true });
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);
  });

  it("follows the writing direction: in right-to-left Alt+← moves to the next column", () => {
    render(
      <div dir="rtl">
        <Board />
      </div>,
    );
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowLeft", altKey: true });
    expect(titles("В работе")).toEqual(["Счёт для «Севера»", "Онбординг"]);
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowRight", altKey: true });
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);
  });

  it("does nothing past the first or last column and without Alt", () => {
    const onValueChange = vi.fn();
    render(<Board onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowLeft", altKey: true });
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowRight" });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("reorders inside a column with Alt+↓", () => {
    const onValueChange = vi.fn();
    render(<Board onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowDown", altKey: true });
    expect(onValueChange).toHaveBeenCalledWith(
      { todo: ["b", "a"], doing: ["c"], done: [] },
      { id: "a", from: "todo", to: "todo", index: 1 },
    );
    expect(titles("К выполнению")).toEqual(["Отчёт по складу", "Счёт для «Севера»"]);
  });

  it("reorders inside a column with Alt+↑", () => {
    const onValueChange = vi.fn();
    render(<Board onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByTestId("card-b"), { key: "ArrowUp", altKey: true });
    expect(onValueChange).toHaveBeenCalledWith(
      { todo: ["b", "a"], doing: ["c"], done: [] },
      { id: "b", from: "todo", to: "todo", index: 0 },
    );
    expect(titles("К выполнению")).toEqual(["Отчёт по складу", "Счёт для «Севера»"]);
  });

  it("Tab moves through the cards, column by column", async () => {
    const user = userEvent.setup();
    render(<Board />);
    await user.tab();
    expect(screen.getByTestId("card-a")).toHaveFocus();
    await user.tab();
    expect(screen.getByTestId("card-b")).toHaveFocus();
    await user.tab();
    expect(screen.getByTestId("card-c")).toHaveFocus();
  });

  it("a full column refuses a keyboard move and says so", () => {
    const onValueChange = vi.fn();
    render(
      <Board
        columns={[COLUMNS[0] as KanbanColumn, { id: "doing", title: "В работе", limit: 1 }]}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowRight", altKey: true });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Счёт для «Севера»: Колонка «В работе» заполнена (1)",
    );
  });

  it("canDrop may say why: the reason is announced", () => {
    render(
      <Board
        canDrop={(_id, columnId) => (columnId === "doing" ? "Сначала оцените задачу" : true)}
      />,
    );
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowRight", altKey: true });
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Счёт для «Севера»: Сначала оцените задачу",
    );
  });

  it("colors a column's count by its stage; a full one turns orange", () => {
    render(
      <Board
        columns={[
          { id: "todo", title: "К выполнению", color: "blue" },
          { id: "doing", title: "В работе", color: "purple", limit: 1 },
        ]}
      />,
    );
    const badge = (text: string) => screen.getByText(text).closest("[data-color]");
    expect(badge("2")).toHaveAttribute("data-color", "blue");
    expect(badge("1 / 1")).toHaveAttribute("data-color", "orange");
  });

  it("draws a meta line under the title that describes the column's list", () => {
    render(
      <Board
        columns={[{ ...(COLUMNS[0] as KanbanColumn), description: "Новые заявки" }]}
        renderColumnMeta={(col) => `${col.id === "todo" ? 2 : 0} сделки · 480 000 ₽`}
      />,
    );
    expect(screen.getByText("2 сделки · 480 000 ₽")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "К выполнению" })).toHaveAccessibleDescription(
      "Новые заявки 2 сделки · 480 000 ₽",
    );
  });

  it("a locked column shows a lock for a grip and nothing moves past it", () => {
    const onColumnOrderChange = vi.fn();
    render(
      <Board
        reorderableColumns
        onColumnOrderChange={onColumnOrderChange}
        columns={[
          { id: "todo", title: "К выполнению", locked: true },
          COLUMNS[1] as KanbanColumn,
          COLUMNS[2] as KanbanColumn,
        ]}
      />,
    );
    expect(screen.getByRole("img", { name: "Закреплено" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Переместить колонку «К выполнению»" })).toBeNull();
    const grip = screen.getByRole("button", { name: "Переместить колонку «В работе»" });
    fireEvent.keyDown(grip, { key: "ArrowLeft", altKey: true });
    expect(onColumnOrderChange).not.toHaveBeenCalled();
    fireEvent.keyDown(grip, { key: "ArrowRight", altKey: true });
    expect(headings()).toEqual(["К выполнению", "Готово", "В работе"]);
  });

  it("canDrop refuses a card in a column", () => {
    const onValueChange = vi.fn();
    render(
      <Board
        canDrop={(id, columnId) => !(id === "c" && columnId === "done")}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.keyDown(screen.getByTestId("card-c"), { key: "ArrowRight", altKey: true });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByTestId("card-c"), { key: "ArrowLeft", altKey: true });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("controlled: draws only what the parent keeps", () => {
    const onValueChange = vi.fn();
    render(<Board value={PLACEMENT} onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowRight", altKey: true });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);
  });

  it("disabled: no shortcuts, no moves", () => {
    const onValueChange = vi.fn();
    render(<Board disabled onValueChange={onValueChange} />);
    const card = screen.getByTestId("card-a");
    expect(card).not.toHaveAttribute("aria-keyshortcuts");
    expect(card).not.toHaveAttribute("aria-roledescription");
    fireEvent.keyDown(card, { key: "ArrowRight", altKey: true });
    fireEvent.keyDown(card, { key: "ArrowDown", altKey: true });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("cards are focusable and advertise their shortcuts", () => {
    render(<Board />);
    const card = screen.getByTestId("card-a");
    expect(card.tagName).toBe("LI");
    expect(card).toHaveAttribute("tabindex", "0");
    expect(card).toHaveAttribute(
      "aria-keyshortcuts",
      "Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight",
    );
  });

  it("loading: busy board with skeleton cards, then the cards", () => {
    const { rerender } = render(<Board loading />);
    const board = screen.getByLabelText("Доска");
    expect(board).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByTestId("card-a")).toBeNull();
    expect(screen.queryByText("Карточек: 2")).toBeNull();
    expect(
      board.querySelectorAll('[aria-hidden="true"] [aria-hidden="true"]').length,
    ).toBeGreaterThan(0);
    rerender(<Board />);
    expect(board).not.toHaveAttribute("aria-busy");
    expect(screen.getByTestId("card-a")).toBeInTheDocument();
  });

  it("loading before the columns arrive: placeholder columns, then the columns", () => {
    const { rerender } = render(<Board loading columns={[]} loadingColumns={4} />);
    const board = screen.getByLabelText("Доска");
    expect(board).toHaveAttribute("aria-busy", "true");
    // The strip of placeholder columns is hidden from assistive tech and holds no column list.
    const strip = board.querySelector('[aria-hidden="true"]');
    expect(strip?.children).toHaveLength(4);
    expect(board.querySelector("ul")).toBeNull();
    expect(screen.queryByRole("heading")).toBeNull();
    rerender(<Board />);
    expect(screen.getAllByRole("heading")).toHaveLength(COLUMNS.length);
    expect(screen.getByTestId("card-a")).toBeInTheDocument();
  });

  it("draws the real columns while loading once they are there", () => {
    render(<Board loading loadingColumns={4} />);
    expect(screen.getAllByRole("heading")).toHaveLength(COLUMNS.length);
  });

  it("uses custom labels", () => {
    render(<Board labels={{ empty: "Пусто", count: "{count} шт." }} />);
    expect(screen.getByText("Пусто")).toBeInTheDocument();
    expect(screen.getByText("2 шт.")).toBeInTheDocument();
  });

  it("renders column actions per column", () => {
    render(
      <Board
        renderColumnActions={(col) => <button type="button">{`Добавить в ${col.title}`}</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Добавить в Готово" })).toBeInTheDocument();
  });

  it("shows a column description under the heading and describes the list with it", () => {
    render(
      <Board
        columns={[{ ...(COLUMNS[0] as KanbanColumn), description: "Берём после планирования" }]}
      />,
    );
    expect(screen.getByRole("list", { name: "К выполнению" })).toHaveAccessibleDescription(
      "Берём после планирования",
    );
  });

  it("draws a card header row above the title", () => {
    render(
      <Board
        renderItem={(task) => (
          <Kanban.Item>
            <Kanban.ItemHeader data-testid={`header-${task.id}`}>{task.id}</Kanban.ItemHeader>
            <Kanban.ItemTitle>{task.title}</Kanban.ItemTitle>
          </Kanban.Item>
        )}
      />,
    );
    const header = screen.getByTestId("header-a");
    expect(header).toHaveTextContent("a");
    expect(header.nextElementSibling).toHaveTextContent("Счёт для «Севера»");
  });

  it("marks the variant on the root, plain by default", () => {
    const { rerender } = render(<Board />);
    expect(screen.getByLabelText("Доска")).toHaveAttribute("data-variant", "plain");
    rerender(<Board variant="line" />);
    expect(screen.getByLabelText("Доска")).toHaveAttribute("data-variant", "line");
    rerender(<Board variant="well" />);
    expect(screen.getByLabelText("Доска")).toHaveAttribute("data-variant", "well");
  });

  it("makes a plain or line card a surface one step above the board's host, a well card none", () => {
    const { rerender } = render(<Board />);
    const card = () => document.querySelector("[data-kanban-item]");
    expect(card()).toHaveAttribute("data-depth", "1");
    expect(card()).toHaveAttribute("data-surface");
    rerender(<Board variant="line" />);
    expect(card()).toHaveAttribute("data-depth", "1");
    rerender(<Board variant="well" />);
    expect(card()).not.toHaveAttribute("data-depth");
    expect(card()).not.toHaveAttribute("data-surface");
  });

  it("has no column grips unless reorderableColumns is set", () => {
    render(<Board />);
    expect(screen.queryByRole("button", { name: /Переместить колонку/ })).toBeNull();
  });

  const headings = () => screen.getAllByRole("heading").map((heading) => heading.textContent);

  it("moves a column with Alt+→ on its grip, reports the order, keeps focus and announces it", () => {
    const onColumnOrderChange = vi.fn();
    render(<Board reorderableColumns onColumnOrderChange={onColumnOrderChange} />);
    const grip = screen.getByRole("button", { name: "Переместить колонку «К выполнению»" });
    expect(grip).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowLeft Alt+ArrowRight");
    grip.focus();
    fireEvent.keyDown(grip, { key: "ArrowRight", altKey: true });

    expect(onColumnOrderChange).toHaveBeenCalledWith(["doing", "todo", "done"], {
      id: "todo",
      index: 1,
    });
    expect(headings()).toEqual(["В работе", "К выполнению", "Готово"]);
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Переместить колонку «К выполнению»" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Колонка «К выполнению»: позиция 2 из 3");
    // The cards travel with their column.
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "ArrowLeft", altKey: true });
    expect(headings()).toEqual(["К выполнению", "В работе", "Готово"]);
  });

  it("card keys never move the column, even from a locked card", () => {
    render(
      <Board
        reorderableColumns
        renderItem={(task) => (
          <Kanban.Item data-testid={`card-${task.id}`} disabled>
            {task.title}
          </Kanban.Item>
        )}
      />,
    );
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowRight", altKey: true });
    expect(headings()).toEqual(["К выполнению", "В работе", "Готово"]);
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);
  });

  it("controlled column order: draws the parent's order, cards follow it with Alt+→", () => {
    render(<Board reorderableColumns columnOrder={["done", "todo", "doing"]} />);
    expect(headings()).toEqual(["Готово", "К выполнению", "В работе"]);
    fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowRight", altKey: true });
    expect(titles("В работе")).toEqual(["Счёт для «Севера»", "Онбординг"]);
    // The parent did not change the order: it stays.
    fireEvent.keyDown(screen.getByRole("button", { name: "Переместить колонку «Готово»" }), {
      key: "ArrowRight",
      altKey: true,
    });
    expect(headings()).toEqual(["Готово", "К выполнению", "В работе"]);
  });

  /** A promise the test settles by hand. */
  function deferred() {
    let resolve: () => void = () => {};
    let reject: (reason: unknown) => void = () => {};
    const promise = new Promise<void>((done, fail) => {
      resolve = done;
      reject = fail;
    });
    return { promise, resolve, reject };
  }

  /** Card ids in a column (a busy card also holds its spinner's text). */
  const cards = (title: string) =>
    column(title)
      .queryAllByRole("listitem")
      .map((item) => item.getAttribute("data-kanban-item"));

  it("async card move: the card waits busy in its new place; resolve keeps it there", async () => {
    const save = deferred();
    render(<Board onValueChange={() => save.promise} />);
    fireEvent.keyDown(screen.getByTestId("card-b"), { key: "ArrowRight", altKey: true });

    expect(cards("В работе")).toEqual(["c", "b"]);
    const card = screen.getByTestId("card-b");
    expect(card).toHaveAttribute("aria-busy", "true");
    expect(card).toHaveAttribute("data-pending");
    // Busy: it does not move again until the answer.
    expect(card).not.toHaveAttribute("aria-keyshortcuts");

    await act(async () => {
      save.resolve();
    });
    expect(cards("В работе")).toEqual(["c", "b"]);
    expect(screen.getByTestId("card-b")).not.toHaveAttribute("aria-busy");
  });

  it("async card move: reject puts the card back and announces the failure", async () => {
    const save = deferred();
    render(<Board onValueChange={() => save.promise} />);
    fireEvent.keyDown(screen.getByTestId("card-b"), { key: "ArrowRight", altKey: true });
    expect(cards("В работе")).toEqual(["c", "b"]);

    await act(async () => {
      save.reject(new Error("409"));
    });
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);
    expect(titles("В работе")).toEqual(["Онбординг"]);
    expect(screen.getByTestId("card-b")).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Не удалось переместить «Отчёт по складу», карточка вернулась на место",
    );
  });

  it("a refused card move glides the card back from where it stood", async () => {
    const motion = withMotion();
    // A card's box: its column across, its place in the column down.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const card = this.dataset.kanbanItem;
      const columnNode = this.closest<HTMLElement>("[data-kanban-column]");
      const columnIndex = columnNode
        ? Array.from(columnNode.parentElement?.children ?? []).indexOf(columnNode)
        : 0;
      const place = card ? Array.from(this.parentElement?.children ?? []).indexOf(this) : 0;
      const left = card ? columnIndex * 300 : 0;
      const top = card ? place * 60 : 0;
      const [width, height] = card ? [280, 50] : [1000, 600];
      return DOMRect.fromRect({ x: left, y: top, width, height });
    });
    const save = deferred();
    render(<Board onValueChange={() => save.promise} />);
    fireEvent.keyDown(screen.getByTestId("card-b"), { key: "ArrowRight", altKey: true });
    const before = motion.animations.length;

    await act(async () => {
      save.reject(new Error("409"));
    });
    const card = screen.getByTestId("card-b");
    expect(cards("К выполнению")).toEqual(["a", "b"]);
    // It glides from the other column (300px across) back to its place.
    const glide = motion.animations.slice(before).find((animation) => animation.element === card);
    expect(glide).toBeDefined();
  });

  it("async card move inside a column: reject restores the order", async () => {
    render(
      <Board
        onValueChange={async () => {
          throw new Error("offline");
        }}
      />,
    );
    await act(async () => {
      fireEvent.keyDown(screen.getByTestId("card-a"), { key: "ArrowDown", altKey: true });
    });
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);
  });

  it("controlled async move: the parent applies it before resolving", async () => {
    function Controlled() {
      const [value, setValue] = React.useState<KanbanValue>(PLACEMENT);
      return (
        <Board
          defaultValue={undefined}
          value={value}
          onValueChange={async (next) => {
            await Promise.resolve();
            setValue(next);
          }}
        />
      );
    }
    render(<Controlled />);
    await act(async () => {
      fireEvent.keyDown(screen.getByTestId("card-b"), { key: "ArrowRight", altKey: true });
    });
    expect(titles("В работе")).toEqual(["Онбординг", "Отчёт по складу"]);
    expect(screen.getByTestId("card-b")).not.toHaveAttribute("aria-busy");
  });

  it("async column move: the grip is busy; reject puts the column back and says so", async () => {
    const save = deferred();
    render(<Board reorderableColumns onColumnOrderChange={() => save.promise} />);
    fireEvent.keyDown(screen.getByRole("button", { name: "Переместить колонку «К выполнению»" }), {
      key: "ArrowRight",
      altKey: true,
    });
    expect(headings()).toEqual(["В работе", "К выполнению", "Готово"]);
    const moved = document.querySelector('[data-kanban-column="todo"]') as HTMLElement;
    expect(moved).toHaveAttribute("aria-busy", "true");
    const grip = screen.getByRole("button", { name: "Переместить колонку «К выполнению»" });
    expect(grip).toHaveAttribute("aria-busy", "true");
    expect(grip).toBeDisabled();

    await act(async () => {
      save.reject(new Error("409"));
    });
    expect(headings()).toEqual(["К выполнению", "В работе", "Готово"]);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Не удалось переместить колонку «К выполнению», она вернулась на место",
    );
  });

  it("async column move: resolve keeps the new order", async () => {
    render(<Board reorderableColumns onColumnOrderChange={async () => {}} />);
    await act(async () => {
      fireEvent.keyDown(
        screen.getByRole("button", { name: "Переместить колонку «К выполнению»" }),
        { key: "ArrowRight", altKey: true },
      );
    });
    expect(headings()).toEqual(["В работе", "К выполнению", "Готово"]);
    expect(document.querySelector('[data-kanban-column="todo"]')).not.toHaveAttribute("aria-busy");
  });

  it("disabled board has no grips", () => {
    render(<Board reorderableColumns disabled />);
    expect(screen.queryByRole("button", { name: /Переместить колонку/ })).toBeNull();
  });

  it("joins a Dnd.Root above it instead of mounting its own", () => {
    render(
      <Dnd.Root>
        <Board />
      </Dnd.Root>,
    );
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("opens a card in place: click, Enter, Space; never from a control inside it", () => {
    const onItemOpen = vi.fn();
    render(
      <Board
        onItemOpen={onItemOpen}
        renderItem={(task) => (
          <Kanban.Item data-testid={`card-${task.id}`}>
            <Kanban.ItemTitle>{task.title}</Kanban.ItemTitle>
            <button type="button">В архив</button>
          </Kanban.Item>
        )}
      />,
    );
    const card = screen.getByTestId("card-b");
    fireEvent.click(within(card).getByText("Отчёт по складу"));
    expect(onItemOpen).toHaveBeenCalledTimes(1);
    expect(onItemOpen.mock.calls[0][0]).toBe(TASKS[1]);
    expect(onItemOpen.mock.calls[0][1].type).toBe("click");
    act(() => card.focus());
    fireEvent.keyDown(card, { key: "Enter" });
    fireEvent.keyDown(card, { key: " " });
    expect(onItemOpen).toHaveBeenCalledTimes(3);
    expect(onItemOpen.mock.calls[2][1].type).toBe("keydown");
    // A held key, Alt + a key (a move) and a control inside the card never open it.
    fireEvent.keyDown(card, { key: "Enter", repeat: true });
    fireEvent.keyDown(card, { key: "Enter", altKey: true });
    fireEvent.click(within(card).getByRole("button", { name: "В архив" }));
    expect(onItemOpen).toHaveBeenCalledTimes(3);
  });

  it("a card that opens stays a tab stop on a read-only board", () => {
    const onItemOpen = vi.fn();
    render(<Board disabled onItemOpen={onItemOpen} />);
    const card = screen.getByTestId("card-a");
    expect(card).toHaveAttribute("tabindex", "0");
    act(() => card.focus());
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onItemOpen).toHaveBeenCalledWith(TASKS[0], expect.anything());
  });

  it("getItemHref: a link named by getLabel covers the card, takes Tab and moves it with Alt + arrows", () => {
    const onItemOpen = vi.fn((_task: Task, event: React.SyntheticEvent) => event.preventDefault());
    const onValueChange = vi.fn();
    render(
      <Board
        getItemHref={(task) => `#/tasks/${task.id}`}
        onItemOpen={onItemOpen}
        onValueChange={onValueChange}
      />,
    );
    const card = screen.getByTestId("card-b");
    const link = within(card).getByRole("link", { name: "Отчёт по складу" });
    expect(link).toHaveAttribute("href", "#/tasks/b");
    expect(card).toHaveAttribute("tabindex", "-1");
    fireEvent.click(link);
    expect(onItemOpen).toHaveBeenCalledTimes(1);
    expect(onItemOpen.mock.calls[0][0]).toBe(TASKS[1]);
    // A modified click is the browser's (new tab); Space clicks the link like Enter.
    fireEvent.click(link, { metaKey: true });
    expect(onItemOpen).toHaveBeenCalledTimes(1);
    act(() => link.focus());
    fireEvent.keyDown(link, { key: " " });
    expect(onItemOpen).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(link, { key: "ArrowRight", altKey: true });
    expect(onValueChange).toHaveBeenCalledWith(
      { todo: ["a"], doing: ["c", "b"], done: [] },
      { id: "b", from: "todo", to: "doing", index: 1 },
    );
    // After a move to another column the card holds the focus: Enter there follows the link.
    const moved = screen.getByTestId("card-b");
    act(() => moved.focus());
    fireEvent.keyDown(moved, { key: "Enter" });
    expect(onItemOpen).toHaveBeenCalledTimes(3);
  });

  it("throws when Kanban.Item is rendered outside renderItem", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Kanban.Item>x</Kanban.Item>)).toThrow(/renderItem/);
  });

  describe("columnGroups", () => {
    const GROUPS = [
      { id: "early", title: "Начало", columnIds: ["todo", "doing"] },
      { id: "end", title: "Конец", columnIds: ["done"] },
    ];
    const gripOf = (title: string) =>
      screen.getByRole("button", { name: `Переместить колонку «${title}»` });
    const columnTitles = () =>
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);

    it("draws a named group over its columns", () => {
      render(<Board columnGroups={GROUPS} />);
      const early = screen.getByRole("group", { name: "Начало" });
      expect(within(early).getByRole("heading", { name: "К выполнению" })).toBeInTheDocument();
      expect(within(early).getByRole("heading", { name: "В работе" })).toBeInTheDocument();
      expect(within(early).queryByRole("heading", { name: "Готово" })).toBeNull();
      expect(
        within(screen.getByRole("group", { name: "Конец" })).getByRole("heading", {
          name: "Готово",
        }),
      ).toBeInTheDocument();
    });

    it("lets columns outside every group stand after them, with no heading", () => {
      render(<Board columnGroups={[GROUPS[0] as (typeof GROUPS)[number]]} />);
      expect(columnTitles()).toEqual(["К выполнению", "В работе", "Готово"]);
      expect(screen.queryByRole("group", { name: "Конец" })).toBeNull();
    });

    it("moves a column with Alt+→ within its group and reports the whole order", () => {
      const onColumnOrderChange = vi.fn();
      render(
        <Board
          reorderableColumns
          columnGroups={GROUPS}
          onColumnOrderChange={onColumnOrderChange}
        />,
      );
      gripOf("К выполнению").focus();
      fireEvent.keyDown(gripOf("К выполнению"), { key: "ArrowRight", altKey: true });
      expect(onColumnOrderChange).toHaveBeenCalledWith(["doing", "todo", "done"], {
        id: "todo",
        index: 1,
      });
      expect(columnTitles()).toEqual(["В работе", "К выполнению", "Готово"]);
    });

    it("refuses a keyboard move past the group's edge and says why", () => {
      const onColumnOrderChange = vi.fn();
      render(
        <Board
          reorderableColumns
          columnGroups={GROUPS}
          onColumnOrderChange={onColumnOrderChange}
        />,
      );
      gripOf("В работе").focus();
      fireEvent.keyDown(gripOf("В работе"), { key: "ArrowRight", altKey: true });
      expect(onColumnOrderChange).not.toHaveBeenCalled();
      expect(columnTitles()).toEqual(["К выполнению", "В работе", "Готово"]);
      expect(screen.getByRole("status")).toHaveTextContent(
        "Колонка «В работе» остаётся в группе «Начало»",
      );
    });
  });
});

describe("Kanban pointer drag", () => {
  const POINTER = { pointerId: 1, pointerType: "mouse", button: 0 };
  const ROW = 20;

  /** Columns stand 300 px apart; cards stack 20 px tall in document order. */
  function stubLayout() {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const columnEl = this.closest<HTMLElement>("[data-kanban-column]");
      const index = COLUMNS.findIndex((col) => col.id === columnEl?.dataset.kanbanColumn);
      const left = Math.max(index, 0) * 300;
      const isItem = this.hasAttribute("data-dnd-item") || this.hasAttribute("data-dnd-gap");
      const siblings = Array.from(this.parentElement?.children ?? []);
      const hidden = this.hasAttribute("data-lifted");
      const top = isItem
        ? siblings.slice(0, siblings.indexOf(this)).filter((n) => !n.hasAttribute("data-lifted"))
            .length * ROW
        : 0;
      const width = hidden ? 0 : 200;
      const height = hidden ? 0 : isItem ? ROW : 400;
      return {
        left,
        top,
        right: left + width,
        bottom: top + height,
        width,
        height,
        x: left,
        y: top,
        toJSON: () => ({}),
      };
    });
  }

  it("drops a card into another column at an exact position", () => {
    const onValueChange = vi.fn();
    render(<Board onValueChange={onValueChange} />);
    stubLayout();
    fireEvent.pointerDown(screen.getByTestId("card-b"), { ...POINTER, clientX: 10, clientY: 25 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 310, clientY: 5 });
    fireEvent.pointerUp(window, { ...POINTER, clientX: 310, clientY: 5 });
    expect(onValueChange).toHaveBeenCalledWith(
      { todo: ["a"], doing: ["b", "c"], done: [] },
      { id: "b", from: "todo", to: "doing", index: 0 },
    );
    expect(titles("В работе")).toEqual(["Отчёт по складу", "Онбординг"]);
  });

  it("Escape cancels a drag in flight: the card stays where it stood", () => {
    const onValueChange = vi.fn();
    render(<Board onValueChange={onValueChange} />);
    stubLayout();
    fireEvent.pointerDown(screen.getByTestId("card-b"), { ...POINTER, clientX: 10, clientY: 25 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 310, clientY: 5 });
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.pointerUp(window, { ...POINTER, clientX: 310, clientY: 5 });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);
    expect(screen.getByRole("status")).toHaveTextContent("отменено");
  });

  it("a drag never opens the card, nor follows its link; a click does", () => {
    const onItemOpen = vi.fn((_task: Task, event: React.SyntheticEvent) => event.preventDefault());
    render(<Board onItemOpen={onItemOpen} />);
    stubLayout();
    const card = screen.getByTestId("card-b");
    fireEvent.pointerDown(card, { ...POINTER, clientX: 10, clientY: 25 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 310, clientY: 5 });
    fireEvent.pointerUp(window, { ...POINTER, clientX: 310, clientY: 5 });
    fireEvent.click(screen.getByTestId("card-b"));
    expect(onItemOpen).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("card-b"));
    expect(onItemOpen).toHaveBeenCalledTimes(1);
  });

  it("a press on a card's link drags the card; the release follows no link", () => {
    const onItemOpen = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Board
        getItemHref={(task) => `#/tasks/${task.id}`}
        onItemOpen={onItemOpen}
        onValueChange={onValueChange}
      />,
    );
    stubLayout();
    const link = within(screen.getByTestId("card-b")).getByRole("link");
    fireEvent.pointerDown(link, { ...POINTER, clientX: 10, clientY: 25 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 310, clientY: 5 });
    fireEvent.pointerUp(window, { ...POINTER, clientX: 310, clientY: 5 });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    const click = fireEvent.click(within(screen.getByTestId("card-b")).getByRole("link"));
    // The click was cancelled: the browser does not navigate.
    expect(click).toBe(false);
    expect(onItemOpen).not.toHaveBeenCalled();
  });

  it("drops into an empty column", () => {
    const onValueChange = vi.fn();
    render(<Board onValueChange={onValueChange} />);
    stubLayout();
    fireEvent.pointerDown(screen.getByTestId("card-c"), { ...POINTER, clientX: 310, clientY: 5 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 610, clientY: 40 });
    fireEvent.pointerUp(window, { ...POINTER, clientX: 610, clientY: 40 });
    expect(onValueChange).toHaveBeenCalledWith(
      { todo: ["a", "b"], doing: [], done: ["c"] },
      { id: "c", from: "doing", to: "done", index: 0 },
    );
  });

  it("a full column is marked as refusing and takes nothing", async () => {
    const onValueChange = vi.fn();
    render(
      <Board
        columns={[COLUMNS[0] as KanbanColumn, { id: "doing", title: "В работе", limit: 1 }]}
        onValueChange={onValueChange}
      />,
    );
    stubLayout();
    fireEvent.pointerDown(screen.getByTestId("card-a"), { ...POINTER, clientX: 10, clientY: 5 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 310, clientY: 30 });
    expect(screen.getByRole("list", { name: "В работе" })).toHaveAttribute("data-dnd-reject");
    fireEvent.pointerUp(window, { ...POINTER, clientX: 310, clientY: 30 });
    await act(async () => {});
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("drags a column by its grip to the end of the board; a press on the column body drags nothing", () => {
    const onColumnOrderChange = vi.fn();
    render(<Board reorderableColumns onColumnOrderChange={onColumnOrderChange} />);
    // Columns stand 300 px apart and 200 px wide; the board spans them all.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const columnEl = this.closest<HTMLElement>("[data-kanban-column]");
      const index = COLUMNS.findIndex((col) => col.id === columnEl?.dataset.kanbanColumn);
      const left = index === -1 ? 0 : index * 300;
      const width = index === -1 ? 900 : 200;
      return {
        left,
        top: 0,
        right: left + width,
        bottom: 400,
        width,
        height: 400,
        x: left,
        y: 0,
        toJSON: () => ({}),
      };
    });

    const heading = screen.getByRole("heading", { name: "К выполнению" });
    fireEvent.pointerDown(heading, { ...POINTER, clientX: 40, clientY: 10 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 760, clientY: 10 });
    fireEvent.pointerUp(window, { ...POINTER, clientX: 760, clientY: 10 });
    expect(onColumnOrderChange).not.toHaveBeenCalled();

    const grip = screen.getByRole("button", { name: "Переместить колонку «К выполнению»" });
    fireEvent.pointerDown(grip, { ...POINTER, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 400, clientY: 10 });
    fireEvent.pointerMove(window, { ...POINTER, clientX: 760, clientY: 10 });
    fireEvent.pointerUp(window, { ...POINTER, clientX: 760, clientY: 10 });
    expect(onColumnOrderChange).toHaveBeenCalledWith(["doing", "done", "todo"], {
      id: "todo",
      index: 2,
    });
  });
});
