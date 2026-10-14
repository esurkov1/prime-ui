import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RollingNumber } from "@/internal/RollingNumber";
import { withMotion } from "@/test/motion";
import { DND_CARRYING_ATTRIBUTE, Dnd, DndLock, moveBefore } from "./Dnd";
import { insertionBefore } from "./geometry";

const ROW_HEIGHT = 20;
const POINTER = { pointerId: 1, pointerType: "mouse", button: 0 };

type Box = { left: number; top: number; width: number; height: number };
const boxes = new Map<string, Box>();

/** jsdom lays nothing out: rows stack in document order (the lifted one takes no room), zones are stubbed by test id. */
function stubLayout() {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const stubbed = boxes.get(this.dataset.testid ?? "");
    let box: Box;
    if (stubbed) {
      box = stubbed;
    } else if (this.hasAttribute("data-dnd-item") || this.hasAttribute("data-dnd-gap")) {
      const siblings = Array.from(this.parentElement?.children ?? []);
      const top =
        siblings.slice(0, siblings.indexOf(this)).filter((n) => !n.hasAttribute("data-lifted"))
          .length * ROW_HEIGHT;
      const hidden = this.hasAttribute("data-lifted");
      box = { left: 0, top, width: hidden ? 0 : 200, height: hidden ? 0 : ROW_HEIGHT };
    } else {
      box = { left: 0, top: 0, width: 200, height: 400 };
    }
    return {
      ...box,
      right: box.left + box.width,
      bottom: box.top + box.height,
      x: box.left,
      y: box.top,
      toJSON: () => ({}),
    };
  });
}

function pressOn(element: Element, x: number, y: number, init: object = {}) {
  fireEvent.pointerDown(element, { ...POINTER, clientX: x, clientY: y, ...init });
}
function moveTo(x: number, y: number) {
  fireEvent.pointerMove(window, { ...POINTER, clientX: x, clientY: y });
}
function releaseAt(x: number, y: number) {
  fireEvent.pointerUp(window, { ...POINTER, clientX: x, clientY: y });
}

beforeEach(() => {
  boxes.clear();
  stubLayout();
});
afterEach(() => {
  vi.restoreAllMocks();
});

type Row = { id: string };
const rows = (...ids: string[]): Row[] => ids.map((id) => ({ id }));

function Sortable({
  initial,
  onReorder,
  handle,
  disabled,
}: {
  initial: Row[];
  onReorder?: (id: string, before: string | null) => void;
  handle?: boolean;
  disabled?: boolean;
}) {
  const [items, setItems] = React.useState(initial);
  return (
    <Dnd.Root>
      <Dnd.Sortable
        aria-label="list"
        items={items}
        getId={(row) => row.id}
        getLabel={(row) => `Row ${row.id}`}
        handle={handle ?? false}
        disabled={disabled ?? false}
        onReorder={(id, before) => {
          onReorder?.(id, before);
          setItems((current) => moveBefore(current, id, before, (row) => row.id));
        }}
        renderItem={(row) => (
          <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
            {handle ? <Dnd.Handle data-testid={`grip-${row.id}`} /> : null}
            {row.id}
            <button type="button">act</button>
          </Dnd.SortableItem>
        )}
      />
    </Dnd.Root>
  );
}

const order = () =>
  Array.from(screen.getByLabelText("list").querySelectorAll<HTMLElement>("[data-dnd-item]")).map(
    (node) => node.dataset.dndItem,
  );

