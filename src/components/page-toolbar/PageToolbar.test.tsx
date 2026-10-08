import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/button/Button";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";

import { PageToolbar } from "./PageToolbar";

describe("PageToolbar", () => {
  it("keeps the JSX order in the DOM, so the Tab order is the reading order", () => {
    render(
      <PageToolbar.Root>
        <PageToolbar.Sections data-testid="sections" />
        <PageToolbar.Tools data-testid="tools" />
        <PageToolbar.View data-testid="view" />
        <PageToolbar.Actions data-testid="actions" />
      </PageToolbar.Root>,
    );
    const ids = ["sections", "tools", "view", "actions"].map((id) => screen.getByTestId(id));
    for (let i = 1; i < ids.length; i++) {
      expect(ids[i - 1].compareDocumentPosition(ids[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
  });

  it("renders one hidden line break after the slots", () => {
    const { container } = render(
      <PageToolbar.Root>
        <PageToolbar.Sections />
        <PageToolbar.Actions />
      </PageToolbar.Root>,
    );
    const bar = container.firstElementChild?.firstElementChild as HTMLElement;
    const last = bar.lastElementChild as HTMLElement;
    expect(last.tagName).toBe("SPAN");
    expect(last).toHaveAttribute("aria-hidden", "true");
    expect(last).toBeEmptyDOMElement();
  });

  it("puts the chips row under the bar, whatever its place in JSX", () => {
    const { container } = render(
      <PageToolbar.Root>
        <PageToolbar.Chips data-testid="chips" />
        <PageToolbar.Tools data-testid="tools" />
      </PageToolbar.Root>,
    );
    const root = container.firstElementChild as HTMLElement;
    const bar = root.firstElementChild as HTMLElement;
    expect(bar).toContainElement(screen.getByTestId("tools"));
    expect(bar).not.toContainElement(screen.getByTestId("chips"));
    expect(root.lastElementChild).toBe(screen.getByTestId("chips"));
  });

  it("leaves the tier to the host: controls inside follow a ControlSizeProvider around it", () => {
    render(
      <ControlSizeProvider value="s">
        <PageToolbar.Root>
          <PageToolbar.Actions>
            <Button.Root>Создать</Button.Root>
          </PageToolbar.Actions>
        </PageToolbar.Root>
      </ControlSizeProvider>,
    );
    expect(screen.getByRole("button", { name: "Создать" })).toHaveAttribute("data-size", "s");
  });

  it("forwards ref, className and native attributes on every part", () => {
    const parts = [
      PageToolbar.Root,
      PageToolbar.Sections,
      PageToolbar.Tools,
      PageToolbar.View,
      PageToolbar.Actions,
      PageToolbar.Chips,
    ];
    for (const Part of parts) {
      const ref = React.createRef<HTMLDivElement>();
      const { unmount } = render(
        <Part ref={ref} className="custom" data-testid="part" aria-label="Панель" />,
      );
      const node = screen.getByTestId("part");
      expect(ref.current).toBe(node);
      expect(node).toHaveClass("custom");
      expect(node).toHaveAttribute("aria-label", "Панель");
      unmount();
    }
  });
});
