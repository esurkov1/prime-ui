import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { MediaViewer } from "@/components/media-viewer/MediaViewer";
import { Modal } from "@/components/modal/Modal";

/**
 * Safari does not focus a button on a click: focus stays on the `tabindex="-1"` region around it
 * (or the body). A press is fired without moving focus, as Safari does.
 */
function safariPress(control: HTMLElement) {
  fireEvent.pointerDown(control);
  fireEvent.click(control);
}

describe("opener of a modal layer", () => {
  it("is the pressed control, not the region Safari left focused", () => {
    function Page() {
      const [open, setOpen] = React.useState(false);
      return (
        <main tabIndex={-1}>
          <button type="button" onClick={() => setOpen(true)}>
            Открыть фото
          </button>
          <MediaViewer
            items={[{ src: "/dock.jpg", alt: "Склад" }]}
            open={open}
            onOpenChange={setOpen}
          />
        </main>
      );
    }
    render(<Page />);
    const region = screen.getByRole("main");
    const opener = screen.getByRole("button", { name: "Открыть фото" });
    region.focus();
    safariPress(opener);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const focus = vi.spyOn(opener, "focus");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    // Opened by a press: back without the focus ring, though a key closed it.
    expect(focus).toHaveBeenCalledWith(expect.objectContaining({ focusVisible: false }));
    // Wherever `focusVisible` is not supported, the kit hides the ring itself until the next key.
    expect(opener).toHaveAttribute("data-focus-quiet");
    fireEvent.keyDown(document, { key: "Shift" });
    expect(opener).toHaveAttribute("data-focus-quiet");
    fireEvent.keyDown(document, { key: "Tab" });
    expect(opener).not.toHaveAttribute("data-focus-quiet");
  });

  it("is the focused element when a key opened the layer", () => {
    function Page() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Изменить заказ
          </button>
          <Modal.Root open={open} onOpenChange={setOpen}>
            <Modal.Content aria-label="Заказ">
              <Modal.Body>Текст</Modal.Body>
            </Modal.Content>
          </Modal.Root>
        </>
      );
    }
    render(<Page />);
    const opener = screen.getByRole("button", { name: "Изменить заказ" });
    opener.focus();
    fireEvent.click(opener);
    const focus = vi.spyOn(opener, "focus");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(opener).toHaveFocus();
    // Opened by a key: the ring shows where focus lands.
    expect(focus).not.toHaveBeenCalledWith(expect.objectContaining({ focusVisible: false }));
    expect(opener).not.toHaveAttribute("data-focus-quiet");
  });
});
