import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { moveBefore } from "@/components/dnd/useSortableList";
import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { StatusDot } from "@/components/status-dot/StatusDot";
import { Switch } from "@/components/switch/Switch";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import rowStyles from "@/internal/listRow.module.css";
import { cssRule, cssValue } from "@/test/css";

import { List } from "./List";

const CSS = "src/components/list/List.module.css";
const ROW_CSS = "src/internal/listRow.module.css";

const rowOf = (element: HTMLElement) => element.closest(`.${rowStyles.row}`) as HTMLElement;

describe("List", () => {
  it("is a named list of rows: a button, a link, or a plain box out of the Tab order", () => {
    render(
      <List.Root aria-label="Счета">
        <List.Item onClick={() => {}}>Счёт № 4830</List.Item>
        <List.Item href="#4829" current>
          Счёт № 4829
        </List.Item>
        <List.Item>Архив</List.Item>
      </List.Root>,
    );
    const list = screen.getByRole("list", { name: "Счета" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Счёт № 4830" })).toHaveAttribute("type", "button");
    const link = screen.getByRole("link", { name: "Счёт № 4829" });
    expect(link).toHaveAttribute("aria-current", "page");
    const plain = screen.getByText("Архив").closest(`.${rowStyles.hit}`) as HTMLElement;
    expect(plain.tagName).toBe("DIV");
    expect(plain).not.toHaveAttribute("tabindex");
  });

  it("marks the current button row and paints it a fill step, the weight unchanged", async () => {
    function Queue() {
      const [current, setCurrent] = React.useState("a");
      return (
        <List.Root aria-label="Обращения">
          {["a", "b"].map((id) => (
            <List.Item key={id} value={id} current={current === id} onClick={() => setCurrent(id)}>
              Обращение {id}
            </List.Item>
          ))}
        </List.Root>
      );
    }
    render(<Queue />);
    await userEvent.click(screen.getByRole("button", { name: "Обращение b" }));
    expect(screen.getByRole("button", { name: "Обращение b" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "Обращение a" })).not.toHaveAttribute("aria-current");
    const current = cssRule(
      ROW_CSS,
      '.row[data-current], .row:has(> .hit:is([aria-current="page"], [aria-current="true"]))',
    );
    expect(cssValue(current, "background")).toBe("var(--prime-color-fill-muted-hover)");
    expect(current.decls.some((decl) => decl.prop === "font-weight")).toBe(false);
  });

  it("opens a button row with Enter and Space, and skips a disabled row", async () => {
    const open = vi.fn();
    render(
      <List.Root aria-label="Обращения">
        <List.Item onClick={() => open("a")}>Первое</List.Item>
        <List.Item disabled onClick={() => open("b")}>
          Второе
        </List.Item>
      </List.Root>,
    );
    const first = screen.getByRole("button", { name: "Первое" });
    first.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(open).toHaveBeenCalledTimes(2);
    await userEvent.click(screen.getByRole("button", { name: "Второе" }));
    expect(open).toHaveBeenCalledTimes(2);
    expect(rowOf(screen.getByRole("button", { name: "Второе" }))).toHaveAttribute("data-disabled");
  });

  it("stacks rows 2 apart; a row is the control height, two lines with a description", () => {
    render(
      <List.Root aria-label="Клиенты">
        <List.Item>Ирина Белова</List.Item>
        <List.Item>
          <List.ItemText>Павел Орлов</List.ItemText>
          <List.ItemDescription>Менеджер</List.ItemDescription>
        </List.Item>
      </List.Root>,
    );
    expect(cssValue(cssRule(CSS, ".root"), "gap")).toBe("calc(var(--prime-space-1) / 2)");
    expect(rowOf(screen.getByText("Ирина Белова"))).not.toHaveAttribute("data-lines");
    expect(rowOf(screen.getByText("Павел Орлов"))).toHaveAttribute("data-lines", "two");
    const row = cssRule(ROW_CSS, ".row");
    expect(cssValue(row, "min-height")).toContain("var(--field-h)");
    expect(cssValue(cssRule(ROW_CSS, ".hit"), "padding-block")).toBe(
      "calc((var(--list-row-h, var(--field-h)) - var(--field-lh)) / 2)",
    );
  });

  it("takes the host tier without its own size", () => {
    render(
      <ControlSizeProvider value="s">
        <List.Root aria-label="Ящики">
          <List.Item>Входящие</List.Item>
        </List.Root>
      </ControlSizeProvider>,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-size", "s");
  });

  it("sizes a mark under the row, beside a description as tall as the two lines", () => {
    render(
      <List.Root aria-label="Клиенты">
        <List.Item>
          <List.ItemIcon>
            <Avatar.Root data-testid="alone">
              <Avatar.Fallback>ИБ</Avatar.Fallback>
            </Avatar.Root>
          </List.ItemIcon>
          Ирина Белова
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <Avatar.Root data-testid="beside">
              <Avatar.Fallback>ПО</Avatar.Fallback>
            </Avatar.Root>
          </List.ItemIcon>
          <List.ItemText>Павел Орлов</List.ItemText>
          <List.ItemDescription>Менеджер</List.ItemDescription>
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <Icon name="object.file" data-testid="glyph" />
          </List.ItemIcon>
          <List.ItemText>Смета.xlsx</List.ItemText>
          <List.ItemDescription>234 КБ</List.ItemDescription>
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <ProgressCircle value={40} aria-label="Срок аренды: 40%" data-testid="ring" />
          </List.ItemIcon>
          Honda ADV 350
        </List.Item>
      </List.Root>,
    );
    expect(screen.getByTestId("alone")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("beside")).toHaveAttribute("data-size", "l");
    const tile = screen.getByTestId("glyph").parentElement as HTMLElement;
    expect(tile).toHaveAttribute("data-kind", "tile");
    expect(tile).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("ring")).toHaveAttribute("data-size", "xs");
    // A ring names the state; a picture repeats the text.
    expect(screen.getByTestId("ring").parentElement).not.toHaveAttribute("aria-hidden");
    expect(screen.getByTestId("alone").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("puts the number after the title and the badges on its line, never cut", () => {
    render(
      <List.Root aria-label="Обращения">
        <List.Item onClick={() => {}}>
          <List.ItemText number="#4821">Не приходят письма</List.ItemText>
          <List.ItemBadges>
            <Badge.Root tone="danger" data-testid="badge">
              Срочно
            </Badge.Root>
          </List.ItemBadges>
          <List.ItemDescription>
            <StatusDot tone="accent">Открыт</StatusDot>Ирина Белова
          </List.ItemDescription>
        </List.Item>
      </List.Root>,
    );
    const row = screen.getByRole("button");
    expect(row).toHaveAccessibleName(/^Не приходят письма #4821 Срочно/);
    const number = screen.getByText("#4821");
    expect(number).toHaveClass(rowStyles.number);
    expect(number.parentElement).toHaveClass(rowStyles.titleRow);
    expect(screen.getByTestId("badge")).toHaveAttribute("data-size", "s");
    expect(cssValue(cssRule(ROW_CSS, ".number"), "flex")).toBe("none");
    expect(cssValue(cssRule(ROW_CSS, ".badges"), "flex")).toBe("0 0 auto");
  });

  it("shows a count as a plain number, a Badge only with a colour", () => {
    render(
      <List.Root aria-label="Ящики">
        <List.Item>
          Сделки
          <List.ItemCount data-testid="plain">124</List.ItemCount>
        </List.Item>
        <List.Item>
          Входящие
          <List.ItemCount color="blue" data-testid="fresh">
            8
          </List.ItemCount>
        </List.Item>
      </List.Root>,
    );
    expect(screen.getByTestId("plain")).toHaveClass(rowStyles.count);
    expect(screen.getByTestId("fresh")).toHaveAttribute("data-color", "blue");
  });

  it("stacks a meta over a count beside a description, one line keeps them side by side", () => {
    render(
      <List.Root aria-label="Переписка">
        <List.Item>
          <List.ItemText>Ирина Белова</List.ItemText>
          <List.ItemDescription>Пришлите акт</List.ItemDescription>
          <List.ItemMeta>10:24</List.ItemMeta>
          <List.ItemCount color="blue">2</List.ItemCount>
        </List.Item>
        <List.Item>
          Сделки
          <List.ItemMeta>вчера</List.ItemMeta>
          <List.ItemCount>5</List.ItemCount>
        </List.Item>
      </List.Root>,
    );
    expect(screen.getByText("10:24").parentElement).toHaveClass(rowStyles.stack);
    expect(screen.getByText("вчера").parentElement).toHaveClass(rowStyles.end);
  });

  it("puts the row's controls beside its element, sized from the row", () => {
    render(
      <List.Root aria-label="Документы">
        <List.Item onClick={() => {}}>
          Смета.xlsx
          <List.ItemActions>
            <Button.Root aria-label="Скачать одна строка">
              <Button.Icon>
                <Icon name="action.download" />
              </Button.Icon>
            </Button.Root>
          </List.ItemActions>
        </List.Item>
        <List.Item onClick={() => {}}>
          <List.ItemText>Договор.pdf</List.ItemText>
          <List.ItemDescription>2,4 МБ</List.ItemDescription>
          <List.ItemActions>
            <Button.Root aria-label="Скачать две строки">
              <Button.Icon>
                <Icon name="action.download" />
              </Button.Icon>
            </Button.Root>
          </List.ItemActions>
        </List.Item>
      </List.Root>,
    );
    const one = screen.getByRole("button", { name: "Скачать одна строка" });
    expect(screen.getByRole("button", { name: "Смета.xlsx" })).not.toContainElement(one);
    expect(one).toHaveAttribute("data-size", "xs");
    expect(screen.getByRole("button", { name: "Скачать две строки" })).toHaveAttribute(
      "data-size",
      "s",
    );
    expect(cssValue(cssRule(ROW_CSS, ".actions"), "--prime-control-height")).toBe(
      "calc(var(--field-h) - var(--prime-space-2))",
    );
  });

  it("toggles the switch of a row without its own action from anywhere on the row", async () => {
    const onChange = vi.fn();
    render(
      <List.Root aria-label="Уведомления">
        <List.Item>
          Новые обращения
          <List.ItemActions>
            <Switch.Root aria-label="Новые обращения" onCheckedChange={onChange} />
          </List.ItemActions>
        </List.Item>
      </List.Root>,
    );
    await userEvent.click(screen.getByText("Новые обращения"));
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it("names a group of rows by its heading", () => {
    render(
      <List.Root aria-label="Ящики">
        <List.Group label="Почта">
          <List.Item>Входящие</List.Item>
        </List.Group>
      </List.Root>,
    );
    expect(screen.getByRole("group", { name: "Почта" })).toContainElement(
      screen.getByText("Входящие"),
    );
    expect(cssValue(cssRule(CSS, ".groupLabel"), "min-height")).toBe(
      "var(--prime-panel-group-label-height)",
    );
  });

  it("shows the controls on hover and focus with actions=hover, always on touch", () => {
    render(
      <List.Root aria-label="Документы" actions="hover">
        <List.Item>Смета.xlsx</List.Item>
      </List.Root>,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-actions", "hover");
    const hidden = cssRule(ROW_CSS, '.tier[data-actions="hover"] .row > .actions', [
      "@media (hover: hover) and (pointer: fine)",
    ]);
    expect(cssValue(hidden, "opacity")).toBe("0");
  });
});

describe("List as a choice", () => {
  const PEOPLE = ["Ирина", "Павел", "Сергей"];

  it("checks several rows with checkboxes and paints them the accent's soft tone", async () => {
    const onValueChange = vi.fn();
    render(
      <List.Root
        aria-label="Наблюдатели"
        multiple
        defaultValue={["Ирина"]}
        onValueChange={onValueChange}
      >
        {PEOPLE.map((name) => (
          <List.Item key={name} value={name}>
            {name}
          </List.Item>
        ))}
      </List.Root>,
    );
    const listbox = screen.getByRole("listbox", { name: "Наблюдатели" });
    expect(listbox).toHaveAttribute("aria-multiselectable", "true");
    const pavel = screen.getByRole("option", { name: "Павел" });
    await userEvent.click(pavel);
    expect(onValueChange).toHaveBeenLastCalledWith(["Ирина", "Павел"]);
    expect(pavel).toHaveAttribute("aria-selected", "true");
    expect(rowOf(pavel)).toHaveAttribute("data-checked");
    expect(cssValue(cssRule(ROW_CSS, ".row[data-checked]"), "background")).toBe(
      "var(--prime-color-accent-soft)",
    );
    // The checkbox leads the row by default.
    expect(pavel.firstElementChild).toHaveClass(rowStyles.indicator);
  });

  it("puts the checkboxes at the end with indicator=end", () => {
    render(
      <List.Root aria-label="Наблюдатели" multiple indicator="end" defaultValue={[]}>
        <List.Item value="a">Ирина</List.Item>
      </List.Root>,
    );
    const option = screen.getByRole("option", { name: "Ирина" });
    expect(option.firstElementChild).not.toHaveClass(rowStyles.indicator);
    expect(option.querySelector(`.${rowStyles.end} .${rowStyles.indicator}`)).not.toBeNull();
  });

  it("chooses one row with a check at the end, held on every row; one Tab stop, arrows move", async () => {
    const onValueChange = vi.fn();
    render(
      <List.Root aria-label="Роль" defaultValue="editor" onValueChange={onValueChange}>
        <List.Item value="viewer">Наблюдатель</List.Item>
        <List.Item value="editor">Редактор</List.Item>
        <List.Item value="admin">Администратор</List.Item>
      </List.Root>,
    );
    const options = screen.getAllByRole("option");
    expect(options.map((option) => option.querySelector(`.${rowStyles.check}`) !== null)).toEqual([
      true,
      true,
      true,
    ]);
    expect(options.map((option) => option.getAttribute("tabindex"))).toEqual(["-1", "0", "-1"]);
    options[1]?.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(options[2]).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    expect(options[1]).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(options[0]).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(options[2]).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith("admin");
    options[0]?.focus();
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("viewer");
    expect(rowOf(options[0] as HTMLElement)).not.toHaveAttribute("data-checked");
  });
});

const STAGES = [
  { id: "lead", name: "Лид" },
  { id: "talks", name: "Переговоры" },
  { id: "contract", name: "Договор" },
];

function Funnel({
  onMove,
  handle,
  lockLast = false,
}: {
  onMove?: (id: string, beforeId: string | null) => unknown;
  handle?: "end" | "start" | "row";
  lockLast?: boolean;
}) {
  const [stages, setStages] = React.useState(STAGES);
  return (
    <List.Root
      aria-label="Этапы воронки"
      handle={handle}
      onReorder={async (id, beforeId) => {
        await onMove?.(id, beforeId);
        setStages((current) => moveBefore(current, id, beforeId, (stage) => stage.id));
      }}
    >
      {stages.map((stage, index) => (
        <List.Item
          key={stage.id}
          value={stage.id}
          locked={lockLast && index === stages.length - 1}
          onClick={() => {}}
        >
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
  it("gives every row a named grip at its end, and moves a row with Alt+↓ / ↑", async () => {
    const onMove = vi.fn();
    render(<Funnel onMove={onMove} />);
    const grip = screen.getByRole("button", { name: "Переместить Лид" });
    const row = rowOf(grip);
    expect(row.lastElementChild).toContainElement(grip);
    await act(async () => {
      fireEvent.keyDown(grip, { key: "ArrowDown", altKey: true });
    });
    expect(onMove).toHaveBeenLastCalledWith("lead", "contract");
    expect(order()).toEqual(["talks", "lead", "contract"]);
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("button", { name: "Переместить Договор" }), {
        key: "ArrowUp",
        altKey: true,
      });
    });
    expect(order()).toEqual(["talks", "contract", "lead"]);
  });

  it("puts the grip at the start with handle=start, and drags the whole row with handle=row", () => {
    const { unmount } = render(<Funnel handle="start" />);
    const grip = screen.getByRole("button", { name: "Переместить Лид" });
    expect(rowOf(grip).firstElementChild).toContainElement(grip);
    unmount();
    render(<Funnel handle="row" />);
    expect(screen.queryByRole("button", { name: "Переместить Лид" })).toBeNull();
  });

  it("shows a lock in the grip's place on a locked row", () => {
    render(<Funnel lockLast />);
    expect(screen.getByRole("img", { name: "Договор: закреплено" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Переместить Договор" })).toBeNull();
  });
});
