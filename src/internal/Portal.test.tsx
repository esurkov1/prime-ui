import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Portal } from "./Portal";

describe("Portal", () => {
  it("renders its children into document.body, outside the parent", () => {
    const { container, unmount } = render(
      <div>
        <Portal>
          <p>Счёт отправлен</p>
        </Portal>
      </div>,
    );
    const text = screen.getByText("Счёт отправлен");
    expect(container.contains(text)).toBe(false);
    expect(text.parentElement).toBe(document.body);
    unmount();
    expect(screen.queryByText("Счёт отправлен")).toBeNull();
  });

  it("renders into the container it is given", () => {
    const host = document.createElement("div");
    document.body.append(host);
    render(
      <Portal container={host}>
        <p>Счёт отправлен</p>
      </Portal>,
    );
    expect(screen.getByText("Счёт отправлен").parentElement).toBe(host);
    host.remove();
  });
});
