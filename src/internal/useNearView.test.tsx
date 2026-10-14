import { act, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";

import { useNearView } from "./useNearView";

type Observed = {
  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit | undefined;
};

let observers: Observed[] = [];

function stubObserver() {
  observers = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observers.push({ callback, options });
      }
      observe() {}
      disconnect() {}
    },
  );
}

function Probe() {
  const ref = React.useRef<HTMLDivElement>(null);
  const near = useNearView(ref);
  return <div ref={ref} data-testid="probe" data-near={near} />;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useNearView", () => {
  it("watches the viewport outside a scroller and turns true once the element comes near", () => {
    stubObserver();
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveAttribute("data-near", "false");
    expect(observers[0]?.options?.root ?? null).toBeNull();
    act(() => {
      observers[0]?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(screen.getByTestId("probe")).toHaveAttribute("data-near", "true");
  });

  it("inside a ScrollContainer the scroller is the observer's root", () => {
    stubObserver();
    render(
      <ScrollContainer data-testid="scroller">
        <Probe />
      </ScrollContainer>,
    );
    expect(observers.at(-1)?.options?.root).toBe(screen.getByTestId("scroller"));
  });

  it("is true at once without IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveAttribute("data-near", "true");
  });
});
