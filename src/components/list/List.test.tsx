import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { moveBefore } from "@/components/dnd/useSortableList";

import { List } from "./List";
import styles from "./List.module.css";

function Dialogs({ onOpen }: { onOpen?: (id: string) => void }) {
  const [current, setCurrent] = React.useState("granit");
  const open = (id: string) => {
    setCurrent(id);
    onOpen?.(id);
  };
  return (
    <List.Root aria-label="Диалоги">
      <List.Item current={current === "granit"} onClick={() => open("granit")}>
        <List.ItemText>ООО «Гранит»</List.ItemText>
        <List.ItemDescription>Счёт № 4821 пришёл без НДС</List.ItemDescription>
        <List.ItemMeta>15:02</List.ItemMeta>
        <List.ItemCount color="blue">2</List.ItemCount>
      </List.Item>
      <List.Item current={current === "leto"} onClick={() => open("leto")}>
        <List.ItemText>ООО «Лето»</List.ItemText>
      </List.Item>
      <List.Item disabled onClick={() => open("archive")}>
        <List.ItemText>Архив</List.ItemText>
      </List.Item>
    </List.Root>
  );
}

describe("List", () => {
  it("renders a named list of rows, each a button inside a list item", () => {
    render(<Dialogs />);
    const list = screen.getByRole("list", { name: "Диалоги" });
    expect(list.tagName).toBe("UL");
    expect(list).toHaveAttribute("data-size", "m");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    for (const item of items) expect(item.firstElementChild?.tagName).toBe("BUTTON");
  });

  it("names a row by its text, description, meta and count", () => {
    render(<Dialogs />);
    expect(
      screen.getByRole("button", { name: "ООО «Гранит» Счёт № 4821 пришёл без НДС 15:02 2" }),
    ).toBeInTheDocument();
  });

  it('marks the current row with aria-current="true" and moves it on click', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<Dialogs onOpen={onOpen} />);
    const granit = screen.getByRole("button", { name: /Гранит/ });
    const leto = screen.getByRole("button", { name: "ООО «Лето»" });
    expect(granit).toHaveAttribute("aria-current", "true");
    expect(leto).not.toHaveAttribute("aria-current");

    await user.click(leto);
    expect(onOpen).toHaveBeenCalledWith("leto");
    expect(leto).toHaveAttribute("aria-current", "true");
    expect(granit).not.toHaveAttribute("aria-current");
  });

  it("moves between rows with Tab and opens one with Enter and Space", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<Dialogs onOpen={onOpen} />);

    await user.tab();
    expect(screen.getByRole("button", { name: /Гранит/ })).toHaveFocus();
    await user.tab();
    const leto = screen.getByRole("button", { name: "ООО «Лето»" });
    expect(leto).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onOpen).toHaveBeenLastCalledWith("leto");
    await user.keyboard(" ");
    expect(onOpen).toHaveBeenCalledTimes(2);

    // The disabled row is skipped.
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it("a disabled row is a disabled button and ignores clicks", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<Dialogs onOpen={onOpen} />);
    const archive = screen.getByRole("button", { name: "Архив" });
    expect(archive).toBeDisabled();
    expect(archive).toHaveAttribute("data-disabled", "true");
    await user.click(archive);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('a link row keeps its href and marks the current one with aria-current="page"', () => {
    render(
      <List.Root aria-label="Счета">
        <List.Item href="/invoices/4821" current>
          <List.ItemText>Счёт № 4821</List.ItemText>
        </List.Item>
        <List.Item href="/invoices/4830" disabled>
          <List.ItemText>Счёт № 4830</List.ItemText>
        </List.Item>
      </List.Root>,
    );
    const current = screen.getByRole("link", { name: "Счёт № 4821" });
    expect(current).toHaveAttribute("href", "/invoices/4821");
    expect(current).toHaveAttribute("aria-current", "page");
    // A disabled link has no href: it is not a link to follow nor a Tab stop.
    const disabled = screen.getByText("Счёт № 4830").closest("a");
    expect(disabled).not.toHaveAttribute("href");
    expect(disabled).toHaveAttribute("aria-disabled", "true");
  });

  it("asChild renders the child element as the row and keeps its href", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <List.Root aria-label="Задачи">
        <List.Item asChild current onClick={onClick}>
          <a href="/tasks/118" data-router="">
            <List.ItemText>Задача № 118</List.ItemText>
            <List.ItemMeta>вчера</List.ItemMeta>
          </a>
        </List.Item>
        <List.Item asChild disabled onClick={onClick}>
          <a href="/tasks/119">
            <List.ItemText>Задача № 119</List.ItemText>
          </a>
        </List.Item>
      </List.Root>,
    );
    const link = screen.getByRole("link", { name: "Задача № 118 вчера" });
    expect(link).toHaveAttribute("href", "/tasks/118");
    expect(link).toHaveAttribute("data-router", "");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link.closest("li")).toBeInTheDocument();
    await user.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);

    const disabled = screen.getByRole("link", { name: "Задача № 119" });
    expect(disabled).toHaveAttribute("href", "/tasks/119");
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).toHaveAttribute("tabindex", "-1");
    await user.click(disabled);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("places the parts: a leading icon, the body, the trail; a trailing icon after the text", () => {
    render(
      <List.Root size="s" aria-label="Проекты">
        <List.Item>
          <List.ItemIcon>
            <svg data-testid="lead" />
          </List.ItemIcon>
          Внедрение CRM
          <List.ItemIcon>
            <svg data-testid="trail" />
          </List.ItemIcon>
        </List.Item>
      </List.Root>,
    );
    const button = screen.getByRole("button", { name: "Внедрение CRM" });
    const lead = screen.getByTestId("lead").parentElement as HTMLElement;
    const trail = screen.getByTestId("trail").parentElement as HTMLElement;
    expect(lead).toHaveAttribute("aria-hidden", "true");
    expect(lead).not.toHaveAttribute("data-edge");
    expect(trail).toHaveAttribute("data-edge", "end");
    expect(button.firstElementChild).toBe(lead);
    // Loose content becomes the text line.
    expect(screen.getByText("Внедрение CRM").tagName).toBe("SPAN");
  });

  it("passes size to the count badge one tier down", () => {
    render(
      <List.Root size="l" aria-label="Очереди">
        <List.Item>
          <List.ItemText>Входящие</List.ItemText>
          <List.ItemCount>12</List.ItemCount>
        </List.Item>
      </List.Root>,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-size", "l");
    expect(screen.getByText("12").closest("[data-tier]")).toHaveAttribute("data-tier", "m");
  });

  it("sends ref, className and native attributes to the row element", () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <List.Root aria-label="Диалоги">
        <List.Item ref={ref} className="custom" data-id="granit">
          <List.ItemText>ООО «Гранит»</List.ItemText>
        </List.Item>
      </List.Root>,
    );
    const button = screen.getByRole("button", { name: "ООО «Гранит»" });
    expect(ref.current).toBe(button);
    expect(button).toHaveClass("custom");
    expect(button).toHaveAttribute("data-id", "granit");
    expect(button).toHaveAttribute("type", "button");
  });
});

