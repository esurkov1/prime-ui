import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";

import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("is a decorative text line at tier m by default", () => {
    const { container } = render(<Skeleton />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveAttribute("data-shape", "text");
    expect(root).toHaveAttribute("data-size", "m");
    expect(root.children).toHaveLength(1);
  });

  it("renders the requested number of text lines", () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.firstElementChild?.children).toHaveLength(3);
  });

  it("renders no lines for the other shapes", () => {
    for (const shape of ["control", "circle", "block"] as const) {
      const { container, unmount } = render(<Skeleton shape={shape} lines={3} />);
      const root = container.firstElementChild as HTMLElement;
      expect(root).toHaveAttribute("data-shape", shape);
      expect(root.children).toHaveLength(0);
      unmount();
    }
  });

  it("takes the host tier without a size and an explicit size over it", () => {
    const { container } = render(
      <ControlSizeProvider value="l">
        <Skeleton data-testid="host" />
        <Skeleton size="xs" />
      </ControlSizeProvider>,
    );
    const [host, own] = Array.from(container.children);
    expect(host).toHaveAttribute("data-size", "l");
    expect(own).toHaveAttribute("data-size", "xs");
  });

  it("forwards ref, className and native attributes", () => {
    const ref = React.createRef<HTMLSpanElement>();
    const { container } = render(
      <Skeleton ref={ref} shape="block" className="cover" data-testid="cover" />,
    );
    const root = container.firstElementChild;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass("cover");
    expect(root).toHaveAttribute("data-testid", "cover");
  });
});
