import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Home, Settings } from "lucide-react";
import type * as React from "react";
import { MemoryRouter, NavLink } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Dropdown } from "@/components/dropdown/Dropdown";

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

  it("places item parts around the label: hidden icon, a plain count in the name", () => {
    render(<Basic />);
    const item = screen.getByRole("button", { name: /^Настройки\s*5$/ });
    expect(item.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("5")).not.toHaveAttribute("data-color");
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

  it("header Toggle: one button that switches modes from the keyboard and stays focused", () => {
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.Header>
          <Sidebar.Brand href="/">Склад</Sidebar.Brand>
          <Sidebar.Toggle variant="header" />
        </Sidebar.Header>
      </Sidebar.Root>,
    );
    const nav = screen.getByRole("navigation");
    const toggle = screen.getByRole("button", { name: "Свернуть панель" });
    expect(toggle).toHaveAttribute("aria-controls", nav.id);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("data-variant", "ghost");

    toggle.focus();
    fireEvent.click(toggle);
    expect(rootOf(nav)).toHaveAttribute("data-mode", "compact");
    expect(toggle).toHaveAccessibleName("Развернуть панель");
    // On the rail edge it is the same element, now soft.
    expect(toggle).toHaveAttribute("data-variant", "soft");
    expect(document.activeElement).toBe(toggle);
  });

  it("header Toggle closes the off-canvas panel", () => {
    mockViewport(true);
    render(
      <Sidebar.Root defaultOpen>
        <Sidebar.Header>
          <Sidebar.Toggle variant="header" />
        </Sidebar.Header>
      </Sidebar.Root>,
    );
    const nav = screen.getByRole("navigation");
    const toggle = nav.querySelector("button[aria-controls]") as HTMLElement;
    expect(toggle).toHaveAccessibleName("Закрыть навигацию");
    fireEvent.click(toggle);
    expect(rootOf(nav)).toHaveAttribute("data-state", "closed");
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

describe("Sidebar item parts", () => {
  it("ItemCount is a plain number by default and a Badge with color / variant", () => {
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.Item>
          Бэклог
          <Sidebar.ItemCount>24</Sidebar.ItemCount>
        </Sidebar.Item>
        <Sidebar.Item>
          Уведомления
          <Sidebar.ItemCount color="red">7</Sidebar.ItemCount>
        </Sidebar.Item>
        <Sidebar.Item>
          Сбои
          <Sidebar.ItemCount variant="solid">!</Sidebar.ItemCount>
        </Sidebar.Item>
      </Sidebar.Root>,
    );
    expect(screen.getByText("24")).not.toHaveAttribute("data-color");
    const red = screen.getByText("7");
    expect(red).toHaveAttribute("data-color", "red");
    expect(red).toHaveAttribute("data-variant", "soft");
    const solid = screen.getByText("!");
    expect(solid).toHaveAttribute("data-color", "gray");
    expect(solid).toHaveAttribute("data-variant", "solid");
  });

  it("an ItemIcon after the label is a trailing icon", () => {
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.Item href="/help">
          <Sidebar.ItemIcon>
            <Home data-testid="lead" />
          </Sidebar.ItemIcon>
          Справка
          <Sidebar.ItemIcon>
            <Settings data-testid="trail" />
          </Sidebar.ItemIcon>
        </Sidebar.Item>
      </Sidebar.Root>,
    );
    const link = screen.getByRole("link", { name: "Справка" });
    expect(link.firstElementChild).toContainElement(screen.getByTestId("lead"));
    expect(screen.getByTestId("lead").parentElement).not.toHaveAttribute("data-edge");
    expect(screen.getByTestId("trail").parentElement).toHaveAttribute("data-edge", "end");
  });

  it("ItemAction is a separate button next to the item, never inside it", () => {
    const onClick = vi.fn();
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.Item href="/deals">
          Сделки
          <Sidebar.ItemAction label="Создать сделку" onClick={onClick} />
        </Sidebar.Item>
      </Sidebar.Root>,
    );
    const link = screen.getByRole("link", { name: "Сделки" });
    const action = screen.getByRole("button", { name: "Создать сделку" });
    expect(link).not.toContainElement(action);
    expect(link.parentElement).toContainElement(action);
    fireEvent.click(action);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("Sidebar.Brand and Sidebar.Account", () => {
  it("Brand renders the logo, name and description; a link with href", () => {
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.Header>
          <Sidebar.Brand href="/" description="Отдел продаж">
            <Sidebar.BrandLogo>
              <svg data-testid="logo" />
            </Sidebar.BrandLogo>
            Прайм CRM
          </Sidebar.Brand>
        </Sidebar.Header>
      </Sidebar.Root>,
    );
    const link = screen.getByRole("link", { name: /Прайм CRM/ });
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveTextContent("Отдел продаж");
    expect(screen.getByTestId("logo").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("Account is a button named by the person and opens a Dropdown", () => {
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.Footer>
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Sidebar.Account description="anna@company.ru">
                <Avatar.Root>
                  <Avatar.Fallback>АС</Avatar.Fallback>
                </Avatar.Root>
                Анна Смирнова
              </Sidebar.Account>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>Выйти</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </Sidebar.Footer>
      </Sidebar.Root>,
    );
    // The avatar initials are hidden: the name says who it is.
    const account = screen.getByRole("button", { name: /^Анна Смирнова\s*anna@company\.ru$/ });
    expect(account).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(account);
    expect(account).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Выйти" })).toBeInTheDocument();
  });
});

describe("Sidebar.Group collapsible", () => {
  function Groups(props: Partial<React.ComponentProps<typeof Sidebar.Group>>) {
    return (
      <Sidebar.Root responsive={false}>
        <Sidebar.Content>
          <Sidebar.Group label="Инструменты" collapsible {...props}>
            <Sidebar.Item href="/tasks">Задачи</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.Root>
    );
  }

  it("the heading is a disclosure button that hides the items from the tab order", () => {
    render(<Groups />);
    const heading = screen.getByRole("button", { name: "Инструменты" });
    const region = document.getElementById(heading.getAttribute("aria-controls") ?? "");
    expect(heading).toHaveAttribute("aria-expanded", "true");
    expect(region).toHaveAttribute("data-state", "open");
    expect(screen.getByRole("group", { name: "Инструменты" })).toBeInTheDocument();

    fireEvent.click(heading);
    expect(heading).toHaveAttribute("aria-expanded", "false");
    expect(region).toHaveAttribute("data-state", "closed");
    expect(region).toHaveAttribute("inert");
  });

  it("controlled: reports changes through onOpenChange", () => {
    const onOpenChange = vi.fn();
    render(<Groups open={false} onOpenChange={onOpenChange} />);
    const heading = screen.getByRole("button", { name: "Инструменты" });
    fireEvent.click(heading);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(heading).toHaveAttribute("aria-expanded", "false");
  });

  it("opens by itself when it holds the current page", () => {
    render(
      <Sidebar.Root responsive={false}>
        <Sidebar.Group label="Инструменты" collapsible defaultOpen={false}>
          <Sidebar.Item current>Задачи</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Root>,
    );
    expect(screen.getByRole("button", { name: "Инструменты" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("on the compact rail the items show and the heading leaves the tab order", () => {
    render(
      <Sidebar.Root responsive={false} mode="compact">
        <Sidebar.Group label="Инструменты" collapsible defaultOpen={false}>
          <Sidebar.Item>Задачи</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Root>,
    );
    const heading = document.querySelector("button[aria-controls]") as HTMLElement;
    expect(heading).toHaveAttribute("inert");
    const region = document.getElementById(heading.getAttribute("aria-controls") ?? "");
    expect(region).toHaveAttribute("data-state", "open");
    expect(region).not.toHaveAttribute("inert");
  });
});

describe("Sidebar.Sub", () => {
  function Nested({
    current = false,
    ...root
  }: Partial<React.ComponentProps<typeof Sidebar.Root>> & { current?: boolean }) {
    return (
      <Sidebar.Root responsive={false} {...root}>
        <Sidebar.Sub>
          <Sidebar.SubTrigger>
            <Sidebar.ItemIcon>
              <Home />
            </Sidebar.ItemIcon>
            Задачи
          </Sidebar.SubTrigger>
          <Sidebar.SubContent>
            <Sidebar.Item href="/backlog">Бэклог</Sidebar.Item>
            <Sidebar.Item href="/review" current={current}>
              На проверке
            </Sidebar.Item>
          </Sidebar.SubContent>
        </Sidebar.Sub>
      </Sidebar.Root>
    );
  }

  it("the parent is a disclosure button: click and arrows open and close the children", () => {
    render(<Nested />);
    const parent = screen.getByRole("button", { name: "Задачи" });
    const region = document.getElementById(parent.getAttribute("aria-controls") ?? "");
    expect(parent).toHaveAttribute("aria-expanded", "false");
    expect(region).toHaveAttribute("inert");
    expect(region).toHaveAttribute("role", "group");
    expect(region).toHaveAttribute("aria-labelledby", parent.id);

    fireEvent.click(parent);
    expect(parent).toHaveAttribute("aria-expanded", "true");
    expect(region).not.toHaveAttribute("inert");

    fireEvent.keyDown(parent, { key: "ArrowLeft" });
    expect(parent).toHaveAttribute("aria-expanded", "false");
    fireEvent.keyDown(parent, { key: "ArrowRight" });
    expect(parent).toHaveAttribute("aria-expanded", "true");
  });

  it("a current child opens the parent and marks the active path", () => {
    render(<Nested current />);
    const parent = screen.getByRole("button", { name: "Задачи" });
    expect(parent).toHaveAttribute("aria-expanded", "true");
    expect(parent).toHaveAttribute("data-active-path", "true");
    expect(parent).not.toHaveAttribute("aria-current");
  });

  describe("compact flyout", () => {
    it("Enter opens the flyout and focuses the first child; arrows move; Escape returns", () => {
      render(<Nested mode="compact" current />);
      const parent = screen.getByRole("button", { name: "Задачи" });
      expect(parent).toHaveAttribute("aria-haspopup", "dialog");
      expect(parent).toHaveAttribute("aria-expanded", "false");
      parent.focus();
      fireEvent.keyDown(parent, { key: "Enter" });

      const flyout = screen.getByRole("dialog", { name: "Задачи" });
      expect(parent).toHaveAttribute("aria-expanded", "true");
      const backlog = within(flyout).getByRole("link", { name: "Бэклог" });
      expect(document.activeElement).toBe(backlog);
      const review = within(flyout).getByRole("link", { name: "На проверке" });
      expect(review).toHaveAttribute("aria-current", "page");

      fireEvent.keyDown(backlog, { key: "ArrowDown" });
      expect(document.activeElement).toBe(review);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(parent).toHaveAttribute("aria-expanded", "false");
      expect(document.activeElement).toBe(parent);
    });

    it("ArrowRight opens it and ArrowLeft brings focus back to the parent", () => {
      render(<Nested mode="compact" />);
      const parent = screen.getByRole("button", { name: "Задачи" });
      parent.focus();
      fireEvent.keyDown(parent, { key: "ArrowRight" });
      expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement);
      fireEvent.keyDown(document.activeElement as HTMLElement, { key: "ArrowLeft" });
      expect(document.activeElement).toBe(parent);
      expect(parent).toHaveAttribute("aria-expanded", "false");
    });

    it("hover opens after the intent delay, leaving closes after the grace period", () => {
      vi.useFakeTimers();
      try {
        render(<Nested mode="compact" />);
        const parent = screen.getByRole("button", { name: "Задачи" });
        fireEvent.pointerEnter(parent, { pointerType: "mouse" });
        expect(parent).toHaveAttribute("aria-expanded", "false");
        act(() => {
          vi.advanceTimersByTime(200);
        });
        expect(parent).toHaveAttribute("aria-expanded", "true");

        fireEvent.pointerLeave(parent, { pointerType: "mouse" });
        act(() => {
          vi.advanceTimersByTime(100);
        });
        // Still open: the pointer may be on its way into the flyout.
        expect(parent).toHaveAttribute("aria-expanded", "true");
        act(() => {
          vi.advanceTimersByTime(400);
        });
        expect(parent).toHaveAttribute("aria-expanded", "false");
      } finally {
        vi.useRealTimers();
      }
    });

    it("a click on a child closes the flyout", () => {
      render(<Nested mode="compact" />);
      const parent = screen.getByRole("button", { name: "Задачи" });
      fireEvent.click(parent);
      fireEvent.click(within(screen.getByRole("dialog")).getByRole("link", { name: "Бэклог" }));
      expect(parent).toHaveAttribute("aria-expanded", "false");
    });

    it("keeps the inline children inert on the rail", () => {
      render(<Nested mode="compact" current />);
      const parent = screen.getByRole("button", { name: "Задачи" });
      expect(parent).toHaveAttribute("data-active-path", "true");
      const inline = document.getElementById(
        parent.getAttribute("aria-labelledby") ?? `${parent.id.replace(/-trigger$/, "")}-content`,
      );
      expect(inline).toHaveAttribute("inert");
    });
  });
});
