import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { withMotion } from "@/test/motion";

import enterMotion from "./enterMotion.module.css";
import { usePartPresence } from "./partPresence";

function Field({ value }: { value: string }) {
  const clear = usePartPresence<HTMLButtonElement>({ present: value !== "", axis: "inline" });
  return (
    <div data-testid="row">
      <span>{value || "Пусто"}</span>
      {value !== "" ? (
        <button type="button" ref={clear.ref} className={clear.className}>
          Очистить
        </button>
      ) : null}
    </div>
  );
}

const clearButton = () => screen.queryByRole("button", { name: "Очистить" });

describe("usePartPresence", () => {
  it("a part present on the first render is just there", () => {
    render(<Field value="Москва" />);
    expect(clearButton()).not.toHaveClass(enterMotion.enter);
  });

  it("a part that appears later enters", () => {
    const { rerender } = render(<Field value="" />);
    expect(clearButton()).toBeNull();
    rerender(<Field value="Казань" />);
    expect(clearButton()).toHaveClass(enterMotion.enter);
    // It stays the part that entered: later renders do not replay or drop the class.
    rerender(<Field value="Казань, склад" />);
    expect(clearButton()).toHaveClass(enterMotion.enter);
  });

  it("a part that leaves closes up in place", async () => {
    const motion = withMotion();
    const { rerender } = render(<Field value="Москва" />);
    rerender(<Field value="" />);
    expect(clearButton()).toBeNull();
    await act(async () => {
      await Promise.resolve();
    });
    // The inert copy stands where the part was and closes up along the inline axis.
    const ghost = screen.getByTestId("row").querySelector("[data-leaving]") as HTMLElement;
    expect(ghost).toHaveAttribute("aria-hidden", "true");
    expect(motion.on(ghost)).toHaveLength(1);
    motion.finishAll();
    expect(screen.getByTestId("row").querySelector("[data-leaving]")).toBeNull();
  });

  it("a part the host unmounts with itself leaves no copy", async () => {
    withMotion();
    const { container, unmount } = render(<Field value="Москва" />);
    unmount();
    await act(async () => {
      await Promise.resolve();
    });
    expect(container.innerHTML).toBe("");
  });
});