describe("Dnd.Sortable", () => {
  it("Tab moves to the items, or with `handle` to their grips", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Sortable initial={rows("a", "b")} />);
    await user.tab();
    expect(screen.getByTestId("row-a")).toHaveFocus();
    // The control inside the item is the next stop, then the next item.
    await user.tab();
    await user.tab();
    expect(screen.getByTestId("row-b")).toHaveFocus();
    unmount();
    render(<Sortable initial={rows("a", "b")} handle />);
    await user.tab();
    expect(screen.getByTestId("grip-a")).toHaveFocus();
    expect(screen.getByTestId("row-a")).not.toHaveAttribute("tabindex");
  });

  it("drags a row in front of the next one and opens a gap there", () => {
    const onReorder = vi.fn();
    render(<Sortable initial={rows("a", "b", "c")} onReorder={onReorder} />);
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 25);
    expect(document.documentElement).toHaveAttribute("data-dnd-active", "mouse");
    expect(screen.getByTestId("row-a")).toHaveAttribute("data-lifted");
    const gap = document.querySelector("[data-dnd-gap]");
    expect(gap?.nextElementSibling).toBe(screen.getByTestId("row-c"));
    releaseAt(10, 25);
    expect(onReorder).toHaveBeenCalledWith("a", "c");
    expect(order()).toEqual(["b", "a", "c"]);
    expect(document.documentElement).not.toHaveAttribute("data-dnd-active");
  });

  it("pointer moves that keep the gap in place re-render no item", () => {
    let renders = 0;
    function Counted() {
      const [items] = React.useState(rows("a", "b", "c", "d"));
      return (
        <Dnd.Root>
          <Dnd.Sortable
            aria-label="list"
            items={items}
            getId={(row) => row.id}
            onReorder={() => {}}
            renderItem={(row) => <CountedItem id={row.id} />}
          />
        </Dnd.Root>
      );
    }
    function CountedItem({ id }: { id: string }) {
      renders += 1;
      return (
        <Dnd.SortableItem id={id} data-testid={`row-${id}`}>
          {id}
        </Dnd.SortableItem>
      );
    }
    render(<Counted />);
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 25);
    renders = 0;
    for (let x = 11; x < 21; x += 1) moveTo(x, 25);
    expect(renders).toBe(0);
    releaseAt(20, 25);
  });

  it("shapes the gap like the lifted item", () => {
    render(<Sortable initial={rows("a", "b")} />);
    screen.getByTestId("row-a").style.borderRadius = "9px";
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 30);
    const gap = document.querySelector<HTMLElement>("[data-dnd-gap]");
    expect(gap?.style.getPropertyValue("--dnd-gap-radius")).toBe("9px");
    releaseAt(10, 30);
  });

  it("drops past the last row as last", () => {
    const onReorder = vi.fn();
    render(<Sortable initial={rows("a", "b", "c")} onReorder={onReorder} />);
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 200);
    releaseAt(10, 200);
    expect(onReorder).toHaveBeenCalledWith("a", null);
  });

  it("does not reorder when released where the row already is", () => {
    const onReorder = vi.fn();
    render(<Sortable initial={rows("a", "b", "c")} onReorder={onReorder} />);
    pressOn(screen.getByTestId("row-b"), 10, 25);
    moveTo(10, 28);
    moveTo(10, 30);
    releaseAt(10, 30);
    expect(onReorder).not.toHaveBeenCalled();
    expect(order()).toEqual(["a", "b", "c"]);
  });

  it("Escape takes the move back", () => {
    const onReorder = vi.fn();
    render(<Sortable initial={rows("a", "b", "c")} onReorder={onReorder} />);
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 200);
    fireEvent.keyDown(window, { key: "Escape" });
    releaseAt(10, 200);
    expect(onReorder).not.toHaveBeenCalled();
    expect(screen.getByTestId("row-a")).not.toHaveAttribute("data-lifted");
    expect(screen.getByRole("status")).toHaveTextContent("Row a: перемещение отменено");
  });

  it("cancels the drag when the window loses focus", () => {
    const onReorder = vi.fn();
    render(<Sortable initial={rows("a", "b", "c")} onReorder={onReorder} />);
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 200);
    fireEvent.blur(window);
    expect(document.documentElement).not.toHaveAttribute("data-dnd-active");
    releaseAt(10, 200);
    expect(onReorder).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("перемещение отменено");
  });

  it("a press that never travels is a click, not a drag", () => {
    render(<Sortable initial={rows("a", "b")} />);
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(11, 6);
    releaseAt(11, 6);
    expect(screen.getByTestId("row-a")).not.toHaveAttribute("data-lifted");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("leaves presses on inner controls to those controls", () => {
    render(<Sortable initial={rows("a", "b")} />);
    pressOn(screen.getByTestId("row-a").querySelector("button") as Element, 10, 5);
    moveTo(10, 60);
    expect(screen.getByTestId("row-a")).not.toHaveAttribute("data-lifted");
  });

  it("with `handle`, only the grip starts a drag", () => {
    render(<Sortable initial={rows("a", "b")} handle />);
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 60);
    expect(screen.getByTestId("row-a")).not.toHaveAttribute("data-lifted");
    releaseAt(10, 60);
    pressOn(screen.getByTestId("grip-a"), 10, 5);
    moveTo(10, 60);
    expect(screen.getByTestId("row-a")).toHaveAttribute("data-lifted");
  });

  it("does nothing when disabled", () => {
    render(<Sortable initial={rows("a", "b")} disabled />);
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 60);
    expect(screen.getByTestId("row-a")).not.toHaveAttribute("data-lifted");
    expect(screen.getByTestId("row-a")).not.toHaveAttribute("aria-roledescription");
  });

  it("reorders from the keyboard with Alt+arrows and announces it", () => {
    const onReorder = vi.fn();
    render(<Sortable initial={rows("a", "b", "c")} onReorder={onReorder} />);
    const a = screen.getByTestId("row-a");
    expect(a).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(a, { key: "ArrowDown", altKey: true });
    expect(onReorder).toHaveBeenCalledWith("a", "c");
    expect(screen.getByRole("status")).toHaveTextContent("Row a: позиция 2 из 3");
    expect(order()).toEqual(["b", "a", "c"]);
    fireEvent.keyDown(screen.getByTestId("row-c"), { key: "ArrowDown", altKey: true });
    expect(onReorder).toHaveBeenCalledTimes(1);
  });

  it("ignores plain arrows", () => {
    const onReorder = vi.fn();
    render(<Sortable initial={rows("a", "b")} onReorder={onReorder} />);
    fireEvent.keyDown(screen.getByTestId("row-a"), { key: "ArrowDown" });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("rolls the drawn order back when the owner refuses", async () => {
    function Refusing() {
      const items = rows("a", "b", "c");
      return (
        <Dnd.Root>
          <Dnd.Sortable
            aria-label="list"
            items={items}
            getId={(row) => row.id}
            onReorder={async () => {
              throw new Error("refused");
            }}
            renderItem={(row) => (
              <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
                {row.id}
              </Dnd.SortableItem>
            )}
          />
        </Dnd.Root>
      );
    }
    render(<Refusing />);
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 200);
    await act(async () => {
      releaseAt(10, 200);
    });
    expect(order()).toEqual(["a", "b", "c"]);
  });

  it("the grip is a named, focusable button and Alt+arrow on it moves its row", () => {
    const onReorder = vi.fn();
    render(<Sortable initial={rows("a", "b")} handle onReorder={onReorder} />);
    const grip = screen.getByTestId("grip-a");
    expect(grip.tagName).toBe("BUTTON");
    expect(grip).toHaveAccessibleName("Перетащить");
    grip.focus();
    fireEvent.keyDown(grip, { key: "ArrowDown", altKey: true });
    expect(onReorder).toHaveBeenCalled();
  });

  it("renders li items inside ul", () => {
    render(
      <Dnd.Root>
        <Dnd.Sortable
          as="ul"
          aria-label="list"
          items={rows("a")}
          getId={(row) => row.id}
          onReorder={() => {}}
          renderItem={(row) => <Dnd.SortableItem id={row.id}>{row.id}</Dnd.SortableItem>}
        />
      </Dnd.Root>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("uses custom labels in the live region", () => {
    render(
      <Dnd.Root labels={{ grabbed: "{label} picked" }}>
        <Dnd.Sortable
          aria-label="list"
          items={rows("a", "b")}
          getId={(row) => row.id}
          onReorder={() => {}}
          renderItem={(row) => (
            <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
              {row.id}
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>,
    );
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 30);
    expect(screen.getByRole("status")).toHaveTextContent("a picked");
  });
});

describe("Dnd.Draggable + Dnd.DropZone", () => {
  function Board({
    onDrop,
    canDrop,
  }: {
    onDrop: (id: string, data: unknown) => void;
    canDrop?: (id: string) => boolean;
  }) {
    return (
      <Dnd.Root>
        <Dnd.Draggable kind="card" id="c1" data={{ n: 1 }} label="Card 1" data-testid="card">
          Card
        </Dnd.Draggable>
        <Dnd.Draggable kind="other" id="o1" data-testid="other">
          Other
        </Dnd.Draggable>
        <Dnd.DropZone
          accepts="card"
          data-testid="zone"
          onDrop={(item) => onDrop(item.id, item.data)}
          {...(canDrop ? { canDrop: (item: { id: string }) => canDrop(item.id) } : {})}
        >
          Zone
        </Dnd.DropZone>
      </Dnd.Root>
    );
  }

  beforeEach(() => {
    boxes.set("card", { left: 0, top: 0, width: 100, height: 40 });
    boxes.set("other", { left: 0, top: 50, width: 100, height: 40 });
    boxes.set("zone", { left: 200, top: 0, width: 200, height: 200 });
  });

  it("drops the payload on an accepting zone and marks it while over", () => {
    const onDrop = vi.fn();
    render(<Board onDrop={onDrop} />);
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(300, 100);
    expect(screen.getByTestId("zone")).toHaveAttribute("data-dnd-over");
    expect(screen.getByTestId("card")).toHaveAttribute("data-dragging");
    releaseAt(300, 100);
    expect(onDrop).toHaveBeenCalledWith("c1", { n: 1 });
    expect(screen.getByTestId("zone")).not.toHaveAttribute("data-dnd-over");
    expect(screen.getByRole("status")).toHaveTextContent("Card 1: перемещён");
  });

  it("ignores kinds it does not accept", () => {
    const onDrop = vi.fn();
    render(<Board onDrop={onDrop} />);
    pressOn(screen.getByTestId("other"), 10, 60);
    moveTo(300, 100);
    expect(screen.getByTestId("zone")).not.toHaveAttribute("data-dnd-over");
    releaseAt(300, 100);
    expect(onDrop).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("возвращён на место");
  });

  it("marks a refusing zone as rejecting and does not drop", () => {
    const onDrop = vi.fn();
    render(<Board onDrop={onDrop} canDrop={() => false} />);
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(300, 100);
    expect(screen.getByTestId("zone")).toHaveAttribute("data-dnd-reject");
    releaseAt(300, 100);
    expect(onDrop).not.toHaveBeenCalled();
  });

  it("flashes after a drop: the zone's fill fades from the accent tint, then the flag clears", async () => {
    const motion = withMotion();
    render(
      <Dnd.Root>
        <Dnd.Draggable kind="card" id="c1" data-testid="card">
          Card
        </Dnd.Draggable>
        <Dnd.DropZone accepts="card" data-testid="zone" flashOnDrop onDrop={() => {}}>
          Zone
        </Dnd.DropZone>
      </Dnd.Root>,
    );
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(300, 100);
    releaseAt(300, 100);
    const zone = screen.getByTestId("zone");
    expect(zone).toHaveAttribute("data-dnd-flash");
    const [flash] = motion.on(zone);
    // One keyframe: the fill starts at the tint and ends on the zone's own.
    expect(flash?.keyframes).toEqual([{ backgroundColor: expect.any(String) }]);
    // The overlay lands in a microtask after the drop.
    await act(async () => {});
    act(() => flash?.finish());
    expect(zone).not.toHaveAttribute("data-dnd-flash");
  });

  it("does not flash under reduced motion", () => {
    render(
      <Dnd.Root>
        <Dnd.Draggable kind="card" id="c1" data-testid="card">
          Card
        </Dnd.Draggable>
        <Dnd.DropZone accepts="card" data-testid="zone" flashOnDrop onDrop={() => {}}>
          Zone
        </Dnd.DropZone>
      </Dnd.Root>,
    );
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(300, 100);
    releaseAt(300, 100);
    expect(screen.getByTestId("zone")).not.toHaveAttribute("data-dnd-flash");
  });

  it("releasing outside every zone drops nothing", () => {
    const onDrop = vi.fn();
    render(<Board onDrop={onDrop} />);
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(100, 300);
    releaseAt(100, 300);
    expect(onDrop).not.toHaveBeenCalled();
  });

  it("clones the lifted element into the overlay without its identity", () => {
    render(<Board onDrop={() => {}} />);
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(50, 50);
    const overlay = document.querySelector("[data-dnd-overlay]");
    expect(overlay).toHaveAttribute("aria-hidden", "true");
    expect(overlay?.textContent).toBe("Card");
    expect(overlay?.querySelector("[data-dnd-item]")).toBeNull();
    releaseAt(50, 50);
  });

  it("is inert without a Dnd.Root", () => {
    render(
      <Dnd.Draggable kind="card" id="c1" data-testid="card">
        Card
      </Dnd.Draggable>,
    );
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(100, 100);
    expect(document.documentElement).not.toHaveAttribute("data-dnd-active");
  });

  it("starts a touch drag only after a hold", () => {
    vi.useFakeTimers();
    try {
      render(<Board onDrop={() => {}} />);
      pressOn(screen.getByTestId("card"), 10, 10, { pointerType: "touch" });
      expect(document.documentElement).not.toHaveAttribute("data-dnd-active");
      act(() => {
        vi.advanceTimersByTime(250);
      });
      expect(document.documentElement).not.toHaveAttribute("data-dnd-active");
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(document.documentElement).toHaveAttribute("data-dnd-active", "touch");
      fireEvent.pointerCancel(window, { ...POINTER, pointerType: "touch" });
      expect(document.documentElement).not.toHaveAttribute("data-dnd-active");
    } finally {
      vi.useRealTimers();
    }
  });

  it("a finger that runs before the hold ends is scrolling, not dragging", () => {
    vi.useFakeTimers();
    try {
      render(<Board onDrop={() => {}} />);
      pressOn(screen.getByTestId("card"), 10, 10, { pointerType: "touch" });
      fireEvent.pointerMove(window, { ...POINTER, pointerType: "touch", clientX: 10, clientY: 40 });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(document.documentElement).not.toHaveAttribute("data-dnd-active");
    } finally {
      vi.useRealTimers();
    }
  });

  it("swallows the click that follows a drag on the dragged element", () => {
    const onClick = vi.fn();
    render(
      <Dnd.Root>
        <Dnd.Draggable kind="card" id="c1" data-testid="card" onClick={onClick}>
          Card
        </Dnd.Draggable>
      </Dnd.Root>,
    );
    boxes.set("card", { left: 0, top: 0, width: 100, height: 40 });
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(60, 10);
    releaseAt(60, 10);
    fireEvent.click(screen.getByTestId("card"));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("no jump when a drag starts", () => {
  it("does not animate items whose recorded positions went stale before the first drag", async () => {
    const animate = vi.fn(() => ({ cancel: () => {}, addEventListener: () => {} }));
    Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, value: animate });
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    try {
      render(<Sortable initial={rows("a", "b", "c")} />);
      // The page scrolled / fonts loaded after mount: everything is drawn 50px lower now.
      vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockRestore();
      const shifted = (this_: HTMLElement) => {
        const siblings = Array.from(this_.parentElement?.children ?? []);
        const isItem = this_.hasAttribute("data-dnd-item") || this_.hasAttribute("data-dnd-gap");
        const top = isItem
          ? siblings.slice(0, siblings.indexOf(this_)).filter((n) => !n.hasAttribute("data-lifted"))
              .length *
              ROW_HEIGHT +
            50
          : 50;
        const hidden = this_.hasAttribute("data-lifted");
        const height = hidden ? 0 : isItem ? ROW_HEIGHT : 400;
        return {
          left: 0,
          top,
          right: 200,
          bottom: top + height,
          width: hidden ? 0 : 200,
          height,
          x: 0,
          y: top,
          toJSON: () => ({}),
        };
      };
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
        this: HTMLElement,
      ) {
        return shifted(this);
      });
      pressOn(screen.getByTestId("row-a"), 10, 55);
      moveTo(10, 56 + 8);
      expect(screen.getByTestId("row-a")).toHaveAttribute("data-lifted");
      // Only the gap's fade-in runs; nothing moves.
      const calls = animate.mock.calls as unknown as Array<[Array<{ transform?: string }>]>;
      expect(calls.filter(([frames]) => frames.some((frame) => frame.transform))).toEqual([]);
      await act(async () => {
        releaseAt(10, 64);
      });
    } finally {
      vi.unstubAllGlobals();
      Reflect.deleteProperty(HTMLElement.prototype, "animate");
    }
  });
});

describe("gap motion", () => {
  it("fades the gap in once and glides it to its next place", () => {
    const animate = vi.fn(function (this: HTMLElement) {
      return { cancel: () => {}, addEventListener: () => {} };
    });
    Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, value: animate });
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    try {
      render(<Sortable initial={rows("a", "b", "c")} />);
      pressOn(screen.getByTestId("row-a"), 10, 5);
      moveTo(10, 15);
      const gap = document.querySelector<HTMLElement>("[data-dnd-gap]");
      const on = (node: Element | null) =>
        (animate.mock.contexts as unknown as Element[]).filter((context) => context === node);
      expect(on(gap)).toHaveLength(1);
      animate.mockClear();
      // Past b: the gap moves one row down and glides there from its old place.
      moveTo(10, 35);
      expect(document.querySelector("[data-dnd-gap]")).toBe(gap);
      const calls = animate.mock.calls as unknown as Array<[Array<{ transform?: string }>]>;
      const glide = calls.find((_, index) => animate.mock.contexts[index] === gap);
      expect(glide?.[0][0]?.transform).toBe("translate(0px, -20px)");
      expect(glide?.[0][1]?.transform).toBe("none");
      releaseAt(10, 35);
    } finally {
      vi.unstubAllGlobals();
      Reflect.deleteProperty(HTMLElement.prototype, "animate");
    }
  });
});

describe("landing", () => {
  it("glides the clone to the item's new place and unhides the item when it lands", async () => {
    const finishers: Array<() => void> = [];
    const animate = vi.fn(function (this: HTMLElement) {
      return {
        cancel: () => {},
        addEventListener: (_type: string, listener: () => void) => finishers.push(listener),
      };
    });
    Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, value: animate });
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    try {
      render(<Sortable initial={rows("a", "b", "c")} />);
      pressOn(screen.getByTestId("row-a"), 10, 5);
      moveTo(10, 25);
      animate.mockClear();
      await act(async () => {
        releaseAt(10, 25);
      });
      // a now sits second (top 20): the host flies there, and the real row waits hidden.
      const calls = animate.mock.calls as unknown as Array<[Array<{ transform?: string }>]>;
      const flight = calls.find(([frames]) => frames.length === 2 && frames[1]?.transform);
      expect(flight?.[0][1]?.transform).toBe("translate3d(0px, 20px, 0)");
      expect(screen.getByTestId("row-a")).toHaveAttribute("data-dnd-landing");
      await act(async () => {
        for (const finish of finishers) finish();
      });
      expect(screen.getByTestId("row-a")).not.toHaveAttribute("data-dnd-landing");
      expect(document.querySelector("[data-dnd-overlay]")?.childElementCount).toBe(0);
    } finally {
      vi.unstubAllGlobals();
      Reflect.deleteProperty(HTMLElement.prototype, "animate");
    }
  });
});

