import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { withMotion } from "@/test/motion";

import enterMotion from "./enterMotion.module.css";
import { RowCells } from "./rowCells";

function Language() {
  return <button type="button">RU</button>;
}

function Period() {
  return <button type="button">Всё время</button>;
}

function More() {
  return <button type="button">Ещё</button>;
}

function Row({ tab }: { tab: "text" | "stats" | "none" }) {
  return (
    <div data-testid="row">
      <RowCells align="end">
        {tab === "text" ? <Language /> : tab === "stats" ? <Period /> : null}
        <More />
      </RowCells>
    </div>
  );
}

const cells = () => [...screen.getByTestId("row").children] as HTMLElement[];

describe("RowCells", () => {
  it("another control in the same place cross-fades inside the same cell, the rest stay", () => {
    const motion = withMotion();
    const fadesOn = (node: Element) =>
      motion.on(node).map((run) => (run.keyframes as Keyframe[]).map((frame) => frame.opacity));
    const { rerender } = render(<Row tab="text" />);
    const [first, second] = cells();
    const more = screen.getByRole("button", { name: "Ещё" });

    rerender(<Row tab="stats" />);

    // One cell per place: the cells are the same elements, nothing entered or left.
    expect(cells()).toEqual([first, second]);
    expect(first).toHaveAttribute("data-axis", "inline");
    expect(first).toHaveAttribute("data-align", "end");
    expect(first).not.toHaveClass(enterMotion.enter);
    // The old control fades out over the new one inside the cell; the new one fades in.
    const leaving = screen.getByText("RU").parentElement as HTMLElement;
    expect(fadesOn(leaving)).toEqual([[1, 0]]);
    expect(leaving).toHaveAttribute("inert");
    expect(fadesOn(screen.getByText("Всё время").parentElement as HTMLElement)).toEqual([[0, 1]]);
    // The control beyond the cell is untouched.
    expect(screen.getByRole("button", { name: "Ещё" })).toBe(more);
    expect(motion.on(more.parentElement as HTMLElement)).toHaveLength(0);
  });

  it("glides the cell's width from the old control's to the new one's", () => {
    withMotion();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const width = this.dataset.state === "closed" ? 80 : 160;
      return { width, height: 32 } as DOMRect;
    });
    const { rerender } = render(<Row tab="text" />);
    const [cell] = cells();
    const setProperty = vi.spyOn(cell.style, "setProperty");
    rerender(<Row tab="stats" />);
    expect(cell).toHaveAttribute("data-resizing", "true");
    expect(setProperty.mock.calls).toEqual([
      ["--swap-size", "80px"],
      ["--swap-size", "160px"],
    ]);
  });

  it("a control shown later rises in its own cell; the first render is still", async () => {
    withMotion();
    const { rerender } = render(<Row tab="none" />);
    expect(cells()).toHaveLength(1);
    expect(cells()[0]).not.toHaveClass(enterMotion.enter);
    const more = screen.getByRole("button", { name: "Ещё" });
    await act(async () => {});
    rerender(<Row tab="text" />);
    expect(cells()).toHaveLength(2);
    expect(cells()[0]).toHaveClass(enterMotion.enter);
    expect(cells()[1]).not.toHaveClass(enterMotion.enter);
    expect(screen.getByRole("button", { name: "Ещё" })).toBe(more);
  });

  it("a control that goes closes up in place as a still copy", async () => {
    withMotion();
    const { rerender } = render(<Row tab="text" />);
    rerender(<Row tab="none" />);
    await act(async () => {});
    const ghost = screen.getByTestId("row").querySelector<HTMLElement>("[data-leaving]");
    expect(ghost).not.toBeNull();
    expect(ghost?.style.getPropertyValue("animation")).toBe("none");
    expect(ghost).toHaveAttribute("aria-hidden", "true");
  });
});