const STAGES = [
  { id: "lead", name: "Лид" },
  { id: "talks", name: "Переговоры" },
  { id: "contract", name: "Договор" },
];

function Funnel({ onMove }: { onMove?: (id: string, beforeId: string | null) => unknown }) {
  const [stages, setStages] = React.useState(STAGES);
  return (
    <List.Root
      aria-label="Этапы воронки"
      onReorder={async (id, beforeId) => {
        await onMove?.(id, beforeId);
        setStages((current) => moveBefore(current, id, beforeId, (stage) => stage.id));
      }}
    >
      {stages.map((stage) => (
        <List.Item key={stage.id} value={stage.id}>
          <List.ItemText>{stage.name}</List.ItemText>
        </List.Item>
      ))}
    </List.Root>
  );
}

const order = () =>
  Array.from(document.querySelectorAll<HTMLElement>("li[data-dnd-item]")).map(
    (row) => row.dataset.dndItem,
  );

describe("List onReorder", () => {
  it("gives every row a named handle beside the row button", () => {
    render(<Funnel />);
    const handle = screen.getByRole("button", { name: "Переместить Лид" });
    const row = handle.closest("li");
    expect(row?.parentElement).toBe(screen.getByRole("list", { name: "Этапы воронки" }));
    expect(row).toContainElement(screen.getByRole("button", { name: "Лид" }));
    expect(order()).toEqual(["lead", "talks", "contract"]);
  });

  it("moves a row with Alt+↓ / ↑ and reports the move by value", async () => {
    const onMove = vi.fn();
    render(<Funnel onMove={onMove} />);
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("button", { name: "Переместить Лид" }), {
        key: "ArrowDown",
        altKey: true,
      });
    });
    expect(onMove).toHaveBeenLastCalledWith("lead", "contract");
    expect(order()).toEqual(["talks", "lead", "contract"]);

    await act(async () => {
      fireEvent.keyDown(screen.getByRole("button", { name: "Переместить Договор" }), {
        key: "ArrowUp",
        altKey: true,
      });
    });
    expect(onMove).toHaveBeenLastCalledWith("contract", "lead");
    expect(order()).toEqual(["talks", "contract", "lead"]);
  });

  it("keeps the row in place busy while saving; a rejection moves it back", async () => {
    let reject: (reason: unknown) => void = () => {};
    const onMove = () =>
      new Promise<void>((_, fail) => {
        reject = fail;
      });
    render(<Funnel onMove={onMove} />);
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("button", { name: "Переместить Лид" }), {
        key: "ArrowDown",
        altKey: true,
      });
    });
    expect(order()).toEqual(["talks", "lead", "contract"]);
    expect(document.querySelector('li[data-dnd-item="lead"]')).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("button", { name: "Переместить Лид" })).toBeNull();

    await act(async () => {
      reject(new Error("Сервер недоступен"));
    });
    expect(order()).toEqual(["lead", "talks", "contract"]);
    expect(document.querySelector('li[data-dnd-item="lead"]')).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("button", { name: "Переместить Лид" })).toBeInTheDocument();
  });

  it("names the handle from labels", () => {
    render(
      <List.Root aria-label="Этапы" onReorder={() => {}} labels={{ reorderItem: "Этап {label}" }}>
        <List.Item value="lead">Лид</List.Item>
      </List.Root>,
    );
    expect(screen.getByRole("button", { name: "Этап Лид" })).toBeInTheDocument();
  });

  it("carries a row in a copy of the list, so the copy keeps the row's tier padding and shape", () => {
    render(
      <List.Root aria-label="Этапы" size="s" onReorder={() => {}}>
        <List.Item value="lead">Лид</List.Item>
        <List.Item value="talks">Переговоры</List.Item>
      </List.Root>,
    );
    const pointer = { pointerId: 1, pointerType: "mouse", button: 0 };
    fireEvent.pointerDown(screen.getByRole("button", { name: "Переместить Лид" }), {
      ...pointer,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerMove(window, { ...pointer, clientX: 10, clientY: 60 });
    const copy = document.querySelector<HTMLElement>("[data-dnd-overlay] [data-dnd-copy]");
    expect(copy).toHaveClass(styles.row ?? "", styles.sortableRow ?? "");
    // The tier variables (`--list-pad-x`, `--list-radius`…) hang on the root: the copy stands in it.
    const root = copy?.parentElement;
    expect(root).toHaveClass(styles.root ?? "");
    expect(root).toHaveAttribute("data-size", "s");
    expect(root?.style.display).toBe("contents");
    fireEvent.pointerUp(window, { ...pointer, clientX: 10, clientY: 60 });
  });

  it("CSS: a sortable row has the row radius (the carried copy and its gap take it)", () => {
    const css = readFileSync(join(__dirname, "List.module.css"), "utf8");
    expect(css).toMatch(/\.sortableRow \{[^}]*border-radius: var\(--list-radius\);/);
  });
});
