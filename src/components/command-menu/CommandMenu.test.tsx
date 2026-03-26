import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CommandMenu } from "./CommandMenu";

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

  it("не рендерит диалог при open=false", () => {
    render(<TestPalette open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
