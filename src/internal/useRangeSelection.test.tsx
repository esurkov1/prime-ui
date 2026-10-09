import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { useRangeSelection } from "./useRangeSelection";

const KEYS = ["a", "b", "c", "d"];

function List({ touch = false }: { touch?: boolean }) {
  const [selected, setSelected] = React.useState<ReadonlySet<string>>(new Set());
  const current = React.useRef(selected);
  current.current = selected;
  const ref = React.useRef<HTMLDivElement>(null);
  const { handlers } = useRangeSelection<string>({
    keys: KEYS,
    isSelected: (key) => current.current.has(key),
    apply: (keys, value) => {
      const next = new Set(current.current);
      for (const key of keys) {
        if (value) next.add(key);
        else next.delete(key);
      }
      current.current = next;
      setSelected(next);
    },
    containerRef: ref,
    hit: (element) => {
      const item = element.closest<HTMLElement>("[data-index]");
      return item ? Number(item.dataset.index) : null;
    },
    touch,
  });
  return (
    <div ref={ref}>
      {KEYS.map((key, index) => (
        <button
          type="button"
          key={key}
          data-index={index}
          aria-pressed={selected.has(key)}
          onPointerDown={(event) => handlers.onPointerDown(index, event)}
          onClick={(event) => handlers.onClick(index, event)}
        >
          {key}
        </button>
      ))}
    </div>
  );
}

const selectedNames = () =>
  screen
    .getAllByRole("button")
    .filter((item) => item.getAttribute("aria-pressed") === "true")
    .map((item) => item.textContent);

describe("useRangeSelection", () => {
  it("toggles on click and selects the Shift range from the anchor", () => {
    render(<List />);
    fireEvent.click(screen.getByText("a"), { detail: 1 });
    fireEvent.click(screen.getByText("c"), { detail: 1, shiftKey: true });
    expect(selectedNames()).toEqual(["a", "b", "c"]);
    fireEvent.click(screen.getByText("b"), { detail: 1 });
    expect(selectedNames()).toEqual(["a", "c"]);
  });

  it.each([
    ["mouse", false],
    ["touch", true],
  ])("paints a %s drag with the first item's new state, and the ending click is no toggle", (pointerType, touch) => {
    render(<List touch={touch} />);
    const original = document.elementFromPoint;
    document.elementFromPoint = () => screen.getByText("c");
    try {
      fireEvent.pointerDown(screen.getByText("a"), { pointerType, button: 0 });
      act(() => {
        window.dispatchEvent(new MouseEvent("pointermove", { clientX: 1, clientY: 1 }));
      });
      act(() => {
        window.dispatchEvent(new MouseEvent("pointerup"));
      });
      fireEvent.click(screen.getByText("c"), { detail: 1 });
      expect(selectedNames()).toEqual(["a", "b", "c"]);
    } finally {
      document.elementFromPoint = original;
    }
  });

  it("leaves a finger to scroll unless touch is on", () => {
    render(<List />);
    const original = document.elementFromPoint;
    document.elementFromPoint = () => screen.getByText("c");
    try {
      fireEvent.pointerDown(screen.getByText("a"), { pointerType: "touch", button: 0 });
      act(() => {
        window.dispatchEvent(new MouseEvent("pointermove", { clientX: 1, clientY: 1 }));
      });
      expect(selectedNames()).toEqual([]);
    } finally {
      document.elementFromPoint = original;
    }
  });
});
