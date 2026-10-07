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
}: {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}) {
  return (
    <CommandMenu.Dialog open={open} onOpenChange={onOpenChange}>
      <CommandMenu.Input placeholder="Поиск" aria-label="Поиск команд" />
      <CommandMenu.List>
        <CommandMenu.Group heading="Тест">
          <CommandMenu.Item value="alpha" keywords="a">
            Alpha
          </CommandMenu.Item>
          <CommandMenu.Item value="beta" keywords="b">
            Beta
          </CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu.List>
    </CommandMenu.Dialog>
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
    const css = fs.readFileSync("src/components/command-menu/CommandMenu.module.css", "utf8");
    expect(css).toMatch(/\.item\[hidden\],\s*\.group\[hidden\]\s*\{\s*display: none;/);
  });

  it("не рендерит диалог при open=false", () => {
    render(<TestPalette open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("CommandMenu — пустое состояние и футер", () => {
  it("Empty появляется, только когда по запросу ничего не найдено", async () => {
    const user = userEvent.setup();
    render(
      <CommandMenu.Dialog open onOpenChange={() => {}}>
        <CommandMenu.InputRow>
          <CommandMenu.Input aria-label="Поиск команд" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group heading="Раздел">
            <CommandMenu.Item value="alpha">Alpha</CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
        <CommandMenu.Footer>
          <CommandMenu.FooterHint keys={["↑", "↓"]}>Навигация</CommandMenu.FooterHint>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>,
    );
    expect(screen.queryByText("Ничего не найдено")).not.toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Раздел" })).toBeInTheDocument();
    await user.type(screen.getByRole("combobox", { name: "Поиск команд" }), "zzz");
    expect(screen.getByText("Ничего не найдено")).toBeInTheDocument();
    expect(screen.getByText("Навигация")).toBeInTheDocument();
  });
});

describe("CommandMenu — size и labels", () => {
  it("size задаёт ярус пунктов, labels — строки поиска и пустого состояния", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CommandMenu.Dialog
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
          <CommandMenu.FooterKeyBox variant="ghost">Esc</CommandMenu.FooterKeyBox>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>,
    );
    const option = screen.getByRole("option", { name: "Alpha" });
    expect(option.closest("[data-size]")).toHaveAttribute("data-size", "xl");
    const input = screen.getByRole("combobox", { name: "Find" });
    expect(input).toHaveAttribute("placeholder", "Find");
    await user.type(input, "zz");
    expect(onValueChange).toHaveBeenLastCalledWith("zz");
    expect(screen.getByText("Nothing")).toBeInTheDocument();
    expect(screen.getByText("Esc")).toHaveAttribute("data-variant", "ghost");
  });
});

describe("CommandMenu — кольцо фокуса", () => {
  it("строка поиска использует общий механизм focusRing={false}", () => {
    render(
      <CommandMenu.Dialog open onOpenChange={() => {}}>
        <CommandMenu.InputRow>
          <CommandMenu.Input aria-label="Поиск команд" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Item value="alpha">Alpha</CommandMenu.Item>
        </CommandMenu.List>
      </CommandMenu.Dialog>,
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

  it("closeOnOutsideClick={false} ignores the scrim", () => {
    const onOpenChange = vi.fn();
    render(
      <CommandMenu.Dialog open onOpenChange={onOpenChange} closeOnOutsideClick={false}>
        <CommandMenu.Input aria-label="Поиск команд" />
      </CommandMenu.Dialog>,
    );
    clickScrim(screen.getByTestId("modal-overlay"));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
