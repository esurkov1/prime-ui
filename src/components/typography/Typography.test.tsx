import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Typography } from "./Typography";

describe("Typography", () => {
  it("renders paragraph with variant data attribute", () => {
    render(<Typography.Root variant="heading-l">Fox</Typography.Root>);

    const el = screen.getByText("Fox");
    expect(el.tagName).toBe("P");
    expect(el).toHaveAttribute("data-variant", "heading-l");
  });

  it("sets weight and tracking when not default", () => {
    render(
      <Typography.Root variant="body-s" weight="semibold" tracking="tight">
        Text
      </Typography.Root>,
    );

    const el = screen.getByText("Text");
    expect(el).toHaveAttribute("data-weight", "semibold");
    expect(el).toHaveAttribute("data-tracking", "tight");
  });

  it("omits data-weight and data-tracking for defaults", () => {
    render(<Typography.Root variant="body-m">Body</Typography.Root>);

    const el = screen.getByText("Body");
    expect(el).not.toHaveAttribute("data-weight");
    expect(el).not.toHaveAttribute("data-tracking");
  });

  it("sets data-italic when italic", () => {
    render(
      <Typography.Root variant="body-s" weight="medium" italic>
        Slant
      </Typography.Root>,
    );

    expect(screen.getByText("Slant")).toHaveAttribute("data-italic", "true");
  });

  it("renders as span and sets secondary tone", () => {
    render(
      <Typography.Root as="span" variant="body-s" tone="secondary">
        Label
      </Typography.Root>,
    );

    const el = screen.getByText("Label");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("data-tone", "secondary");
  });

  it.each([
    "caption",
    "body-s",
    "body-m",
    "body-l",
    "title-s",
    "title-m",
    "title-l",
    "heading-s",
    "heading-m",
    "heading-l",
    "display-s",
    "display-m",
    "display-l",
    "code",
  ] as const)("exposes role %s as data-variant", (variant) => {
    render(<Typography.Root variant={variant}>R</Typography.Root>);
    expect(screen.getByText("R")).toHaveAttribute("data-variant", variant);
  });

  it.each([
    "secondary",
    "muted",
    "accent",
    "success",
    "warning",
    "danger",
  ] as const)("sets data-tone=%s", (tone) => {
    render(
      <Typography.Root variant="body-m" tone={tone}>
        T
      </Typography.Root>,
    );
    expect(screen.getByText("T")).toHaveAttribute("data-tone", tone);
  });

  it("does not set data-tone for the default tone", () => {
    render(<Typography.Root variant="body-m">D</Typography.Root>);
    expect(screen.getByText("D")).not.toHaveAttribute("data-tone");
  });

  it("exposes an explicit weight override, including regular", () => {
    render(
      <Typography.Root variant="title-s" weight="regular">
        W
      </Typography.Root>,
    );
    expect(screen.getByText("W")).toHaveAttribute("data-weight", "regular");
  });

  it("sets data-truncate", () => {
    render(
      <Typography.Root variant="body-m" truncate>
        Long
      </Typography.Root>,
    );
    expect(screen.getByText("Long")).toHaveAttribute("data-truncate", "true");
  });
});
