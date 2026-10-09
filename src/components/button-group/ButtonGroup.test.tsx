import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { DisabledProvider } from "@/internal/disabledContext";

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
});
