import { act, fireEvent, render, screen, within } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Dnd } from "./Dnd";
import { insertionBefore } from "./geometry";
import { moveBefore } from "./useSortableList";

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
            onReorder={async () => ({ ok: false })}
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

  it("flashes after a drop until the flash animation ends", async () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
    const animation = { cancel: () => {}, addEventListener: () => {} };
    Object.defineProperty(HTMLElement.prototype, "animate", {
      configurable: true,
      value: () => animation,
    });
    try {
      render(
        <Dnd.Root>
          <Dnd.Draggable kind="card" id="c1" data-testid="card">
            Card
          </Dnd.Draggable>
          <Dnd.DropZone accepts="card" data-testid="zone" flashOnDrop onDrop={() => {}}>
            <span data-testid="inner">Zone</span>
          </Dnd.DropZone>
        </Dnd.Root>,
      );
      pressOn(screen.getByTestId("card"), 10, 10);
      moveTo(300, 100);
      releaseAt(300, 100);
      const zone = screen.getByTestId("zone");
      expect(zone).toHaveAttribute("data-dnd-flash");
      // An animation of a child is not the zone's flash.
      fireEvent.animationEnd(screen.getByTestId("inner"));
      expect(zone).toHaveAttribute("data-dnd-flash");
      fireEvent.animationEnd(zone);
      expect(zone).not.toHaveAttribute("data-dnd-flash");
      // The overlay lands in a microtask after the drop.
      await act(async () => {});
    } finally {
      vi.unstubAllGlobals();
      Reflect.deleteProperty(HTMLElement.prototype, "animate");
    }
  });

  it("does not flash under reduced motion (no animation would end it)", () => {
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
        vi.advanceTimersByTime(200);
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
        vi.advanceTimersByTime(300);
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
      expect(animate).not.toHaveBeenCalled();
      await act(async () => {
        releaseAt(10, 64);
      });
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
});
