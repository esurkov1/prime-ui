import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { moveBefore } from "@/components/dnd/useSortableList";
import { Switch } from "@/components/switch/Switch";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import enterMotion from "@/internal/enterMotion.module.css";
import { cssRule, cssValue } from "@/test/css";

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

  it("asChild renders the child element as the row; a disabled one drops its href", async () => {
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
    expect(disabled).not.toHaveAttribute("href");
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

  it("gives a leading avatar the row tier unless it has its own size", () => {
    render(
      <List.Root size="l" aria-label="Клиенты">
        <List.Item>
          <List.ItemIcon>
            <Avatar.Root data-testid="tier">
              <Avatar.Fallback>ИБ</Avatar.Fallback>
            </Avatar.Root>
          </List.ItemIcon>
          Ирина Белова
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <Avatar.Root size="xs" data-testid="own">
              <Avatar.Fallback>ПО</Avatar.Fallback>
            </Avatar.Root>
          </List.ItemIcon>
          Павел Орлов
        </List.Item>
      </List.Root>,
    );
    expect(screen.getByTestId("tier")).toHaveAttribute("data-size", "l");
    expect(screen.getByTestId("own")).toHaveAttribute("data-size", "xs");
  });

  it("takes the host tier without its own size", () => {
    render(
      <ControlSizeProvider value="s">
        <List.Root aria-label="Очереди">
          <List.Item>Входящие</List.Item>
        </List.Root>
      </ControlSizeProvider>,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-size", "s");
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
    // The grip stays, busy (Dnd's busy handle).
    expect(screen.getByRole("button", { name: "Переместить Лид" })).toHaveAttribute(
      "aria-busy",
      "true",
    );

    await act(async () => {
      reject(new Error("Сервер недоступен"));
    });
    expect(order()).toEqual(["lead", "talks", "contract"]);
    expect(document.querySelector('li[data-dnd-item="lead"]')).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("button", { name: "Переместить Лид" })).toBeInTheDocument();
  });

  it("keeps its list role with the list style reset", () => {
    render(
      <List.Root aria-label="Обращения">
        <List.Item>Счёт без НДС</List.Item>
      </List.Root>,
    );
    expect(screen.getByRole("list", { name: "Обращения" })).toHaveAttribute("role", "list");
  });

  it("a row the data adds rises in; the first render stays still", () => {
    function Queue({ ids }: { ids: string[] }) {
      return (
        <List.Root aria-label="Обращения">
          {ids.map((id) => (
            <List.Item key={id} value={id}>
              {id}
            </List.Item>
          ))}
        </List.Root>
      );
    }
    const { rerender } = render(<Queue ids={["T-1"]} />);
    expect(screen.getByRole("listitem")).not.toHaveClass(enterMotion.enter);
    rerender(<Queue ids={["T-1", "T-2"]} />);
    const [first, second] = screen.getAllByRole("listitem");
    expect(first).not.toHaveClass(enterMotion.enter);
    expect(second).toHaveClass(enterMotion.enter);
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
    const row = cssRule("src/components/list/List.module.css", ".sortableRow");
    expect(cssValue(row, "border-radius")).toBe("var(--field-radius)");
  });

  it("puts List.ItemActions beside the row element, one tier down, inside the row's fills", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onVisible = vi.fn();
    render(
      <List.Root aria-label="Этапы">
        <List.Item current onClick={onOpen}>
          <List.ItemText>Переговоры</List.ItemText>
          <List.ItemActions data-testid="actions">
            <Switch.Root aria-label="Показывать на доске" onCheckedChange={onVisible} />
          </List.ItemActions>
        </List.Item>
      </List.Root>,
    );
    const row = screen.getByRole("button", { name: "Переговоры" });
    const actions = screen.getByTestId("actions");
    // The controls are no part of the row button: its name stays its text.
    expect(row).not.toContainElement(actions);
    expect(row.parentElement).toHaveClass(styles.frame);
    expect(actions.parentElement).toBe(row.parentElement);
    const toggle = screen.getByRole("switch", { name: "Показывать на доске" });
    expect(toggle.closest("[data-size]")).toHaveAttribute("data-size", "s");
    // Tab goes from the row to its control; Space toggles it without opening the row.
    await user.tab();
    expect(row).toHaveFocus();
    await user.tab();
    expect(toggle).toHaveFocus();
    await user.keyboard(" ");
    expect(onVisible).toHaveBeenCalledWith(true);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("ends a reorderable row with its handle, after List.ItemActions; Tab: row, control, handle", async () => {
    const user = userEvent.setup();
    render(
      <List.Root aria-label="Этапы" onReorder={() => {}}>
        <List.Item value="talks">
          <List.ItemText>Переговоры</List.ItemText>
          <List.ItemActions>
            <Switch.Root aria-label="Показывать на доске" />
          </List.ItemActions>
        </List.Item>
        <List.Item value="contract">Договор</List.Item>
      </List.Root>,
    );
    const handle = screen.getByRole("button", { name: "Переместить Переговоры" });
    const row = handle.closest("li");
    expect(row?.lastElementChild).toContainElement(handle);
    expect(row?.lastElementChild).toHaveClass(styles.grip ?? "");
    await user.tab();
    expect(screen.getByRole("button", { name: "Переговоры" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("switch", { name: "Показывать на доске" })).toHaveFocus();
    await user.tab();
    expect(handle).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Договор" })).toHaveFocus();
  });

  it("keeps List.ItemActions out of a link row made with asChild", () => {
    render(
      <List.Root aria-label="Этапы">
        <List.Item asChild>
          <a href="/stages/new">
            <List.ItemText>Новые</List.ItemText>
            <List.ItemActions>
              <button type="button">Ещё</button>
            </List.ItemActions>
          </a>
        </List.Item>
      </List.Root>,
    );
    const link = screen.getByRole("link", { name: "Новые" });
    expect(link).not.toContainElement(screen.getByRole("button", { name: "Ещё" }));
  });

  it("stands a colour dot in an icon-wide box, as the large dot", () => {
    const { container } = render(
      <List.Root aria-label="Воронки">
        <List.Item>
          <List.ItemIcon>
            <Badge.Dot color="green" />
          </List.ItemIcon>
          Продажи
        </List.Item>
      </List.Root>,
    );
    const box = container.querySelector(`.${styles.icon}`);
    expect(box).toHaveAttribute("data-mark", "dot");
    expect(box?.firstElementChild).toHaveAttribute("data-size", "l");
    expect(box?.firstElementChild).toHaveAttribute("data-color", "green");
    expect(
      cssValue(
        cssRule(
          "src/components/list/List.module.css",
          '.icon[data-mark="dot"], .icon[data-edge="end"]',
        ),
        "width",
      ),
    ).toBe("var(--field-icon)");
  });
});
