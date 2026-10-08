import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Tabs } from "./Tabs";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicTabs({
  defaultValue = "tab1",
  orientation = "horizontal" as const,
  value,
  onValueChange,
}: {
  defaultValue?: string;
  orientation?: "horizontal" | "vertical";
  value?: string;
  onValueChange?: (v: string) => void;
}) {
  return (
    <Tabs.Root
      defaultValue={defaultValue}
      orientation={orientation}
      value={value}
      onValueChange={onValueChange}
    >
      <Tabs.List>
        <Tabs.Item value="tab1">Tab 1</Tabs.Item>
        <Tabs.Item value="tab2">Tab 2</Tabs.Item>
        <Tabs.Item value="tab3" disabled>
          Tab 3
        </Tabs.Item>
      </Tabs.List>
      <Tabs.Panel value="tab1">Panel 1</Tabs.Panel>
      <Tabs.Panel value="tab2">Panel 2</Tabs.Panel>
      <Tabs.Panel value="tab3">Panel 3</Tabs.Panel>
    </Tabs.Root>
  );
}

// ─── Render ───────────────────────────────────────────────────────────────────

describe("Tabs — render", () => {
  it("renders tablist and tabs", () => {
    render(<BasicTabs />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("sets data-size=m by default on root", () => {
    const { container } = render(<BasicTabs />);
    const root = container.querySelector('[data-orientation="horizontal"]');
    expect(root).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from Root size prop", () => {
    const { container } = render(
      <Tabs.Root defaultValue="tab1" size="xl">
        <Tabs.List>
          <Tabs.Item value="tab1">Tab 1</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="tab1">Panel 1</Tabs.Panel>
      </Tabs.Root>,
    );
    const root = container.querySelector('[data-size="xl"]');
    expect(root).toBeInTheDocument();
  });

  it("renders active panel and hides inactive panels", () => {
    render(<BasicTabs defaultValue="tab1" />);
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
    expect(screen.queryByText("Panel 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Panel 3")).not.toBeInTheDocument();
  });

  it("renders Tabs.Label text as tab accessible name", () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Item value="a">
            <Tabs.Label>Hello</Tabs.Label>
          </Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="a">Panel</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByRole("tab", { name: "Hello" })).toBeInTheDocument();
  });

  it("allows two Tabs.Icon slots in a tab (composition like Button)", () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Item value="a">
            <Tabs.Icon>
              <span data-testid="icon-left" />
            </Tabs.Icon>
            Label
            <Tabs.Icon>
              <span data-testid="icon-right" />
            </Tabs.Icon>
          </Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="a">Panel</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByTestId("icon-left")).toBeInTheDocument();
    expect(screen.getByTestId("icon-right")).toBeInTheDocument();
  });
});

// ─── Click interaction ────────────────────────────────────────────────────────

describe("Tabs — click", () => {
  it("switches active tab on click", () => {
    render(<BasicTabs />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(screen.getByText("Panel 2")).toBeInTheDocument();
    expect(screen.queryByText("Panel 1")).not.toBeInTheDocument();
  });

  it("does not switch on click when tab is disabled", () => {
    render(<BasicTabs />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab 3" }));
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
    expect(screen.queryByText("Panel 3")).not.toBeInTheDocument();
  });
});

// ─── ARIA ─────────────────────────────────────────────────────────────────────

describe("Tabs — ARIA", () => {
  it("sets role=tablist on list", () => {
    render(<BasicTabs />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("sets aria-selected correctly", () => {
    render(<BasicTabs defaultValue="tab1" />);
    const [tab1, tab2] = screen.getAllByRole("tab");
    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(tab2).toHaveAttribute("aria-selected", "false");
  });

  it("sets tabIndex=0 on selected tab and -1 on others", () => {
    render(<BasicTabs defaultValue="tab1" />);
    const [tab1, tab2] = screen.getAllByRole("tab");
    expect(tab1).toHaveAttribute("tabindex", "0");
    expect(tab2).toHaveAttribute("tabindex", "-1");
  });

  it("without a selection the first enabled tab is the tab stop", () => {
    render(
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Item value="a" disabled>
            A
          </Tabs.Item>
          <Tabs.Item value="b">B</Tabs.Item>
          <Tabs.Item value="c">C</Tabs.Item>
        </Tabs.List>
      </Tabs.Root>,
    );
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "C" })).toHaveAttribute("tabindex", "-1");
    fireEvent.click(screen.getByRole("tab", { name: "C" }));
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tab", { name: "C" })).toHaveAttribute("tabindex", "0");
  });

  it("builds valid id references from values with spaces and symbols", () => {
    render(
      <Tabs.Root defaultValue="Мои заказы #1">
        <Tabs.List>
          <Tabs.Item value="Мои заказы #1">Заказы</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="Мои заказы #1">Список</Tabs.Panel>
      </Tabs.Root>,
    );
    const tab = screen.getByRole("tab", { name: "Заказы" });
    const controls = tab.getAttribute("aria-controls") ?? "";
    expect(controls).not.toMatch(/\s/);
    expect(document.getElementById(controls)).toBe(screen.getByRole("tabpanel"));
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Заказы");
  });

  it("sets aria-controls and aria-labelledby linking tab to panel", () => {
    render(<BasicTabs defaultValue="tab1" />);
    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    const panel1 = screen.getByRole("tabpanel");

    expect(tab1).toHaveAttribute("aria-controls", panel1.id);
    expect(panel1).toHaveAttribute("aria-labelledby", tab1.id);
  });

  it("sets role=tabpanel on active panel", () => {
    render(<BasicTabs defaultValue="tab1" />);
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });

  it("sets aria-orientation on tablist (horizontal)", () => {
    render(<BasicTabs orientation="horizontal" />);
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("sets aria-orientation on tablist (vertical)", () => {
    render(<BasicTabs orientation="vertical" />);
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
  });
});

// ─── Keyboard navigation (horizontal) ────────────────────────────────────────

describe("Tabs — keyboard (horizontal)", () => {
  it("ArrowRight moves focus to next tab and activates it", () => {
    render(<BasicTabs defaultValue="tab1" orientation="horizontal" />);
    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    tab1.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(screen.getByText("Panel 2")).toBeInTheDocument();
  });

  it("ArrowLeft moves focus to previous tab", () => {
    render(<BasicTabs defaultValue="tab2" orientation="horizontal" />);
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });
    tab2.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowLeft" });
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
  });

  it("ArrowRight wraps from last enabled tab to first", () => {
    render(<BasicTabs defaultValue="tab2" orientation="horizontal" />);
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });
    tab2.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
  });

  it("Home activates first tab", () => {
    render(<BasicTabs defaultValue="tab2" orientation="horizontal" />);
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });
    tab2.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "Home" });
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
  });

  it("End activates last enabled tab", () => {
    render(<BasicTabs defaultValue="tab1" orientation="horizontal" />);
    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    tab1.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "End" });
    expect(screen.getByText("Panel 2")).toBeInTheDocument();
  });
});

