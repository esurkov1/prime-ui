import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { withMotion } from "@/test/motion";

import { createImageSlot } from "./imageSlot";

const slot = createImageSlot("Probe", { image: "image", fallback: "fallback" });

function Probe({ src }: { src: string }) {
  return (
    <slot.ImageSlotProvider>
      <slot.Image src={src} alt="Фото менеджера" data-fit="cover" />
      <slot.Fallback data-testid="fallback">ИП</slot.Fallback>
    </slot.ImageSlotProvider>
  );
}

const images = () => Array.from(document.querySelectorAll("img"));
const current = () => screen.getByRole("img", { name: "Фото менеджера" });

afterEach(() => {
  vi.useRealTimers();
});

describe("createImageSlot", () => {
  it("reports the load: the fallback leaves the accessibility tree once the picture is in", () => {
    render(<Probe src="/a.jpg" />);
    expect(current()).toHaveAttribute("data-status", "loading");
    expect(screen.getByTestId("fallback")).not.toHaveAttribute("aria-hidden");
    fireEvent.load(current());
    expect(current()).toHaveAttribute("data-status", "loaded");
    expect(screen.getByTestId("fallback")).toHaveAttribute("aria-hidden", "true");
  });

  it("a new source keeps the last picture under the new one until it has faded in", () => {
    withMotion();
    const { rerender } = render(<Probe src="/a.jpg" />);
    fireEvent.load(current());
    rerender(<Probe src="/b.jpg" />);
    expect(images()).toHaveLength(2);
    const [leaving, next] = images();
    expect(leaving).toHaveAttribute("src", "/a.jpg");
    expect(leaving).toHaveAttribute("aria-hidden", "true");
    expect(leaving).toHaveAttribute("data-status", "loaded");
    expect(leaving).toHaveAttribute("data-fit", "cover");
    expect(next).toBe(current());
    expect(next).toHaveAttribute("src", "/b.jpg");
    expect(next).toHaveAttribute("data-status", "loading");
    // Loaded, the new picture fades in over the old one; then the old one goes.
    fireEvent.load(next);
    expect(images()).toHaveLength(2);
    fireEvent.transitionEnd(next, { propertyName: "opacity" });
    expect(images()).toEqual([next]);
  });

  it("the old picture goes after the slow clock when no transition reports its end", () => {
    withMotion();
    vi.useFakeTimers();
    const { rerender } = render(<Probe src="/a.jpg" />);
    fireEvent.load(current());
    rerender(<Probe src="/b.jpg" />);
    fireEvent.load(current());
    expect(images()).toHaveLength(2);
    act(() => vi.advanceTimersByTime(2000));
    expect(images()).toHaveLength(1);
  });

  it("a new source that fails drops the old picture at once: the fallback shows", () => {
    withMotion();
    const { rerender } = render(<Probe src="/a.jpg" />);
    fireEvent.load(current());
    rerender(<Probe src="/missing.jpg" />);
    expect(images()).toHaveLength(2);
    fireEvent.error(current());
    expect(images()).toHaveLength(1);
    expect(current()).toHaveAttribute("data-status", "error");
    expect(screen.getByTestId("fallback")).not.toHaveAttribute("aria-hidden");
  });

  it("a picture that never loaded leaves nothing behind", () => {
    withMotion();
    const { rerender } = render(<Probe src="/a.jpg" />);
    rerender(<Probe src="/b.jpg" />);
    expect(images()).toHaveLength(1);
  });

  it("under reduced motion a new source replaces the picture at once", () => {
    const { rerender } = render(<Probe src="/a.jpg" />);
    fireEvent.load(current());
    rerender(<Probe src="/b.jpg" />);
    expect(images()).toHaveLength(1);
  });
});
