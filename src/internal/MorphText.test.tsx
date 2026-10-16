import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { MorphText } from "./MorphText";

describe("MorphText", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("morphs only the changed part: the shared start and end stay still", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const { container, rerender } = render(<MorphText>{"Искать «фыв»"}</MorphText>);
    rerender(<MorphText>{"Искать «фывф»"}</MorphText>);
    const root = container.firstElementChild as HTMLElement;
    const [prefix, segment, suffix] = Array.from(root.children) as HTMLElement[];
    expect(prefix.textContent).toBe("Искать «фыв");
    expect(suffix.textContent).toBe("»");
    const layers = Array.from(segment.children).slice(1);
    expect(layers.map((layer) => layer.textContent)).toEqual(["", "ф"]);
    expect(root).toHaveTextContent("Искать «фывф»");
  });

  it("never paints a leaving word past its own box sideways", () => {
    const root = cssRule("src/internal/MorphText.module.css", ".root");
    expect(cssValue(root, "overflow-x")).toBe("clip");
  });
});
