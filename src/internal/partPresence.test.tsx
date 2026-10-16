import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { withMotion } from "@/test/motion";

import enterMotion from "./enterMotion.module.css";
import { useEnterOnAppear, usePartPresence } from "./partPresence";

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

function Notice({ text, error }: { text: string; error?: boolean }) {
  const appear = useEnterOnAppear<HTMLParagraphElement>(error ?? true);
  return (
    <p ref={appear.ref} className={appear.entering ? enterMotion.enter : undefined}>
      {text}
    </p>
  );
}

function Screen({ shown, wrapped }: { shown: boolean; wrapped?: boolean }) {
  const notice = shown ? <Notice text="Счёт отправлен" /> : null;
  return <section>{wrapped && shown ? <div>{notice}</div> : notice}</section>;
}

const notice = (text = "Счёт отправлен") => screen.getByText(text);

describe("useEnterOnAppear", () => {
  it("a part that mounts with its page is just there", () => {
    render(<Screen shown />);
    expect(notice()).not.toHaveClass(enterMotion.enter);
  });

  it("a part inserted on its own into a shown host enters", async () => {
    const { rerender } = render(<Screen shown={false} />);
    await act(async () => {});
    rerender(<Screen shown />);
    expect(notice()).toHaveClass(enterMotion.enter);
  });

  it("a part that comes with a new region of a shown host is that region's", async () => {
    const { rerender } = render(<Screen shown={false} wrapped />);
    await act(async () => {});
    rerender(<Screen shown wrapped />);
    expect(notice()).not.toHaveClass(enterMotion.enter);
  });

  it("a mounted part enters when it turns on, not before", () => {
    const { rerender } = render(<Notice text="Проверьте ИНН" error={false} />);
    expect(notice("Проверьте ИНН")).not.toHaveClass(enterMotion.enter);
    rerender(<Notice text="Проверьте ИНН" error />);
    expect(notice("Проверьте ИНН")).toHaveClass(enterMotion.enter);
    rerender(<Notice text="Проверьте ИНН" error={false} />);
    expect(notice("Проверьте ИНН")).not.toHaveClass(enterMotion.enter);
  });
});
