import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { Page } from "../page/Page";
import { Sidebar } from "../sidebar/Sidebar";
import { AppShell, AppShellBoundary, type AppShellNavState, useAppShellNav } from "./AppShell";

describe("AppShell", () => {
  it("puts Nav in its own column and everything else into the content panel", () => {
    render(
      <AppShell.Root data-testid="root">
        <AppShell.Nav>rail</AppShell.Nav>
        <AppShell.Main>body</AppShell.Main>
        <AppShell.Footer>bar</AppShell.Footer>
      </AppShell.Root>,
    );

    const root = screen.getByTestId("root");
    const [nav, panel] = Array.from(root.children);
    expect(nav).toHaveTextContent("rail");
    expect(panel).toContainElement(screen.getByRole("main"));
    expect(screen.getByRole("main").nextElementSibling).toHaveTextContent("bar");
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

  it("CSS: main hands the page its gutter and top air and pads only the bottom", () => {
    const main = cssRule("src/layout/app-shell/AppShell.module.css", ".main");
    expect(cssValue(main, "--page-gutter")).toBe("var(--prime-layout-gutter)");
    expect(cssValue(main, "--page-top")).toBe("var(--shell-top)");
    expect(cssValue(main, "padding-block-end")).toBe("var(--shell-rail-end, var(--shell-end))");
  });

  it("Template composes nav, main and footer", () => {
    render(
      <AppShell.Template nav={<span>sidebar</span>} footer={<span>bar</span>}>
        <span>page</span>
      </AppShell.Template>,
    );
    expect(screen.getByText("sidebar")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("page");
    expect(screen.getByText("bar")).toBeInTheDocument();
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

  it("a frame of its own (AppShellBoundary) keeps the shell's navigation out", () => {
    render(
      <AppShell.Root>
        <AppShell.Nav>
          <Sidebar.Root offCanvas="always">
            <Sidebar.Item>Обзор</Sidebar.Item>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Main>
          <AppShellBoundary>
            <Page.Root>
              <Page.TopBar>
                <Page.Heading>
                  <Page.Title>Превью</Page.Title>
                </Page.Heading>
              </Page.TopBar>
            </Page.Root>
          </AppShellBoundary>
        </AppShell.Main>
      </AppShell.Root>,
    );
    expect(screen.queryByRole("button", { name: "Открыть меню" })).not.toBeInTheDocument();
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
