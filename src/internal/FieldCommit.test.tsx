import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { type FieldCommitHandler, FieldCommitStatus, useFieldCommit } from "./FieldCommit";

const LABELS = { saving: "Сохраняется", saved: "Сохранено" };

function Field({ onCommit }: { onCommit: FieldCommitHandler }) {
  const ref = React.useRef<HTMLInputElement>(null);
  const commit = useFieldCommit(ref, onCommit);
  return (
    <>
      <input
        ref={ref}
        aria-label="Название"
        defaultValue="Поставка"
        onFocus={commit.sync}
        onBlur={commit.commit}
        onKeyDown={(event) => {
          if (event.key === "Escape") commit.revert();
        }}
      />
      <FieldCommitStatus state={commit.state} labels={LABELS} />
    </>
  );
}

const input = () => screen.getByRole("textbox", { name: "Название" }) as HTMLInputElement;
const type = (value: string) => fireEvent.change(input(), { target: { value } });

describe("useFieldCommit", () => {
  it("saves a changed value on blur, never an unchanged one", () => {
    const onCommit = vi.fn();
    render(<Field onCommit={onCommit} />);
    fireEvent.focus(input());
    fireEvent.blur(input());
    expect(onCommit).not.toHaveBeenCalled();
    fireEvent.focus(input());
    type("Поставка №2");
    fireEvent.blur(input());
    expect(onCommit).toHaveBeenCalledWith("Поставка №2");
    expect(screen.getByRole("status")).toHaveTextContent("Сохранено");
  });

  it("Escape puts the committed value back", () => {
    render(<Field onCommit={vi.fn()} />);
    fireEvent.focus(input());
    type("Черновик");
    fireEvent.keyDown(input(), { key: "Escape" });
    expect(input().value).toBe("Поставка");
  });

  it("a pending save says so; a rejected one restores the committed value", async () => {
    let reject: () => void = () => {};
    const onCommit = vi.fn(
      () =>
        new Promise<void>((_, fail) => {
          reject = () => fail(new Error("offline"));
        }),
    );
    render(<Field onCommit={onCommit} />);
    fireEvent.focus(input());
    type("Поставка №3");
    fireEvent.blur(input());
    expect(screen.getByRole("status")).toHaveTextContent("Сохраняется");
    await act(async () => reject());
    expect(input().value).toBe("Поставка");
    expect(screen.getByRole("status")).toHaveTextContent("");
  });
});
