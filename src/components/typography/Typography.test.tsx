import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Typography } from "./Typography";

describe("Typography", () => {
  it("renders paragraph with size data attribute", () => {
    render(<Typography.Root size="5xl">Fox</Typography.Root>);

    const el = screen.getByText("Fox");
    expect(el.tagName).toBe("P");
    expect(el).toHaveAttribute("data-size", "5xl");
  });

  it("sets weight and tracking when not default", () => {
    render(
      <Typography.Root size="s" weight="semibold" tracking="tight">
        Text
      </Typography.Root>,
    );

    const el = screen.getByText("Text");
    expect(el).toHaveAttribute("data-weight", "semibold");
    expect(el).toHaveAttribute("data-tracking", "tight");
  });

  it("omits data-weight and data-tracking for defaults", () => {
    render(<Typography.Root size="m">Body</Typography.Root>);

    const el = screen.getByText("Body");
    expect(el).not.toHaveAttribute("data-weight");
    expect(el).not.toHaveAttribute("data-tracking");
  });

  it("sets data-italic when italic", () => {
    render(
      <Typography.Root size="s" weight="medium" italic>
        Slant
      </Typography.Root>,
    );

    expect(screen.getByText("Slant")).toHaveAttribute("data-italic", "true");
  });

  it("renders as span and sets muted tone", () => {
    render(
      <Typography.Root as="span" size="xs" tone="muted">
        Label
      </Typography.Root>,
    );

    const el = screen.getByText("Label");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("data-tone", "muted");
  });
});
