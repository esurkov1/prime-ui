import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Icon } from "@/icons";

import { GlyphSwap, glyphKey } from "./glyphSwap";

const layers = (container: HTMLElement) =>
  Array.from(container.firstElementChild?.children ?? []) as HTMLElement[];

describe("GlyphSwap", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("knows a glyph by its type, its icon name and its key; text is one glyph", () => {
    expect(glyphKey(<Icon name="action.close" />)).not.toBe(glyphKey(<Icon name="action.play" />));
    expect(glyphKey(<Icon name="action.close" />)).toBe(glyphKey(<Icon name="action.close" />));
    expect(glyphKey("45%")).toBe(glyphKey(46));
    expect(glyphKey(null)).toBe("");
  });

  it("cross-fades a new glyph: the old one leaves hidden, the new one enters and gestures", () => {
    // Tests run with reduced motion (`src/test/setup.ts`); this one moves.
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }));
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
