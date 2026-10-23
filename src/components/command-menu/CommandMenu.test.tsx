import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { cssRule, cssValue } from "@/test/css";
import { withMotion } from "@/test/motion";

import { CommandMenu } from "./CommandMenu";

/** A scrim dismiss is a full click that starts and ends outside the panel. */
function clickScrim() {
  const scrim = screen.getByRole("dialog").parentElement as HTMLElement;
  fireEvent.pointerDown(scrim);
  fireEvent.click(scrim);
}

function TestPalette({
  open = true,
  onOpenChange = vi.fn(),
  onSelect = vi.fn(),
}: {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  onSelect?: (value: string) => void;
}) {
  return (
    <CommandMenu.Root open={open} onOpenChange={onOpenChange}>
      <CommandMenu.Input placeholder="Поиск" aria-label="Поиск команд" />
      <CommandMenu.List>
        <CommandMenu.Group label="Тест">
          <CommandMenu.Item value="alpha" keywords="a" onSelect={() => onSelect("alpha")}>
            Alpha
          </CommandMenu.Item>
          <CommandMenu.Item value="beta" keywords="b" onSelect={() => onSelect("beta")}>
            Beta
          </CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu.List>
    </CommandMenu.Root>
  );
}

describe("CommandMenu", () => {
  it("показывает диалог и пункты при open", () => {
    render(<TestPalette />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Beta" })).toBeInTheDocument();
  });

  it("keeps autofill and the password managers off the search", () => {
    render(<TestPalette />);
    const input = screen.getByRole("combobox", { name: "Поиск команд" });
    expect(input).toHaveAttribute("type", "search");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toHaveAttribute("data-form-type", "other");
  });

  it("фильтрует пункты по вводу в поле поиска", async () => {
    const user = userEvent.setup();
    render(<TestPalette />);

    const input = screen.getByRole("combobox", { name: "Поиск команд" });
    await user.type(input, "bet");

    expect(screen.queryByRole("option", { name: "Alpha" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Beta" })).toBeInTheDocument();
  });

  it("отфильтрованные пункты и группа без совпадений получают hidden и уходят из дерева доступности", async () => {
    const user = userEvent.setup();
    render(
      <CommandMenu.Root open onOpenChange={() => {}}>
        <CommandMenu.Input aria-label="Поиск команд" />
        <CommandMenu.List>
          <CommandMenu.Group label="Разделы">
            <CommandMenu.Item value="заказы">Заказы</CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group label="Действия">
            <CommandMenu.Item value="счёт">Выставить счёт</CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Root>,
    );
    await user.type(screen.getByRole("combobox", { name: "Поиск команд" }), "счёт");
    expect(screen.queryByRole("option", { name: "Заказы" })).not.toBeInTheDocument();
    expect(screen.getByText("Заказы").closest('[role="option"]')).toHaveAttribute("hidden");
    expect(screen.queryByRole("group", { name: "Разделы" })).not.toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Действия" })).toBeInTheDocument();
  });

  it("marks the matched part of item text while a query is typed", async () => {
    const user = userEvent.setup();
    render(<TestPalette />);
    expect(document.querySelector("mark")).toBeNull();

    await user.type(screen.getByRole("combobox"), "LP");
    const option = screen.getByRole("option", { name: "Alpha" });
    expect(option.querySelector("mark")).toHaveTextContent("lp");
    expect(option).toHaveTextContent("Alpha");
  });

  it("marks the match in the description line too", async () => {
    const user = userEvent.setup();
    render(
      <CommandMenu.Root open onOpenChange={vi.fn()}>
        <CommandMenu.Input aria-label="Поиск команд" />
        <CommandMenu.List>
          <CommandMenu.Item value="intro" keywords="что такое система">
            <CommandMenu.ItemText description="Что такое Prime UI">Введение</CommandMenu.ItemText>
          </CommandMenu.Item>
        </CommandMenu.List>
      </CommandMenu.Root>,
    );
    await user.type(screen.getByRole("combobox"), "что");
    const marks = screen.getByRole("option").querySelectorAll("mark");
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent("Что");
  });

  it("не рендерит диалог при open=false", () => {
    render(<TestPalette open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("стрелки двигают активный пункт, Enter выполняет его", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TestPalette onSelect={onSelect} />);
    const input = screen.getByRole("combobox", { name: "Поиск команд" });
    const beta = screen.getByRole("option", { name: "Beta" });

    expect(screen.getByRole("option", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
    await user.type(input, "{ArrowDown}");
    expect(beta).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", beta.id);
    await user.type(input, "{Enter}");
    expect(onSelect).toHaveBeenCalledWith("beta");
  });

  it("Home and End move the active item to the first and the last match", async () => {
    const user = userEvent.setup();
    render(<TestPalette />);
    const alpha = screen.getByRole("option", { name: "Alpha" });
    const beta = screen.getByRole("option", { name: "Beta" });
    await user.keyboard("{End}");
    expect(beta).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Home}");
    expect(alpha).toHaveAttribute("aria-selected", "true");
  });

  it("Title называет диалог", () => {
    render(
      <CommandMenu.Root open onOpenChange={() => {}}>
        <CommandMenu.Title>Быстрые действия</CommandMenu.Title>
        <CommandMenu.Input />
      </CommandMenu.Root>,
    );
    expect(screen.getByRole("dialog", { name: "Быстрые действия" })).toBeInTheDocument();
  });
});

describe("CommandMenu — пустое состояние и футер", () => {
  it("Empty появляется, только когда по запросу ничего не найдено", async () => {
    const user = userEvent.setup();
    render(
      <CommandMenu.Root open onOpenChange={() => {}}>
        <CommandMenu.Input aria-label="Поиск команд" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group label="Раздел">
            <CommandMenu.Item value="alpha">Alpha</CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
        <CommandMenu.Footer>
          <CommandMenu.FooterHint keys={["↑", "↓"]}>Навигация</CommandMenu.FooterHint>
        </CommandMenu.Footer>
      </CommandMenu.Root>,
    );
    expect(screen.queryByText("Ничего не найдено")).not.toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Раздел" })).toBeInTheDocument();
    await user.type(screen.getByRole("combobox", { name: "Поиск команд" }), "zzz");
    // The empty state is a status of its own, beside the list's loading announcement.
    expect(screen.getByText("Ничего не найдено").closest('[role="status"]')).not.toBeNull();
    expect(screen.getByText("Навигация")).toBeInTheDocument();
  });
});

describe("CommandMenu — size и labels", () => {
  it("size задаёт ярус пунктов, labels — строки поиска и пустого состояния", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(
      <CommandMenu.Root
        open
        onOpenChange={() => {}}
        size="xl"
        labels={{ search: "Find", empty: "Nothing" }}
        onSearchChange={onSearchChange}
      >
        <CommandMenu.Input />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Item value="alpha">Alpha</CommandMenu.Item>
        </CommandMenu.List>
        <CommandMenu.Footer>
          <CommandMenu.FooterHint keys={["Esc"]}>Закрыть</CommandMenu.FooterHint>
        </CommandMenu.Footer>
      </CommandMenu.Root>,
    );
    const option = screen.getByRole("option", { name: "Alpha" });
    expect(option.closest("[data-size]")).toHaveAttribute("data-size", "l");
    const input = screen.getByRole("combobox", { name: "Find" });
    expect(input).toHaveAttribute("placeholder", "Find");
    await user.type(input, "zz");
    expect(onSearchChange).toHaveBeenLastCalledWith("zz");
    expect(screen.getByText("Nothing").closest('[role="status"]')).toHaveTextContent(/^Nothing$/);
    expect(screen.getByText("Esc").tagName).toBe("KBD");
  });
});

describe("CommandMenu — кольцо фокуса", () => {
  it("поле поиска — постоянный фокус палитры: фокус на нём при открытии, кольца нет", () => {
    render(
      <CommandMenu.Root open onOpenChange={() => {}}>
        <CommandMenu.Input aria-label="Поиск команд" />
        <CommandMenu.List>
          <CommandMenu.Item value="alpha">Alpha</CommandMenu.Item>
        </CommandMenu.List>
      </CommandMenu.Root>,
    );
    expect(screen.getByRole("combobox", { name: "Поиск команд" })).toHaveFocus();
    expect(cssValue(cssRule("src/internal/menu.module.css", ".searchInput"), "outline")).toBe(
      "none",
    );
  });
});

describe("CommandMenu — overlay contract", () => {
  it("a pointerdown on the scrim closes it; inside the dialog does not", () => {
    const onOpenChange = vi.fn();
    render(<TestPalette onOpenChange={onOpenChange} />);
    fireEvent.pointerDown(screen.getByRole("option", { name: "Alpha" }));
    expect(onOpenChange).not.toHaveBeenCalled();

    clickScrim();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Escape closes it", () => {
    const onOpenChange = vi.fn();
    render(<TestPalette onOpenChange={onOpenChange} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closeOnEscape={false} ignores Escape", () => {
    const onOpenChange = vi.fn();
    render(
      <CommandMenu.Root open onOpenChange={onOpenChange} closeOnEscape={false}>
        <CommandMenu.Input aria-label="Поиск команд" />
      </CommandMenu.Root>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closeOnOutsideClick={false} ignores the scrim", () => {
    const onOpenChange = vi.fn();
    render(
      <CommandMenu.Root open onOpenChange={onOpenChange} closeOnOutsideClick={false}>
        <CommandMenu.Input aria-label="Поиск команд" />
      </CommandMenu.Root>,
    );
    clickScrim();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe("CommandMenu — focus, query and disabled items", () => {
  it("focus lands in the search field on open", async () => {
    render(<TestPalette />);
    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: "Поиск команд" })).toHaveFocus(),
    );
  });

  it("the query lives on Root: search / onSearchChange, cleared when the palette closes", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    function Harness() {
      const [open, setOpen] = React.useState(true);
      const [query, setQuery] = React.useState("al");
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            open
          </button>
          <CommandMenu.Root
            open={open}
            onOpenChange={setOpen}
            search={query}
            onSearchChange={(next) => {
              onSearchChange(next);
              setQuery(next);
            }}
          >
            <CommandMenu.Input aria-label="Поиск команд" />
            <CommandMenu.List>
              <CommandMenu.Item value="alpha">Alpha</CommandMenu.Item>
              <CommandMenu.Item value="beta">Beta</CommandMenu.Item>
            </CommandMenu.List>
          </CommandMenu.Root>
        </>
      );
    }
    render(<Harness />);
    const input = screen.getByRole("combobox", { name: "Поиск команд" });
    expect(input).toHaveValue("al");
    expect(screen.queryByRole("option", { name: "Beta" })).not.toBeInTheDocument();
    await user.type(input, "p");
    expect(onSearchChange).toHaveBeenLastCalledWith("alp");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onSearchChange).toHaveBeenLastCalledWith("");
  });

  it("a disabled item is shown with aria-disabled, skipped by the arrows and not runnable", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CommandMenu.Root open onOpenChange={vi.fn()}>
        <CommandMenu.Input aria-label="Поиск команд" />
        <CommandMenu.List>
          <CommandMenu.Item value="alpha">Alpha</CommandMenu.Item>
          <CommandMenu.Item value="beta" disabled onSelect={onSelect}>
            Beta
          </CommandMenu.Item>
          <CommandMenu.Item value="gamma">Gamma</CommandMenu.Item>
        </CommandMenu.List>
      </CommandMenu.Root>,
    );
    const beta = screen.getByRole("option", { name: "Beta" });
    expect(beta).toBeVisible();
    expect(beta).toHaveAttribute("aria-disabled", "true");
    const input = screen.getByRole("combobox", { name: "Поиск команд" });
    await user.type(input, "{ArrowDown}");
    expect(screen.getByRole("option", { name: "Gamma" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(beta);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("the pointer moves the active option", () => {
    render(<TestPalette />);
    const beta = screen.getByRole("option", { name: "Beta" });
    fireEvent.pointerMove(beta);
    expect(beta).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveAttribute("aria-selected", "false");
  });
});

describe("CommandMenu — a persistent item", () => {
  const onCreate = vi.fn();
  function Harness() {
    const [query, setQuery] = React.useState("");
    return (
      <CommandMenu.Root open onOpenChange={vi.fn()} search={query} onSearchChange={setQuery}>
        <CommandMenu.Input aria-label="Поиск команд" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          {query.trim() ? (
            <CommandMenu.Item
              persistent
              value={`создать ${query}`}
              onSelect={() => onCreate(query)}
            >
              Создать «{query}»
            </CommandMenu.Item>
          ) : null}
          <CommandMenu.Item value="alpha">Alpha</CommandMenu.Item>
          <CommandMenu.Item value="alpha beta">Alpha beta</CommandMenu.Item>
        </CommandMenu.List>
      </CommandMenu.Root>
    );
  }

  it("shows with the empty text while nothing matches, takes the highlight and runs on Enter", async () => {
    onCreate.mockClear();
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByRole("combobox", { name: "Поиск команд" });
    await user.type(input, "zeta");
    // Never a match: the empty state still shows, the text only.
    const empty = screen.getByText("Ничего не найдено").closest('[role="status"]');
    expect(empty).not.toBeNull();
    const create = screen.getByRole("option", { name: "Создать «zeta»" });
    expect(empty).not.toContainElement(create);
    expect(create).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Enter}");
    expect(onCreate).toHaveBeenCalledWith("zeta");
  });

  it("stays when a namesake matches; the arrows reach it after the matches", async () => {
    onCreate.mockClear();
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByRole("combobox", { name: "Поиск команд" });
    await user.type(input, "alpha");
    expect(screen.queryByText("Ничего не найдено")).not.toBeInTheDocument();
    const create = screen.getByRole("option", { name: "Создать «alpha»" });
    expect(create).toBeVisible();
    // The first match is active, not the create item rendered before it.
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(create).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
  });
});

describe("CommandMenu — server search", () => {
  const PEOPLE = ["Анна Смирнова", "Борис Котов", "Вера Лебедева"];

  function ServerPalette(props: Partial<React.ComponentProps<typeof CommandMenu.Root>>) {
    return (
      <CommandMenu.Root open onOpenChange={vi.fn()} filter={false} {...props}>
        <CommandMenu.Input aria-label="Поиск людей" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          {PEOPLE.map((name) => (
            <CommandMenu.Item key={name} value={name}>
              {name}
            </CommandMenu.Item>
          ))}
        </CommandMenu.List>
      </CommandMenu.Root>
    );
  }

  it("filter={false} keeps every item whatever the query", async () => {
    const user = userEvent.setup();
    render(<ServerPalette />);
    await user.type(screen.getByRole("combobox", { name: "Поиск людей" }), "zzz");
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.queryByText("Ничего не найдено")).not.toBeInTheDocument();
  });

  it("loading with no items shows skeleton rows in the list, not the empty state", () => {
    render(
      <CommandMenu.Root open onOpenChange={vi.fn()} filter={false} loading>
        <CommandMenu.Input aria-label="Поиск людей" />
        <CommandMenu.List>
          <CommandMenu.Empty />
        </CommandMenu.List>
      </CommandMenu.Root>,
    );
    const list = screen.getByRole("listbox");
    expect(list).toHaveAttribute("aria-busy", "true");
    expect(list.querySelectorAll("[data-skeleton]").length).toBeGreaterThan(0);
    expect(screen.queryByText("Ничего не найдено")).not.toBeInTheDocument();
    expect(screen.getByText("Загрузка…")).toBeInTheDocument();
  });

  it("loading with items keeps them on screen and marks the list busy", () => {
    render(<ServerPalette loading />);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByRole("listbox").querySelector("[data-skeleton]")).toBeNull();
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-busy", "true");
  });

  it("loadingMore adds skeleton rows after the items", () => {
    render(<ServerPalette loadingMore hasMore />);
    const list = screen.getByRole("listbox");
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(list.querySelectorAll("[data-skeleton]").length).toBeGreaterThan(0);
  });

  it("the arrows reaching the last item ask for more once per round", async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    const { rerender } = render(<ServerPalette hasMore onLoadMore={onLoadMore} />);
    const input = screen.getByRole("combobox", { name: "Поиск людей" });
    await user.type(input, "{End}");
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    await user.type(input, "{ArrowUp}{ArrowDown}");
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    rerender(<ServerPalette hasMore={false} onLoadMore={onLoadMore} />);
    await user.type(input, "{ArrowUp}{ArrowDown}");
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("the sentinel asks for more when it scrolls into view", () => {
    const observers: { callback: IntersectionObserverCallback }[] = [];
    const original = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        observers.push({ callback });
      }
      observe() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
    try {
      const onLoadMore = vi.fn();
      render(<ServerPalette hasMore onLoadMore={onLoadMore} />);
      expect(observers.length).toBeGreaterThan(0);
      observers
        .at(-1)
        ?.callback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    } finally {
      globalThis.IntersectionObserver = original;
    }
  });

  it("loadError replaces the list with an alert; the retry button and Enter call onRetry", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ServerPalette loadError="Не удалось загрузить людей" onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Не удалось загрузить людей");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Повторить" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    await user.type(screen.getByRole("combobox", { name: "Поиск людей" }), "{Enter}");
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it("with a load error Tab moves focus from the search field to the retry button", async () => {
    const user = userEvent.setup();
    render(<ServerPalette loadError="Не удалось загрузить людей" onRetry={vi.fn()} />);
    expect(document.activeElement).toBe(screen.getByRole("combobox", { name: "Поиск людей" }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Повторить" }));
  });

  it("async onRetry: the button loads and nothing retries again until it settles", async () => {
    let reject: (reason: unknown) => void = () => {};
    const onRetry = vi.fn(
      () =>
        new Promise<void>((_, fail) => {
          reject = fail;
        }),
    );
    render(<ServerPalette loadError="Не удалось загрузить людей" onRetry={onRetry} />);
    const button = screen.getByRole("button", { name: "Повторить" });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.keyDown(screen.getByRole("combobox", { name: "Поиск людей" }), { key: "Enter" });
    expect(onRetry).toHaveBeenCalledTimes(1);

    await act(async () => {
      reject(new Error("offline"));
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Не удалось загрузить людей");
    expect(button).not.toHaveAttribute("aria-busy");
    fireEvent.keyDown(screen.getByRole("combobox", { name: "Поиск людей" }), { key: "Enter" });
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it("a load state change cross-fades: the old list leaves inert while the error shows", () => {
    withMotion();
    const { rerender } = render(<ServerPalette />);
    expect(screen.getByRole("listbox").closest("[inert]")).toBeNull();
    rerender(<ServerPalette loadError="Ошибка" />);
    expect(screen.getByRole("alert").closest("[inert]")).toBeNull();
    expect(screen.getByRole("listbox", { hidden: true }).closest("[inert]")).not.toBeNull();
  });
});
