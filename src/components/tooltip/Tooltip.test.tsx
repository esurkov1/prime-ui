import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Tooltip } from "./Tooltip";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicTooltip({
  open,
  defaultOpen,
  onOpenChange,
  side = "top",
  size = "m",
  delayDuration,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (v: boolean) => void;
  side?: "top" | "bottom" | "left" | "right";
  size?: "s" | "m" | "l" | "xl";
  delayDuration?: number;
}) {
  return (
    <Tooltip.Provider delayDuration={delayDuration}>
      <Tooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <Tooltip.Trigger>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content side={side} size={size}>
          Tooltip text
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is hidden by default", () => {
    render(<BasicTooltip />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens after hover delay (mouseenter)", async () => {
    render(<BasicTooltip delayDuration={400} />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text");
  });

  it("closes on mouseleave", async () => {
    render(<BasicTooltip delayDuration={0} />);

    await act(async () => {
      fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));
      vi.runAllTimers();
    });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens on focus", async () => {
    render(<BasicTooltip delayDuration={0} />);

    await act(async () => {
      fireEvent.focus(screen.getByRole("button", { name: "Trigger" }));
      vi.runAllTimers();
    });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("closes on blur", async () => {
    render(<BasicTooltip delayDuration={0} />);

    await act(async () => {
      fireEvent.focus(screen.getByRole("button", { name: "Trigger" }));
      vi.runAllTimers();
    });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.blur(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("does not open before delay elapses", async () => {
    render(<BasicTooltip delayDuration={500} />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("cancels pending open when mouseleave fires before delay", async () => {
    render(<BasicTooltip delayDuration={500} />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));
    fireEvent.mouseLeave(screen.getByRole("button", { name: "Trigger" }));

    await act(async () => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  describe("controlled mode", () => {
    it("shows when open=true", () => {
      render(<BasicTooltip open={true} />);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("hides when open=false", async () => {
      render(<BasicTooltip open={false} />);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("calls onOpenChange when trigger fires", async () => {
      const onOpenChange = vi.fn();
      render(<BasicTooltip open={false} onOpenChange={onOpenChange} delayDuration={0} />);

      await act(async () => {
        fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));
        vi.runAllTimers();
      });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("data attributes", () => {
    it("applies data-size to tooltip content", async () => {
      render(<BasicTooltip size="l" delayDuration={0} />);

      await act(async () => {
        fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));
        vi.runAllTimers();
      });

      expect(screen.getByRole("tooltip")).toHaveAttribute("data-size", "l");
    });

    it("applies data-side to tooltip content", async () => {
      render(<BasicTooltip side="left" delayDuration={0} />);

      await act(async () => {
        fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));
        vi.runAllTimers();
      });

      expect(screen.getByRole("tooltip")).toHaveAttribute("data-side", "left");
    });

    it("applies data-size s", async () => {
      render(<BasicTooltip size="s" delayDuration={0} />);

      await act(async () => {
        fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));
        vi.runAllTimers();
      });

      expect(screen.getByRole("tooltip")).toHaveAttribute("data-size", "s");
    });
  });

  describe("ARIA", () => {
    it("tooltip has role=tooltip", async () => {
      render(<BasicTooltip delayDuration={0} />);

      await act(async () => {
        fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));
        vi.runAllTimers();
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("trigger has aria-describedby pointing to tooltip id", async () => {
      render(<BasicTooltip delayDuration={0} />);

      await act(async () => {
        fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));
        vi.runAllTimers();
      });

      const trigger = screen.getByRole("button", { name: "Trigger" });
      const tooltip = screen.getByRole("tooltip");

      expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    });

    it("aria-describedby is set even when tooltip is closed", () => {
      render(<BasicTooltip />);
      const trigger = screen.getByRole("button", { name: "Trigger" });
      expect(trigger).toHaveAttribute("aria-describedby");
    });
  });

  describe("defaultOpen", () => {
    it("opens immediately when defaultOpen=true", () => {
      render(<BasicTooltip defaultOpen={true} />);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });
});
