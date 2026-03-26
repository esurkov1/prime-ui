import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { Sidebar, useSidebarNavTo } from "./Sidebar";

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

  it("uses double variant by default", () => {
    render(
      <Sidebar.Root>
        <Sidebar.NavPanel />
      </Sidebar.Root>,
    );

    const root = screen.getByRole("complementary", { name: "Sidebar" });
    expect(root).toHaveAttribute("data-variant", "double");
    expect(root).not.toHaveAttribute("data-collapsed");
  });

  it("supports simple variant", () => {
    render(
      <Sidebar.Root variant="simple">
        <Sidebar.NavPanel />
      </Sidebar.Root>,
    );

    const root = screen.getByRole("complementary", { name: "Sidebar" });
    expect(root).toHaveAttribute("data-variant", "simple");
    expect(root).toHaveAttribute("data-collapsed", "true");
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
      fireEvent.click(screen.getByRole("button", { name: "Открыть сайдбар" }));
      expect(root).toHaveAttribute("data-open", "true");

      const nav = root.querySelector("nav");
      expect(nav).toBeTruthy();
      fireEvent.mouseLeave(nav as HTMLElement);
      expect(root).toHaveAttribute("data-open", "true");
    } finally {
      window.matchMedia = previousMatchMedia;
    }
  });

  it("opens from left edge hover and closes when pointer leaves nav (peek)", async () => {
    const matchMediaImpl = (query: string) => {
      const narrow = query.includes("64rem") && query.includes("max-width");
      const fineHover = query.includes("(hover: hover)") && query.includes("(pointer: fine)");
      const matches = narrow || fineHover;
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
      const edge = await waitFor(() => {
        const el = root.querySelector("[data-sidebar-part='edge-peek']");
        expect(el).toBeTruthy();
        return el as HTMLElement;
      });

      fireEvent.pointerEnter(edge);
      await waitFor(() => {
        expect(root).toHaveAttribute("data-open", "true");
      });

      const nav = root.querySelector("nav");
      expect(nav).toBeTruthy();
      fireEvent.pointerLeave(nav as HTMLElement);
      await waitFor(() => {
        expect(root).toHaveAttribute("data-open", "false");
      });
    } finally {
      window.matchMedia = previousMatchMedia;
    }
  });

  it("shows collapsed open handle only when sidebar is closed", () => {
    const { rerender } = render(
      <Sidebar.Root open={false}>
        <Sidebar.NavPanel />
      </Sidebar.Root>,
    );

    expect(screen.getByRole("button", { name: "Открыть сайдбар" })).toBeInTheDocument();

    rerender(
      <Sidebar.Root open>
        <Sidebar.NavPanel />
      </Sidebar.Root>,
    );

    expect(screen.queryByRole("button", { name: "Открыть сайдбар" })).not.toBeInTheDocument();
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
    expect(root).toHaveAttribute("data-open", "false");
  });

  it("updates NavPanel content when ContextBar section changes", () => {
    render(
      <Sidebar.Root variant="double" defaultActiveSection="crm">
        <Sidebar.ContextBar
          items={[
            { id: "crm", label: "CRM", icon: <span>c</span> },
            { id: "fleet", label: "Автопарк", icon: <span>f</span> },
          ]}
        />
        <Sidebar.NavPanel>
          <Sidebar.PanelSwitch
            sections={{
              crm: <div>Сделки и контакты</div>,
              fleet: <div>Машины и маршруты</div>,
            }}
          />
        </Sidebar.NavPanel>
      </Sidebar.Root>,
    );

    expect(screen.getByText("Сделки и контакты")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Автопарк" }));
    expect(screen.getByText("Машины и маршруты")).toBeInTheDocument();
  });

  it("MenuRouterLink marks active route and merges className", () => {
    render(
      <MemoryRouter initialEntries={["/here"]}>
        <Sidebar.Root variant="simple">
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

  it("useSidebarNavTo prefixes path with activeSection in double variant", () => {
    function Probe({ path }: { path: string }) {
      return <span data-testid="to">{useSidebarNavTo(path)}</span>;
    }

    render(
      <Sidebar.Root variant="double" defaultActiveSection="crm">
        <Sidebar.NavPanel>
          <Probe path="deals" />
        </Sidebar.NavPanel>
      </Sidebar.Root>,
    );

    expect(screen.getByTestId("to")).toHaveTextContent("/crm/deals");
  });

  it("renders menu primitives and active state", () => {
    render(
      <Sidebar.Root variant="double">
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
      <Sidebar.Root variant="simple">
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
      <Sidebar.Root variant="simple">
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
      <Sidebar.Root variant="simple">
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
      <Sidebar.Root variant="simple">
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
