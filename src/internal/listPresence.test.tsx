import { act, render, renderHook, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { withMotion } from "@/test/motion";

import { type ListPresence, useListItemPresence, useListPresence } from "./listPresence";

describe("useListPresence", () => {
  const run = (initial: string[]) =>
    renderHook(({ keys }) => useListPresence(keys), { initialProps: { keys: initial } });

  it("the first render enters nothing", () => {
    const { result } = run(["a", "b"]);
    expect([...result.current.entering]).toEqual([]);
    expect(result.current.settle).toBe(0);
  });

  it("new keys enter and the rows glide", () => {
    const { result, rerender } = run(["a", "b"]);
    rerender({ keys: ["c", "a", "b"] });
    expect([...result.current.entering]).toEqual(["c"]);
    expect([...result.current.leaving]).toEqual([]);
    expect(result.current.settle).toBe(1);
  });

  it("a plain removal closes up in place: the rows below follow, no glide", () => {
    const { result, rerender } = run(["a", "b", "c"]);
    rerender({ keys: ["a", "c"] });
    expect([...result.current.leaving]).toEqual(["b"]);
    expect(result.current.settle).toBe(0);
  });

  it("a move glides every row and closes nothing", () => {
    const { result, rerender } = run(["a", "b", "c"]);
    rerender({ keys: ["c", "a"] });
    expect([...result.current.leaving]).toEqual([]);
    expect(result.current.settle).toBe(1);
  });

  it("the same order keeps the same state", () => {
    const { result, rerender } = run(["a", "b"]);
    rerender({ keys: ["c", "a", "b"] });
    rerender({ keys: ["c", "a", "b"] });
    expect([...result.current.entering]).toEqual(["c"]);
    expect(result.current.settle).toBe(1);
  });
});

describe("useListItemPresence", () => {
  function Row({ list, id }: { list: ListPresence; id: string }) {
    const ref = React.useRef<HTMLLIElement>(null);
    const entered = useListItemPresence(list, id, ref, "block");
    return (
      <li ref={ref} data-entered={entered || undefined}>
        {id}
      </li>
    );
  }
  function Rows({ keys }: { keys: string[] }) {
    const list = useListPresence(keys);
    return (
      <ul data-testid="list">
        {keys.map((key) => (
          <Row key={key} list={list} id={key} />
        ))}
      </ul>
    );
  }

  it("a new row says it entered; one taken out closes up in place", async () => {
    const motion = withMotion();
    const { rerender } = render(<Rows keys={["Счёт 14", "Счёт 15"]} />);
    expect(screen.getByText("Счёт 14")).not.toHaveAttribute("data-entered");
    rerender(<Rows keys={["Счёт 13", "Счёт 14", "Счёт 15"]} />);
    expect(screen.getByText("Счёт 13")).toHaveAttribute("data-entered");
    rerender(<Rows keys={["Счёт 13", "Счёт 15"]} />);
    await act(async () => {
      await Promise.resolve();
    });
    const ghost = screen.getByTestId("list").querySelector("[data-leaving]") as HTMLElement;
    expect(ghost).toHaveTextContent("Счёт 14");
    expect(motion.on(ghost)).toHaveLength(1);
  });
});
