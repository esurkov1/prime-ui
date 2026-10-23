import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { moveBefore } from "@/components/dnd/useSortableList";
import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { StatusDot } from "@/components/status-dot/StatusDot";
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
        <List.Item onClick={() => {}}>
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

  it("puts a glyph beside two lines on a tile as tall as the lines; an avatar and a one-line row keep theirs", () => {
    render(
      <List.Root aria-label="Сеансы">
        <List.Item>
          <List.ItemIcon>
            <svg data-testid="device" />
          </List.ItemIcon>
          <List.ItemText>MacBook Pro · Safari</List.ItemText>
          <List.ItemDescription>Москва · сейчас</List.ItemDescription>
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <svg data-testid="plain" />
          </List.ItemIcon>
          <List.ItemText>iPhone 15</List.ItemText>
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <Avatar.Root data-testid="avatar">
              <Avatar.Fallback>ИБ</Avatar.Fallback>
            </Avatar.Root>
          </List.ItemIcon>
          <List.ItemText>Ирина Белова</List.ItemText>
          <List.ItemDescription>ООО «Гранит»</List.ItemDescription>
        </List.Item>
      </List.Root>,
    );
    const tile = screen.getByTestId("device").parentElement as HTMLElement;
    expect(tile).toHaveClass(styles.tile);
    expect(tile).toHaveAttribute("data-size", "s");
    expect(tile).toHaveAttribute("aria-hidden", "true");
    const plain = screen.getByTestId("plain").parentElement as HTMLElement;
    expect(plain).toHaveClass(styles.icon);
    expect(plain).not.toHaveClass(styles.tile);
    expect(screen.getByTestId("avatar").parentElement).toHaveClass(styles.icon);
    // An avatar beside two lines is as tall as they are (40 at `m`), as the tile.
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "l");
  });

  it("fits a progress ring to the row and keeps its name: the row's height, or the two lines", () => {
    render(
      <List.Root aria-label="Аренды">
        <List.Item>
          <List.ItemIcon>
            <ProgressCircle value={72} aria-label="Срок аренды: 72%" data-testid="line" />
          </List.ItemIcon>
          <List.ItemText>Yamaha NMAX</List.ItemText>
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <ProgressCircle value={40} aria-label="Срок аренды: 40%" data-testid="two" />
          </List.ItemIcon>
          <List.ItemText>Honda ADV 350</List.ItemText>
          <List.ItemDescription>Осталось 8 дней</List.ItemDescription>
        </List.Item>
        <List.Item>
          <List.ItemIcon>
            <ProgressCircle value={10} size="xs" aria-label="Срок аренды: 10%" data-testid="own" />
          </List.ItemIcon>
          <List.ItemText>Vespa Primavera</List.ItemText>
        </List.Item>
      </List.Root>,
    );
    expect(screen.getByTestId("line")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("two")).toHaveAttribute("data-size", "m");
    expect(screen.getByTestId("own")).toHaveAttribute("data-size", "xs");
    // The ring tells the row's state: its slot is not hidden from assistive tech.
    expect(screen.getByTestId("two").parentElement).not.toHaveAttribute("aria-hidden");
    expect(screen.getByRole("progressbar", { name: "Срок аренды: 40%" })).toBeInTheDocument();
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
        <List.Item ref={ref} className="custom" data-id="granit" onClick={() => {}}>
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
        <List.Item key={stage.id} value={stage.id} onClick={() => {}}>
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
        <List.Item value="talks">Переговоры</List.Item>
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

  it("a locked row holds its place: a named lock in the grip's box, the row works as any other", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    const onOpen = vi.fn();
    render(
      <List.Root aria-label="Этапы воронки" onReorder={onMove}>
        <List.Item value="new" locked onClick={() => onOpen("new")}>
          <List.ItemText>Новая</List.ItemText>
          <List.ItemActions>
            <Switch.Root aria-label="Показывать «Новая»" />
          </List.ItemActions>
        </List.Item>
        <List.Item value="talks" onClick={() => {}}>
          <List.ItemText>Переговоры</List.ItemText>
          <List.ItemActions>
            <Switch.Root aria-label="Показывать «Переговоры»" />
          </List.ItemActions>
        </List.Item>
        <List.Item value="contract">Договор</List.Item>
      </List.Root>,
    );
    const lock = screen.getByRole("img", { name: "Новая: закреплено" });
    const row = lock.closest("li");
    // The lock stands in the grip's box, so the locked row keeps the movable rows' columns.
    expect(lock.parentElement).toHaveClass(styles.grip ?? "");
    expect(row).toHaveAttribute("data-locked");
    expect(screen.queryByRole("button", { name: "Переместить Новая" })).toBeNull();
    // The row itself is a normal row: enabled, it opens on a click, its control is its own.
    const button = screen.getByRole("button", { name: "Новая" });
    expect(button).toBeEnabled();
    await user.click(button);
    expect(onOpen).toHaveBeenCalledWith("new");
    expect(screen.getByRole("switch", { name: "Показывать «Новая»" })).toBeEnabled();
    // It does not move from the keyboard either.
    await act(async () => {
      fireEvent.keyDown(button, { key: "ArrowDown", altKey: true });
    });
    expect(onMove).not.toHaveBeenCalled();
    // A neighbour does not step over it, and the refusal says why.
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("button", { name: "Переместить Переговоры" }), {
        key: "ArrowUp",
        altKey: true,
      });
    });
    expect(onMove).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Переговоры: «Новая» закреплено, дальше не переместить",
    );
  });

  it("draws no grip while nothing can move; the grip comes in its kept box with a second row", async () => {
    const onMove = vi.fn();
    function Phase({ stages }: { stages: string[] }) {
      return (
        <List.Root aria-label="Этапы фазы" onReorder={onMove}>
          <List.Item value="new" locked>
            Новая
          </List.Item>
          {stages.map((stage) => (
            <List.Item key={stage} value={stage} onClick={() => {}}>
              {stage}
            </List.Item>
          ))}
        </List.Root>
      );
    }
    const { rerender } = render(<Phase stages={["Квалификация"]} />);
    const row = screen.getByRole("button", { name: "Квалификация" });
    const box = row.closest("li")?.lastElementChild;
    // One movable row beside a pinned one: no grip, no lock, the grip box kept empty.
    expect(screen.queryByRole("button", { name: "Переместить Квалификация" })).toBeNull();
    expect(screen.queryByRole("img", { name: "Новая: закреплено" })).toBeNull();
    expect(box).toHaveClass(styles.grip ?? "");
    expect(box).toBeEmptyDOMElement();
    // No Alt+arrow either.
    await act(async () => {
      fireEvent.keyDown(row, { key: "ArrowUp", altKey: true });
    });
    expect(onMove).not.toHaveBeenCalled();

    rerender(<Phase stages={["Квалификация", "Переговоры"]} />);
    const handle = screen.getByRole("button", { name: "Переместить Квалификация" });
    expect(handle.parentElement).toBe(box);
    expect(handle).toHaveClass(enterMotion.enter);
    expect(handle).toHaveAttribute("aria-keyshortcuts");
    expect(screen.getByRole("img", { name: "Новая: закреплено" })).toBeInTheDocument();
    await act(async () => {
      fireEvent.keyDown(handle, { key: "ArrowDown", altKey: true });
    });
    expect(onMove).toHaveBeenCalledWith("Квалификация", null);
  });

  it("a single row draws no grip and takes no Alt+arrow", async () => {
    const onMove = vi.fn();
    render(
      <List.Root aria-label="Этапы" onReorder={onMove}>
        <List.Item value="lead" onClick={() => {}}>
          Лид
        </List.Item>
      </List.Root>,
    );
    const row = screen.getByRole("button", { name: "Лид" });
    expect(screen.queryByRole("button", { name: "Переместить Лид" })).toBeNull();
    expect(row.closest("li")).not.toHaveAttribute("aria-keyshortcuts");
    await act(async () => {
      fireEvent.keyDown(row, { key: "ArrowDown", altKey: true });
    });
    expect(onMove).not.toHaveBeenCalled();
  });

  it("names the lock from labels", () => {
    render(
      <List.Root
        aria-label="Этапы"
        onReorder={() => {}}
        labels={{ lockedItem: "{label} — системный" }}
      >
        <List.Item value="lead">Лид</List.Item>
        <List.Item value="talks">Переговоры</List.Item>
        <List.Item value="won" locked>
          Выиграна
        </List.Item>
      </List.Root>,
    );
    expect(screen.getByRole("img", { name: "Выиграна — системный" })).toBeInTheDocument();
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
        <List.Item value="talks" onClick={() => {}}>
          <List.ItemText>Переговоры</List.ItemText>
          <List.ItemActions>
            <Switch.Root aria-label="Показывать на доске" />
          </List.ItemActions>
        </List.Item>
        <List.Item value="contract" onClick={() => {}}>
          Договор
        </List.Item>
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

  it("leads a reorderable row with side=start controls; DOM and Tab: control, row, end controls, handle", async () => {
    const user = userEvent.setup();
    render(
      <List.Root aria-label="Этапы" onReorder={() => {}}>
        <List.Item value="talks" onClick={() => {}}>
          <List.ItemActions side="start" data-testid="leading">
            <Switch.Root aria-label="Показывать на доске" />
          </List.ItemActions>
          <List.ItemText>Переговоры</List.ItemText>
          <List.ItemActions data-testid="trailing">
            <button type="button">Ещё</button>
          </List.ItemActions>
        </List.Item>
        <List.Item value="contract" onClick={() => {}}>
          Договор
        </List.Item>
      </List.Root>,
    );
    const row = screen.getByRole("button", { name: "Переговоры" });
    const toggle = screen.getByRole("switch", { name: "Показывать на доске" });
    const more = screen.getByRole("button", { name: "Ещё" });
    const handle = screen.getByRole("button", { name: "Переместить Переговоры" });
    const leading = screen.getByTestId("leading");
    const trailing = screen.getByTestId("trailing");
    // One frame, in reading order: the leading controls, the row element, the trailing controls.
    const frame = row.parentElement;
    expect(frame).toHaveClass(styles.frame);
    expect(Array.from(frame?.children ?? [])).toEqual([leading, row, trailing]);
    expect(leading).toHaveAttribute("data-side", "start");
    expect(trailing).toHaveAttribute("data-side", "end");
    expect(row).not.toContainElement(toggle);
    // The grip keeps the row's end.
    expect(handle.closest("li")?.lastElementChild).toContainElement(handle);
    // One tier below the row, as far from the row's side edge as its own text is (`--field-px`),
    // at any row height: a spacer leads it.
    expect(toggle.closest("[data-size]")).toHaveAttribute("data-size", "s");
    const css = "src/components/list/List.module.css";
    const spacer = cssRule(
      css,
      '.actions[data-side="end"]::after, .actions[data-side="start"]::before',
    );
    expect(cssValue(spacer, "inline-size")).toBe("var(--field-px)");
    expect(spacer.decls.some((decl) => decl.prop === "aspect-ratio")).toBe(false);
    await user.tab();
    expect(toggle).toHaveFocus();
    await user.tab();
    expect(row).toHaveFocus();
    await user.tab();
    expect(more).toHaveFocus();
    await user.tab();
    expect(handle).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Договор" })).toHaveFocus();
    await user.tab({ shift: true });
    await user.tab({ shift: true });
    await user.tab({ shift: true });
    await user.tab({ shift: true });
    expect(toggle).toHaveFocus();
  });

  it("renders a row without onClick, href or asChild as a static box out of the Tab order", async () => {
    const user = userEvent.setup();
    render(
      <List.Root aria-label="Архив">
        <List.Item data-testid="row">
          <List.ItemText>Детское кресло</List.ItemText>
          <List.ItemDescription>150 ₽ в сутки</List.ItemDescription>
          <List.ItemActions>
            <button type="button">Вернуть из архива</button>
          </List.ItemActions>
        </List.Item>
      </List.Root>,
    );
    const row = screen.getByTestId("row");
    expect(row.tagName).toBe("DIV");
    expect(screen.queryByRole("button", { name: /Детское кресло/ })).toBeNull();
    expect(row).toHaveTextContent(/Детское кресло.*150 ₽ в сутки/);
    await user.tab();
    expect(screen.getByRole("button", { name: "Вернуть из архива" })).toHaveFocus();
  });

  it("sees parts passed in a fragment", () => {
    render(
      <List.Root aria-label="Проблемы">
        <List.Item onClick={() => {}}>
          <List.ItemText>Нет оплаты</List.ItemText>
          <List.ItemDescription>Счёт № 4821</List.ItemDescription>
          <List.ItemMeta>вчера</List.ItemMeta>
          <List.ItemActions>
            <button type="button">Закрыть</button>
          </List.ItemActions>
        </List.Item>
      </List.Root>,
    );
    const row = screen.getByRole("button", { name: /Нет оплаты/ });
    expect(screen.getByText("Нет оплаты")).toHaveClass(styles.text ?? "");
    expect(screen.getByText("Счёт № 4821").parentElement).toHaveClass(styles.description ?? "");
    expect(screen.getByText("вчера")).toHaveClass(styles.meta ?? "");
    expect(row).not.toContainElement(screen.getByRole("button", { name: "Закрыть" }));
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

  it("puts the badges on the title's line and a StatusDot first in the description", () => {
    render(
      <List.Root aria-label="Обращения">
        <List.Item onClick={() => {}}>
          <List.ItemText>Счёт без НДС</List.ItemText>
          <List.ItemBadges data-testid="badges">
            <Badge.Root tone="danger">Срочно</Badge.Root>
          </List.ItemBadges>
          <List.ItemDescription>
            <StatusDot tone="warning">Ждёт ответа</StatusDot>
            ООО «Гранит»
          </List.ItemDescription>
        </List.Item>
      </List.Root>,
    );
    const title = screen.getByText("Счёт без НДС");
    const badges = screen.getByTestId("badges");
    expect(badges.parentElement).toBe(title.parentElement);
    expect(title.compareDocumentPosition(badges) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const description = screen.getByText("ООО «Гранит»").parentElement;
    expect(description?.firstElementChild).toHaveTextContent("Ждёт ответа");
    expect(description).toHaveTextContent("Ждёт ответа·ООО «Гранит»");
  });
});
