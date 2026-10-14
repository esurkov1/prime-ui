import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createComponentContext } from "./context";

function errorOf(run: () => unknown): string {
  try {
    run();
  } catch (error) {
    return (error as Error).message;
  }
  return "";
}

describe("createComponentContext", () => {
  it("names the root of a component", () => {
    const [, useInput] = createComponentContext<number>("Input");
    expect(errorOf(() => renderHook(() => useInput()))).toBe(
      "[prime-ui-kit] `Input` sub-component must be used inside `Input.Root`.",
    );
  });

  it("names a part as is, never `Radio.Group.Root`", () => {
    const [, useGroup] = createComponentContext<number>("Radio.Group");
    expect(errorOf(() => renderHook(() => useGroup()))).toBe(
      "[prime-ui-kit] `Radio.Group` sub-component must be used inside `Radio.Group`.",
    );
  });

  it("takes the parent and the calling part", () => {
    const [, useShell] = createComponentContext<number>("Modal", {
      parent: "Modal.Content, Drawer.Content or Sheet.Content",
    });
    expect(errorOf(() => renderHook(() => useShell("Modal.Footer")))).toBe(
      "[prime-ui-kit] `Modal.Footer` sub-component must be used inside `Modal.Content, Drawer.Content or Sheet.Content`.",
    );
  });

  it("returns the provided value", () => {
    const [Provider, useValue] = createComponentContext<number>("Tabs");
    const { result } = renderHook(() => useValue(), {
      wrapper: ({ children }) => <Provider value={7}>{children}</Provider>,
    });
    expect(result.current).toBe(7);
  });
});
