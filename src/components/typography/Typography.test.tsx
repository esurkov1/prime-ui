import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Typography } from "./Typography";

describe("Typography", () => {
  it("renders paragraph with variant data attribute", () => {
    render(<Typography.Root variant="headline">Fox</Typography.Root>);

    const el = screen.getByText("Fox");
    expect(el.tagName).toBe("P");
    expect(el).toHaveAttribute("data-variant", "headline");
  });

  it("sets weight and tracking when not default", () => {
    render(
      <Typography.Root variant="body-small" weight="semibold" tracking="tight">
        Text
      </Typography.Root>,
    );

    const el = screen.getByText("Text");
    expect(el).toHaveAttribute("data-weight", "semibold");
    expect(el).toHaveAttribute("data-tracking", "tight");
  });

  it("omits data-weight and data-tracking for defaults", () => {
    render(<Typography.Root variant="body-default">Body</Typography.Root>);

    const el = screen.getByText("Body");
    expect(el).not.toHaveAttribute("data-weight");
    expect(el).not.toHaveAttribute("data-tracking");
  });

  it("sets data-italic when italic", () => {
    render(
      <Typography.Root variant="body-small" weight="medium" italic>
        Slant
      </Typography.Root>,
    );

    expect(screen.getByText("Slant")).toHaveAttribute("data-italic", "true");
  });

  it("renders as span and sets muted tone", () => {
    render(
      <Typography.Root as="span" variant="body-compact" tone="muted">
        Label
      </Typography.Root>,
    );

    const el = screen.getByText("Label");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("data-tone", "muted");
  });
});
