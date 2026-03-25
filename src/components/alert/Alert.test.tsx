import { render, screen } from "@testing-library/react";
import { Info } from "lucide-react";
import { describe, expect, it } from "vitest";

import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders root", () => {
    render(<Alert.Root>Content</Alert.Root>);
    expect(screen.getByRole("alert")).toHaveTextContent("Content");
  });

  it("sets data-status for all statuses", () => {
    const statuses = ["information", "warning", "error", "success", "feature"] as const;

    for (const status of statuses) {
      const { unmount } = render(<Alert.Root status={status}>V</Alert.Root>);
      expect(screen.getByRole("alert")).toHaveAttribute("data-status", status);
      unmount();
    }
  });

  it("sets data-size for s, m, l, xl", () => {
    const sizes = ["s", "m", "l", "xl"] as const;
    for (const size of sizes) {
      const { unmount } = render(<Alert.Root size={size}>X</Alert.Root>);
      expect(screen.getByRole("alert")).toHaveAttribute("data-size", size);
      unmount();
    }
  });

  it("sets data-appearance", () => {
    const { unmount } = render(
      <Alert.Root appearance="stroke" status="error">
        X
      </Alert.Root>,
    );
    expect(screen.getByRole("alert")).toHaveAttribute("data-appearance", "stroke");
    unmount();
  });

  it("defaults status to information and appearance to light", () => {
    render(<Alert.Root>Default</Alert.Root>);
    const el = screen.getByRole("alert");
    expect(el).toHaveAttribute("data-status", "information");
    expect(el).toHaveAttribute("data-appearance", "light");
  });

  it("renders Icon, Title, Description, Actions", () => {
    render(
      <Alert.Root>
        <Alert.Icon>
          <svg data-testid="alert-icon" />
        </Alert.Icon>
        <Alert.Title>Title text</Alert.Title>
        <Alert.Description>Description text</Alert.Description>
        <Alert.Actions>
          <button type="button">Action</button>
        </Alert.Actions>
      </Alert.Root>,
    );

    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
    expect(screen.getByText("Title text")).toBeInTheDocument();
    expect(screen.getByText("Description text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("supports polymorphic Icon as", () => {
    render(
      <Alert.Root>
        <Alert.Icon as={Info} data-testid="lucide-info" />
        <Alert.Title>T</Alert.Title>
      </Alert.Root>,
    );
    expect(screen.getByTestId("lucide-info")).toBeInTheDocument();
  });

  it("places CloseIcon in close slot", () => {
    render(
      <Alert.Root>
        <Alert.Icon as={Info} />
        <Alert.Title>T</Alert.Title>
        <Alert.CloseIcon data-testid="close-glyph" />
      </Alert.Root>,
    );
    expect(screen.getByTestId("close-glyph")).toBeInTheDocument();
  });

  it("uses role=status and aria-live=polite when liveTone is polite", () => {
    render(
      <Alert.Root liveTone="polite">
        <span>Queued</span>
      </Alert.Root>,
    );
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-live", "polite");
  });

  it("allows overriding role and aria-live", () => {
    const { container } = render(
      <Alert.Root role="presentation" aria-live="off">
        <span>x</span>
      </Alert.Root>,
    );
    const el = container.querySelector('[role="presentation"]');
    expect(el).toBeTruthy();
    expect(el).toHaveAttribute("aria-live", "off");
  });

  it("merges className on root", () => {
    render(<Alert.Root className="custom-alert">A</Alert.Root>);
    expect(screen.getByRole("alert")).toHaveClass("custom-alert");
  });

  it("has role alert by default", () => {
    render(<Alert.Root>Notice</Alert.Root>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
