import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cssRule, cssValue } from "@/test/css";

import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders nav with list", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Навигационная цепочка" })).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("Item with href renders a link", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  });

  it("Item with href passes aria-label for icon-only links", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/" aria-label="Home">
          <span data-testid="glyph" />
        </Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  });

  it("Item with current renders span with aria-current", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item current>Here</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    const span = screen.getByText("Here");
    expect(span.tagName).toBe("SPAN");
    expect(span).toHaveAttribute("aria-current", "page");
  });

  it("draws the chevrons inside the levels: every list item is a level", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/a">A</Breadcrumb.Item>
        <Breadcrumb.Item current>B</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    for (const item of items) expect(item).not.toHaveAttribute("aria-hidden");
    // The chevron is decorative, inside the level it leads to; the first level has none.
    expect(items[0].querySelector('[aria-hidden="true"] svg')).toBeNull();
    expect(items[1].querySelector('[aria-hidden="true"] svg')).toBeInTheDocument();
  });

  it("a kept level gets its chevron when a level is inserted before it", () => {
    function Trail({ parent }: { parent?: string }) {
      return (
        <Breadcrumb.Root>
          {parent ? <Breadcrumb.Item>{parent}</Breadcrumb.Item> : null}
          <Breadcrumb.Item current>Color</Breadcrumb.Item>
        </Breadcrumb.Root>
      );
    }
    const { rerender } = render(<Trail />);
    const color = screen.getByText("Color").closest("li") as HTMLElement;
    expect(color.querySelector('[aria-hidden="true"] svg')).toBeNull();

    rerender(<Trail parent="Основа" />);
    const [first, second] = screen.getAllByRole("listitem");
    // The same element, now second: it shows the chevron.
    expect(second).toBe(color);
    expect(second.querySelector('[aria-hidden="true"] svg')).toBeInTheDocument();
    expect(first.querySelector('[aria-hidden="true"] svg')).toBeNull();
  });

  it("a current level with a link marks the link as the current page", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/orders" current>
          Orders
        </Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("renders Ellipsis", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Ellipsis />
      </Breadcrumb.Root>,
    );
    expect(screen.getByText("…")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Скрытые разделы")).toBeInTheDocument();
  });

  it("uses labels overrides", () => {
    render(
      <Breadcrumb.Root labels={{ nav: "Breadcrumbs", ellipsis: "More" }}>
        <Breadcrumb.Ellipsis />
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumbs" })).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("merges className on Root", () => {
    render(
      <Breadcrumb.Root className="crumbs">
        <Breadcrumb.Item href="/">H</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Навигационная цепочка" })).toHaveClass("crumbs");
  });

  it("sets data-size on Root and passes size to links", () => {
    render(
      <Breadcrumb.Root size="l" data-testid="bc-root">
        <Breadcrumb.Item href="/a">A</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    const nav = screen.getByTestId("bc-root");
    expect(nav).toHaveAttribute("data-size", "l");
    const link = screen.getByRole("link", { name: "A" });
    expect(link).toHaveAttribute("data-size", "l");
  });

  it("marks long paths as collapsible and inserts a hidden auto ellipsis", () => {
    const { container } = render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/a">A</Breadcrumb.Item>
        <Breadcrumb.Item current>Current</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    const nav = screen.getByRole("navigation", { name: "Навигационная цепочка" });
    expect(nav).toHaveAttribute("data-collapsible", "true");
    // Three levels and the auto «…», a menu button named after the skipped levels.
    expect(container.querySelectorAll("li")).toHaveLength(4);
    const more = screen.getByRole("button", { name: "Скрытые разделы" });
    expect(container.querySelectorAll("li")[1]).toContainElement(more);
    expect(more).toHaveAttribute("aria-haspopup", "menu");
    expect(screen.getByRole("link", { name: "A" })).toBeInTheDocument();
  });

  it("the «…» menu lists the hidden middle levels, links stay links", async () => {
    const user = userEvent.setup();
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/orders">Orders</Breadcrumb.Item>
        <Breadcrumb.Item>Archive</Breadcrumb.Item>
        <Breadcrumb.Item current>Order</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Скрытые разделы" }));
    const menu = screen.getByRole("menu");
    const items = within(menu).getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(["Orders", "Archive"]);
    expect(items[0]).toHaveAttribute("href", "/orders");
    expect(items[0]).toHaveFocus();
    expect(items[1]).toBeDisabled();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Скрытые разделы" })).toHaveFocus();
  });

  it("Enter on the focused «…» opens the menu; arrows move between the hidden levels", async () => {
    const user = userEvent.setup();
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/sales">Sales</Breadcrumb.Item>
        <Breadcrumb.Item href="/orders">Orders</Breadcrumb.Item>
        <Breadcrumb.Item current>Order</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    screen.getByRole("button", { name: "Скрытые разделы" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("menuitem", { name: "Sales" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Orders" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Sales" })).toHaveFocus();
  });

  it("CSS: collapsed middle levels are display: none (never focusable while invisible)", () => {
    const rule = cssRule(
      "src/components/breadcrumb/Breadcrumb.module.css",
      '.root[data-collapsible="true"] .item:nth-child(n + 3):not(:last-child)',
      ["@container (max-width: 30rem)"],
    );
    expect(cssValue(rule, "display")).toBe("none");
  });

  it("the separator takes the trail's placeholder colour, the links the muted tone", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item current>Order</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("data-tone", "muted");
    const separator = screen.getByText("Order").closest("li")?.querySelector("svg");
    expect(separator).not.toHaveAttribute("data-tone");
  });

  it("the root takes the host tier when it has no size", () => {
    render(
      <ControlSizeProvider value="s">
        <Breadcrumb.Root>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        </Breadcrumb.Root>
      </ControlSizeProvider>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute("data-size", "s");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("data-size", "s");
  });

  it("does not collapse short paths", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item current>Current</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Навигационная цепочка" })).toHaveAttribute(
      "data-collapsible",
      "false",
    );
  });

  it("Tab moves through the links and skips the current page", async () => {
    const user = userEvent.setup();
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/orders">Orders</Breadcrumb.Item>
        <Breadcrumb.Item current>Order</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    // The auto «…» (CSS shows it only in a narrow container; jsdom applies no stylesheet).
    await user.tab();
    expect(screen.getByRole("button", { name: "Скрытые разделы" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Orders" })).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });
});
