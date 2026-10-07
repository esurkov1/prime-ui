import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

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
    const { container } = render(
      <ButtonGroup.Root orientation="vertical">
        <ButtonGroup.Item>A</ButtonGroup.Item>
      </ButtonGroup.Root>,
    );

    expect(container.firstElementChild).toHaveAttribute("data-orientation", "vertical");
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
});
