import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/button/Button";
import { swipe } from "@/test/mobile";
import { describeOverlayConformance } from "@/test/overlayConformance";

import { Sheet, type SheetRootProps } from "./Sheet";

/** The scrim: the sibling before the sheet panel. */
function sheetScrim() {
  return screen.getByRole("dialog").previousElementSibling as HTMLElement;
}

/** A sheet with a header and a body. */
function TitledSheet(props: Omit<SheetRootProps, "children">) {
  return (
    <Sheet.Root {...props}>
      <Sheet.Trigger>
        <Button.Root>Open</Button.Root>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>Действия с заказом</Sheet.Title>
        </Sheet.Header>
        <Sheet.Body>
          <p>Body content</p>
          <Button.Root>Повторить заказ</Button.Root>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  );
}

/** The content alone: no header, no footer, named by aria-label. */
function BareSheet(props: Omit<SheetRootProps, "children">) {
  return (
    <Sheet.Root {...props}>
      <Sheet.Trigger>
        <Button.Root>Open</Button.Root>
      </Sheet.Trigger>
      <Sheet.Content aria-label="Дата отгрузки">
        <Sheet.Body>
          <Button.Root>8 марта</Button.Root>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  );
}

function openSheet() {
  fireEvent.click(screen.getByRole("button", { name: "Open" }));
}

async function expectClosed() {
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
}

const handleOf = (dialog: HTMLElement) =>
  dialog.querySelector("[data-swipe-handle]") as HTMLElement;
const headerOf = (dialog: HTMLElement) => dialog.querySelector("header") as HTMLElement;

describe("Sheet", () => {
  it("opens from Trigger as a modal dialog with a hidden grab handle first", () => {
    render(<TitledSheet />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    openSheet();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).toHaveAttribute("data-depth", "floating");
    expect(handleOf(dialog)).toHaveAttribute("aria-hidden", "true");
    expect(handleOf(dialog)).toBe(dialog.firstElementChild);
  });

  it("names the dialog from its Title, or from aria-label without a header", () => {
    const { unmount } = render(<TitledSheet defaultOpen />);
    expect(screen.getByRole("dialog", { name: "Действия с заказом" })).toBeInTheDocument();
    unmount();

    render(<BareSheet defaultOpen />);
    const dialog = screen.getByRole("dialog", { name: "Дата отгрузки" });
    expect(dialog.querySelector("header")).toBeNull();
    expect(dialog.querySelector("footer")).toBeNull();
  });

  it("the header keeps its close button", async () => {
    render(<TitledSheet />);
    openSheet();
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    await expectClosed();
  });

  it("closes by Escape unless closeOnEscape={false}", async () => {
    const { unmount } = render(<BareSheet />);
    openSheet();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    await expectClosed();
    unmount();

    render(<BareSheet closeOnEscape={false} />);
    openSheet();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("closes by a scrim click unless closeOnOutsideClick={false}", async () => {
    const { unmount } = render(<BareSheet />);
    openSheet();
    fireEvent.pointerDown(sheetScrim());
    fireEvent.click(sheetScrim());
    await expectClosed();
    unmount();

    render(<BareSheet closeOnOutsideClick={false} />);
    openSheet();
    fireEvent.pointerDown(sheetScrim());
    fireEvent.click(sheetScrim());
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("closes with a swipe down from the handle or the header", async () => {
    render(<TitledSheet />);
    openSheet();
    swipe(handleOf(screen.getByRole("dialog")), { x: 0, y: 0 }, { x: 0, y: 300 });
    await expectClosed();
    openSheet();
    swipe(headerOf(screen.getByRole("dialog")), { x: 0, y: 0 }, { x: 0, y: 300 });
    await expectClosed();
  });

  it("ignores a swipe that starts in its body", () => {
    render(<TitledSheet />);
    openSheet();
    swipe(screen.getByText("Body content"), { x: 0, y: 0 }, { x: 0, y: 300 });
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("the scrim thins with the drag", () => {
    render(<BareSheet />);
    openSheet();
    const scrim = sheetScrim();
    swipe(handleOf(screen.getByRole("dialog")), { x: 0, y: 0 }, { x: 0, y: 300 });
    // jsdom has no layout: the panel is 0 high, so any drag counts as all the way out.
    expect(scrim.style.getPropertyValue("--swipe-progress")).toBe("1");
  });

  it("swiping follows closeOnOutsideClick: off, there is no handle and no swipe", () => {
    render(<TitledSheet closeOnOutsideClick={false} />);
    openSheet();
    const dialog = screen.getByRole("dialog");
    expect(handleOf(dialog)).toBeNull();
    swipe(headerOf(dialog), { x: 0, y: 0 }, { x: 0, y: 300 });
    expect(dialog).toHaveAttribute("data-state", "open");
  });

  it("notifies onOpenChange(false) when controlled", () => {
    const onOpenChange = vi.fn();
    render(<BareSheet open onOpenChange={onOpenChange} />);
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("moves focus inside and returns it to the trigger", async () => {
    render(<BareSheet />);
    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    openSheet();
    await waitFor(() => {
      expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
    });
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    await expectClosed();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("uses labels.close for the header close button", () => {
    render(<TitledSheet defaultOpen labels={{ close: "Скрыть" }} />);
    expect(screen.getByRole("button", { name: "Скрыть" })).toBeInTheDocument();
  });
});

describeOverlayConformance("Sheet", {
  render: () => (
    <Sheet.Root>
      <Sheet.Trigger>
        <Button.Root>Открыть</Button.Root>
      </Sheet.Trigger>
      <Sheet.Content aria-label="Новый клиент">
        <Sheet.Body>
          <input aria-label="Компания" />
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close>
            <Button.Root variant="soft" tone="neutral">
              Отмена
            </Button.Root>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  ),
  trigger: "Открыть",
  role: "dialog",
  modal: true,
});
