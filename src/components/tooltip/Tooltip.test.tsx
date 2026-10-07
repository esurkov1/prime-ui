import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { computeTooltipPosition, Tooltip, type TooltipPlacementInput } from "./Tooltip";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicTooltip({
  open,
  defaultOpen,
  onOpenChange,
  side = "top",
  align,
  size = "m",
  delayDuration,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (v: boolean) => void;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  size?: "s" | "m" | "l" | "xl";
  delayDuration?: number;
}) {
  return (
    <Tooltip.Provider delayDuration={delayDuration}>
      <Tooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <Tooltip.Trigger>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content side={side} align={align} size={size}>
          Tooltip text
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

const trigger = (name = "Trigger") => screen.getByRole("button", { name });

async function hover(el: HTMLElement) {
  await act(async () => {
    fireEvent.pointerEnter(el);
    vi.runOnlyPendingTimers();
  });
}

async function unhover(el: HTMLElement) {
  await act(async () => {
    fireEvent.pointerLeave(el);
    vi.runOnlyPendingTimers();
  });
}

function stubMatchMedia(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: reduced && query.includes("reduce"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

// ─── Behaviour ────────────────────────────────────────────────────────────────

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubMatchMedia(true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("Content forwards ref and native attributes to the chip", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content ref={ref} className="extra" data-testid="chip">
          Tooltip text
        </Tooltip.Content>
      </Tooltip.Root>,
    );
    const chip = screen.getByRole("tooltip");
    expect(ref.current).toBe(chip);
    expect(chip).toHaveClass("extra");
    expect(chip).toHaveAttribute("data-testid", "chip");
  });

  it("is hidden by default", () => {
    render(<BasicTooltip />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens after the hover delay", async () => {
    render(<BasicTooltip delayDuration={400} />);
    fireEvent.pointerEnter(trigger());
    await act(async () => {
      vi.advanceTimersByTime(399);
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text");
  });

  it("cancels a pending open when the pointer leaves first", async () => {
    render(<BasicTooltip delayDuration={500} />);
    fireEvent.pointerEnter(trigger());
    fireEvent.pointerLeave(trigger());
    await act(async () => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes shortly after the pointer leaves the trigger", async () => {
    render(<BasicTooltip delayDuration={0} />);
    await hover(trigger());
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await unhover(trigger());
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("stays open while the pointer moves onto the chip (WCAG 1.4.13 hoverable)", async () => {
    render(<BasicTooltip delayDuration={0} />);
    await hover(trigger());
    fireEvent.pointerLeave(trigger());
    fireEvent.pointerEnter(screen.getByRole("tooltip"));
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await unhover(screen.getByRole("tooltip"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("ignores touch hover; focus still opens it", async () => {
    render(<BasicTooltip delayDuration={0} />);
    await act(async () => {
      fireEvent.pointerEnter(trigger(), { pointerType: "touch" });
      vi.runOnlyPendingTimers();
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.focus(trigger());
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("opens on focus and closes on blur", async () => {
    render(<BasicTooltip delayDuration={0} />);
    await act(async () => {
      fireEvent.focus(trigger());
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.blur(trigger());
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("hides on press and does not reopen from the focus the press causes", async () => {
    render(<BasicTooltip delayDuration={0} />);
    await hover(trigger());
    await act(async () => {
      fireEvent.pointerDown(trigger());
      fireEvent.focus(trigger());
      vi.runOnlyPendingTimers();
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("Escape closes it and keeps focus on the trigger", () => {
    const onOpenChange = vi.fn();
    render(<BasicTooltip defaultOpen onOpenChange={onOpenChange} />);
    trigger().focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(trigger()).toHaveFocus();
  });

  it("keeps the child's own ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Tooltip.Root>
        <Tooltip.Trigger>
          <button ref={ref} type="button">
            Own ref
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content>Hint</Tooltip.Content>
      </Tooltip.Root>,
    );
    expect(ref.current).toBe(trigger("Own ref"));
  });

  describe("controlled", () => {
    it("follows open", () => {
      const { rerender } = render(<BasicTooltip open />);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      rerender(<BasicTooltip open={false} />);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("reports hover through onOpenChange", async () => {
      const onOpenChange = vi.fn();
      render(<BasicTooltip open={false} onOpenChange={onOpenChange} delayDuration={0} />);
      await hover(trigger());
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("group (Provider)", () => {
    function Toolbar() {
      return (
        <Tooltip.Provider delayDuration={400} skipDelayDuration={300}>
          {["A", "B"].map((name) => (
            <Tooltip.Root key={name}>
              <Tooltip.Trigger>
                <button type="button">{name}</button>
              </Tooltip.Trigger>
              <Tooltip.Content>Hint {name}</Tooltip.Content>
            </Tooltip.Root>
          ))}
        </Tooltip.Provider>
      );
    }

    it("after one tooltip, the neighbour opens at once, without motion, and replaces it", async () => {
      render(<Toolbar />);
      fireEvent.pointerEnter(trigger("A"));
      await act(async () => {
        vi.advanceTimersByTime(400);
      });
      expect(screen.getByRole("tooltip")).toHaveTextContent("Hint A");
      expect(screen.getByRole("tooltip")).not.toHaveAttribute("data-instant");

      await act(async () => {
        fireEvent.pointerLeave(trigger("A"));
        fireEvent.pointerEnter(trigger("B"));
      });
      const tips = screen.getAllByRole("tooltip");
      expect(tips).toHaveLength(1);
      expect(tips[0]).toHaveTextContent("Hint B");
      expect(tips[0]).toHaveAttribute("data-instant", "true");
    });

    it("the warm window ends after skipDelayDuration", async () => {
      render(<Toolbar />);
      fireEvent.pointerEnter(trigger("A"));
      await act(async () => {
        vi.advanceTimersByTime(400);
      });
      await unhover(trigger("A"));
      await act(async () => {
        vi.advanceTimersByTime(400);
      });
      fireEvent.pointerEnter(trigger("B"));
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("DOM and ARIA", () => {
    it("role, aria-describedby only while open, data attributes", async () => {
      // jsdom puts the trigger at (0, 0): "bottom" fits there, "left" would flip.
      render(<BasicTooltip side="bottom" align="start" size="l" delayDuration={0} />);
      expect(trigger()).not.toHaveAttribute("aria-describedby");
      expect(trigger()).toHaveAttribute("data-state", "closed");

      await hover(trigger());
      const tip = screen.getByRole("tooltip");
      expect(trigger()).toHaveAttribute("aria-describedby", tip.id);
      expect(trigger()).toHaveAttribute("data-state", "open");
      expect(tip).toHaveAttribute("data-size", "l");
      expect(tip).toHaveAttribute("data-side", "bottom");
      expect(tip).toHaveAttribute("data-align", "start");
    });

    it("renders a decorative arrow", async () => {
      render(<BasicTooltip defaultOpen />);
      const arrow = screen.getByRole("tooltip").querySelector("svg");
      expect(arrow).toHaveAttribute("aria-hidden", "true");
    });
  });
});

describe("Tooltip — overlay contract", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubMatchMedia(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("closing plays the exit (data-state=closed) and unmounts after it", async () => {
    render(<BasicTooltip delayDuration={0} />);
    await hover(trigger());
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-state", "open");

    await act(async () => {
      fireEvent.blur(trigger());
    });
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-state", "closed");
    fireEvent.animationEnd(screen.getByRole("tooltip"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});

// ─── Placement ────────────────────────────────────────────────────────────────

describe("computeTooltipPosition", () => {
  const opts: TooltipPlacementInput = {
    side: "top",
    align: "center",
    offset: 8,
    pad: 8,
    arrowInset: 11,
  };
  const anchor = { top: 300, bottom: 332, left: 200, right: 232, width: 32, height: 32 };

  it("centres above the trigger with the arrow at the trigger's centre", () => {
    const p = computeTooltipPosition(anchor, 100, 24, 800, 600, opts);
    expect(p).toEqual({ side: "top", top: 268, left: 166, arrow: 50 });
  });

  it("flips to the opposite side when there is no room", () => {
    const top = { ...anchor, top: 4, bottom: 36 };
    const p = computeTooltipPosition(top, 100, 24, 800, 600, opts);
    expect(p.side).toBe("bottom");
    expect(p.top).toBe(44);
  });

  it("shifts inside the viewport and keeps the arrow on the trigger", () => {
    const edge = { ...anchor, left: 0, right: 32 };
    const p = computeTooltipPosition(edge, 100, 24, 800, 600, opts);
    expect(p.left).toBe(8);
    expect(p.arrow).toBe(11);
  });

  it("aligns to the trigger's start and end", () => {
    expect(
      computeTooltipPosition(anchor, 100, 24, 800, 600, { ...opts, align: "start" }).left,
    ).toBe(200);
    expect(computeTooltipPosition(anchor, 100, 24, 800, 600, { ...opts, align: "end" }).left).toBe(
      132,
    );
  });

  it("places left / right along the vertical axis", () => {
    const p = computeTooltipPosition(anchor, 100, 24, 800, 600, { ...opts, side: "right" });
    expect(p).toEqual({ side: "right", top: 304, left: 240, arrow: 12 });
  });
});
