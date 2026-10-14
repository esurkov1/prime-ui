import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppHeader } from "../app-header/AppHeader";
import { Sidebar } from "../sidebar/Sidebar";
import { AppShell, AppShellBoundary, type AppShellNavState, useAppShellNav } from "./AppShell";

describe("AppShell", () => {
  it("puts Nav in its own column and everything else into the content panel", () => {
    render(
      <AppShell.Root data-testid="root">
        <AppShell.Nav>rail</AppShell.Nav>
        <AppHeader.Root>top</AppHeader.Root>
        <AppShell.Main>body</AppShell.Main>
      </AppShell.Root>,
    );

    const root = screen.getByTestId("root");
    const [nav, panel] = Array.from(root.children);
    expect(nav).toHaveTextContent("rail");
    expect(panel).toContainElement(screen.getByRole("banner"));
    expect(panel).toContainElement(screen.getByRole("main"));
    expect(screen.getByRole("banner").nextElementSibling).toBe(screen.getByRole("main"));
    // Two grid columns only with a navigation column (an attribute, not `:has()`).
    expect(root).toHaveAttribute("data-nav", "true");
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
      <AppShell.Template
        nav={<span>sidebar</span>}
        header={<AppHeader.Root>Crumbs</AppHeader.Root>}
      >
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

  it("a page's own header moves into the shell's header row and replaces the default one", () => {
    function Page({ title }: { title?: string }) {
      return (
        <>
          {title ? <AppHeader.Root>{title}</AppHeader.Root> : null}
          <span>page</span>
        </>
      );
    }
    const { rerender } = render(
      <AppShell.Template header={<AppHeader.Root>Обзор</AppHeader.Root>}>
        <Page title="Сделки" />
      </AppShell.Template>,
    );
    const main = screen.getByRole("main");
    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getByRole("banner")).toHaveTextContent("Сделки");
    expect(screen.getByRole("banner").nextElementSibling).toBe(main);
    expect(main).not.toContainElement(screen.getByRole("banner"));

    // The page leaves its header: the shell's own comes back.
    rerender(
      <AppShell.Template header={<AppHeader.Root>Обзор</AppHeader.Root>}>
        <Page />
      </AppShell.Template>,
    );
    expect(screen.getByRole("banner")).toHaveTextContent("Обзор");
  });

  it("relays the Sidebar's navigation: useAppShellNav and data-off-canvas", () => {
    const seen: (AppShellNavState | null)[] = [];
    function Probe() {
      seen.push(useAppShellNav());
      return null;
    }
    const { rerender } = render(
      <AppShell.Root data-testid="root">
        <AppShell.Nav>
          <Sidebar.Root offCanvas="always">
            <Sidebar.Item>Обзор</Sidebar.Item>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Main>
          <Probe />
        </AppShell.Main>
      </AppShell.Root>,
    );
    const nav = screen.getByRole("navigation", { hidden: true });
    expect(screen.getByTestId("root")).toHaveAttribute("data-off-canvas", "true");
    const relayed = seen.at(-1);
    expect(relayed).toMatchObject({ navId: nav.id, offCanvas: true, open: false });
    act(() => relayed?.setOpen(true));
    expect(nav.parentElement).toHaveAttribute("data-state", "open");
    expect(seen.at(-1)?.open).toBe(true);

    rerender(
      <AppShell.Root data-testid="root">
        <AppShell.Main>
          <Probe />
        </AppShell.Main>
      </AppShell.Root>,
    );
    expect(seen.at(-1)).toBeNull();
    expect(screen.getByTestId("root")).not.toHaveAttribute("data-off-canvas");
  });

  it("a frame of its own (AppShellBoundary) keeps a header in place", () => {
    render(
      <AppShell.Root>
        <AppShell.Main>
          <AppShellBoundary>
            <div data-testid="preview">
              <AppHeader.Root>Превью</AppHeader.Root>
            </div>
          </AppShellBoundary>
        </AppShell.Main>
      </AppShell.Root>,
    );
    expect(screen.getByTestId("preview")).toContainElement(screen.getByRole("banner"));
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
