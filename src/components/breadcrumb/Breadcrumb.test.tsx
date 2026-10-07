import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

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

  it("draws a hidden chevron between levels, none before the first", () => {
    const { container } = render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/a">A</Breadcrumb.Item>
        <Breadcrumb.Item current>B</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    const items = container.querySelectorAll("li");
    expect(items).toHaveLength(3);
    expect(items[0]).not.toHaveAttribute("aria-hidden");
    expect(items[1]).toHaveAttribute("aria-hidden", "true");
    expect(items[1].querySelector("svg")).toBeInTheDocument();
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
    expect(container.querySelectorAll("li")).toHaveLength(7);
    expect(screen.getByRole("link", { name: "A" })).toBeInTheDocument();
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
    await user.tab();
    expect(screen.getByRole("link", { name: "Orders" })).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });
});
