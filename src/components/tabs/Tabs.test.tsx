import { fireEvent, render, screen } from "@testing-library/react";
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
        <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
        <Tabs.Tab value="tab3" disabled>
          Tab 3
        </Tabs.Tab>
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
          <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
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
          <Tabs.Tab value="a">
            <Tabs.Label>Hello</Tabs.Label>
          </Tabs.Tab>
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
          <Tabs.Tab value="a">
            <Tabs.Icon>
              <span data-testid="icon-left" />
            </Tabs.Icon>
            Label
            <Tabs.Icon>
              <span data-testid="icon-right" />
            </Tabs.Icon>
          </Tabs.Tab>
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

  it("ArrowRight does not navigate in vertical mode", () => {
    render(<BasicTabs defaultValue="tab1" orientation="vertical" />);
    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    tab1.focus();

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
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
          <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
          <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
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
          <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
          <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
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
