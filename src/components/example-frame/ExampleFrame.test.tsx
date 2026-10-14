import { readFileSync } from "node:fs";
import path from "node:path";

import { act, fireEvent, render, screen } from "@testing-library/react";
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

  // Read from the DOM, not by `:has()` (which restyled the page on every insert in an example).
  it("marks the child that holds a full-width block or a table, also when one arrives later", async () => {
    const { rerender } = render(
      <ExampleFrame code="" previewLayout="stack">
        <div data-testid="form">
          <span />
        </div>
        <span data-testid="plain" />
      </ExampleFrame>,
    );
    const form = screen.getByTestId("form");
    const stage = form.parentElement as HTMLElement;
    expect(form).not.toHaveAttribute("data-preview-stretch");
    expect(stage).not.toHaveAttribute("data-stretch");

    rerender(
      <ExampleFrame code="" previewLayout="stack">
        <div data-testid="form">
          <button type="button" data-full-width="true">
            Сохранить
          </button>
        </div>
        <span data-testid="plain" />
      </ExampleFrame>,
    );
    await act(async () => {});
    expect(form).toHaveAttribute("data-preview-stretch");
    expect(screen.getByTestId("plain")).not.toHaveAttribute("data-preview-stretch");
    expect(stage).toHaveAttribute("data-stretch");

    // A virtualized list unmounts the full-width row while scrolling: the stage keeps its width.
    rerender(
      <ExampleFrame code="" previewLayout="stack">
        <div data-testid="form">
          <span />
        </div>
        <span data-testid="plain" />
      </ExampleFrame>,
    );
    await act(async () => {});
    expect(form).toHaveAttribute("data-preview-stretch");
    expect(stage).toHaveAttribute("data-stretch");
  });

  it("gives a matrix as many columns as its first row has cells", () => {
    render(
      <ExampleFrame code="" previewLayout="matrix">
        <div data-testid="row">
          <div>xs</div>
          <div>s</div>
          <div>m</div>
        </div>
      </ExampleFrame>,
    );
    const stage = screen.getByTestId("row").parentElement as HTMLElement;
    expect(stage.style.getPropertyValue("--matrix-columns")).toBe("3");
  });

  it("wraps the rows of a matrix whose column grid is wider than the stage", () => {
    // jsdom has no layout: the stage reports a grid 600 wide in a 343 frame.
    const scroll = vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(600);
    const client = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(343);
    render(
      <ExampleFrame code="" previewLayout="matrix">
        <div data-testid="row">
          <div>xs</div>
          <div>xl</div>
        </div>
      </ExampleFrame>,
    );
    const stage = screen.getByTestId("row").parentElement as HTMLElement;
    expect(stage).toHaveAttribute("data-matrix-wrap");
    scroll.mockRestore();
    client.mockRestore();
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

  it("stretches a preview block only by a zero-specificity width, so an example's own width wins", () => {
    const css = readFileSync(
      path.resolve(process.cwd(), "src/components/example-frame/ExampleFrame.module.css"),
      "utf8",
    );
    const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(
      ([, selector, body]) =>
        selector.includes("[data-preview-stretch]") && /(^|[\s;])width\s*:/.test(body),
    );
    expect(rules.length).toBeGreaterThan(0);
    for (const [, selector] of rules) {
      for (const part of selector.replace(/\/\*[\s\S]*?\*\//g, "").split(",")) {
        expect(part.trim()).toMatch(/^:where\(.+\) > :where\(.+\)$/);
      }
    }
  });
});
