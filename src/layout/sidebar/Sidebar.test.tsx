import { act, fireEvent, render, screen } from "@testing-library/react";
import { Home, Settings } from "lucide-react";
import { MemoryRouter, NavLink } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Sidebar, type SidebarMode, useSidebar } from "./Sidebar";

function mockViewport(mobile: boolean) {
  const listeners = new Set<() => void>();
  const state = { mobile };
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      get matches() {
        return query.includes("max-width") && state.mobile;
      },
      media: query,
      onchange: null,
      addEventListener: (_: string, cb: () => void) => listeners.add(cb),
      removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
  return {
    set(next: boolean) {
      state.mobile = next;
      act(() => {
        for (const cb of listeners) cb();
      });
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function rootOf(nav: HTMLElement) {
  return nav.parentElement as HTMLElement;
}

function Basic(props: React.ComponentProps<typeof Sidebar.Root>) {
  return (
    <Sidebar.Root {...props}>
      <Sidebar.Content>
        <Sidebar.Group label="Разделы">
          <Sidebar.Item current>
            <Sidebar.ItemIcon>
              <Home />
            </Sidebar.ItemIcon>
            Главная
          </Sidebar.Item>
          <Sidebar.Item>
            <Sidebar.ItemIcon>
              <Settings />
            </Sidebar.ItemIcon>
            Настройки
            <Sidebar.ItemCount>5</Sidebar.ItemCount>
          </Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Toggle />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}

describe("Sidebar", () => {
  it("renders a navigation landmark with the default label and m size", () => {
    render(<Basic />);
    const nav = screen.getByRole("navigation", { name: "Навигация" });
    expect(rootOf(nav)).toHaveAttribute("data-size", "m");
    expect(rootOf(nav)).toHaveAttribute("data-mode", "expanded");
  });

  it("applies size and labels", () => {
    render(<Basic size="l" labels={{ navigation: "Основное меню" }} />);
    const nav = screen.getByRole("navigation", { name: "Основное меню" });
    expect(rootOf(nav)).toHaveAttribute("data-size", "l");
  });

  it("groups items under an accessible label", () => {
    render(<Basic />);
    expect(screen.getByRole("group", { name: "Разделы" })).toBeInTheDocument();
  });

  it("places item parts around the label: hidden icon, count badge in the name", () => {
    render(<Basic />);
    const item = screen.getByRole("button", { name: /^Настройки\s*5$/ });
    expect(item.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("5")).toHaveAttribute("data-color", "gray");
  });

  it("puts the scrolling region in a ScrollContainer with edge fades", () => {
    render(<Basic />);
    const group = screen.getByRole("group", { name: "Разделы" });
    expect(group.parentElement).toHaveAttribute("data-fade", "vertical");
  });

  it("marks the current item with aria-current and data-state", () => {
    render(<Basic />);
    const item = screen.getByRole("button", { name: "Главная" });
    expect(item).toHaveAttribute("aria-current", "page");
    expect(item).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("button", { name: /Настройки/ })).not.toHaveAttribute("aria-current");
  });

  it("renders a link when href is set and blocks it when disabled", () => {
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.Item href="/a">A</Sidebar.Item>
        <Sidebar.Item href="/b" disabled>
          B
        </Sidebar.Item>
      </Sidebar.Root>,
    );
    expect(screen.getByRole("link", { name: "A" })).toHaveAttribute("href", "/a");
    const b = screen.getByText("B").closest("a") as HTMLElement;
    expect(b).not.toHaveAttribute("href");
    expect(b).toHaveAttribute("aria-disabled", "true");
    expect(b).toHaveAttribute("data-disabled", "true");
  });

  it("renders a router link via asChild and keeps the item structure", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <Sidebar.Root responsive={false}>
          <Sidebar.Item asChild>
            <NavLink to="/" end>
              <Sidebar.ItemIcon>
                <Home />
              </Sidebar.ItemIcon>
              Главная
            </NavLink>
          </Sidebar.Item>
          <Sidebar.Item asChild>
            <NavLink to="/settings">
              <Sidebar.ItemIcon>
                <Settings />
              </Sidebar.ItemIcon>
              Настройки
            </NavLink>
          </Sidebar.Item>
        </Sidebar.Root>
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Настройки" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Главная" })).not.toHaveAttribute("aria-current");
  });

  it("uncontrolled: Toggle switches expanded ↔ compact and updates its label", () => {
    const onModeChange = vi.fn();
    render(<Basic responsive={false} onModeChange={onModeChange} />);
    const nav = screen.getByRole("navigation");
    const toggle = screen.getByRole("button", { name: "Свернуть панель" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-controls", nav.id);

    fireEvent.click(toggle);
    expect(rootOf(nav)).toHaveAttribute("data-mode", "compact");
    expect(onModeChange).toHaveBeenLastCalledWith("compact");
    expect(screen.getByRole("button", { name: "Развернуть панель" })).toBe(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(rootOf(nav)).toHaveAttribute("data-mode", "expanded");
  });

  it("edge Toggle: a round button that switches modes from the keyboard", () => {
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.Header>
          Склад
          <Sidebar.Toggle variant="edge" />
        </Sidebar.Header>
      </Sidebar.Root>,
    );
    const nav = screen.getByRole("navigation");
    const toggle = screen.getByRole("button", { name: "Свернуть панель" });
    expect(toggle).toHaveAttribute("aria-controls", nav.id);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    toggle.focus();
    fireEvent.keyDown(toggle, { key: "Enter" });
    fireEvent.click(toggle);
    expect(rootOf(nav)).toHaveAttribute("data-mode", "compact");
    expect(toggle).toHaveAccessibleName("Развернуть панель");
    expect(document.activeElement).toBe(toggle);
  });

  it("edge Toggle renders nothing off-canvas", () => {
    mockViewport(true);
    render(
      <Sidebar.Root>
        <Sidebar.Header>
          <Sidebar.Toggle variant="edge" />
        </Sidebar.Header>
      </Sidebar.Root>,
    );
    // Only the scrim is left: it is labelled `labels.close`; no edge toggle is rendered.
    expect(screen.queryByRole("button", { name: /панель/ })).toBeNull();
    expect(document.querySelectorAll("button")).toHaveLength(1);
  });

  it("keeps focus on the toggle across mode changes (no remount)", () => {
    render(<Basic responsive={false} />);
    const toggle = screen.getByRole("button", { name: "Свернуть панель" });
    toggle.focus();
    fireEvent.click(toggle);
    expect(document.activeElement).toBe(toggle);
  });

  it("controlled mode: renders the given mode and reports changes", () => {
    const onModeChange = vi.fn();
    const { rerender } = render(
      <Basic responsive={false} mode="compact" onModeChange={onModeChange} />,
    );
    const nav = screen.getByRole("navigation");
    expect(rootOf(nav)).toHaveAttribute("data-mode", "compact");

    fireEvent.click(screen.getByRole("button", { name: "Развернуть панель" }));
    expect(onModeChange).toHaveBeenCalledWith("expanded");
    expect(rootOf(nav)).toHaveAttribute("data-mode", "compact");

    rerender(<Basic responsive={false} mode="hidden" onModeChange={onModeChange} />);
    expect(rootOf(nav)).toHaveAttribute("data-mode", "hidden");
    // Hidden keeps the panel width of the last visible mode and makes the panel inert.
    expect(rootOf(nav)).toHaveAttribute("data-panel-mode", "compact");
    expect(nav).toHaveAttribute("inert");
  });

  it("hidden → Toggle expands", () => {
    render(<Basic responsive={false} defaultMode="hidden" />);
    const nav = screen.getByRole("navigation", { hidden: true });
    fireEvent.click(screen.getByRole("button", { name: "Развернуть панель", hidden: true }));
    expect(rootOf(nav)).toHaveAttribute("data-mode", "expanded");
  });

  it("shows a tooltip with the item label in compact mode only", () => {
    const { rerender } = render(<Basic responsive={false} mode="expanded" />);
    fireEvent.focus(screen.getByRole("button", { name: "Главная" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    rerender(<Basic responsive={false} mode="compact" />);
    vi.useFakeTimers();
    const item = screen.getByRole("button", { name: "Главная" });
    fireEvent.blur(item);
    fireEvent.focus(item);
    act(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Главная");
  });

  it("forwards refs to the item element", () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.Item ref={ref}>A</Sidebar.Item>
      </Sidebar.Root>,
    );
    expect(ref.current).toBe(screen.getByRole("button", { name: "A" }));
  });

  describe("responsive (off-canvas below 768px)", () => {
    it("is closed by default, opens via open prop and closes with Escape", () => {
      mockViewport(true);
      const onOpenChange = vi.fn();
      const { rerender } = render(<Basic open={false} onOpenChange={onOpenChange} />);
      const nav = screen.getByRole("navigation", { hidden: true });
      expect(rootOf(nav)).toHaveAttribute("data-mobile", "true");
      expect(rootOf(nav)).toHaveAttribute("data-state", "closed");
      expect(nav).toHaveAttribute("inert");

      rerender(<Basic open onOpenChange={onOpenChange} />);
      expect(rootOf(nav)).toHaveAttribute("data-state", "open");
      expect(nav).not.toHaveAttribute("inert");

      fireEvent.keyDown(document, { key: "Escape" });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("closes from the scrim", () => {
      mockViewport(true);
      render(
        <Sidebar.Root defaultOpen>
          <Sidebar.Item href="#a">A</Sidebar.Item>
          <Sidebar.Toggle />
        </Sidebar.Root>,
      );
      const nav = screen.getByRole("navigation");
      const scrim = screen.getAllByRole("button", { name: "Закрыть навигацию" })[0];
      fireEvent.click(scrim);
      expect(rootOf(nav)).toHaveAttribute("data-state", "closed");
    });

    it("closes after navigating and from the toggle", () => {
      mockViewport(true);
      function Harness() {
        const ctx = useSidebar();
        return (
          <button type="button" onClick={() => ctx.setOpen(true)}>
            open
          </button>
        );
      }
      render(
        <Sidebar.Root>
          <Harness />
          <Sidebar.Item href="#a">A</Sidebar.Item>
          <Sidebar.Toggle />
        </Sidebar.Root>,
      );
      const nav = screen.getByRole("navigation", { hidden: true });
      fireEvent.click(screen.getByText("open"));
      expect(rootOf(nav)).toHaveAttribute("data-state", "open");
      fireEvent.click(screen.getByRole("link", { name: "A" }));
      expect(rootOf(nav)).toHaveAttribute("data-state", "closed");

      fireEvent.click(screen.getByText("open", { selector: "button" }));
      const toggle = nav.querySelector("button[aria-controls]") as HTMLElement;
      expect(toggle).toHaveAttribute("aria-label", "Закрыть навигацию");
      fireEvent.click(toggle);
      expect(rootOf(nav)).toHaveAttribute("data-state", "closed");
    });

    it("leaving the narrow viewport closes the panel and restores the rail", () => {
      const viewport = mockViewport(true);
      render(<Basic defaultOpen />);
      const nav = screen.getByRole("navigation");
      expect(rootOf(nav)).toHaveAttribute("data-state", "open");
      viewport.set(false);
      expect(rootOf(nav)).not.toHaveAttribute("data-mobile");
      expect(rootOf(nav)).not.toHaveAttribute("data-state");
      viewport.set(true);
      expect(rootOf(nav)).toHaveAttribute("data-state", "closed");
    });

    it("responsive={false} never goes off-canvas", () => {
      mockViewport(true);
      render(<Basic responsive={false} />);
      expect(rootOf(screen.getByRole("navigation"))).not.toHaveAttribute("data-mobile");
    });
  });

  it("useSidebar throws outside Sidebar.Root", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Probe() {
      useSidebar();
      return null;
    }
    expect(() => render(<Probe />)).toThrow();
    spy.mockRestore();
  });

  it("exposes mode setters through useSidebar", () => {
    const seen: SidebarMode[] = [];
    function Probe() {
      const { mode, setMode } = useSidebar();
      seen.push(mode);
      return (
        <button type="button" onClick={() => setMode("hidden")}>
          hide
        </button>
      );
    }
    render(
      <Sidebar.Root responsive={false}>
        <Probe />
      </Sidebar.Root>,
    );
    fireEvent.click(screen.getByText("hide"));
    expect(seen.at(-1)).toBe("hidden");
  });
});
