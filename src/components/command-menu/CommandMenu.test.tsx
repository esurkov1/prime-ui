import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CommandMenu } from "./CommandMenu";

/** A scrim dismiss is a full click that starts and ends outside the panel. */
function clickScrim(scrim: HTMLElement) {
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

  it("фильтрует пункты по вводу в поле поиска", async () => {
    const user = userEvent.setup();
    render(<TestPalette />);

    const input = screen.getByRole("combobox", { name: "Поиск команд" });
    await user.type(input, "bet");

    expect(screen.queryByRole("option", { name: "Alpha" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Beta" })).toBeInTheDocument();
  });

  it("отфильтрованные пункты получают hidden, а CSS прячет [hidden] вопреки display: flex", async () => {
    const user = userEvent.setup();
    render(<TestPalette />);
    await user.type(screen.getByRole("combobox", { name: "Поиск команд" }), "bet");
    const alpha = screen.getByText("Alpha").closest('[role="option"]');
    expect(alpha).toHaveAttribute("hidden");
    const fs = await import("node:fs");
    const rows = fs.readFileSync("src/internal/menu.module.css", "utf8");
    const own = fs.readFileSync("src/components/command-menu/CommandMenu.module.css", "utf8");
    expect(rows).toMatch(/\.item\[hidden\]\s*\{\s*display: none;/);
    expect(own).toMatch(/\.group\[hidden\]\s*\{\s*display: none;/);
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
    expect(screen.getByRole("status")).toHaveTextContent("Ничего не найдено");
    expect(screen.getByText("Навигация")).toBeInTheDocument();
  });
});

describe("CommandMenu — size и labels", () => {
  it("size задаёт ярус пунктов, labels — строки поиска и пустого состояния", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CommandMenu.Root
        open
        onOpenChange={() => {}}
        size="xl"
        labels={{ search: "Find", empty: "Nothing", emptyHint: "" }}
      >
        <CommandMenu.Input onValueChange={onValueChange} />
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
    expect(option.closest("[data-size]")).toHaveAttribute("data-size", "xl");
    const input = screen.getByRole("combobox", { name: "Find" });
    expect(input).toHaveAttribute("placeholder", "Find");
    await user.type(input, "zz");
    expect(onValueChange).toHaveBeenLastCalledWith("zz");
    expect(screen.getByText("Nothing")).toBeInTheDocument();
    expect(screen.getByText("Esc").tagName).toBe("KBD");
  });
});

describe("CommandMenu — кольцо фокуса", () => {
  it("строка поиска использует общий механизм focusRing={false}", () => {
    render(
      <CommandMenu.Root open onOpenChange={() => {}}>
        <CommandMenu.Input aria-label="Поиск команд" />
        <CommandMenu.List>
          <CommandMenu.Item value="alpha">Alpha</CommandMenu.Item>
        </CommandMenu.List>
      </CommandMenu.Root>,
    );
    expect(screen.getByRole("combobox", { name: "Поиск команд" }).parentElement).toHaveAttribute(
      "data-focus-ring",
      "false",
    );
  });
});

describe("CommandMenu — overlay contract", () => {
  it("a pointerdown on the scrim closes it; inside the dialog does not", () => {
    const onOpenChange = vi.fn();
    render(<TestPalette onOpenChange={onOpenChange} />);
    fireEvent.pointerDown(screen.getByRole("option", { name: "Alpha" }));
    expect(onOpenChange).not.toHaveBeenCalled();

    clickScrim(screen.getByTestId("modal-overlay"));
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
    clickScrim(screen.getByTestId("modal-overlay"));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
