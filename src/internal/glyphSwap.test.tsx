import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Icon } from "@/icons";

import { cssRule } from "@/test/css";
import { withMotion } from "@/test/motion";

import { GlyphSwap } from "./glyphSwap";

const layers = (container: HTMLElement) =>
  Array.from(container.firstElementChild?.children ?? []) as HTMLElement[];

describe("GlyphSwap", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("knows a glyph by its type, its icon name and its key", () => {
    withMotion();
    const { container, rerender } = render(
      <GlyphSwap>
        <Icon name="action.close" />
      </GlyphSwap>,
    );
    // The same icon with new props is the same glyph: it updates in place.
    rerender(
      <GlyphSwap>
        <Icon name="action.close" size="s" />
      </GlyphSwap>,
    );
    expect(layers(container)).toHaveLength(1);
    // Another key is another glyph.
    rerender(
      <GlyphSwap>
        <Icon key="next" name="action.close" />
      </GlyphSwap>,
    );
    expect(layers(container)).toHaveLength(2);
  });

  it("sizes its box by the glyph, never by the host", () => {
    // A host that is a flex item of a row (Composer's recording dot) would take the row's width.
    const props = cssRule("src/internal/glyphSwap.module.css", ".swap").decls.map((d) => d.prop);
    for (const prop of ["width", "height", "inline-size", "block-size", "flex", "flex-grow"]) {
      expect(props).not.toContain(prop);
    }
  });

  it("renders no layer for nothing", () => {
    const { container } = render(<GlyphSwap>{null}</GlyphSwap>);
    expect(layers(container)).toHaveLength(0);
  });

  it("cross-fades a new glyph: the old one leaves hidden, the new one enters and gestures", () => {
    // Tests run with reduced motion (`src/test/setup.ts`); this one moves.
    withMotion();
    vi.useFakeTimers();
    const { container, rerender } = render(
      <GlyphSwap>
        <Icon name="action.close" />
      </GlyphSwap>,
    );
    expect(layers(container)).toHaveLength(1);
    expect(layers(container)[0]).not.toHaveAttribute("data-entering");
    rerender(
      <GlyphSwap>
        <Icon name="action.download" />
      </GlyphSwap>,
    );
    const [leaving, entering] = layers(container);
    expect(leaving).toHaveAttribute("data-leaving");
    expect(leaving).toHaveAttribute("aria-hidden", "true");
    expect(entering).toHaveAttribute("data-entering");
    expect(entering.querySelector("svg")).toHaveAttribute("data-play");
    act(() => vi.runAllTimers());
    expect(layers(container)).toHaveLength(1);
  });

  it("changes text in place: a ticking percent never cross-fades", () => {
    const { container, rerender } = render(<GlyphSwap>45%</GlyphSwap>);
    rerender(<GlyphSwap>46%</GlyphSwap>);
    expect(layers(container)).toHaveLength(1);
    expect(container).toHaveTextContent("46%");
  });

  it("reduced motion (the test default): swaps at once, no gesture", () => {
    const { container, rerender } = render(
      <GlyphSwap>
        <Icon name="action.play" />
      </GlyphSwap>,
    );
    rerender(
      <GlyphSwap>
        <Icon name="action.pause" />
      </GlyphSwap>,
    );
    expect(layers(container)).toHaveLength(1);
    expect(layers(container)[0].querySelector("svg")).not.toHaveAttribute("data-play");
  });
});
