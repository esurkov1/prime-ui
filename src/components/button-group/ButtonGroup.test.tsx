import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { DisabledProvider } from "@/internal/disabledContext";
import press from "@/internal/press.module.css";
import { cssRule, cssValue } from "@/test/css";

import { ButtonGroup } from "./ButtonGroup";

describe("ButtonGroup", () => {
  it("moves focus with Tab, skips disabled segments and presses with Enter / Space", async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    render(
      <ButtonGroup.Root aria-label="Экспорт">
        <ButtonGroup.Item onClick={onExport}>CSV</ButtonGroup.Item>
        <ButtonGroup.Item disabled>Excel</ButtonGroup.Item>
        <ButtonGroup.Item onClick={onExport}>PDF</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "CSV" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.tab();
    expect(screen.getByRole("button", { name: "PDF" })).toHaveFocus();
    await user.keyboard(" ");
    expect(onExport).toHaveBeenCalledTimes(2);
  });

  it("renders items", () => {
    render(
      <ButtonGroup.Root>
        <ButtonGroup.Item>One</ButtonGroup.Item>
        <ButtonGroup.Item>Two</ButtonGroup.Item>
        <ButtonGroup.Item>Three</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );

    expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Two" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Three" })).toBeInTheDocument();
  });

  it("exposes aria-label on root", () => {
    render(
      <ButtonGroup.Root aria-label="View">
        <ButtonGroup.Item>One</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );

    expect(screen.getByLabelText("View")).toBeInTheDocument();
  });

  it("defaults to horizontal orientation", () => {
    const { container } = render(
      <ButtonGroup.Root>
        <ButtonGroup.Item>A</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );

    const root = container.firstElementChild;
    expect(root).not.toHaveAttribute("data-orientation", "vertical");
  });

  it("sets vertical orientation via data-attribute", () => {
    render(
      <ButtonGroup.Root orientation="vertical">
        <ButtonGroup.Item>A</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );

    expect(screen.getByRole("group")).toHaveAttribute("data-orientation", "vertical");
  });

  it("sets pressed state and aria-pressed", () => {
    render(
      <ButtonGroup.Root>
        <ButtonGroup.Item pressed>On</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Off</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );

    expect(screen.getByRole("button", { name: "On" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("button", { name: "On" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Off" })).toHaveAttribute("aria-pressed", "false");
  });

  it("allows arbitrary non-Item children without context", () => {
    render(
      <ButtonGroup.Root>
        <span data-testid="child">child</span>
      </ButtonGroup.Root>,
    );

    expect(screen.getByTestId("child")).toHaveTextContent("child");
  });

  it("merges className on root", () => {
    const { container } = render(
      <ButtonGroup.Root className="custom-group">
        <ButtonGroup.Item>X</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );

    expect(container.firstElementChild).toHaveClass("custom-group");
  });

  it("sets data-size on root", () => {
    const { container } = render(
      <ButtonGroup.Root size="s">
        <ButtonGroup.Item>X</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );

    expect(container.firstElementChild).toHaveAttribute("data-size", "s");
  });

  it("supports xl size", () => {
    const { container } = render(
      <ButtonGroup.Root size="xl">
        <ButtonGroup.Item>X</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );

    expect(container.firstElementChild).toHaveAttribute("data-size", "xl");
  });

  it("exposes role=group and fullWidth", () => {
    render(
      <ButtonGroup.Root aria-label="Tier" fullWidth>
        <ButtonGroup.Item>A</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    const group = screen.getByRole("group", { name: "Tier" });
    expect(group).toHaveAttribute("data-full-width", "true");
  });

  it("marks icon-only and leading-icon segments", () => {
    render(
      <ButtonGroup.Root>
        <ButtonGroup.Item aria-label="Bold">
          <ButtonGroup.Icon>B</ButtonGroup.Icon>
        </ButtonGroup.Item>
        <ButtonGroup.Item>
          <ButtonGroup.Icon>G</ButtonGroup.Icon>
          Grid
        </ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("data-icon-only", "true");
    expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute(
      "data-leading-icon",
      "true",
    );
  });

  it("takes the host tier without its own size", () => {
    render(
      <ControlSizeProvider value="s">
        <ButtonGroup.Root aria-label="View">
          <ButtonGroup.Item>List</ButtonGroup.Item>
        </ButtonGroup.Root>
      </ControlSizeProvider>,
    );
    expect(screen.getByRole("group", { name: "View" })).toHaveAttribute("data-size", "s");
  });
});

describe("ButtonGroup field frame", () => {
  it("names the group with its label and describes it with the hint, then the error", () => {
    const { rerender } = render(
      <ButtonGroup.Root label="Чей расход" hint="Влияет на отчёт" required>
        <ButtonGroup.Item pressed>Компании</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Личный</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    const group = screen.getByRole("group", { name: /Чей расход/ });
    expect(group).toHaveAccessibleDescription("Влияет на отчёт");
    expect(group).toHaveAttribute("aria-required", "true");
    expect(group).not.toHaveAttribute("aria-invalid");

    rerender(
      <ButtonGroup.Root label="Чей расход" hint="Влияет на отчёт" error="Выберите вариант">
        <ButtonGroup.Item pressed={false}>Компании</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Личный</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    expect(group).toHaveAccessibleDescription("Выберите вариант");
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAttribute("data-invalid", "true");
  });

  it("sends id to the group and className, ref and native attributes to the frame", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <ButtonGroup.Root
        id="expense-owner"
        className="frame"
        data-testid="frame"
        ref={ref}
        aria-label="Чей расход"
      >
        <ButtonGroup.Item>Компании</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    const frame = screen.getByTestId("frame");
    expect(frame).toHaveClass("frame");
    expect(ref.current).toBe(frame);
    expect(screen.getByRole("group", { name: "Чей расход" })).toHaveAttribute(
      "id",
      "expense-owner",
    );
  });

  it("takes disabled from a disabled Fieldset around it", () => {
    render(
      <DisabledProvider disabled>
        <ButtonGroup.Root aria-label="Экспорт">
          <ButtonGroup.Item>CSV</ButtonGroup.Item>
          <ButtonGroup.Item>PDF</ButtonGroup.Item>
        </ButtonGroup.Root>
      </DisabledProvider>,
    );
    expect(screen.getByRole("button", { name: "CSV" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "PDF" })).toBeDisabled();
  });

  it("a row is a switcher that scrolls inside itself; a column stacks", () => {
    const { rerender } = render(
      <ButtonGroup.Root aria-label="Период">
        <ButtonGroup.Item pressed>День</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Неделя</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    const group = screen.getByRole("group", { name: "Период" });
    expect(group).toHaveAttribute("data-edges", "fade");
    rerender(
      <ButtonGroup.Root aria-label="Период" orientation="vertical">
        <ButtonGroup.Item pressed>День</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Неделя</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    expect(screen.getByRole("group", { name: "Период" })).not.toHaveAttribute("data-edges");
  });

  it("full width: segments tend to equal widths and never get narrower than their label", () => {
    const rule = cssRule(
      "src/components/button-group/ButtonGroup.module.css",
      '.root[data-full-width="true"]:not([data-orientation="vertical"]) > .item',
    );
    expect(cssValue(rule, "flex")).toBe("1 1 0");
    expect(cssValue(rule, "min-width")).toBe("max-content");
  });

  it("presses by scale only: the shared press, compact for an icon-only segment", () => {
    render(
      <ButtonGroup.Root aria-label="Правка">
        <ButtonGroup.Item>Отменить</ButtonGroup.Item>
        <ButtonGroup.Item aria-label="Повторить">
          <ButtonGroup.Icon>
            <svg />
          </ButtonGroup.Icon>
        </ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    expect(screen.getByRole("button", { name: "Отменить" })).toHaveClass(press.press);
    expect(screen.getByRole("button", { name: "Повторить" })).toHaveClass(press.pressCompact);
  });

  it("styles the toggled segment from aria-pressed", () => {
    const rule = cssRule(
      "src/components/button-group/ButtonGroup.module.css",
      '.item[aria-pressed="true"]',
    );
    expect(cssValue(rule, "background")).toBe("var(--prime-color-accent-soft)");
  });
});

describe("ButtonGroup.Item pressed triad", () => {
  function deferred() {
    let resolve: () => void = () => {};
    let reject: (reason: unknown) => void = () => {};
    const promise = new Promise<void>((done, fail) => {
      resolve = done;
      reject = fail;
    });
    return { promise, resolve, reject };
  }

  it("uncontrolled: a press flips the state and reports it; Space presses too", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ButtonGroup.Root aria-label="Фильтр">
        <ButtonGroup.Item defaultPressed={false} onPressedChange={onPressedChange}>
          Мои
        </ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    const item = screen.getByRole("button", { name: "Мои" });
    expect(item).toHaveAttribute("aria-pressed", "false");
    await user.click(item);
    expect(item).toHaveAttribute("aria-pressed", "true");
    expect(item).toHaveAttribute("data-state", "active");
    expect(onPressedChange).toHaveBeenLastCalledWith(true);
    await user.keyboard(" ");
    expect(item).toHaveAttribute("aria-pressed", "false");
    expect(onPressedChange).toHaveBeenLastCalledWith(false);
  });

  it("async: the new state shows at once, presses wait; resolve keeps it", async () => {
    const user = userEvent.setup();
    const save = deferred();
    const onPressedChange = vi.fn(() => save.promise);
    render(
      <ButtonGroup.Root aria-label="Фильтр">
        <ButtonGroup.Item defaultPressed={false} onPressedChange={onPressedChange}>
          Мои
        </ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    const item = screen.getByRole("button", { name: "Мои" });
    await user.click(item);
    expect(item).toHaveAttribute("aria-pressed", "true");
    expect(item).toHaveAttribute("aria-busy", "true");
    await user.click(item);
    expect(onPressedChange).toHaveBeenCalledTimes(1);
    await act(async () => {
      save.resolve();
    });
    expect(item).toHaveAttribute("aria-pressed", "true");
    expect(item).not.toHaveAttribute("aria-busy");
  });

  it("async: reject turns the state back", async () => {
    const user = userEvent.setup();
    const save = deferred();
    render(
      <ButtonGroup.Root aria-label="Фильтр">
        <ButtonGroup.Item defaultPressed onPressedChange={() => save.promise}>
          Мои
        </ButtonGroup.Item>
      </ButtonGroup.Root>,
    );
    const item = screen.getByRole("button", { name: "Мои" });
    await user.click(item);
    expect(item).toHaveAttribute("aria-pressed", "false");
    await act(async () => {
      save.reject(new Error("offline"));
    });
    expect(item).toHaveAttribute("aria-pressed", "true");
    expect(item).not.toHaveAttribute("aria-busy");
  });
});