describe("landing with a rolling number", () => {
  it("the carried copy's digits take the new position at the drop and roll in flight", async () => {
    Object.defineProperty(HTMLElement.prototype, "animate", {
      configurable: true,
      value: () => ({ cancel: () => {}, addEventListener: () => {} }),
    });
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    function Numbered() {
      const [items, setItems] = React.useState(rows("a", "b", "c"));
      return (
        <Dnd.Root>
          <Dnd.Sortable
            aria-label="list"
            items={items}
            getId={(row) => row.id}
            onReorder={(id, before) =>
              setItems((current) => moveBefore(current, id, before, (row) => row.id))
            }
            renderItem={(row, index) => (
              <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
                <RollingNumber>{index + 1}</RollingNumber>
              </Dnd.SortableItem>
            )}
          />
        </Dnd.Root>
      );
    }
    try {
      render(<Numbered />);
      pressOn(screen.getByTestId("row-a"), 10, 5);
      moveTo(10, 25);
      const copyDigit = () =>
        document.querySelector<HTMLElement>("[data-dnd-overlay] [data-rolling-digit]");
      expect(copyDigit()?.style.getPropertyValue("--rolling-n")).toBe("1");
      await act(async () => {
        releaseAt(10, 25);
      });
      // a now stands second: the copy shows «2» while it lands, not after.
      expect(copyDigit()?.style.getPropertyValue("--rolling-n")).toBe("2");
    } finally {
      vi.unstubAllGlobals();
      Reflect.deleteProperty(HTMLElement.prototype, "animate");
    }
  });
});

