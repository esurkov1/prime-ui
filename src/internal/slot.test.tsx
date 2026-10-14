import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import {
  type OutletStore,
  Slot,
  slotChild,
  useMovedToOutlet,
  useOutletEntries,
  useOutletStore,
} from "./slot";

describe("Slot", () => {
  it("chains handlers, the child's first", () => {
    const calls: string[] = [];
    render(
      <Slot onClick={() => calls.push("slot")}>
        <button type="button" onClick={() => calls.push("child")}>
          Go
        </button>
      </Slot>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(calls).toEqual(["child", "slot"]);
  });

  it("skips its own handler when the child's handler calls preventDefault()", () => {
    const slot = vi.fn();
    render(
      <Slot onClick={slot}>
        <button type="button" onClick={(event) => event.preventDefault()}>
          Go
        </button>
      </Slot>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(slot).not.toHaveBeenCalled();
  });

  it("joins aria-describedby ids, the child's first", () => {
    render(
      <Slot aria-describedby="tip">
        <button type="button" aria-describedby="hint">
          Go
        </button>
      </Slot>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-describedby", "hint tip");
  });

  it("aria-disabled stops the click before the child's own handler (a link does not navigate)", () => {
    const child = vi.fn();
    render(
      <Slot aria-disabled>
        {/* biome-ignore lint/a11y/useValidAnchor: a navigating link with a handler is the case under test */}
        <a href="#next" onClick={child}>
          Далее
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(child).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });

  it("aria-disabled takes a link child out of the Tab order and drops its href", () => {
    render(
      <Slot aria-disabled>
        <a href="#next">Далее</a>
      </Slot>,
    );
    const link = screen.getByRole("link", { name: "Далее" });
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("passes a typed ref to the child without a cast", () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <Slot ref={ref}>
        <a href="#next">Далее</a>
      </Slot>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("keeps the merged ref stable between renders", () => {
    const ref = vi.fn();
    const { rerender } = render(
      <Slot ref={ref}>
        <button type="button">Go</button>
      </Slot>,
    );
    rerender(
      <Slot ref={ref}>
        <button type="button">Go</button>
      </Slot>,
    );
    expect(ref).toHaveBeenCalledTimes(1);
  });
});

describe("slotChild", () => {
  it("returns the one element child", () => {
    const child = slotChild(<a href="#x">Счёт</a>, "Card.Root");
    expect(child.props.children).toBe("Счёт");
  });

  it("names the part when the child is not one element", () => {
    expect(() => slotChild("Счёт", "Card.Root")).toThrow(
      "[prime-ui-kit] Card.Root asChild needs a single element child.",
    );
  });
});

describe("outlet", () => {
  const StoreContext = React.createContext<OutletStore | null>(null);

  function Outlet() {
    const store = React.useContext(StoreContext);
    const entries = useOutletEntries(store as OutletStore);
    return (
      <div data-testid="outlet">
        {entries.map(({ id, node }) => (
          <React.Fragment key={id}>{node}</React.Fragment>
        ))}
      </div>
    );
  }

  function Part({ label }: { label: string }) {
    const node = <span>{label}</span>;
    const moved = useMovedToOutlet(React.useContext(StoreContext), node);
    return moved ? null : node;
  }

  function Host({ children }: { children: React.ReactNode }) {
    const store = useOutletStore();
    return (
      <StoreContext.Provider value={store}>
        <Outlet />
        <div data-testid="body">{children}</div>
      </StoreContext.Provider>
    );
  }

  it("moves a part into the outlet, follows its updates and drops it on unmount", () => {
    const { rerender } = render(
      <Host>
        <Part label="Сделки" />
      </Host>,
    );
    expect(screen.getByTestId("outlet")).toHaveTextContent("Сделки");
    expect(screen.getByTestId("body")).toBeEmptyDOMElement();

    rerender(
      <Host>
        <Part label="Клиенты" />
      </Host>,
    );
    expect(screen.getByTestId("outlet")).toHaveTextContent("Клиенты");

    rerender(<Host>{null}</Host>);
    expect(screen.getByTestId("outlet")).toBeEmptyDOMElement();
  });

  it("keeps the arrival order: a part that updates stays in its place", () => {
    function Pair({ second }: { second: string }) {
      return (
        <>
          <Part label="A" />
          <Part label={second} />
        </>
      );
    }
    const { rerender } = render(
      <Host>
        <Pair second="B" />
      </Host>,
    );
    rerender(
      <Host>
        <Pair second="C" />
      </Host>,
    );
    expect(screen.getByTestId("outlet")).toHaveTextContent("AC");
  });

  it("stays in place without a store", () => {
    render(
      <StoreContext.Provider value={null}>
        <div data-testid="body">
          <Part label="Сделки" />
        </div>
      </StoreContext.Provider>,
    );
    expect(screen.getByTestId("body")).toHaveTextContent("Сделки");
  });
});
