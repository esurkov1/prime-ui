import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ExampleFrame } from "./ExampleFrame";

describe("ExampleFrame", () => {
  it("previews children at desktop width by default", () => {
    const { container } = render(
      <ExampleFrame.Root code="<div />">
        <ExampleFrame.Stage>
          <span>stage</span>
        </ExampleFrame.Stage>
      </ExampleFrame.Root>,
    );
    expect(screen.getByText("stage")).toBeInTheDocument();
    expect(container.querySelector("[data-viewport]")).toHaveAttribute("data-viewport", "desktop");
    expect(screen.getByRole("radio", { name: "Десктоп" })).toBeChecked();
  });

  it("switches to the code pane", () => {
    render(<ExampleFrame.Root code="const answer = 42;">preview</ExampleFrame.Root>);
    fireEvent.click(screen.getByRole("radio", { name: "Код" }));
    expect(screen.getByRole("region", { name: "Код примера" })).toHaveTextContent(
      "const answer = 42;",
    );
    expect(screen.queryByText("preview")).not.toBeInTheDocument();
  });

  it("takes toolbar strings from labels", () => {
    render(
      <ExampleFrame.Root code="x" labels={{ preview: "Preview", copy: "Copy code" }}>
        preview
      </ExampleFrame.Root>,
    );
    expect(screen.getByRole("radio", { name: "Preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });

  it("swaps the copy glyph to a check next to the button after copying", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<ExampleFrame.Root code="const a = 1;">preview</ExampleFrame.Root>);
    const button = screen.getByRole("button", { name: "Копировать код" });
    const icon = button.querySelector("[data-copy-state]");
    expect(icon).toHaveAttribute("data-copy-state", "idle");
    fireEvent.click(button);
    expect(await screen.findByRole("button", { name: "Скопировано" })).toBe(button);
    expect(writeText).toHaveBeenCalledWith("const a = 1;");
    expect(icon).toHaveAttribute("data-copy-state", "copied");
  });
});