describe("place numbers in flight", () => {
  it("index is the place on release while dragging; a mirrored part follows on the copy", async () => {
    function Numbered() {
      const [items, setItems] = React.useState(rows("a", "b", "c"));
      return (
        <Dnd.Root>
          <Dnd.Sortable
            aria-label="list"
            items={items}
            getId={(row) => row.id}
            onReorder={(id, before) =>
              setItems((current) => moveBefore(current, id, before, (row) => row.id))
            }
            renderItem={(row, index) => (
              <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
                <span data-dnd-mirror="" data-testid={`place-${row.id}`}>
                  <RollingNumber>{index + 1}</RollingNumber>
                </span>
              </Dnd.SortableItem>
            )}
          />
        </Dnd.Root>
      );
    }
    render(<Numbered />);
    const place = (id: string) =>
      screen
        .getByTestId(`place-${id}`)
        .querySelector<HTMLElement>("[data-rolling-digit]")
        ?.style.getPropertyValue("--rolling-n");
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 25);
    // a would land second: b already shows 1 and a 2, before the release.
    expect(place("b")).toBe("1");
    expect(place("a")).toBe("2");
    await act(async () => {});
    const copy = document.querySelector<HTMLElement>(
      "[data-dnd-overlay] [data-dnd-mirror] [data-rolling-digit]",
    );
    expect(copy?.style.getPropertyValue("--rolling-n")).toBe("2");
    releaseAt(10, 25);
  });
});

describe("landing among lists that share ids", () => {
  it("lands on the item of its own kind, not on a same-id item of another list", async () => {
    Object.defineProperty(HTMLElement.prototype, "animate", {
      configurable: true,
      value: () => ({ cancel: () => {}, addEventListener: () => {} }),
    });
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    try {
      render(
        <>
          {/* Another board drawn earlier with the same card id. */}
          <div data-dnd-item="a" data-dnd-kind="other-board" data-testid="decoy" />
          <Sortable initial={rows("a", "b", "c")} />
        </>,
      );
      pressOn(screen.getByTestId("row-a"), 10, 5);
      moveTo(10, 25);
      await act(async () => {
        releaseAt(10, 25);
      });
      expect(screen.getByTestId("decoy")).not.toHaveAttribute("data-dnd-landing");
      expect(screen.getByTestId("row-a")).toHaveAttribute("data-dnd-landing");
    } finally {
      vi.unstubAllGlobals();
      Reflect.deleteProperty(HTMLElement.prototype, "animate");
    }
  });
});

