import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePresence } from "./usePresence";

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: reduce && query.includes("prefers-reduced-motion: reduce"),
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

function Layer({ open }: { open: boolean }) {
  const presence = usePresence(open, { exitDuration: "base" });
  if (!presence.mounted) return null;
  return (
    <div data-testid="layer" data-state={presence.state} onAnimationEnd={presence.onExitEnd}>
      <span data-testid="child" />
    </div>
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("usePresence", () => {
  describe("with motion", () => {
    beforeEach(() => stubReducedMotion(false));

    it("mounts open, keeps the layer with data-state=closed until animationend", () => {
      const { rerender } = render(<Layer open={false} />);
      expect(screen.queryByTestId("layer")).toBeNull();

      rerender(<Layer open />);
      expect(screen.getByTestId("layer")).toHaveAttribute("data-state", "open");

      // The enter animation ending must not unmount an open layer.
      fireEvent.animationEnd(screen.getByTestId("layer"));
      expect(screen.getByTestId("layer")).toBeInTheDocument();

      rerender(<Layer open={false} />);
      expect(screen.getByTestId("layer")).toHaveAttribute("data-state", "closed");

      // A descendant's animation bubbling up is ignored.
      fireEvent.animationEnd(screen.getByTestId("child"));
      expect(screen.getByTestId("layer")).toBeInTheDocument();

      fireEvent.animationEnd(screen.getByTestId("layer"));
      expect(screen.queryByTestId("layer")).toBeNull();
    });

    it("unmounts after the token-duration timeout when no animationend arrives", () => {
      vi.useFakeTimers();
      const { rerender } = render(<Layer open />);
      rerender(<Layer open={false} />);
      expect(screen.getByTestId("layer")).toHaveAttribute("data-state", "closed");

      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.getByTestId("layer")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(screen.queryByTestId("layer")).toBeNull();
    });

    it("reopening during the exit keeps the layer and switches back to open", () => {
      vi.useFakeTimers();
      const { rerender } = render(<Layer open />);
      rerender(<Layer open={false} />);
      rerender(<Layer open />);
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId("layer")).toHaveAttribute("data-state", "open");
    });
  });

  describe("with prefers-reduced-motion: reduce", () => {
    beforeEach(() => stubReducedMotion(true));

    it("unmounts immediately on close", () => {
      const { rerender } = render(<Layer open />);
      expect(screen.getByTestId("layer")).toBeInTheDocument();
      rerender(<Layer open={false} />);
      expect(screen.queryByTestId("layer")).toBeNull();
    });
  });
});
