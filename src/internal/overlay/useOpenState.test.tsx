import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useOpenState } from "./useOpenState";

describe("useOpenState", () => {
  it("is the open triad: uncontrolled from defaultOpen, reporting each change", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useOpenState({ defaultOpen: true, onOpenChange }));
    expect(result.current[0]).toBe(true);
    act(() => result.current[1]((open) => !open));
    expect(result.current[0]).toBe(false);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("follows a controlled open", () => {
    const { result, rerender } = renderHook(({ open }) => useOpenState({ open }), {
      initialProps: { open: false },
    });
    expect(result.current[0]).toBe(false);
    rerender({ open: true });
    expect(result.current[0]).toBe(true);
  });

  it("renders a disabled owner closed and ignores a request to open", () => {
    const onOpenChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ disabled }) => useOpenState({ defaultOpen: true, disabled, onOpenChange }),
      { initialProps: { disabled: true } },
    );
    expect(result.current[0]).toBe(false);
    act(() => result.current[1](true));
    expect(result.current[0]).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
    // Enabled again, the state it kept shows.
    rerender({ disabled: false });
    expect(result.current[0]).toBe(true);
  });

  it("lets a disabled owner close", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useOpenState({ defaultOpen: true, disabled: true, onOpenChange }),
    );
    act(() => result.current[1](false));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
