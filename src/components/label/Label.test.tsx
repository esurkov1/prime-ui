import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Icon } from "@/icons";
import { iconBoxStyles } from "@/internal/iconBox";

import { Label } from "./Label";

describe("Label", () => {
  it("renders root", () => {
    render(<Label.Root>Field name</Label.Root>);
    expect(screen.getByText("Field name")).toBeInTheDocument();
  });

  it("passes htmlFor to the label element", () => {
    render(<Label.Root htmlFor="email-id">Email</Label.Root>);
    expect(screen.getByText("Email")).toHaveAttribute("for", "email-id");
  });

  it("sets data-disabled when disabled", () => {
    render(<Label.Root disabled>Muted</Label.Root>);
    expect(screen.getByText("Muted")).toHaveAttribute("data-disabled", "true");
  });

  it("sets data-size to m by default", () => {
    render(<Label.Root>Plain</Label.Root>);
    expect(screen.getByText("Plain")).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from size prop", () => {
    render(<Label.Root size="xl">Big</Label.Root>);
    expect(screen.getByText("Big")).toHaveAttribute("data-size", "xl");
  });

  it("provides control size to Icon inside Label.Icon without explicit size", () => {
    render(
      <Label.Root size="s">
        <Label.Icon>
          <Icon data-testid="label-icon" name="nav.home" />
        </Label.Icon>
      </Label.Root>,
    );
    expect(screen.getByTestId("label-icon")).toHaveClass(iconBoxStyles.s);
  });

  it("renders a decorative asterisk when required", () => {
    render(<Label.Root required>Email</Label.Root>);
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the optional marker with the default and custom label", () => {
    const { rerender } = render(<Label.Root optional>Note</Label.Root>);
    expect(screen.getByText("необязательно")).toBeInTheDocument();
    rerender(
      <Label.Root optional labels={{ optional: "optional" }}>
        Note
      </Label.Root>,
    );
    expect(screen.getByText("optional")).toBeInTheDocument();
  });

  it("renders Description inside the label, so it is part of the accessible name", () => {
    render(
      <>
        <Label.Root htmlFor="budget">
          Бюджет <Label.Description>₽, без НДС</Label.Description>
        </Label.Root>
        <input id="budget" />
      </>,
    );
    expect(screen.getByText("₽, без НДС")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAccessibleName("Бюджет ₽, без НДС");
  });

  it("hides the icon slot from assistive technology", () => {
    render(
      <Label.Root>
        <Label.Icon data-testid="slot">
          <Icon name="field.email" />
        </Label.Icon>
        Email
      </Label.Root>,
    );
    expect(screen.getByTestId("slot")).toHaveAttribute("aria-hidden", "true");
  });

  it("merges className on root", () => {
    render(<Label.Root className="custom-label">L</Label.Root>);
    expect(screen.getByText("L")).toHaveClass("custom-label");
  });

  it("renders children", () => {
    render(
      <Label.Root>
        <span data-testid="child">nested</span>
      </Label.Root>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
