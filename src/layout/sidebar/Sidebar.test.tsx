import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("renders landmark with default aria-label", () => {
    render(
      <Sidebar.Root>
        <Sidebar.NavPanel>
          <Sidebar.Content>Nav</Sidebar.Content>
        </Sidebar.NavPanel>
      </Sidebar.Root>,
    );
    expect(screen.getByRole("complementary", { name: "Sidebar" })).toBeInTheDocument();
  });

  it("does not set variant data attribute", () => {
    render(
      <Sidebar.Root>
        <Sidebar.NavPanel />
      </Sidebar.Root>,
    );

    const root = screen.getByRole("complementary", { name: "Sidebar" });
    expect(root).not.toHaveAttribute("data-variant");
    expect(root).not.toHaveAttribute("data-collapsed");
  });

  it("supports page-nav slot", () => {
    render(
      <Sidebar.Root sidebarSlot="page-nav">
        <Sidebar.NavPanel />
      </Sidebar.Root>,
    );

    const root = screen.getByRole("complementary", { name: "Sidebar" });
    expect(root).toHaveAttribute("data-sidebar-slot", "page-nav");
  });

  it("is open by default and supports controlled open state", () => {
    const { rerender } = render(
      <Sidebar.Root>
        <Sidebar.NavPanel />
      </Sidebar.Root>,
    );

    const root = screen.getByRole("complementary", { name: "Sidebar" });
    expect(root).toHaveAttribute("data-open", "true");

    rerender(
      <Sidebar.Root open={false}>
        <Sidebar.NavPanel />
      </Sidebar.Root>,
    );
    expect(root).toHaveAttribute("data-open", "false");
  });

  it("sets responsive mode attribute", () => {
    render(
      <Sidebar.Root responsive>
        <Sidebar.NavPanel />
      </Sidebar.Root>,
    );

    const root = screen.getByRole("complementary", { name: "Sidebar" });
    expect(root).toHaveAttribute("data-responsive", "true");
  });

  it("does not close on nav leave when opened via floating toggle", () => {
    const matchMediaImpl = (query: string) => {
      if (query.includes("480px") && query.includes("max-width")) {
        return {
          matches: false,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        } as MediaQueryList;
      }
      const matches = query.includes("64rem") && query.includes("max-width");
      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as MediaQueryList;
    };
    const previousMatchMedia = window.matchMedia;
    window.matchMedia = matchMediaImpl as typeof window.matchMedia;

    try {
      render(
        <Sidebar.Root defaultOpen={false} responsive>
          <Sidebar.NavPanel />
        </Sidebar.Root>,
      );

      const root = screen.getByRole("complementary", { name: "Sidebar" });
      fireEvent.click(screen.getByRole("button", { name: /Открыть сайдбар/ }));
      expect(root).toHaveAttribute("data-open", "true");

      const nav = root.querySelector("nav");
      expect(nav).toBeTruthy();
      fireEvent.mouseLeave(nav as HTMLElement);
      expect(root).toHaveAttribute("data-open", "true");
    } finally {
      window.matchMedia = previousMatchMedia;
    }
  });

  it("does not show floating toggle when viewport matches xs hidden (≤480px)", () => {
    const matchMediaImpl = (query: string) => {
      if (query.includes("480px") && query.includes("max-width")) {
        return {
          matches: true,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        } as MediaQueryList;
      }
      const matches = query.includes("64rem") && query.includes("max-width");
      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as MediaQueryList;
    };
    const previousMatchMedia = window.matchMedia;
    window.matchMedia = matchMediaImpl as typeof window.matchMedia;

    try {
      render(
        <Sidebar.Root defaultOpen={false} responsive>
          <Sidebar.NavPanel />
        </Sidebar.Root>,
      );

      expect(screen.queryByRole("button", { name: /Открыть сайдбар/ })).not.toBeInTheDocument();
    } finally {
      window.matchMedia = previousMatchMedia;
    }
  });

  it("shows collapsed open handle only when sidebar is closed on narrow viewport", () => {
    const matchMediaImpl = (query: string) => {
      if (query.includes("480px") && query.includes("max-width")) {
        return {
          matches: false,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        } as MediaQueryList;
      }
      const matches = query.includes("64rem") && query.includes("max-width");
      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as MediaQueryList;
    };
    const previousMatchMedia = window.matchMedia;
    window.matchMedia = matchMediaImpl as typeof window.matchMedia;

    try {
      const { rerender } = render(
        <Sidebar.Root open={false}>
          <Sidebar.NavPanel />
        </Sidebar.Root>,
      );

      expect(screen.getByRole("button", { name: /Открыть сайдбар/ })).toBeInTheDocument();

      rerender(
        <Sidebar.Root open>
          <Sidebar.NavPanel />
        </Sidebar.Root>,
      );

      expect(screen.queryByRole("button", { name: /Открыть сайдбар/ })).not.toBeInTheDocument();
    } finally {
      window.matchMedia = previousMatchMedia;
    }
  });

  it("ToggleButton toggles open state", () => {
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.ToggleButton />
          </Sidebar.Header>
        </Sidebar.NavPanel>
      </Sidebar.Root>,
    );

    const root = screen.getByRole("complementary", { name: "Sidebar" });
    expect(root).toHaveAttribute("data-open", "true");

    fireEvent.click(screen.getByRole("button", { name: "Скрыть сайдбар" }));
    expect(root).toHaveAttribute("data-open", "true");
    expect(root).toHaveAttribute("data-sidebar-mode", "compact");
  });

  it("MenuRouterLink marks active route and merges className", () => {
    render(
      <MemoryRouter initialEntries={["/here"]}>
        <Sidebar.Root>
          <Sidebar.NavPanel>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuRouterLink to="/here">Here</Sidebar.MenuRouterLink>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuRouterLink to="/other">Other</Sidebar.MenuRouterLink>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.NavPanel>
        </Sidebar.Root>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Here" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Other" })).not.toHaveAttribute("aria-current");
  });

  it("renders menu primitives and active state", () => {
    render(
      <Sidebar.Root>
        <Sidebar.NavPanel>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton type="button" active>
                  <Sidebar.MenuLabel>Current</Sidebar.MenuLabel>
                </Sidebar.MenuButton>
                <Sidebar.MenuAction type="button" aria-label="More">
                  ·
                </Sidebar.MenuAction>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
        </Sidebar.NavPanel>
      </Sidebar.Root>,
    );

    expect(screen.getByRole("button", { name: "Current" })).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
  });

  it("renders IdentityButton with title and subtitle", () => {
    render(
      <Sidebar.Root>
        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.IdentityButton
              title="Prime-UI"
              subtitle="Reakt UI-Kit"
              leading={<span>logo</span>}
            />
          </Sidebar.Header>
        </Sidebar.NavPanel>
      </Sidebar.Root>,
    );

    const trigger = screen.getByRole("button", { name: /Prime-UI/i });
    expect(trigger).toHaveTextContent("Prime-UI");
    expect(trigger).toHaveTextContent("Reakt UI-Kit");
  });

  it("MenuButton asChild renders as <a> with data-active", () => {
    render(
      <Sidebar.Root>
        <Sidebar.NavPanel>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton asChild active>
                <a href="/path">Nav link</a>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.NavPanel>
      </Sidebar.Root>,
    );

    const link = screen.getByRole("link", { name: "Nav link" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/path");
    expect(link).toHaveAttribute("data-active", "true");
    expect(link).not.toHaveAttribute("disabled");
  });

  it("MenuButton asChild disabled sets aria-disabled and prevents click", () => {
    render(
      <Sidebar.Root>
        <Sidebar.NavPanel>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton asChild disabled>
                <a href="/locked">Locked</a>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.NavPanel>
      </Sidebar.Root>,
    );

    const link = screen.getByRole("link", { name: "Locked" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("disabled");
    const prevented = !fireEvent.click(link);
    expect(prevented).toBe(true);
  });

  it("MenuLink renders as <a> via MenuButton asChild", () => {
    render(
      <Sidebar.Root>
        <Sidebar.NavPanel>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuLink href="/docs" active>
                Docs
              </Sidebar.MenuLink>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.NavPanel>
      </Sidebar.Root>,
    );

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("data-active", "true");
  });
});
