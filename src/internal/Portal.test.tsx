import { act, render, screen } from "@testing-library/react";
import * as React from "react";
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

  it("content that suspends after mount is hidden by its boundary and shown again in place", async () => {
    let resolve: () => void = () => {};
    const pending = new Promise<void>((done) => {
      resolve = done;
    });
    let ready = false;
    void pending.then(() => {
      ready = true;
    });
    function History({ load }: { load: boolean }) {
      if (load && !ready) throw pending;
      return <p>История сделки</p>;
    }
    function Card({ load }: { load: boolean }) {
      return (
        <React.Suspense fallback={null}>
          <Portal>
            <section aria-label="Сделка">
              <History load={load} />
            </section>
          </Portal>
        </React.Suspense>
      );
    }
    const { rerender } = render(<Card load={false} />);
    const card = screen.getByRole("region", { name: "Сделка" });
    rerender(<Card load />);
    await act(async () => {
      resolve();
      await pending;
    });
    expect(screen.getByRole("region", { name: "Сделка" })).toBe(card);
    expect(screen.getByText("История сделки")).toBeInTheDocument();
  });
});
