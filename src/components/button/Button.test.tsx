import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";
import styles from "./Button.module.css";

describe("Button", () => {
  it("renders and handles click", () => {
    const onClick = vi.fn();
    render(<Button.Root onClick={onClick}>Save</Button.Root>);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("defaults to variant solid, tone accent, size m", () => {
    render(<Button.Root>Save</Button.Root>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-variant", "solid");
    expect(button).toHaveAttribute("data-tone", "accent");
    expect(button).toHaveAttribute("data-size", "m");
  });

  it("sets data-disabled when disabled", () => {
    render(<Button.Root disabled>Off</Button.Root>);
    expect(screen.getByRole("button", { name: "Off" })).toHaveAttribute("data-disabled", "true");
  });

  it("is disabled while loading", () => {
    render(<Button.Root loading>Submitting</Button.Root>);

    const button = screen.getByRole("button", { name: "Submitting" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-loading", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("supports explicit submit type", () => {
    render(<Button.Root type="submit">Submit form</Button.Root>);
    expect(screen.getByRole("button", { name: "Submit form" })).toHaveAttribute("type", "submit");
  });

  it("renders icon with aria-label when no visible label", () => {
    render(
      <Button.Root aria-label="Icon button">
        <Button.Icon>
          <span aria-hidden="true">x</span>
        </Button.Icon>
      </Button.Root>,
    );

    expect(screen.getByRole("button", { name: "Icon button" })).toBeInTheDocument();
  });

  it("sets data-full-width when fullWidth is true", () => {
    render(<Button.Root fullWidth>Wide</Button.Root>);

    expect(screen.getByRole("button", { name: "Wide" })).toHaveAttribute("data-full-width", "true");
  });

  it("renders the Spinner only while loading, hidden from screen readers", () => {
    const { rerender, container } = render(<Button.Root>Send</Button.Root>);
    expect(container.querySelector(`.${styles.spinner}`)).toBeNull();

    rerender(<Button.Root loading>Send</Button.Root>);
    expect(container.querySelector(`.${styles.spinner}`)).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("Button.Icon renders icon wrapper with aria-hidden", () => {
    const { container } = render(
      <Button.Root>
        <Button.Icon>→</Button.Icon>
        Send
      </Button.Root>,
    );
    const icon = container.querySelector(`.${styles.icon}`);
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Button asChild", () => {
  it("renders as <a> when child is an anchor", () => {
    render(
      <Button.Root asChild>
        <a href="/path">Go</a>
      </Button.Root>,
    );
    const link = screen.getByRole("link", { name: "Go" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/path");
  });

  it("merges Button className onto the child", () => {
    const { container } = render(
      <Button.Root asChild className="extra">
        <a href="/">Link</a>
      </Button.Root>,
    );
    const link = container.querySelector("a");
    expect(link).toHaveClass(styles.root);
    expect(link).toHaveClass("extra");
  });

  it("forwards data-variant, data-tone, data-size to the child", () => {
    render(
      <Button.Root variant="outline" tone="danger" asChild size="l">
        <a href="/">Link</a>
      </Button.Root>,
    );
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("data-variant", "outline");
    expect(link).toHaveAttribute("data-tone", "danger");
    expect(link).toHaveAttribute("data-size", "l");
  });

  it("sets aria-disabled (not disabled attr) when disabled", () => {
    render(
      <Button.Root asChild disabled>
        <a href="/">Disabled</a>
      </Button.Root>,
    );
    const link = screen.getByRole("link", { name: "Disabled" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("disabled");
  });

  it("prevents navigation click when disabled", () => {
    render(
      <Button.Root asChild disabled>
        <a href="/path">Disabled Link</a>
      </Button.Root>,
    );
    const prevented = !fireEvent.click(screen.getByRole("link", { name: "Disabled Link" }));
    expect(prevented).toBe(true);
  });

  it("does not call user onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button.Root asChild disabled onClick={onClick}>
        <a href="/">Disabled</a>
      </Button.Root>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls user onClick when not disabled", () => {
    const onClick = vi.fn();
    render(
      <Button.Root asChild onClick={onClick}>
        <a href="/">Link</a>
      </Button.Root>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Link" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sets aria-disabled + aria-busy when loading", () => {
    render(
      <Button.Root asChild loading>
        <a href="/">Loading</a>
      </Button.Root>,
    );
    const link = screen.getByRole("link", { name: "Loading" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link).toHaveAttribute("data-loading", "true");
  });

  it("does not forward type attribute to child", () => {
    render(
      <Button.Root asChild type="submit">
        <a href="/">Link</a>
      </Button.Root>,
    );
    expect(screen.getByRole("link", { name: "Link" })).not.toHaveAttribute("type");
  });

  describe("Button layout", () => {
    it("marks icon-only, leading and trailing icon layouts", () => {
      render(
        <>
          <Button.Root aria-label="Only">
            <Button.Icon>x</Button.Icon>
          </Button.Root>
          <Button.Root>
            <Button.Icon>x</Button.Icon>
            Lead
          </Button.Root>
          <Button.Root>
            Trail
            <Button.Icon>x</Button.Icon>
          </Button.Root>
        </>,
      );
      expect(screen.getByRole("button", { name: "Only" })).toHaveAttribute(
        "data-icon-only",
        "true",
      );
      const lead = screen.getByRole("button", { name: "Lead" });
      expect(lead).toHaveAttribute("data-leading-icon", "true");
      expect(lead).not.toHaveAttribute("data-trailing-icon");
      const trail = screen.getByRole("button", { name: "Trail" });
      expect(trail).toHaveAttribute("data-trailing-icon", "true");
      expect(trail).not.toHaveAttribute("data-icon-only");
    });

    it("renders the spinner over the label when loading without a leading icon", () => {
      const { container } = render(<Button.Root loading>Save</Button.Root>);
      const button = screen.getByRole("button", { name: "Save" });
      expect(container.querySelectorAll(`.${styles.spinner}`)).toHaveLength(1);
      expect(button).toHaveAttribute("data-loading-overlay", "true");
    });

    it("puts the automatic spinner in place of a leading icon", () => {
      const { container } = render(
        <Button.Root loading>
          <Button.Icon>x</Button.Icon>
          Save
        </Button.Root>,
      );
      expect(container.querySelectorAll(`.${styles.spinner}`)).toHaveLength(1);
      expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute(
        "data-loading-overlay",
      );
    });

    it("accepts size xs", () => {
      render(<Button.Root size="xs">Tiny</Button.Root>);
      expect(screen.getByRole("button", { name: "Tiny" })).toHaveAttribute("data-size", "xs");
    });
  });
});
