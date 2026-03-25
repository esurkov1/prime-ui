import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useOptionalControlSize } from "@/internal/ControlSizeContext";

import { Hint } from "./Hint";

function ControlSizeDump() {
  const size = useOptionalControlSize();
  return <span data-testid="control-size-dump">{size ?? "none"}</span>;
}

describe("Hint", () => {
  it("renders root", () => {
    render(<Hint.Root>Helper copy</Hint.Root>);
    expect(screen.getByText("Helper copy")).toBeInTheDocument();
  });

  it("sets data-variant to error", () => {
    render(<Hint.Root variant="error">Invalid</Hint.Root>);
    expect(screen.getByText("Invalid")).toHaveAttribute("data-variant", "error");
  });

  it("sets data-variant to disabled", () => {
    render(<Hint.Root variant="disabled">Inactive</Hint.Root>);
    expect(screen.getByText("Inactive")).toHaveAttribute("data-variant", "disabled");
  });

  it("defaults data-size to m", () => {
    render(<Hint.Root>Default size</Hint.Root>);
    expect(screen.getByText("Default size")).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from prop", () => {
    render(<Hint.Root size="xl">Large hint</Hint.Root>);
    expect(screen.getByText("Large hint")).toHaveAttribute("data-size", "xl");
  });

  it("exposes control size from prop to nested consumers", () => {
    render(
      <Hint.Root size="l">
        <ControlSizeDump />
      </Hint.Root>,
    );
    expect(screen.getByTestId("control-size-dump")).toHaveTextContent("l");
  });

  it("renders Icon", () => {
    render(
      <Hint.Root>
        <Hint.Icon>
          <svg data-testid="hint-svg" />
        </Hint.Icon>
        With icon
      </Hint.Root>,
    );
    expect(screen.getByTestId("hint-svg")).toBeInTheDocument();
    expect(screen.getByText("With icon")).toBeInTheDocument();
  });

  it("merges className on root", () => {
    render(<Hint.Root className="custom-hint">H</Hint.Root>);
    expect(screen.getByText("H")).toHaveClass("custom-hint");
  });
});
