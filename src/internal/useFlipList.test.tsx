import { act, render } from "@testing-library/react";
import * as React from "react";

import { layoutRect, useFlipList } from "./useFlipList";

const ROW = 20;

/** jsdom lays nothing out: rows stack in document order, the list starts at the origin. */
function stubLayout() {
  return vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const index = this.dataset.row
      ? Array.from(this.parentElement?.children ?? []).indexOf(this)
      : 0;
    const height = this.dataset.row ? ROW : 200;
    return {
      left: 0,
      top: index * ROW,
      right: 200,
      bottom: index * ROW + height,
      width: 200,
      height,
      x: 0,
      y: index * ROW,
      toJSON: () => ({}),
    } as DOMRect;
  });
}

const rowsOf = (list: HTMLElement) => list.querySelectorAll<HTMLElement>("[data-row]");
const keyOf = (row: HTMLElement) => row.dataset.row;

function List({ order, settle = 0 }: { order: string[]; settle?: number }) {
  const [list, setList] = React.useState<HTMLUListElement | null>(null);
  useFlipList({
    container: list,
    nodes: rowsOf,
    keyOf,
    layoutKey: order.join(),
    settle,
  });

  return (
    <ul ref={setList}>
      {order.map((id) => (
        <li key={id} data-row={id}>
          {id}
        </li>
      ))}
    </ul>
  );
}

describe("useFlipList", () => {
  let animate: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    stubLayout();
    animate = vi.fn(() => ({ addEventListener: () => {}, cancel: () => {} }));
    HTMLElement.prototype.animate = animate as unknown as HTMLElement["animate"];
    // Motion on: the test setup prefers reduced motion.
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete (HTMLElement.prototype as Partial<HTMLElement>).animate;
  });

  it("glides the rows that moved from where they stood when a settle is asked for", () => {
    const { rerender } = render(<List order={["a", "b", "c"]} />);
    rerender(<List order={["c", "a", "b"]} settle={1} />);
    const moved = animate.mock.calls.map(([frames]) => frames[0].transform);
    // c came up two rows, a and b went down one.
    expect(moved).toEqual([
      "translate(0px, 40px)",
      "translate(0px, -20px)",
      "translate(0px, -20px)",
    ]);
  });

  it("a new order without a settle (or a drag) jumps", () => {
    const { rerender } = render(<List order={["a", "b"]} />);
    rerender(<List order={["b", "a"]} />);
    expect(animate).not.toHaveBeenCalled();
  });

  it("capture() glides the change made with it from the boxes read now", () => {
    function Board() {
      const [order, setOrder] = React.useState(["a", "b"]);
      const [list, setList] = React.useState<HTMLUListElement | null>(null);
      // No layout key: only a capture glides.
      const { capture } = useFlipList({ container: list, nodes: rowsOf, keyOf });
      return (
        <>
          <button
            type="button"
            onClick={() => {
              capture();
              setOrder((current) => [...current].reverse());
            }}
          >
            Вернуть
          </button>
          <ul ref={setList}>
            {order.map((id) => (
              <li key={id} data-row={id}>
                {id}
              </li>
            ))}
          </ul>
        </>
      );
    }
    const { getByRole } = render(<Board />);
    act(() => getByRole("button").click());
    expect(animate).toHaveBeenCalledTimes(2);
  });

  it("measures an element's layout box with a running glide taken out", () => {
    const node = document.createElement("div");
    node.dataset.row = "x";
    document.body.append(node);
    expect(layoutRect(node)).toMatchObject({ top: 0, height: ROW, width: 200 });
  });
});
