import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { exitTimeoutMs } from "@/hooks/usePresence";
import swapMotion from "@/internal/swapMotion.module.css";

import { Crossfade } from "./Crossfade";

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

const layerOf = (text: string) => screen.getByText(text).parentElement as HTMLElement;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Crossfade", () => {
  beforeEach(() => stubReducedMotion(false));

  it("renders the content still on the first render", () => {
    const { container } = render(
      <Crossfade state="loading" aria-busy="true">
        <p>Загрузка</p>
      </Crossfade>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root.children).toHaveLength(1);
    expect(layerOf("Загрузка")).toHaveAttribute("data-state", "open");
    expect(layerOf("Загрузка")).not.toHaveClass(swapMotion.swapIn);
  });

  it("keeps the old state as a hidden fading layer and fades the new one in", () => {
    const { rerender } = render(
      <Crossfade state="loading">
        <p>Загрузка</p>
      </Crossfade>,
    );
    rerender(
      <Crossfade state="ready">
        <p>Данные</p>
      </Crossfade>,
    );

    const leaving = layerOf("Загрузка");
    expect(leaving).toHaveAttribute("data-state", "closed");
    expect(leaving).toHaveAttribute("aria-hidden", "true");
    expect(leaving).toHaveAttribute("inert");
    expect(leaving).toHaveClass(swapMotion.swapOut);
    expect(layerOf("Данные")).toHaveAttribute("data-state", "open");
    expect(layerOf("Данные")).toHaveClass(swapMotion.swapIn);

    // Only the layer's own animation removes it, not one bubbling from its content.
    fireEvent.animationEnd(screen.getByText("Загрузка"));
    expect(screen.getByText("Загрузка")).toBeInTheDocument();
    fireEvent.animationEnd(leaving);
    expect(screen.queryByText("Загрузка")).toBeNull();
  });

  it("updates the same state in place", () => {
    const { container, rerender } = render(
      <Crossfade state="ready">
        <p>3 платежа</p>
      </Crossfade>,
    );
    rerender(
      <Crossfade state="ready">
        <p>4 платежа</p>
      </Crossfade>,
    );
    expect((container.firstElementChild as HTMLElement).children).toHaveLength(1);
    expect(layerOf("4 платежа")).not.toHaveClass(swapMotion.swapIn);
  });

  it("does not remount the leaving content", () => {
    const mounts = vi.fn();
    function Panel({ label }: { label: string }) {
      React.useEffect(() => mounts(label), [label]);
      return <p>{label}</p>;
    }
    const { rerender } = render(
      <Crossfade state="error">
        <Panel label="Ошибка" />
      </Crossfade>,
    );
    rerender(
      <Crossfade state="ready">
        <Panel label="Данные" />
      </Crossfade>,
    );
    expect(mounts.mock.calls).toEqual([["Ошибка"], ["Данные"]]);
  });

  it("removes the leaving layer after the exit timeout when no animationend arrives", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Crossfade state="loading">
        <p>Загрузка</p>
      </Crossfade>,
    );
    rerender(
      <Crossfade state="empty">
        <p>Пусто</p>
      </Crossfade>,
    );
    expect(screen.getByText("Загрузка")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(exitTimeoutMs("fast"));
    });
    expect(screen.queryByText("Загрузка")).toBeNull();
  });

  it("glides from the height the region has when the state changes", () => {
    let height = 100;
    // «Пусто» is tall: the root measures 140 once it shows it.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const h = this.textContent?.includes("Пусто") ? 140 : height;
      return { height: h, width: 200, top: 0, left: 0, right: 200, bottom: h } as DOMRect;
    });
    const { container, rerender } = render(
      <Crossfade state="loading">
        <p>Загрузка</p>
      </Crossfade>,
    );
    const root = container.firstElementChild as HTMLElement;
    // The content shrank without a render; the next state is as tall: nothing to glide.
    height = 60;
    rerender(
      <Crossfade state="ready">
        <p>Данные</p>
      </Crossfade>,
    );
    expect(root).not.toHaveAttribute("data-resizing");
    rerender(
      <Crossfade state="empty">
        <p>Пусто</p>
      </Crossfade>,
    );
    // 60 at the change → 140 now: the glide runs.
    expect(root).toHaveAttribute("data-resizing", "true");
    vi.restoreAllMocks();
  });

  it("swaps at once under reduced motion", () => {
    stubReducedMotion(true);
    const { rerender } = render(
      <Crossfade state="loading">
        <p>Загрузка</p>
      </Crossfade>,
    );
    rerender(
      <Crossfade state="ready">
        <p>Данные</p>
      </Crossfade>,
    );
    expect(screen.queryByText("Загрузка")).toBeNull();
    expect(screen.getByText("Данные")).toBeInTheDocument();
  });
});
