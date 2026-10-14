import { act, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { Disclosure, useDisclosure } from "./Disclosure";

const CSS = "src/internal/disclosure.module.css";

afterEach(() => {
  vi.useRealTimers();
});

/** Runs the frame after mount, where the transitions switch on. */
function nextFrame() {
  act(() => {
    vi.advanceTimersToNextFrame();
  });
}

describe("Disclosure", () => {
  it("keeps its content mounted and flips only its state", () => {
    const { rerender } = render(
      <Disclosure open={false} data-testid="slot">
        <p>Расшифровка</p>
      </Disclosure>,
    );
    const slot = screen.getByTestId("slot");
    const text = screen.getByText("Расшифровка");
    expect(slot).toHaveAttribute("data-state", "closed");
    rerender(
      <Disclosure open data-testid="slot">
        <p>Расшифровка</p>
      </Disclosure>,
    );
    expect(slot).toHaveAttribute("data-state", "open");
    expect(screen.getByText("Расшифровка")).toBe(text);
    rerender(
      <Disclosure open={false} data-testid="slot">
        <p>Расшифровка</p>
      </Disclosure>,
    );
    // Closing keeps the node: it fades and folds with the height, then hides.
    expect(screen.getByText("Расшифровка")).toBe(text);
    expect(slot).toHaveAttribute("data-state", "closed");
  });

  it("stands still on mount: the transitions switch on a frame later", () => {
    vi.useFakeTimers();
    render(
      <Disclosure open data-testid="slot">
        <p>Группа</p>
      </Disclosure>,
    );
    const slot = screen.getByTestId("slot");
    // A state the host settles right after mounting does not play.
    expect(slot).toHaveAttribute("data-state", "open");
    expect(slot).not.toHaveAttribute("data-mounted");
    nextFrame();
    expect(slot).toHaveAttribute("data-mounted");
  });

  it("appear: an open one mounts closed and opens with the transitions on", () => {
    const states: string[] = [];
    function Probe() {
      const { root, clip } = useDisclosure({ open: true, appear: true });
      states.push(`${root["data-state"]}${root["data-mounted"] === "" ? "+mounted" : ""}`);
      return (
        <div {...root} data-testid="slot">
          <div {...clip}>Детали заказа</div>
        </div>
      );
    }
    render(<Probe />);
    expect(states[0]).toBe("closed");
    expect(states.at(-1)).toBe("open+mounted");
    expect(screen.getByTestId("slot")).toHaveAttribute("data-state", "open");
  });

  it("folds a host's own elements: a detail row's cell", () => {
    function DetailRow({ open }: { open: boolean }) {
      const { root, clip } = useDisclosure({ open });
      return (
        <table>
          <tbody>
            <tr>
              <td {...root} data-testid="cell">
                <div {...clip}>Состав заказа</div>
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
    const { rerender } = render(<DetailRow open={false} />);
    const cell = screen.getByTestId("cell");
    expect(cell).toHaveAttribute("data-state", "closed");
    expect(cell.firstElementChild).toHaveTextContent("Состав заказа");
    rerender(<DetailRow open />);
    expect(cell).toHaveAttribute("data-state", "open");
  });

  it("passes the consumer's ref and attributes to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Disclosure open ref={ref} id="transcript" className="host">
        Текст
      </Disclosure>,
    );
    expect(ref.current).toHaveAttribute("id", "transcript");
    expect(ref.current).toHaveClass("host");
  });

  describe("CSS", () => {
    it("opens and closes on one clock each, the fade with the fold; nothing moves before mount", () => {
      expect(cssRule(CSS, ".root").decls.some(({ prop }) => prop === "transition")).toBe(false);
      expect(cssValue(cssRule(CSS, ".root[data-mounted]"), "transition")).toMatch(
        /^grid-template-rows var\(--disclosure-close-clock\)/,
      );
      expect(
        cssValue(cssRule(CSS, '.root[data-mounted][data-state="open"]'), "transition"),
      ).toMatch(/^grid-template-rows var\(--disclosure-open-clock\)/);
      expect(cssValue(cssRule(CSS, ".root[data-mounted] > .clip > *"), "transition")).toBe(
        "opacity var(--disclosure-close-clock),\n    translate var(--disclosure-close-clock)",
      );
      expect(
        cssValue(cssRule(CSS, '.root[data-mounted][data-state="open"] > .clip > *'), "transition"),
      ).toBe("opacity var(--disclosure-open-clock),\n    translate var(--disclosure-open-clock)");
    });

    it("the close clock defaults to the open one", () => {
      const close = cssValue(cssRule(CSS, ".root"), "--disclosure-close-clock").replace(/\s+/g, "");
      expect(close).toBe(
        "var(--disclosure-close-duration,var(--disclosure-duration,var(--prime-motion-duration-base)))" +
          "var(--disclosure-close-ease,var(--disclosure-ease,var(--prime-motion-easing-standard)))",
      );
    });

    it("the clip keeps the focus space past its edge", () => {
      const clip = cssRule(CSS, ".clip");
      expect(cssValue(clip, "overflow")).toBe("clip");
      expect(cssValue(clip, "overflow-clip-margin")).toBe("var(--prime-focus-space)");
    });
  });
});
