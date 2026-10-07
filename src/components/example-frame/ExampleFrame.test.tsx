import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
});
