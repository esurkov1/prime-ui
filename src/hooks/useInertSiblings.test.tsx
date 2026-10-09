import { render } from "@testing-library/react";
import * as React from "react";
import { createPortal } from "react-dom";

import { useInertSiblings } from "./useInertSiblings";

function Layer({ enabled }: { enabled: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useInertSiblings(enabled, ref);
  return createPortal(<div ref={ref} />, document.body);
}

describe("useInertSiblings", () => {
  it("restores the page only when the last of two nested layers lets go, in any order", () => {
    const page = document.createElement("main");
    document.body.append(page);
    const outer = render(<Layer enabled />);
    const inner = render(<Layer enabled />);
    expect(page.inert).toBe(true);

    // The outer layer goes first (a deleted tree runs its cleanups parent-first).
    outer.unmount();
    expect(page.inert).toBe(true);
    inner.unmount();
    expect(page.inert).toBeFalsy();
    page.remove();
  });
});
