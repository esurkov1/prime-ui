import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { ScrollContainer } from "./ScrollContainer";

describe("ScrollContainer", () => {
  it("рендерит дочерний контент", () => {
    render(<ScrollContainer>scroll-me</ScrollContainer>);
    expect(screen.getByText("scroll-me")).toBeInTheDocument();
  });

  it("поддерживает as=main", () => {
    render(<ScrollContainer as="main">main</ScrollContainer>);
    expect(screen.getByRole("main")).toHaveTextContent("main");
  });

  it("forwards ref and native attributes", () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <ScrollContainer ref={ref} aria-label="Список" tabIndex={0} role="region">
        items
      </ScrollContainer>,
    );
    expect(ref.current).toBe(screen.getByRole("region", { name: "Список" }));
    expect(ref.current).toHaveAttribute("tabindex", "0");
  });

  it("marks the hidden edges while fade is on (measured once per frame)", async () => {
    render(
      <ScrollContainer fade data-testid="scroll">
        items
      </ScrollContainer>,
    );
    const node = screen.getByTestId("scroll");
    expect(node).toHaveAttribute("data-fade", "vertical");
    expect(node).not.toHaveAttribute("data-overflow-start");

    // jsdom has no layout: give the region a scroll size, then scroll to the middle.
    Object.defineProperty(node, "scrollHeight", { configurable: true, value: 300 });
    Object.defineProperty(node, "clientHeight", { configurable: true, value: 100 });
    node.scrollTop = 0;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-end", "true"));
    expect(node).not.toHaveAttribute("data-overflow-start");

    node.scrollTop = 100;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).toHaveAttribute("data-overflow-start", "true"));
    expect(node).toHaveAttribute("data-overflow-end", "true");

    node.scrollTop = 200;
    fireEvent.scroll(node);
    await waitFor(() => expect(node).not.toHaveAttribute("data-overflow-end"));
    expect(node).toHaveAttribute("data-overflow-start", "true");
  });

  it("fades along the horizontal axis for axis=horizontal and sets nothing without fade", () => {
    const { rerender } = render(
      <ScrollContainer axis="horizontal" fade data-testid="scroll">
        items
      </ScrollContainer>,
    );
    expect(screen.getByTestId("scroll")).toHaveAttribute("data-fade", "horizontal");
    rerender(
      <ScrollContainer axis="horizontal" data-testid="scroll">
        items
      </ScrollContainer>,
    );
    expect(screen.getByTestId("scroll")).not.toHaveAttribute("data-fade");
  });
});
