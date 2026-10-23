import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { StatusDot } from "./StatusDot";

describe("StatusDot", () => {
  it("renders the word and defaults to the neutral tone", () => {
    render(<StatusDot>Работает</StatusDot>);
    expect(screen.getByText("Работает")).toHaveAttribute("data-tone", "neutral");
  });

  it("writes the tone", () => {
    render(<StatusDot tone="danger">Ошибка</StatusDot>);
    expect(screen.getByText("Ошибка")).toHaveAttribute("data-tone", "danger");
  });

  it("hides the dot from assistive tech", () => {
    render(<StatusDot tone="success">Работает</StatusDot>);
    const root = screen.getByText("Работает");
    expect(root.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveTextContent("Работает");
  });

  it("forwards ref, className and native attributes", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(
      <StatusDot ref={ref} className="custom" title="Статус">
        Пауза
      </StatusDot>,
    );
    const root = screen.getByText("Пауза");
    expect(ref.current).toBe(root);
    expect(root).toHaveClass("custom");
    expect(root).toHaveAttribute("title", "Статус");
  });
});
