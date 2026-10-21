import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Icon } from "@/icons";

import { FieldActionButton, FieldCopyButton, FieldSectionButton } from "./FieldAction";

const LABELS = { copy: "Копировать", copied: "Скопировано", copyError: "Не удалось скопировать" };

describe("FieldActionButton", () => {
  afterEach(() => vi.restoreAllMocks());

  it("is a named button segment with a tooltip; tooltip={false} leaves only the name", () => {
    const { rerender } = render(
      <FieldActionButton label="Позвонить">
        <Icon name="action.copy" />
      </FieldActionButton>,
    );
    const button = screen.getByRole("button", { name: "Позвонить" });
    expect(button).toHaveAttribute("data-field-action", "");
    expect(button).toHaveAttribute("type", "button");
    fireEvent.focus(button);
    rerender(
      <FieldActionButton label="Очистить" tooltip={false}>
        <Icon name="action.close" />
      </FieldActionButton>,
    );
    expect(screen.getByRole("button", { name: "Очистить" })).toBeInTheDocument();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("asChild renders the consumer's link; disabled becomes aria-disabled", () => {
    render(
      <FieldActionButton label="Открыть профиль" asChild disabled>
        <a href="/clients/42">
          <Icon name="action.copy" />
        </a>
      </FieldActionButton>,
      { container: document.body.appendChild(document.createElement("div")) },
    );
    const link = screen.getByLabelText("Открыть профиль");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });
});

describe("FieldCopyButton", () => {
  afterEach(() => vi.restoreAllMocks());

  it("copies, renames itself and announces it through a polite region", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    render(<FieldCopyButton getText={() => "INV-2041"} labels={LABELS} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Копировать" }));
    });
    expect(writeText).toHaveBeenCalledWith("INV-2041");
    expect(screen.getByRole("button", { name: "Скопировано" })).toHaveAttribute(
      "data-copy-state",
      "copied",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Скопировано");
    vi.unstubAllGlobals();
  });

  it("says so when the clipboard refuses", async () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    render(<FieldCopyButton getText={() => "INV-2041"} labels={LABELS} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Копировать" }));
    });
    expect(screen.getByRole("status")).toHaveTextContent("Не удалось скопировать");
    vi.unstubAllGlobals();
  });
});

describe("FieldSectionButton", () => {
  it("is a field segment named by its content, with no tooltip", () => {
    render(
      <FieldSectionButton aria-expanded={false}>
        <Icon name="action.filter" />
        Фильтр
      </FieldSectionButton>,
    );
    const button = screen.getByRole("button", { name: "Фильтр" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-field-action", "");
    expect(button).toHaveAttribute("data-field-section", "");
    expect(button).not.toHaveAttribute("aria-label");
    fireEvent.focus(button);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
