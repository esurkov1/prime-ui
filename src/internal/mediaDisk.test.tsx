import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { MediaPlayMark } from "./mediaDisk";

const CSS = "src/internal/mediaDisk.module.css";

describe("MediaPlayMark", () => {
  it("is a decorative disk of the control `l` tier with the play glyph", () => {
    const { container } = render(<MediaPlayMark />);
    const mark = container.firstElementChild as HTMLElement;
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark).toHaveAttribute("data-size", "l");
    expect(mark).toHaveAttribute("data-shown", "true");
    expect(mark.querySelector("svg")).not.toBeNull();
    expect(cssValue(cssRule(CSS, ".disk"), "inline-size")).toBe("var(--field-h)");
  });

  it("stays mounted while hidden: `shown={false}` fades and shrinks it away", () => {
    const { container, rerender } = render(<MediaPlayMark />);
    const mark = container.firstElementChild;
    rerender(<MediaPlayMark shown={false} />);
    expect(container.firstElementChild).toBe(mark);
    expect(mark).toHaveAttribute("data-shown", "false");
    const hidden = cssRule(CSS, '.disk[data-shown="false"]');
    expect(cssValue(hidden, "opacity")).toBe("0");
    expect(cssValue(hidden, "scale")).toBe("var(--prime-motion-scale-mark)");
  });
});