// ─── Keyboard navigation (vertical) ──────────────────────────────────────────

describe("Tabs — keyboard (vertical)", () => {
  it("ArrowDown activates next tab", () => {
    render(<BasicTabs defaultValue="tab1" orientation="vertical" />);
    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    tab1.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowDown" });
    expect(screen.getByText("Panel 2")).toBeInTheDocument();
  });

  it("ArrowUp activates previous tab", () => {
    render(<BasicTabs defaultValue="tab2" orientation="vertical" />);
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });
    tab2.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowUp" });
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
  });

  it("ArrowRight also navigates in vertical mode (list may wrap into a row)", () => {
    render(<BasicTabs defaultValue="tab1" orientation="vertical" />);
    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    tab1.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(screen.getByText("Panel 2")).toBeInTheDocument();
  });

  it("ArrowDown does not navigate in horizontal mode", () => {
    render(<BasicTabs defaultValue="tab1" />);
    screen.getByRole("tab", { name: "Tab 1" }).focus();
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowDown" });
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
  });
});

// ─── Disabled tab skipped in keyboard nav ────────────────────────────────────

describe("Tabs — disabled tab skipped in keyboard nav", () => {
  it("ArrowRight from tab2 wraps to tab1 (tab3 is disabled)", () => {
    render(<BasicTabs defaultValue="tab2" orientation="horizontal" />);
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });
    tab2.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    // tab3 disabled → wraps to tab1
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
  });

  it("End skips disabled tab3 and lands on tab2", () => {
    render(<BasicTabs defaultValue="tab1" orientation="horizontal" />);
    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    tab1.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "End" });
    expect(screen.getByText("Panel 2")).toBeInTheDocument();
  });
});

// ─── Controlled / Uncontrolled ────────────────────────────────────────────────

