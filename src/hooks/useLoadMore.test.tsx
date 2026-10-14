import { act, render } from "@testing-library/react";
import * as React from "react";

import { useLoadMore } from "./useLoadMore";

type Observed = { callback: IntersectionObserverCallback; options?: IntersectionObserverInit };
const observers: Observed[] = [];

class FakeObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    observers.push({ callback, options });
  }
  observe() {}
  disconnect() {}
}

function List({
  enabled,
  round,
  onLoadMore,
  rootMargin,
  onRequest,
}: {
  enabled: boolean;
  round: unknown;
  onLoadMore: () => void;
  rootMargin?: string;
  onRequest?: (request: () => void) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const { sentinelRef, request } = useLoadMore({
    enabled,
    onLoadMore,
    scrollRef,
    round,
    rootMargin,
  });
  onRequest?.(request);
  return (
    <div ref={scrollRef}>
      <div ref={sentinelRef} />
    </div>
  );
}

const reach = () =>
  act(() => {
    observers
      .at(-1)
      ?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
  });

describe("useLoadMore", () => {
  beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", FakeObserver);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("asks once per round when the sentinel comes into view", () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(<List enabled round={1} onLoadMore={onLoadMore} />);
    reach();
    reach();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    rerender(<List enabled round={2} onLoadMore={onLoadMore} />);
    reach();
    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it("asks from the keyboard the same way, and not while disabled", () => {
    const onLoadMore = vi.fn();
    let request = () => {};
    const capture = (next: () => void) => {
      request = next;
    };
    const { rerender } = render(
      <List enabled={false} round={1} onLoadMore={onLoadMore} onRequest={capture} />,
    );
    request();
    expect(onLoadMore).not.toHaveBeenCalled();
    rerender(<List enabled round={1} onLoadMore={onLoadMore} onRequest={capture} />);
    request();
    request();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    // A failed load disables the list; enabled again (a retry), the same round asks again.
    rerender(<List enabled={false} round={1} onLoadMore={onLoadMore} onRequest={capture} />);
    rerender(<List enabled round={1} onLoadMore={onLoadMore} onRequest={capture} />);
    request();
    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it("observes inside the list's own scroller with the host's margin", () => {
    render(<List enabled round={1} onLoadMore={() => {}} rootMargin="0px 0px 120px 0px" />);
    expect(observers.at(-1)?.options?.rootMargin).toBe("0px 0px 120px 0px");
    expect(observers.at(-1)?.options?.root).toBeInstanceOf(HTMLDivElement);
  });
});