describe("connected lists", () => {
  function Columns({
    onMove,
  }: {
    onMove: (list: string, id: string, before: string | null) => void;
  }) {
    const [cols, setCols] = React.useState<Record<string, Row[]>>({
      left: rows("a", "b"),
      right: rows("x", "y"),
    });
    return (
      <Dnd.Root>
        {(["left", "right"] as const).map((name) => (
          <Dnd.Sortable
            key={name}
            kind="card"
            aria-label={name}
            items={cols[name] ?? []}
            getId={(row) => row.id}
            canDrop={(id) => !(name === "right" && id === "a")}
            onReorder={(id, before) => {
              onMove(name, id, before);
              setCols((current) => {
                const moved = Object.values(current)
                  .flat()
                  .find((row) => row.id === id);
                if (!moved) return current;
                const next: Record<string, Row[]> = {};
                for (const [key, list] of Object.entries(current)) {
                  next[key] = list.filter((row) => row.id !== id);
                }
                next[name] = moveBefore([...(next[name] ?? []), moved], id, before, (r) => r.id);
                return next;
              });
            }}
            renderItem={(row) => (
              <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
                {row.id}
              </Dnd.SortableItem>
            )}
          />
        ))}
      </Dnd.Root>
    );
  }

  beforeEach(() => {
    boxes.set("row-a", { left: 0, top: 0, width: 100, height: 20 });
  });

  function stubColumns() {
    // Left list at x 0-100, right list at x 200-300; rows stack 20px tall.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const isRight = this.closest('[aria-label="right"]') !== null;
      const left = isRight ? 200 : 0;
      const isItem = this.hasAttribute("data-dnd-item") || this.hasAttribute("data-dnd-gap");
      const siblings = Array.from(this.parentElement?.children ?? []);
      const top = isItem
        ? siblings.slice(0, siblings.indexOf(this)).filter((n) => !n.hasAttribute("data-lifted"))
            .length * ROW_HEIGHT
        : 0;
      const hidden = this.hasAttribute("data-lifted");
      const width = hidden ? 0 : 100;
      const height = hidden ? 0 : isItem ? ROW_HEIGHT : 300;
      return {
        left,
        top,
        right: left + width,
        bottom: top + height,
        width,
        height,
        x: left,
        y: top,
        toJSON: () => ({}),
      };
    });
  }

  it("drops an item from another list at an exact position", () => {
    const onMove = vi.fn();
    render(<Columns onMove={onMove} />);
    stubColumns();
    pressOn(screen.getByTestId("row-b"), 10, 25);
    moveTo(210, 5);
    // Over the right list, above x's midline: the gap opens in front of x.
    const gap = document.querySelector("[data-dnd-gap]");
    expect(gap?.nextElementSibling).toBe(screen.getByTestId("row-x"));
    releaseAt(210, 5);
    expect(onMove).toHaveBeenCalledWith("right", "b", "x");
    const right = within(screen.getByLabelText("right"));
    expect(right.getAllByTestId(/row-/).map((n) => n.textContent)).toEqual(["b", "x", "y"]);
  });

  it("drops past the last item of another list as last", () => {
    const onMove = vi.fn();
    render(<Columns onMove={onMove} />);
    stubColumns();
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(210, 200);
    releaseAt(210, 200);
    expect(onMove).not.toHaveBeenCalled(); // "a" is refused by the right list
    pressOn(screen.getByTestId("row-b"), 10, 5);
    moveTo(210, 200);
    releaseAt(210, 200);
    expect(onMove).toHaveBeenCalledWith("right", "b", null);
  });

  it("marks a refusing list and does not drop into it", () => {
    render(<Columns onMove={() => {}} />);
    stubColumns();
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(210, 30);
    expect(screen.getByLabelText("right")).toHaveAttribute("data-dnd-reject");
    releaseAt(210, 30);
    expect(screen.getByLabelText("left")).toBeInTheDocument();
  });

  it("closes the source list's gap while the item is over another list", () => {
    render(<Columns onMove={() => {}} />);
    stubColumns();
    pressOn(screen.getByTestId("row-b"), 10, 25);
    moveTo(10, 30);
    expect(within(screen.getByLabelText("left")).queryByTestId("row-b")).toBeInTheDocument();
    expect(screen.getByLabelText("left").querySelector("[data-dnd-gap]")).not.toBeNull();
    moveTo(210, 10);
    expect(screen.getByLabelText("left").querySelector("[data-dnd-gap]")).toBeNull();
    expect(screen.getByLabelText("right").querySelector("[data-dnd-gap]")).not.toBeNull();
    releaseAt(210, 10);
  });

  it("keeps the gap in the list it left while the pointer crosses the gutter", () => {
    const onMove = vi.fn();
    render(<Columns onMove={onMove} />);
    stubColumns();
    pressOn(screen.getByTestId("row-b"), 10, 25);
    moveTo(210, 5);
    // Between the lists: over nothing, the drop stays aimed at the right list.
    moveTo(150, 5);
    expect(screen.getByLabelText("left").querySelector("[data-dnd-gap]")).toBeNull();
    expect(screen.getByLabelText("right").querySelector("[data-dnd-gap]")).not.toBeNull();
    releaseAt(150, 5);
    expect(onMove).toHaveBeenCalledWith("right", "b", "x");
    expect(screen.getByRole("status")).toHaveTextContent("перемещён");
  });

  it("returns the gap to the source list after a refusing list", () => {
    const onMove = vi.fn();
    render(<Columns onMove={onMove} />);
    stubColumns();
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(210, 30);
    moveTo(150, 30);
    expect(screen.getByLabelText("right").querySelector("[data-dnd-gap]")).toBeNull();
    expect(screen.getByLabelText("left").querySelector("[data-dnd-gap]")).not.toBeNull();
    releaseAt(150, 30);
    expect(onMove).not.toHaveBeenCalled();
  });

  it("fades the gap out in the list it left and in where it opens", async () => {
    const animate = vi.fn(function (this: HTMLElement) {
      return { cancel: () => {}, addEventListener: () => {} };
    });
    Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, value: animate });
    // jsdom lays nothing out: the list stands in for the positioned box.
    const offsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetParent");
    Object.defineProperty(HTMLElement.prototype, "offsetParent", {
      configurable: true,
      get(this: HTMLElement) {
        return this.parentElement;
      },
    });
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    try {
      render(<Columns onMove={() => {}} />);
      stubColumns();
      pressOn(screen.getByTestId("row-b"), 10, 25);
      moveTo(10, 30);
      animate.mockClear();
      await act(async () => {
        moveTo(210, 5);
      });
      const left = screen.getByLabelText("left");
      const gap = screen.getByLabelText("right").querySelector("[data-dnd-gap]");
      const frames = (node: Element | null) =>
        (animate.mock.calls as unknown as Array<[Array<Record<string, unknown>>]>)
          .filter((_, index) => animate.mock.contexts[index] === node)
          .map(([keyframes]) => keyframes);
      // The left gap is gone; a copy out of the flow fades out on its spot (second row, top 20).
      expect(left.querySelector("[data-dnd-gap]")).toBeNull();
      const ghost = left.firstElementChild as HTMLElement;
      expect(ghost.getAttribute("aria-hidden")).toBe("true");
      expect(ghost.style.position).toBe("absolute");
      expect(ghost.style.top).toBe("20px");
      expect(frames(ghost)).toEqual([[{ opacity: 1 }, { opacity: 0 }]]);
      // The right one fades in on its own spot: nothing flies across.
      expect(frames(gap)).toEqual([[{ opacity: 0 }, { opacity: 1 }]]);
      releaseAt(210, 5);
      await act(async () => {});
    } finally {
      vi.unstubAllGlobals();
      Reflect.deleteProperty(HTMLElement.prototype, "animate");
      if (offsetParent) Object.defineProperty(HTMLElement.prototype, "offsetParent", offsetParent);
    }
  });
});

describe("helpers", () => {
  it("moveBefore moves an item in front of another, or last", () => {
    const ids = ["a", "b", "c"];
    const id = (s: string) => s;
    expect(moveBefore(ids, "c", "a", id)).toEqual(["c", "a", "b"]);
    expect(moveBefore(ids, "a", null, id)).toEqual(["b", "c", "a"]);
    expect(moveBefore(ids, "x", "a", id)).toEqual(ids);
  });

  it("insertionBefore reads the layout without the gap", () => {
    render(
      <div data-testid="c">
        <div data-dnd-item="a" />
        <div data-dnd-gap="" />
        <div data-dnd-item="b" />
      </div>,
    );
    // a: 0-20, gap: 20-40, b: 40-60 → without the gap b spans 20-40, midline 30.
    const container = screen.getByTestId("c");
    expect(insertionBefore(container, "[data-dnd-item]", { x: 0, y: 25 })).toBe("b");
    expect(insertionBefore(container, "[data-dnd-item]", { x: 0, y: 35 })).toBe(null);
  });

  it("insertionBefore in a grid reads slots: the cell under the aim is the index taken", () => {
    // Two 100 px cells per row: a b / c d.
    for (const [id, left, top] of [
      ["a", 0, 0],
      ["b", 100, 0],
      ["c", 0, 100],
      ["d", 100, 100],
    ] as const) {
      boxes.set(id, { left, top, width: 100, height: 100 });
    }
    stubLayout();
    render(
      <div data-testid="grid">
        {["a", "b", "c", "d"].map((id) => (
          <div key={id} data-dnd-item={id} data-testid={id} />
        ))}
      </div>,
    );
    const grid = screen.getByTestId("grid");
    const at = (x: number, y: number, lifted?: string) =>
      insertionBefore(grid, "[data-dnd-item]", { x, y }, "grid", lifted);
    // An item from elsewhere takes the slot it is over.
    expect(at(80, 50)).toBe("a");
    expect(at(180, 50)).toBe("b");
    expect(at(160, 150)).toBe("d");
    // The carried item still drawn: over its own slot it stays (in front of what follows it)…
    expect(at(80, 50, "a")).toBe("b");
    // …and entering the next slot takes it at once: a goes after b.
    expect(at(120, 50, "a")).toBe("c");
    // Entering a slot before it puts it in front of the item there.
    expect(at(20, 50, "d")).toBe("a");
    boxes.clear();
  });
});