describe("Tabs — controlled mode", () => {
  it("calls onValueChange when tab is clicked", () => {
    const onValueChange = vi.fn();
    render(
      <Tabs.Root value="tab1" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Item value="tab1">Tab 1</Tabs.Item>
          <Tabs.Item value="tab2">Tab 2</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="tab1">Panel 1</Tabs.Panel>
        <Tabs.Panel value="tab2">Panel 2</Tabs.Panel>
      </Tabs.Root>,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(onValueChange).toHaveBeenCalledWith("tab2");
  });

  it("does not change active panel in controlled mode without value update", () => {
    render(
      <Tabs.Root value="tab1">
        <Tabs.List>
          <Tabs.Item value="tab1">Tab 1</Tabs.Item>
          <Tabs.Item value="tab2">Tab 2</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="tab1">Panel 1</Tabs.Panel>
        <Tabs.Panel value="tab2">Panel 2</Tabs.Panel>
      </Tabs.Root>,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
    expect(screen.queryByText("Panel 2")).not.toBeInTheDocument();
  });
});

describe("Tabs — uncontrolled mode", () => {
  it("switches panel independently when defaultValue is set", () => {
    render(<BasicTabs defaultValue="tab1" />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(screen.getByText("Panel 2")).toBeInTheDocument();
  });
});

// ─── Two-line triggers ───────────────────────────────────────────────────────

describe("Tabs — two-line trigger", () => {
  it("names the tab by label + count and describes it by the description", () => {
    render(
      <Tabs.Root defaultValue="fleet">
        <Tabs.List>
          <Tabs.Item value="fleet">
            <Tabs.Label>В парке</Tabs.Label>
            <Tabs.Count color="blue">12</Tabs.Count>
            <Tabs.Description>
              <strong>3</strong> в подготовке
            </Tabs.Description>
          </Tabs.Item>
          <Tabs.Item value="archive">Архив</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="fleet">Fleet</Tabs.Panel>
      </Tabs.Root>,
    );
    const tab = screen.getByRole("tab", { name: "В парке 12" });
    expect(tab).toHaveAttribute("data-two-line", "true");
    expect(tab).toHaveAccessibleDescription("3 в подготовке");
    expect(screen.getByText("12")).toHaveAttribute("data-color", "blue");
    const plain = screen.getByRole("tab", { name: "Архив" });
    expect(plain).not.toHaveAttribute("data-two-line");
    expect(plain).not.toHaveAttribute("aria-describedby");
  });

  it("sets data-state on triggers", () => {
    render(<BasicTabs defaultValue="tab2" />);
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("data-state", "inactive");
  });
});

// ─── Indicator and structure ─────────────────────────────────────────────────

describe("Tabs — indicator", () => {
  it("renders one hidden bar indicator before the triggers in a horizontal list", () => {
    render(<BasicTabs />);
    const list = screen.getByRole("tablist");
    expect(list).toHaveAttribute("data-indicator", "bar");
    const indicator = list.firstElementChild;
    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(list.querySelectorAll('[aria-hidden="true"][data-visible]')).toHaveLength(1);
  });

  it("scrolls horizontally with an edge fade and a hidden scrollbar", () => {
    render(<BasicTabs />);
    expect(screen.getByRole("tablist")).toHaveAttribute("data-fade", "horizontal");
  });

  it("moves the indicator to the selected tab without re-rendering the items", () => {
    let commits = 0;
    const offsets = { tab1: 0, tab2: 80 };
    vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return offsets[this.dataset.value as keyof typeof offsets] ?? 0;
    });
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(60);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(32);
    render(
      <React.Profiler
        id="tabs"
        onRender={() => {
          commits += 1;
        }}
      >
        <Tabs.Root defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">tab1</Tabs.Item>
            <Tabs.Item value="tab2">tab2</Tabs.Item>
          </Tabs.List>
        </Tabs.Root>
      </React.Profiler>,
    );
    const indicator = screen.getByRole("tablist").firstElementChild as HTMLElement;
    expect(indicator).toHaveAttribute("data-visible", "true");
    expect(indicator.style.transform).toBe("translateX(0px)");
    commits = 0;
    fireEvent.click(screen.getByRole("tab", { name: "tab2" }));
    expect(indicator.style.transform).toBe("translateX(80px)");
    // One commit for the selection; measuring the indicator adds none.
    expect(commits).toBe(1);
    vi.restoreAllMocks();
  });

  it("scrolls only the list to the selected tab, never the page", () => {
    const scrollIntoView = vi.fn();
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.value === "tab3" ? 300 : 0;
    });
    try {
      render(
        <Tabs.Root defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">Tab 1</Tabs.Item>
            <Tabs.Item value="tab3">Tab 3</Tabs.Item>
          </Tabs.List>
        </Tabs.Root>,
      );
      fireEvent.click(screen.getByRole("tab", { name: "Tab 3" }));
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 200, behavior: "auto" });
      expect(scrollIntoView).not.toHaveBeenCalled();
    } finally {
      Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
      Reflect.deleteProperty(HTMLElement.prototype, "scrollTo");
      vi.restoreAllMocks();
    }
  });

  it("uses a pill indicator in a vertical list", () => {
    render(<BasicTabs orientation="vertical" />);
    expect(screen.getByRole("tablist")).toHaveAttribute("data-indicator", "pill");
  });
});

describe("Tabs — single structural style", () => {
  it("has no variant: no data-variant on the root", () => {
    const { container } = render(<BasicTabs />);
    expect(container.querySelector("[data-variant]")).toBeNull();
  });

  it("rejects the removed segmented variant at the type level", () => {
    render(
      // @ts-expect-error — Tabs has no `variant`; use SegmentedControl to choose a value.
      <Tabs.Root defaultValue="a" variant="segmented">
        <Tabs.List>
          <Tabs.Item value="a">A</Tabs.Item>
        </Tabs.List>
      </Tabs.Root>,
    );
    expect(screen.getByRole("tab", { name: "A" })).toBeInTheDocument();
  });

  it("wraps plain text in a label without duplicating the accessible name", () => {
    render(<BasicTabs />);
    const tab = screen.getByRole("tab", { name: "Tab 1" });
    expect(tab.querySelector("[data-text]")).toHaveAttribute("data-text", "Tab 1");
  });
});
