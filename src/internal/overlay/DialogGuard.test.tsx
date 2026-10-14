import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Modal } from "@/components/modal/Modal";
import { Sheet } from "@/components/sheet/Sheet";
import { mockCompactViewport, swipe } from "@/test/mobile";

/**
 * `Guard` is one part shared by Modal, Drawer and Sheet (`DialogGuard` on `useDialogGuard`): its
 * behaviour is tested once here, for each of them.
 */
const DIALOGS = [
  { name: "Modal", Dialog: Modal, swipes: "on a phone" },
  { name: "Drawer", Dialog: Drawer, swipes: null },
  { name: "Sheet", Dialog: Sheet, swipes: "always" },
] as const;

type GuardedProps = {
  busy?: boolean;
  dirty?: boolean;
  onOpenChange?: (open: boolean) => void;
  labels?: { discardTitle?: string };
};

/** The scrim: the sibling before the (topmost) dialog panel. */
function clickScrim() {
  const dialogs = screen.getAllByRole("dialog");
  const scrim = dialogs[dialogs.length - 1]?.previousElementSibling as HTMLElement;
  fireEvent.pointerDown(scrim);
  fireEvent.click(scrim);
}

describe.each(DIALOGS)("$name.Guard", ({ Dialog, swipes }) => {
  function Guarded({ busy, dirty, onOpenChange, labels }: GuardedProps) {
    return (
      <Dialog.Root onOpenChange={onOpenChange} labels={labels}>
        <Dialog.Trigger>
          <Button.Root>Новая сделка</Button.Root>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Новая сделка</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Guard busy={busy} dirty={dirty} />
            <input aria-label="Название" />
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close>
              <Button.Root variant="soft" tone="neutral">
                Отмена
              </Button.Root>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );
  }

  function open() {
    const opener = screen.getByRole("button", { name: "Новая сделка" });
    opener.focus();
    fireEvent.click(opener);
    return opener;
  }

  it("busy: no dismiss closes it; the close button and Close stay in place, disabled", () => {
    const onOpenChange = vi.fn();
    render(<Guarded busy onOpenChange={onOpenChange} />);
    open();
    onOpenChange.mockClear();
    fireEvent.keyDown(document, { key: "Escape" });
    clickScrim();
    expect(screen.getByRole("button", { name: "Закрыть" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Отмена" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("dirty: a dismiss asks first; «Продолжить» keeps the dialog and its changes", async () => {
    const onOpenChange = vi.fn();
    render(<Guarded dirty onOpenChange={onOpenChange} />);
    open();
    onOpenChange.mockClear();
    fireEvent.keyDown(document, { key: "Escape" });
    const confirm = await screen.findByRole("alertdialog", { name: "Не сохранять изменения?" });
    expect(confirm).toHaveAccessibleDescription("Изменения в форме пропадут.");
    // The least destructive choice takes focus.
    await waitFor(() => expect(screen.getByRole("button", { name: "Продолжить" })).toHaveFocus());
    fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("dirty: Escape closes only the confirm; «Не сохранять» closes both and returns focus", async () => {
    const onOpenChange = vi.fn();
    render(<Guarded dirty onOpenChange={onOpenChange} />);
    const opener = open();
    fireEvent.click(screen.getByRole("button", { name: "Отмена" }));
    const confirm = await screen.findByRole("alertdialog");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(confirm).not.toBeInTheDocument());
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    clickScrim();
    fireEvent.click(await screen.findByRole("button", { name: "Не сохранять" }));
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(false));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("takes the confirm texts from the Root labels", async () => {
    render(<Guarded dirty labels={{ discardTitle: "Закрыть без сохранения?" }} />);
    open();
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(
      await screen.findByRole("alertdialog", { name: "Закрыть без сохранения?" }),
    ).toBeInTheDocument();
  });

  it("closing from code is never held", async () => {
    function Controlled() {
      const [isOpen, setOpen] = React.useState(true);
      return (
        <>
          <button type="button" onClick={() => setOpen(false)}>
            Сохранено
          </button>
          <Dialog.Root open={isOpen} onOpenChange={setOpen}>
            <Dialog.Content aria-label="Сделка">
              <Dialog.Guard busy dirty />
            </Dialog.Content>
          </Dialog.Root>
        </>
      );
    }
    render(<Controlled />);
    // The dialog makes the page inert; the owner closes it from code.
    fireEvent.click(screen.getByText("Сохранено"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  describe.runIf(swipes !== null)(`swiping (${swipes})`, () => {
    let restore: () => void = () => {};
    afterEach(() => {
      restore();
      document.body.removeAttribute("style");
    });

    const handle = () =>
      screen.getByRole("dialog").querySelector("[data-swipe-handle]") as HTMLElement;

    it("dirty: a swipe glides back and asks before discarding", async () => {
      restore = mockCompactViewport();
      render(<Guarded dirty />);
      open();
      swipe(handle(), { x: 0, y: 0 }, { x: 0, y: 300 });
      expect(
        await screen.findByRole("alertdialog", { name: "Не сохранять изменения?" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("dialog")).not.toHaveAttribute("data-swipe-dismissed");
    });

    it("busy: the handle stays, the panel takes no swipe", () => {
      restore = mockCompactViewport();
      render(<Guarded busy />);
      open();
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("data-swipe-disabled");
      swipe(handle(), { x: 0, y: 0 }, { x: 0, y: 300 });
      expect(dialog).toHaveAttribute("data-state", "open");
    });
  });
});