describe("native drag inside items", () => {
  it("a picture or a link in a sortable item never starts the browser's own drag", () => {
    render(
      <Dnd.Root>
        <Dnd.Sortable
          aria-label="list"
          items={rows("a")}
          getId={(row) => row.id}
          onReorder={() => {}}
          renderItem={(row) => (
            <Dnd.SortableItem id={row.id}>
              <img src="photo.jpg" alt="" data-testid="photo" />
              <a href="/orders/1" data-testid="link">
                Заказ
              </a>
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>,
    );
    expect(fireEvent.dragStart(screen.getByTestId("photo"))).toBe(false);
    expect(fireEvent.dragStart(screen.getByTestId("link"))).toBe(false);
  });

  it("a Dnd.Draggable stops it too, and keeps its own onDragStart for the kit drag", () => {
    const onDragStart = vi.fn();
    render(
      <Dnd.Root>
        <Dnd.Draggable kind="card" id="c1" data-testid="card" onDragStart={onDragStart}>
          <img src="cover.jpg" alt="" data-testid="cover" />
        </Dnd.Draggable>
        <Dnd.Draggable kind="card" id="c2" disabled>
          <img src="cover.jpg" alt="" data-testid="still" />
        </Dnd.Draggable>
      </Dnd.Root>,
    );
    boxes.set("card", { left: 0, top: 0, width: 100, height: 40 });
    expect(fireEvent.dragStart(screen.getByTestId("cover"))).toBe(false);
    // A disabled one is not the kit's to carry: the browser keeps its drag.
    expect(fireEvent.dragStart(screen.getByTestId("still"))).toBe(true);
    expect(onDragStart).not.toHaveBeenCalled();
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(60, 10);
    expect(onDragStart).toHaveBeenCalledTimes(1);
    releaseAt(60, 10);
  });
});

describe("linked lists from the keyboard", () => {
  function Board({
    canDrop,
    unlinked,
  }: {
    canDrop?: (list: string, id: string) => boolean | string;
    unlinked?: boolean;
  }) {
    const [cols, setCols] = React.useState<Record<string, Row[]>>({
      todo: rows("a", "b"),
      doing: rows("x", "y"),
      done: [],
    });
    return (
      <Dnd.Root>
        {(["todo", "doing", "done"] as const).map((name) => (
          <section key={name}>
            <h3 id={`title-${name}`}>{name.toUpperCase()}</h3>
            <Dnd.Sortable
              {...(unlinked ? {} : { kind: "task" })}
              aria-labelledby={`title-${name}`}
              data-testid={`list-${name}`}
              items={cols[name] ?? []}
              getId={(row) => row.id}
              getLabel={(row) => `Task ${row.id}`}
              canDrop={canDrop ? (id) => canDrop(name, id) : undefined}
              onReorder={(id, before) =>
                setCols((current) => {
                  const moved = Object.values(current)
                    .flat()
                    .find((row) => row.id === id);
                  if (!moved) return current;
                  const next: Record<string, Row[]> = {};
                  for (const [key, list] of Object.entries(current)) {
                    next[key] = list.filter((row) => row.id !== id);
                  }
                  next[name] = moveBefore([...(next[name] ?? []), moved], id, before, (r) => r.id);
                  return next;
                })
              }
              renderItem={(row) => (
                <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
                  {row.id}
                </Dnd.SortableItem>
              )}
            />
          </section>
        ))}
      </Dnd.Root>
    );
  }

  const idsIn = (list: string) =>
    within(screen.getByTestId(`list-${list}`))
      .queryAllByTestId(/row-/)
      .map((node) => node.textContent);

  it("Alt+→ moves an item to the same row of the next list; focus follows; it is announced", () => {
    render(<Board />);
    const row = screen.getByTestId("row-b");
    expect(row).toHaveAttribute(
      "aria-keyshortcuts",
      "Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight",
    );
    row.focus();
    fireEvent.keyDown(row, { key: "ArrowRight", altKey: true });
    expect(idsIn("todo")).toEqual(["a"]);
    expect(idsIn("doing")).toEqual(["x", "b", "y"]);
    expect(document.activeElement).toBe(screen.getByTestId("row-b"));
    expect(screen.getByRole("status")).toHaveTextContent("Task b: «DOING», позиция 2 из 3");
    fireEvent.keyDown(screen.getByTestId("row-b"), { key: "ArrowRight", altKey: true });
    expect(idsIn("done")).toEqual(["b"]);
    fireEvent.keyDown(screen.getByTestId("row-b"), { key: "ArrowLeft", altKey: true });
    expect(idsIn("doing")).toEqual(["b", "x", "y"]);
  });

  it("follows the writing direction: in rtl ← goes to the next list", () => {
    render(
      <div dir="rtl">
        <Board />
      </div>,
    );
    fireEvent.keyDown(screen.getByTestId("row-a"), { key: "ArrowLeft", altKey: true });
    expect(idsIn("doing")).toEqual(["a", "x", "y"]);
  });

  it("a refusing list keeps the item and says why", () => {
    render(
      <Board
        canDrop={(list, id) =>
          list === "doing" && id === "a" ? "Сначала оцените задачу" : list !== "done"
        }
      />,
    );
    fireEvent.keyDown(screen.getByTestId("row-a"), { key: "ArrowRight", altKey: true });
    expect(idsIn("todo")).toEqual(["a", "b"]);
    expect(screen.getByRole("status")).toHaveTextContent("Task a: Сначала оцените задачу");
    fireEvent.keyDown(screen.getByTestId("row-x"), { key: "ArrowRight", altKey: true });
    expect(idsIn("doing")).toEqual(["x", "y"]);
    expect(screen.getByRole("status")).toHaveTextContent("Task x: «DONE» не принимает элемент");
  });

  it("lists without a shared kind stay apart", () => {
    render(<Board unlinked />);
    const row = screen.getByTestId("row-a");
    expect(row).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowUp Alt+ArrowDown");
    fireEvent.keyDown(row, { key: "ArrowRight", altKey: true });
    expect(idsIn("todo")).toEqual(["a", "b"]);
  });
});

describe("locked items", () => {
  function Pinned({ onReorder }: { onReorder?: (id: string, before: string | null) => void }) {
    const [items, setItems] = React.useState(rows("inbox", "b", "c"));
    return (
      <Dnd.Root>
        <Dnd.Sortable
          aria-label="list"
          handle
          items={items}
          getId={(row) => row.id}
          onReorder={(id, before) => {
            onReorder?.(id, before);
            setItems((current) => moveBefore(current, id, before, (row) => row.id));
          }}
          renderItem={(row) => (
            <Dnd.SortableItem id={row.id} locked={row.id === "inbox"} data-testid={`row-${row.id}`}>
              <Dnd.Handle data-testid={`grip-${row.id}`} />
              {row.id}
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>
    );
  }

  it("a locked item shows a lock instead of the grip and does not drag", () => {
    render(<Pinned />);
    const row = screen.getByTestId("row-inbox");
    expect(row).toHaveAttribute("data-locked");
    expect(row).not.toHaveAttribute("aria-roledescription");
    expect(within(row).getByRole("img", { name: "Закреплено" })).toBeInTheDocument();
    expect(within(row).queryByRole("button")).toBeNull();
    pressOn(row, 10, 5);
    moveTo(10, 50);
    expect(document.documentElement).not.toHaveAttribute("data-dnd-active");
  });

  it("nothing moves past it: neither by keyboard nor by pointer", () => {
    const onReorder = vi.fn();
    render(<Pinned onReorder={onReorder} />);
    fireEvent.keyDown(screen.getByTestId("grip-b"), { key: "ArrowUp", altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByTestId("grip-b"), { key: "ArrowDown", altKey: true });
    expect(onReorder).toHaveBeenCalledWith("b", null);

    onReorder.mockClear();
    // c (second row now) dragged above the pinned first row: the move does not happen.
    pressOn(screen.getByTestId("grip-c"), 10, 25);
    moveTo(10, 2);
    releaseAt(10, 2);
    expect(onReorder).not.toHaveBeenCalled();
    expect(order()).toEqual(["inbox", "c", "b"]);
  });
});

describe("empty list", () => {
  it("shows `empty` while it has no items, and a gap opening steps it out of the flow", () => {
    function Lists() {
      const [cols, setCols] = React.useState<Record<string, Row[]>>({ left: rows("a"), right: [] });
      return (
        <Dnd.Root>
          {(["left", "right"] as const).map((name) => (
            <Dnd.Sortable
              key={name}
              kind="card"
              as="ul"
              aria-label={name}
              items={cols[name] ?? []}
              getId={(row) => row.id}
              empty="Нет задач"
              onReorder={(id) =>
                setCols({
                  left: name === "left" ? rows(id) : [],
                  right: name === "right" ? rows(id) : [],
                })
              }
              renderItem={(row) => (
                <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
                  {row.id}
                </Dnd.SortableItem>
              )}
            />
          ))}
        </Dnd.Root>
      );
    }
    render(<Lists />);
    const right = screen.getByLabelText("right");
    const empty = within(right).getByText("Нет задач");
    expect(empty.tagName).toBe("LI");
    expect(empty).toHaveAttribute("data-dnd-empty");
    expect(within(screen.getByLabelText("left")).queryByText("Нет задач")).toBeNull();
    fireEvent.keyDown(screen.getByTestId("row-a"), { key: "ArrowRight", altKey: true });
    expect(within(right).queryByText("Нет задач")).toBeNull();
    expect(within(screen.getByLabelText("left")).getByText("Нет задач")).toBeInTheDocument();
  });
});

describe("refusal with a reason", () => {
  it("says why while over the target and shows it under the carried copy", () => {
    render(
      <Dnd.Root>
        <Dnd.Draggable kind="card" id="c1" label="Счёт 42" data-testid="card">
          Счёт
        </Dnd.Draggable>
        <Dnd.DropZone
          accepts="card"
          data-testid="zone"
          canDrop={() => "Папка закрыта для изменений"}
          onDrop={() => {}}
        >
          Архив
        </Dnd.DropZone>
      </Dnd.Root>,
    );
    boxes.set("card", { left: 0, top: 0, width: 100, height: 40 });
    boxes.set("zone", { left: 200, top: 0, width: 200, height: 200 });
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(300, 100);
    expect(screen.getByTestId("zone")).toHaveAttribute("data-dnd-reject");
    expect(screen.getByRole("status")).toHaveTextContent("Счёт 42: Папка закрыта для изменений");
    const overlay = document.querySelector("[data-dnd-overlay]") as HTMLElement;
    expect(overlay.lastElementChild).toHaveTextContent("Папка закрыта для изменений");
    moveTo(100, 300);
    expect(overlay.textContent).not.toContain("Папка закрыта");
    releaseAt(100, 300);
  });
});

describe("the carried copy", () => {
  it("takes the fill of the surface it was lifted from when the item has none", () => {
    const getComputed = window.getComputedStyle;
    vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
      const style = getComputed(element, pseudo);
      if (!(element as HTMLElement).hasAttribute?.("data-dnd-item")) return style;
      return {
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderRadius: "",
        getPropertyValue: (name: string) =>
          name === "--prime-color-layer-current" ? " rgb(250, 250, 251)" : "",
      } as unknown as CSSStyleDeclaration;
    });
    render(
      <Dnd.Root>
        <Dnd.Draggable kind="card" id="c1" data-testid="card">
          Строка
        </Dnd.Draggable>
      </Dnd.Root>,
    );
    boxes.set("card", { left: 0, top: 0, width: 100, height: 40 });
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(60, 60);
    const copy = document.querySelector("[data-dnd-overlay] [data-dnd-copy]") as HTMLElement;
    expect(copy.style.backgroundColor).toBe("rgb(250, 250, 251)");
    releaseAt(60, 60);
  });

  it("flies inside empty copies of its host up to the surface and its theme", () => {
    render(
      <div data-theme="dark">
        <div data-testid="page">
          <div data-depth="1">
            <ul data-size="s" aria-label="Этапы">
              <Dnd.Root>
                <Dnd.Draggable kind="card" id="c1" data-testid="card">
                  Строка
                </Dnd.Draggable>
              </Dnd.Root>
            </ul>
          </div>
        </div>
      </div>,
    );
    boxes.set("card", { left: 0, top: 0, width: 100, height: 40 });
    pressOn(screen.getByTestId("card"), 10, 10);
    moveTo(60, 60);
    const overlay = document.querySelector("[data-dnd-overlay]") as HTMLElement;
    const copy = overlay.querySelector<HTMLElement>("[data-dnd-copy]");
    // The host's tier attributes reach the copy (a List row's padding and radius hang on them).
    const host = copy?.closest<HTMLElement>('[data-size="s"]');
    expect(host?.style.display).toBe("contents");
    expect(copy?.closest('[data-depth="1"]')).not.toBeNull();
    expect(copy?.closest('[data-theme="dark"]')).not.toBeNull();
    // Nothing above the surface but its theme, and no copy answers to the original's name.
    expect(overlay.querySelector("[data-testid]")).toBeNull();
    expect(overlay.querySelector("[aria-label]")).toBeNull();
    expect(screen.getAllByLabelText("Этапы")).toHaveLength(1);
    releaseAt(60, 60);
  });
});

describe("a wrapping grid", () => {
  it("drags a tile to the next row and reorders in reading order; Alt+→ steps it", () => {
    // Two 100 px cells per row: a b / c d.
    // Cells take their slots in reading order, the lifted one out of the layout.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const isCell = this.hasAttribute("data-dnd-item") || this.hasAttribute("data-dnd-gap");
      let box = { left: 0, top: 0, width: 200, height: 200 };
      if (isCell) {
        const hidden = this.hasAttribute("data-lifted");
        const slots = Array.from(this.parentElement?.children ?? []).filter(
          (node) => !node.hasAttribute("data-lifted"),
        );
        const index = slots.indexOf(this);
        box = hidden
          ? { left: 0, top: 0, width: 0, height: 0 }
          : { left: (index % 2) * 100, top: Math.floor(index / 2) * 100, width: 100, height: 100 };
      }
      return {
        ...box,
        right: box.left + box.width,
        bottom: box.top + box.height,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };
    });
    function Grid() {
      const [items, setItems] = React.useState(rows("a", "b", "c", "d"));
      return (
        <Dnd.Root>
          <Dnd.Sortable
            aria-label="list"
            axis="grid"
            items={items}
            getId={(row) => row.id}
            onReorder={(id, before) =>
              setItems((current) => moveBefore(current, id, before, (row) => row.id))
            }
            renderItem={(row) => (
              <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
                {row.id}
              </Dnd.SortableItem>
            )}
          />
        </Dnd.Root>
      );
    }
    render(<Grid />);
    expect(screen.getByLabelText("list")).toHaveAttribute("data-axis", "grid");
    expect(screen.getByTestId("row-a")).toHaveAttribute(
      "aria-keyshortcuts",
      "Alt+ArrowLeft Alt+ArrowRight",
    );
    // a, grabbed at its centre, carried into the second row over d's cell.
    pressOn(screen.getByTestId("row-a"), 50, 50);
    moveTo(150, 150);
    releaseAt(150, 150);
    expect(order()).toEqual(["b", "c", "d", "a"]);
    fireEvent.keyDown(screen.getByTestId("row-b"), { key: "ArrowRight", altKey: true });
    expect(order()).toEqual(["c", "b", "d", "a"]);
  });
});

describe('table rows (`as="tbody"`)', () => {
  function Rows({ onReorder }: { onReorder?: (id: string, before: string | null) => unknown }) {
    const [items, setItems] = React.useState(rows("a", "b", "c"));
    return (
      <Dnd.Root>
        <table>
          <thead>
            <tr>
              <th>Этап</th>
              <th>Сделки</th>
            </tr>
          </thead>
          <Dnd.Sortable
            as="tbody"
            aria-label="list"
            items={items}
            getId={(row) => row.id}
            header={
              <tr data-testid="heading">
                <th colSpan={2}>Продажи</th>
              </tr>
            }
            onReorder={async (id, before) => {
              await onReorder?.(id, before);
              setItems((current) => moveBefore(current, id, before, (row) => row.id));
            }}
            renderItem={(row) => (
              <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
                <td>{row.id}</td>
                <td>1</td>
              </Dnd.SortableItem>
            )}
          />
        </table>
      </Dnd.Root>
    );
  }

  it("renders tr items after the heading row; the gap is a row across every column", async () => {
    render(<Rows />);
    const body = screen.getByLabelText("list");
    expect(body.tagName).toBe("TBODY");
    expect(body.firstElementChild).toBe(screen.getByTestId("heading"));
    expect(screen.getByTestId("row-a").tagName).toBe("TR");
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 30);
    const gap = document.querySelector<HTMLTableRowElement>("tr[data-dnd-gap]");
    expect(gap?.cells[0]?.colSpan).toBe(2);
    await act(async () => {
      releaseAt(10, 30);
    });
    expect(order()).toEqual(["b", "a", "c"]);
  });

  it("carries a row inside a copy of its table with every column at its width", () => {
    render(<Rows />);
    pressOn(screen.getByTestId("row-b"), 10, 25);
    moveTo(10, 60);
    const copy = document.querySelector("[data-dnd-overlay] table");
    expect(copy).not.toBeNull();
    expect(copy?.querySelectorAll("col")).toHaveLength(2);
    expect(copy?.querySelector("tbody > tr")).toHaveTextContent("b");
    expect(copy?.querySelector("[data-dnd-item]")).toBeNull();
    releaseAt(10, 60);
  });

  it("keeps a pending move drawn and rolls a rejected one back", async () => {
    let reject: (reason: unknown) => void = () => {};
    render(
      <Rows
        onReorder={() =>
          new Promise((_, fail) => {
            reject = fail;
          })
        }
      />,
    );
    await act(async () => {
      fireEvent.keyDown(screen.getByTestId("row-a"), { key: "ArrowDown", altKey: true });
    });
    expect(order()).toEqual(["b", "a", "c"]);
    await act(async () => {
      reject(new Error("refused"));
    });
    expect(order()).toEqual(["a", "b", "c"]);
  });
});

