import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StageDepthProvider } from "@/internal/surfaceDepth";

import { ExampleFrame } from "./ExampleFrame";

describe("ExampleFrame", () => {
  it("previews children at desktop width by default", () => {
    const { container } = render(
      <ExampleFrame code="<div />">
        <span>stage</span>
      </ExampleFrame>,
    );
    expect(screen.getByText("stage")).toBeInTheDocument();
    expect(container.querySelector("[data-viewport]")).toHaveAttribute("data-viewport", "desktop");
    expect(screen.getByRole("radio", { name: "Десктоп" })).toBeChecked();
  });

  // The stage lays out its children with `> *` selectors: a wrapper would break every layout.
  it("keeps the example a direct child of the stage and puts the stage on the asked layer", () => {
    render(
      <StageDepthProvider value={1}>
        <ExampleFrame code="" previewLayout="row">
          <button type="button">A</button>
          <span>B</span>
        </ExampleFrame>
      </StageDepthProvider>,
    );
    const button = screen.getByRole("button", { name: "A" });
    const stage = button.parentElement as HTMLElement;
    expect(stage).toHaveAttribute("data-preview-layout", "row");
    expect(stage).toHaveAttribute("data-depth", "1");
    expect(screen.getByText("B").parentElement).toBe(stage);
  });

  it("puts the stage on the page (layer 0) by default", () => {
    render(
      <ExampleFrame code="">
        <button type="button">A</button>
      </ExampleFrame>,
    );
    expect(screen.getByRole("button", { name: "A" }).parentElement).toHaveAttribute(
      "data-depth",
      "0",
    );
  });

  it("names both toolbar switches and moves the device choice with arrow keys", () => {
    const onViewportChange = vi.fn();
    render(
      <ExampleFrame code="x" onViewportChange={onViewportChange}>
        preview
      </ExampleFrame>,
    );
    expect(screen.getByRole("radiogroup", { name: "Вид примера" })).toBeInTheDocument();
    const devices = screen.getByRole("radiogroup", { name: "Ширина превью" });
    screen.getByRole("radio", { name: "Десктоп" }).focus();
    fireEvent.keyDown(devices, { key: "ArrowRight" });
    expect(onViewportChange).toHaveBeenCalledWith("tablet");
  });

  it("switches to the code pane", () => {
    render(<ExampleFrame code="const answer = 42;">preview</ExampleFrame>);
    fireEvent.click(screen.getByRole("radio", { name: "Код" }));
    expect(screen.getByRole("region", { name: "Код примера" })).toHaveTextContent(
      "const answer = 42;",
    );
    expect(screen.queryByText("preview")).not.toBeInTheDocument();
  });

  it("takes toolbar strings from labels", () => {
    render(
      <ExampleFrame code="x" labels={{ preview: "Preview", copy: "Copy code" }}>
        preview
      </ExampleFrame>,
    );
    expect(screen.getByRole("radio", { name: "Preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });

  it("swaps the copy glyph to a check next to the button after copying", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<ExampleFrame code="const a = 1;">preview</ExampleFrame>);
    const button = screen.getByRole("button", { name: "Копировать код" });
    const icon = button.querySelector("[data-copy-state]");
    expect(icon).toHaveAttribute("data-copy-state", "idle");
    fireEvent.click(button);
    expect(await screen.findByRole("button", { name: "Скопировано" })).toBe(button);
    expect(writeText).toHaveBeenCalledWith("const a = 1;");
    expect(icon).toHaveAttribute("data-copy-state", "copied");
  });
});
