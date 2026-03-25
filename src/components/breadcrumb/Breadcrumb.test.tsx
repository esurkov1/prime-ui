import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders nav with list", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
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

  it("renders Separator with chevron by default", () => {
    const { container } = render(
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/a">A</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item href="/b">B</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    const sep = container.querySelector('li[aria-hidden="true"]');
    expect(sep).toBeTruthy();
    expect(sep?.querySelector("svg")).toBeInTheDocument();
  });

  it("Separator accepts custom children", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Separator>{">"}</Breadcrumb.Separator>
      </Breadcrumb.Root>,
    );
    expect(screen.getByText(">")).toBeInTheDocument();
  });

  it("renders Ellipsis", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Ellipsis />
      </Breadcrumb.Root>,
    );
    expect(screen.getByText("…")).toBeInTheDocument();
  });

  it("merges className on Root", () => {
    render(
      <Breadcrumb.Root className="crumbs">
        <Breadcrumb.Item href="/">H</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveClass("crumbs");
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
});