describe("one session", () => {
  it("a Dnd.Root inside another is its children: one live region, one overlay", () => {
    render(
      <Dnd.Root>
        <Dnd.Root>
          <Dnd.Draggable kind="card" id="c1" aria-label="Счёт 1042">
            Счёт 1042
          </Dnd.Draggable>
        </Dnd.Root>
      </Dnd.Root>,
    );
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });
});

describe("keyboard target", () => {
  it("with `handle` the grip carries the shortcuts and the role description, not the item", () => {
    render(<Sortable initial={rows("a", "b")} handle />);
    const row = screen.getByTestId("row-a");
    expect(row).not.toHaveAttribute("aria-keyshortcuts");
    expect(row).not.toHaveAttribute("aria-roledescription");
    expect(row).not.toHaveAttribute("tabindex");
    const grip = screen.getByTestId("grip-a");
    expect(grip).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowUp Alt+ArrowDown");
    expect(grip).toHaveAttribute("aria-roledescription", "перетаскиваемый элемент");
  });

  it("a named div item is a button with a role description; an unnamed one stays generic", () => {
    render(
      <Dnd.Root>
        <Dnd.Sortable
          aria-label="list"
          items={rows("a", "b")}
          getId={(row) => row.id}
          onReorder={() => {}}
          renderItem={(row) => (
            <Dnd.SortableItem
              id={row.id}
              data-testid={`row-${row.id}`}
              aria-labelledby={row.id === "a" ? "title-a" : undefined}
            >
              <span id={`title-${row.id}`}>Задача {row.id}</span>
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>,
    );
    const named = screen.getByRole("button", { name: "Задача a" });
    expect(named).toBe(screen.getByTestId("row-a"));
    expect(named).toHaveAttribute("aria-roledescription", "перетаскиваемый элемент");
    const unnamed = screen.getByTestId("row-b");
    expect(unnamed).not.toHaveAttribute("role");
    expect(unnamed).not.toHaveAttribute("aria-roledescription");
    expect(unnamed).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowUp Alt+ArrowDown");
  });

  it("a named Dnd.Draggable is a button; an unnamed one has no role description", () => {
    render(
      <Dnd.Root>
        <Dnd.Draggable kind="card" id="c1" aria-label="Счёт 1042">
          Счёт 1042
        </Dnd.Draggable>
        <Dnd.Draggable kind="card" id="c2" data-testid="plain">
          Счёт 1043
        </Dnd.Draggable>
      </Dnd.Root>,
    );
    expect(screen.getByRole("button", { name: "Счёт 1042" })).toHaveAttribute(
      "aria-roledescription",
    );
    expect(screen.getByTestId("plain")).not.toHaveAttribute("aria-roledescription");
  });
});

describe("the lock", () => {
  it("is a named image; the grip of a locked item turns into it with its ref and attributes", () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <Dnd.Root>
        <DndLock aria-label="Системная колонка" data-testid="lock" />
        <Dnd.Sortable
          aria-label="list"
          handle
          items={rows("a")}
          getId={(row) => row.id}
          onReorder={() => {}}
          renderItem={(row) => (
            <Dnd.SortableItem id={row.id} locked>
              <Dnd.Handle ref={ref} data-testid="grip" className="grip" />
              {row.id}
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>,
    );
    expect(screen.getByTestId("lock")).toHaveAccessibleName("Системная колонка");
    const grip = screen.getByTestId("grip");
    expect(grip).toBe(ref.current);
    expect(grip.tagName).toBe("SPAN");
    expect(grip).toHaveClass("grip");
    expect(grip).toHaveAccessibleName("Закреплено");
  });
});

describe("a move being saved", () => {
  it("the item is busy and still, its grip is busy, until the promise settles", async () => {
    let resolve: () => void = () => {};
    const onReorder = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    render(
      <Dnd.Root>
        <Dnd.Sortable
          aria-label="list"
          handle
          items={rows("a", "b", "c")}
          getId={(row) => row.id}
          onReorder={onReorder}
          renderItem={(row) => (
            <Dnd.SortableItem id={row.id} data-testid={`row-${row.id}`}>
              <Dnd.Handle data-testid={`grip-${row.id}`} />
              {row.id}
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>,
    );
    await act(async () => {
      fireEvent.keyDown(screen.getByTestId("grip-a"), { key: "ArrowDown", altKey: true });
    });
    expect(screen.getByTestId("row-a")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("grip-a")).toHaveAttribute("aria-busy", "true");
    // Still while saved: another move of the same item waits.
    fireEvent.keyDown(screen.getByTestId("grip-a"), { key: "ArrowDown", altKey: true });
    expect(onReorder).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolve();
    });
    expect(screen.getByTestId("row-a")).not.toHaveAttribute("aria-busy");
  });
});

describe("drag state on the list", () => {
  it("every list that may take the item is marked while it is carried", () => {
    render(<Sortable initial={rows("a", "b")} />);
    const list = screen.getByLabelText("list");
    expect(list).not.toHaveAttribute(DND_CARRYING_ATTRIBUTE);
    pressOn(screen.getByTestId("row-a"), 10, 5);
    moveTo(10, 25);
    expect(list).toHaveAttribute(DND_CARRYING_ATTRIBUTE);
    releaseAt(10, 25);
    expect(list).not.toHaveAttribute(DND_CARRYING_ATTRIBUTE);
  });

  it("the click after a drop into another list is no press on the item drawn there", () => {
    const onClick = vi.fn();
    function Two() {
      const [cols, setCols] = React.useState<Record<string, Row[]>>({
        left: rows("a"),
        right: rows("x"),
      });
      return (
        <Dnd.Root>
          {(["left", "right"] as const).map((name) => (
            <Dnd.Sortable
              key={name}
              kind="card"
              aria-label={name}
              items={cols[name] ?? []}
              getId={(row) => row.id}
              onReorder={(id) =>
                setCols({ left: name === "left" ? rows("a", "x") : [], right: rows("x", id) })
              }
              renderItem={(row) => (
                <Dnd.SortableItem id={row.id} data-testid={`${name}-${row.id}`} onClick={onClick}>
                  {row.id}
                </Dnd.SortableItem>
              )}
            />
          ))}
        </Dnd.Root>
      );
    }
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const left = this.closest('[aria-label="right"]') ? 200 : 0;
      const item = this.hasAttribute("data-dnd-item");
      const width = this.hasAttribute("data-lifted") ? 0 : 100;
      const height = item ? ROW_HEIGHT : 300;
      return {
        left,
        top: 0,
        right: left + width,
        bottom: height,
        width,
        height,
        x: left,
        y: 0,
        toJSON: () => ({}),
      };
    });
    render(<Two />);
    pressOn(screen.getByTestId("left-a"), 10, 5);
    moveTo(250, 250);
    releaseAt(250, 250);
    fireEvent.click(screen.getByTestId("right-a"));
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("right-a"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
