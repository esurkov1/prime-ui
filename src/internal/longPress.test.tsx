import { act, fireEvent, render, screen } from "@testing-library/react";

import { PRESS_SLOP_PX, useLongPress } from "./longPress";

// The default hold of useLongPress.
const LONG_PRESS_MS = 500;

function Row({
  onLongPress,
  onClick,
  enabled,
}: {
  onLongPress: (point: { x: number; y: number }) => void;
  onClick?: (fired: boolean) => void;
  enabled?: boolean;
}) {
  const { handlers, takeFired } = useLongPress({ onLongPress, enabled });
  return (
    <button type="button" {...handlers} onClick={() => onClick?.(takeFired())}>
      Заказ 1042
    </button>
  );
}

const touch = (x: number, y: number) => ({ pointerType: "touch", clientX: x, clientY: y });

describe("useLongPress", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("fires once a resting finger holds, with the point it rests on", () => {
    const onLongPress = vi.fn();
    render(<Row onLongPress={onLongPress} />);
    fireEvent.pointerDown(screen.getByRole("button"), touch(10, 20));
    act(() => vi.advanceTimersByTime(LONG_PRESS_MS - 1));
    expect(onLongPress).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onLongPress).toHaveBeenCalledWith({ x: 10, y: 20 });
  });

  it("gives up when the finger moves past the slop, lifts, or the press is a mouse", () => {
    const onLongPress = vi.fn();
    render(<Row onLongPress={onLongPress} />);
    const row = screen.getByRole("button");
    fireEvent.pointerDown(row, touch(0, 0));
    fireEvent.pointerMove(row, touch(PRESS_SLOP_PX + 1, 0));
    fireEvent.pointerDown(row, touch(0, 0));
    fireEvent.pointerUp(row, touch(0, 0));
    fireEvent.pointerDown(row, { pointerType: "mouse", clientX: 0, clientY: 0 });
    act(() => vi.advanceTimersByTime(LONG_PRESS_MS * 2));
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it("answers once that the press ended as a long press, and stays off when disabled", () => {
    const onClick = vi.fn();
    const { rerender } = render(<Row onLongPress={() => {}} onClick={onClick} />);
    const row = screen.getByRole("button");
    fireEvent.pointerDown(row, touch(0, 0));
    act(() => vi.advanceTimersByTime(LONG_PRESS_MS));
    fireEvent.click(row);
    fireEvent.click(row);
    expect(onClick.mock.calls).toEqual([[true], [false]]);

    const onLongPress = vi.fn();
    rerender(<Row onLongPress={onLongPress} enabled={false} />);
    fireEvent.pointerDown(row, touch(0, 0));
    act(() => vi.advanceTimersByTime(LONG_PRESS_MS));
    expect(onLongPress).not.toHaveBeenCalled();
  });
});
