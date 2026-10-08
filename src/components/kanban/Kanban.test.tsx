import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Dnd } from "@/components/dnd/Dnd";

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
    expect(titles("К выполнению")).toEqual(["Счёт для «Севера»", "Отчёт по складу"]);
    expect(titles("В работе")).toEqual(["Онбординг"]);
    expect(screen.getByRole("heading", { name: "В работе" })).toBeInTheDocument();
    expect(screen.getByText("Карточек: 2")).toBeInTheDocument();
    // The card the data has but no column holds is not drawn.
    expect(screen.queryByText("Тариф для партнёров")).toBeNull();
  });

  it("shows the empty state in a column without cards", () => {
    render(<Board />);
    const done = screen.getByRole("list", { name: "Готово" }).parentElement as HTMLElement;
    expect(within(done).getByText("Нет карточек")).toBeInTheDocument();
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
      "Счёт для «Севера»: колонка «В работе» не принимает карточку",
    );
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

  it("joins a Dnd.Root above it instead of mounting its own", () => {
    render(
      <Dnd.Root>
        <Board />
      </Dnd.Root>,
    );
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("throws when Kanban.Item is rendered outside renderItem", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Kanban.Item>x</Kanban.Item>)).toThrow(/renderItem/);
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
});
