import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("puts Nav in its own column and everything else into the content panel", () => {
    render(
      <AppShell.Root data-testid="root">
        <AppShell.Nav>rail</AppShell.Nav>
        <AppShell.Header>top</AppShell.Header>
        <AppShell.Main>body</AppShell.Main>
      </AppShell.Root>,
    );

    const root = screen.getByTestId("root");
    const [nav, panel] = Array.from(root.children);
    expect(nav).toHaveTextContent("rail");
    expect(panel).toContainElement(screen.getByRole("banner"));
    expect(panel).toContainElement(screen.getByRole("main"));
    expect(screen.getByRole("banner").nextElementSibling).toBe(screen.getByRole("main"));
  });

  it("sets data-fill-viewport and merges className", () => {
    render(
      <AppShell.Root fillViewport className="custom" data-testid="root">
        <AppShell.Main />
      </AppShell.Root>,
    );
    const root = screen.getByTestId("root");
    expect(root).toHaveAttribute("data-fill-viewport", "true");
    expect(root).toHaveClass("custom");
  });

  it("Main is contained by default and supports full width", () => {
    const { rerender } = render(
      <AppShell.Root>
        <AppShell.Main />
      </AppShell.Root>,
    );
    // Default is the full panel with gutters; `contained` is opt-in for long-read pages.
    expect(screen.getByRole("main")).toHaveAttribute("data-content-width", "full");

    rerender(
      <AppShell.Root>
        <AppShell.Main contentWidth="contained" />
      </AppShell.Root>,
    );
    expect(screen.getByRole("main")).toHaveAttribute("data-content-width", "contained");
  });

  it("Template composes nav, optional header and main", () => {
    const { rerender } = render(
      <AppShell.Template nav={<span>sidebar</span>} header={<span>Crumbs</span>}>
        <span>page</span>
      </AppShell.Template>,
    );
    expect(screen.getByText("sidebar")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveTextContent("Crumbs");
    expect(screen.getByRole("main")).toHaveTextContent("page");

    rerender(
      <AppShell.Template nav={<span>sidebar</span>}>
        <span>page</span>
      </AppShell.Template>,
    );
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
  });

  it("Template scrolls main to the top when scrollResetKey changes", () => {
    const { rerender } = render(
      <AppShell.Template scrollResetKey="/a">
        <span>page</span>
      </AppShell.Template>,
    );
    const main = screen.getByRole("main");
    main.scrollTop = 120;

    rerender(
      <AppShell.Template scrollResetKey="/a">
        <span>page</span>
      </AppShell.Template>,
    );
    expect(main.scrollTop).toBe(120);

    rerender(
      <AppShell.Template scrollResetKey="/b">
        <span>page</span>
      </AppShell.Template>,
    );
    expect(main.scrollTop).toBe(0);
  });

  it("Template forwards its ref to main", () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <AppShell.Template ref={ref} mainProps={{ id: "content" }}>
        <span>page</span>
      </AppShell.Template>,
    );
    expect(ref.current).toBe(screen.getByRole("main"));
    expect(screen.getByRole("main")).toHaveAttribute("id", "content");
  });
});
