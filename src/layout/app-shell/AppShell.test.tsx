import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import enterMotion from "@/internal/enterMotion.module.css";
import { cssRule, cssRules, cssValue } from "@/test/css";

import { BottomNav } from "../bottom-nav/BottomNav";
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
    expect(cssValue(main, "padding-block-end").replace(/\s+/g, " ")).toBe(
      "max( var(--shell-fill-end, var(--prime-space-16)), var(--shell-floating-end, var(--prime-space-0)) )",
    );
    // With the rail on screen the floating capsule's room scales to 0: a fill page keeps its gutter.
    const rail = cssRule(
      "src/layout/app-shell/AppShell.module.css",
      '.root[data-nav="true"]:not([data-off-canvas])',
    );
    expect(cssValue(rail, "--shell-floating-scale")).toBe("0");
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

  describe("Fab", () => {
    const CSS = "src/layout/app-shell/AppShell.module.css";
    const shell = (fab: React.ReactNode) => (
      <AppShell.Root>
        <AppShell.Main>
          <button type="button">Последняя кнопка страницы</button>
          {fab}
        </AppShell.Main>
        <AppShell.Footer>
          <BottomNav.Root floating>
            <BottomNav.Item current>Сделки</BottomNav.Item>
            <BottomNav.Item>Клиенты</BottomNav.Item>
          </BottomNav.Root>
        </AppShell.Footer>
      </AppShell.Root>
    );

    it("renders a named circle button into the dock, after the page and before the bar", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const ref = { current: null as HTMLButtonElement | null };
      render(
        shell(
          <AppShell.Fab aria-label="AI-ассистент" ref={ref} className="custom" onClick={onClick}>
            <svg />
          </AppShell.Fab>,
        ),
      );
      const fab = screen.getByRole("button", { name: "AI-ассистент" });
      expect(ref.current).toBe(fab);
      expect(fab).toHaveClass("custom");
      expect(fab).toHaveAttribute("data-shape", "circle");
      // Rendered inside main, it stands in the dock: not in main, before the bar's nav.
      expect(screen.getByRole("main")).not.toContainElement(fab);
      const nav = screen.getByRole("navigation");
      expect(fab.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

      // Keyboard: the page, then the action, then the sections.
      await user.tab();
      expect(screen.getByRole("button", { name: "Последняя кнопка страницы" })).toHaveFocus();
      await user.tab();
      expect(fab).toHaveFocus();
      await user.keyboard("{Enter}");
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledTimes(2);
      await user.tab();
      expect(screen.getByRole("button", { name: "Сделки" })).toHaveFocus();
    });

    it("stands still with the shell and pops in when it appears later", async () => {
      const fab = <AppShell.Fab aria-label="Ассистент">x</AppShell.Fab>;
      const { unmount } = render(shell(fab));
      const still = screen.getByRole("button", { name: "Ассистент" }).parentElement;
      expect(still).not.toHaveClass(enterMotion.enter);
      unmount();

      const view = render(shell(null));
      await act(async () => {});
      view.rerender(shell(fab));
      expect(screen.getByRole("button", { name: "Ассистент" }).parentElement).toHaveClass(
        enterMotion.enter,
      );
    });

    it("must be inside AppShell.Root (and a frame of its own keeps it out)", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<AppShell.Fab aria-label="Ассистент">x</AppShell.Fab>)).toThrow(
        /AppShell\.Fab/,
      );
      expect(() =>
        render(
          <AppShell.Root>
            <AppShellBoundary>
              <AppShell.Fab aria-label="Ассистент">x</AppShell.Fab>
            </AppShellBoundary>
          </AppShell.Root>,
        ),
      ).toThrow(/AppShell\.Fab/);
      error.mockRestore();
    });

    it("CSS: the dock sticks on the sticky layer, under the overlays", () => {
      const dock = cssRule(CSS, ".dock");
      expect(cssValue(dock, "position")).toBe("sticky");
      expect(cssValue(dock, "bottom")).toBe("0");
      expect(cssValue(dock, "z-index")).toBe("var(--prime-z-sticky)");
      // The panel isolates it: no z-index in the shell reaches the overlay layer.
      expect(cssValue(cssRule(CSS, ".panel"), "isolation")).toBe("isolate");
      const zs = cssRules(CSS).flatMap((rule) =>
        rule.decls.filter((decl) => decl.prop === "z-index").map((decl) => decl.value),
      );
      expect(zs.length).toBeGreaterThan(0);
      expect(zs.every((z) => z === "var(--prime-z-sticky)")).toBe(true);
    });

    it("CSS: the corner clears the bar, the capsule and the safe area", () => {
      const fabs = cssRule(CSS, ".fabs");
      expect(cssValue(fabs, "position")).toBe("absolute");
      expect(cssValue(fabs, "bottom")).toBe("calc(100% + var(--shell-fab-lift))");
      expect(cssValue(fabs, "inset-inline-end")).toBe(
        "calc(var(--shell-fab-end) + var(--prime-safe-area-right))",
      );
      const corner = "calc(var(--prime-layout-gutter) + var(--prime-safe-area-bottom))";
      expect(cssValue(cssRule(CSS, ".dock"), "--shell-fab-lift")).toBe(corner);
      expect(cssValue(cssRule(CSS, ".dock:has(> .footer)"), "--shell-fab-lift")).toBe(
        "var(--prime-layout-gutter)",
      );
      const floating = cssRule(CSS, '.dock:has(> .footer > [data-floating="true"])');
      const lift = cssValue(floating, "--shell-fab-lift").replace(/\s+/g, " ");
      expect(lift).toContain("var(--shell-capsule)");
      expect(lift).toContain("var(--prime-bottom-nav-floating-inset) * 2");
      expect(lift).toContain("var(--prime-safe-area-bottom)");
      expect(cssValue(floating, "--shell-fab-end")).toBe("var(--prime-bottom-nav-floating-inset)");
      // Beside the rail the bar is gone: back to the corner.
      const rail = cssRule(CSS, '.root[data-nav="true"]:not([data-off-canvas]) > .panel > .dock');
      expect(cssValue(rail, "--shell-fab-lift")).toBe(corner);
    });
  });
});
