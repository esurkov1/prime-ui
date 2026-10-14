import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RowAction } from "./RowAction";

describe("RowAction", () => {
  it("is a ghost neutral icon button one tier below the row, named by its label", async () => {
    const onClick = vi.fn();
    render(
      <RowAction label="Копировать" size="m" onClick={onClick}>
        <svg aria-hidden="true" />
      </RowAction>,
    );
    const button = screen.getByRole("button", { name: "Копировать" });
    expect(button).toHaveAttribute("data-size", "s");
    expect(button).toHaveAttribute("data-variant", "ghost");
    expect(button).toHaveAttribute("data-tone", "neutral");
    expect(button).toHaveAttribute("data-icon-only", "true");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows its label as a tooltip on keyboard focus", async () => {
    render(
      <RowAction label="Создать задачу" size="s">
        <svg aria-hidden="true" />
      </RowAction>,
    );
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Создать задачу" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Создать задачу");
  });

  it("asChild is a link with the same look, its children the glyph", () => {
    render(
      <RowAction label="Написать" size="m" asChild>
        <a href="mailto:finance@severny-veter.ru">
          <svg aria-hidden="true" />
        </a>
      </RowAction>,
    );
    const link = screen.getByRole("link", { name: "Написать" });
    expect(link).toHaveAttribute("href", "mailto:finance@severny-veter.ru");
    expect(link).toHaveAttribute("data-size", "s");
    expect(link).toHaveAttribute("data-icon-only", "true");
  });
});
