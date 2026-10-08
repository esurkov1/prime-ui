import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";
import {
  NotificationProvider,
  useNotifications,
} from "@/components/notification/NotificationStore";
import { Select } from "@/components/select/Select";
import { mockCompactViewport, swipe } from "@/test/mobile";

import { Modal, type ModalRootProps } from "./Modal";

/** The full-screen scrim around the dialog panel. */
function scrim() {
  return screen.getByRole("dialog").parentElement as HTMLElement;
}

/** A scrim dismiss is a full click that starts and ends outside the panel. */
function clickScrim() {
  const node = scrim();
  fireEvent.pointerDown(node);
  fireEvent.click(node);
}

function BasicModal({
  onConfirm,
  ...rootProps
}: Omit<ModalRootProps, "children"> & { onConfirm?: () => void }) {
  return (
    <Modal.Root {...rootProps}>
      <Modal.Trigger>
        <Button.Root>Open</Button.Root>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Icon tone="danger">
            <svg />
          </Modal.Icon>
          <Modal.Title>Test title</Modal.Title>
          <Modal.Description>Test description</Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <p>Body content</p>
          <Button.Root>Focusable inside</Button.Root>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button.Root variant="outline" tone="neutral">
              Cancel
            </Button.Root>
          </Modal.Close>
          <Modal.Confirm>
            <Button.Root onClick={onConfirm}>Confirm</Button.Root>
          </Modal.Confirm>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}

function openModal() {
  fireEvent.click(screen.getByRole("button", { name: "Open" }));
}

describe("Modal", () => {
  it("opens from Trigger", () => {
    render(<BasicModal />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    openModal();

    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("labels the dialog from Title and Description", () => {
    render(<BasicModal />);
    openModal();

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute(
      "aria-labelledby",
      screen.getByRole("heading", { name: "Test title" }).id,
    );
    expect(dialog).toHaveAttribute("aria-describedby", screen.getByText("Test description").id);
  });

  it("uses explicit aria-labelledby / aria-describedby as the part ids", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Content aria-describedby="custom-desc" aria-labelledby="custom-title">
          <Modal.Header>
            <Modal.Title>Custom</Modal.Title>
            <Modal.Description>Custom desc</Modal.Description>
          </Modal.Header>
        </Modal.Content>
      </Modal.Root>,
    );

    const dialog = screen.getByRole("dialog");
    expect(screen.getByRole("heading", { name: "Custom" })).toHaveAttribute("id", "custom-title");
    expect(screen.getByText("Custom desc")).toHaveAttribute("id", "custom-desc");
    expect(dialog).toHaveAttribute("aria-labelledby", "custom-title");
    expect(dialog).toHaveAttribute("aria-describedby", "custom-desc");
  });

  it("omits aria-describedby without a Description", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Title only</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal.Root>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", screen.getByRole("heading").id);
    expect(dialog).not.toHaveAttribute("aria-describedby");
  });

  it("renders the header icon with its tone and hides it from assistive tech", () => {
    render(<BasicModal defaultOpen />);
    const icon = screen.getByRole("dialog").querySelector("[data-tone]");
    expect(icon).toHaveAttribute("data-tone", "danger");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the header close as a small ghost icon button with labels.close", () => {
    render(<BasicModal defaultOpen labels={{ close: "Close dialog" }} />);
    const close = screen.getByRole("button", { name: "Close dialog" });
    expect(close).toHaveAttribute("data-size", "s");
    expect(close).toHaveAttribute("data-variant", "ghost");
  });

  it("hides the header close with showClose={false}", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Header showClose={false}>
            <Modal.Title>No close</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal.Root>,
    );
    expect(screen.queryByRole("button", { name: "Закрыть" })).not.toBeInTheDocument();
  });

  it("defaults to size m and exposes size on the dialog", () => {
    const { rerender } = render(
      <Modal.Root defaultOpen>
        <Modal.Content aria-label="Sized" />
      </Modal.Root>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "m");

    rerender(
      <Modal.Root defaultOpen>
        <Modal.Content aria-label="Sized" size="xl" />
      </Modal.Root>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "xl");
  });

  it("lays footer actions out as fill for s/m and end for l/xl, overridable", () => {
    const footer = (size: "s" | "m" | "l" | "xl", layout?: "fill" | "end") => (
      <Modal.Root defaultOpen>
        <Modal.Content aria-label="Footer" size={size}>
          <Modal.Footer layout={layout} data-testid="footer">
            <Button.Root>OK</Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    );
    const { rerender } = render(footer("m"));
    expect(screen.getByTestId("footer")).toHaveAttribute("data-layout", "fill");
    rerender(footer("l"));
    expect(screen.getByTestId("footer")).toHaveAttribute("data-layout", "end");
    rerender(footer("s", "end"));
    expect(screen.getByTestId("footer")).toHaveAttribute("data-layout", "end");
  });

  it("keeps the autoFocus target as initial focus and returns focus to the trigger", async () => {
    render(
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root>Open</Button.Root>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Rename</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* biome-ignore lint/a11y/noAutofocus: initial focus target under test */}
            <input aria-label="Name" autoFocus />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Name" }));
    });

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("moves focus to the first focusable element on open", async () => {
    render(<BasicModal />);
    openModal();
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Закрыть" }));
    });
  });

  it("ignores Escape already handled by a nested control", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Content aria-label="Nested">
          <Modal.Body>
            <input
              aria-label="Combobox"
              onKeyDown={(event) => {
                if (event.key === "Escape") event.preventDefault();
              }}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>,
    );

    fireEvent.keyDown(screen.getByRole("textbox", { name: "Combobox" }), { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes via the header close button", () => {
    render(<BasicModal />);
    openModal();
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via Modal.Close", () => {
    render(<BasicModal />);
    openModal();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape by default and not with closeOnEscape={false}", () => {
    const { unmount } = render(<BasicModal />);
    openModal();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    render(<BasicModal closeOnEscape={false} />);
    openModal();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on overlay click by default and not with closeOnOutsideClick={false}", () => {
    const { unmount } = render(<BasicModal />);
    openModal();
    clickScrim();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    render(<BasicModal closeOnOutsideClick={false} />);
    openModal();
    clickScrim();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not close when the click starts inside the dialog", () => {
    render(<BasicModal defaultOpen />);
    fireEvent.pointerDown(screen.getByText("Body content"));
    fireEvent.click(screen.getByText("Body content"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("supports header and footer without a body", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Header footer</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button.Root>Action</Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>,
    );
    expect(screen.getByRole("heading", { name: "Header footer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  function FormModal(props: Omit<ModalRootProps, "children"> & { onConfirm?: () => void }) {
    const { onConfirm, ...rootProps } = props;
    return (
      <Modal.Root defaultOpen {...rootProps}>
        <Modal.Content aria-label="Form">
          <Modal.Body>
            <input aria-label="Name" />
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root variant="outline" tone="neutral">
                Cancel
              </Button.Root>
            </Modal.Close>
            <Modal.Confirm>
              <Button.Root onClick={onConfirm}>Confirm</Button.Root>
            </Modal.Confirm>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    );
  }

  it("Enter in a text field clicks Modal.Confirm", () => {
    const onConfirm = vi.fn();
    render(<FormModal onConfirm={onConfirm} />);
    const field = screen.getByRole("textbox", { name: "Name" });
    field.focus();
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("Enter on Cancel does not confirm: the focused button keeps its own Enter", () => {
    const onConfirm = vi.fn();
    render(<FormModal onConfirm={onConfirm} />);
    const cancel = screen.getByRole("button", { name: "Cancel" });
    cancel.focus();
    fireEvent.keyDown(cancel, { key: "Enter" });
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("Enter does nothing with confirmOnEnter={false}", () => {
    const onConfirm = vi.fn();
    render(<FormModal confirmOnEnter={false} onConfirm={onConfirm} />);
    const field = screen.getByRole("textbox", { name: "Name" });
    field.focus();
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("onEnterConfirm replaces the default confirm click", () => {
    const onCustom = vi.fn();
    const onConfirm = vi.fn();
    render(<FormModal onEnterConfirm={onCustom} onConfirm={onConfirm} />);
    const field = screen.getByRole("textbox", { name: "Name" });
    field.focus();
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onCustom).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("Enter on another footer button or a link does not trigger Modal.Confirm", () => {
    const onConfirm = vi.fn();
    render(
      <Modal.Root defaultOpen>
        <Modal.Content aria-label="Order">
          <Modal.Body>
            <a href="#terms">Условия</a>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root>Details</Button.Root>
            <Modal.Confirm>
              <Button.Root onClick={onConfirm}>Confirm</Button.Root>
            </Modal.Confirm>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>,
    );
    for (const el of [
      screen.getByRole("button", { name: "Details" }),
      screen.getByRole("link", { name: "Условия" }),
    ]) {
      el.focus();
      fireEvent.keyDown(el, { key: "Enter" });
    }
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("does not confirm on Enter from a textarea", () => {
    const onConfirm = vi.fn();
    render(
      <Modal.Root defaultOpen>
        <Modal.Content aria-label="Form">
          <Modal.Body>
            <textarea data-testid="ta" defaultValue="line" />
          </Modal.Body>
          <Modal.Footer>
            <Modal.Confirm>
              <Button.Root onClick={onConfirm}>OK</Button.Root>
            </Modal.Confirm>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>,
    );
    screen.getByTestId("ta").focus();
    fireEvent.keyDown(screen.getByTestId("ta"), { key: "Enter" });
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("works controlled with aria-label only", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Modal.Root open={false} onOpenChange={onOpenChange}>
        <Modal.Content aria-label="Controlled modal" />
      </Modal.Root>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Modal.Root open onOpenChange={onOpenChange}>
        <Modal.Content aria-label="Controlled modal" />
      </Modal.Root>,
    );
    expect(screen.getByRole("dialog", { name: "Controlled modal" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("makes the page behind inert while open (no extra aria-hidden)", () => {
    const outside = document.createElement("div");
    document.body.appendChild(outside);
    const { unmount } = render(<BasicModal defaultOpen />);
    expect(outside.inert).toBe(true);
    expect(outside).not.toHaveAttribute("aria-hidden");
    unmount();
    expect(outside.inert).toBeFalsy();
    outside.remove();
  });

  it("keeps the toast region usable while open", () => {
    function Harness() {
      const { notify } = useNotifications();
      return (
        <Modal.Root defaultOpen>
          <Modal.Content aria-label="With toast">
            <Button.Root onClick={() => notify({ title: "Сохранено", persistent: true })}>
              Notify
            </Button.Root>
          </Modal.Content>
        </Modal.Root>
      );
    }
    render(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    const toast = screen.getByText("Сохранено");
    expect(toast.closest("[inert]")).toBeNull();
    expect(screen.getByRole("button", { name: "Закрыть уведомление" })).toBeVisible();
  });
});

describe("Modal — overlay contract", () => {
  function ModalWithSelect() {
    return (
      <Modal.Root defaultOpen>
        <Modal.Content aria-label="With select">
          <Modal.Body>
            <p>Modal body</p>
            <Select.Root placeholder="Pick">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="one">One</Select.Item>
              </Select.Content>
            </Select.Root>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    );
  }

  it("a pointerdown inside a nested Select listbox does not close the modal", () => {
    render(<ModalWithSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    fireEvent.pointerDown(listbox);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("an outside click closes only the topmost layer (Select first, then the modal)", () => {
    render(<ModalWithSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    clickScrim();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    clickScrim();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Escape closes only the topmost layer", () => {
    render(<ModalWithSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("a drag that starts inside the dialog and ends on the scrim does not close it", () => {
    render(<BasicModal defaultOpen />);
    fireEvent.pointerDown(screen.getByText("Body content"));
    fireEvent.click(scrim());
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("returns focus to the trigger after an outside click", () => {
    render(<BasicModal />);
    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    fireEvent.click(trigger);
    clickScrim();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("nested layers opened in the same commit stack child above parent (defaultOpen)", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Content aria-label="Outer">
          <Select.Root placeholder="Pick" defaultOpen>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="one">One</Select.Item>
            </Select.Content>
          </Select.Root>
        </Modal.Content>
      </Modal.Root>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("Tab cycles inside the dialog", () => {
    render(<BasicModal defaultOpen />);
    const confirm = screen.getByRole("button", { name: "Confirm" });
    confirm.focus();
    fireEvent.keyDown(confirm, { key: "Tab" });
    expect(screen.getByRole("button", { name: "Закрыть" })).toHaveFocus();
  });
});

describe("Modal — narrow viewport sheet", () => {
  const header = () => screen.getByRole("dialog").querySelector("header") as HTMLElement;

  it("has no handle and no swipe on a wide viewport", () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog").querySelector("[data-swipe-handle]")).toBeNull();
    swipe(header(), { x: 0, y: 0 }, { x: 0, y: 300 });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("gets a handle and closes with a swipe down below 640px", async () => {
    const restore = mockCompactViewport();
    try {
      render(<BasicModal />);
      fireEvent.click(screen.getByRole("button", { name: "Open" }));
      const handle = screen.getByRole("dialog").querySelector("[data-swipe-handle]");
      expect(handle).toHaveAttribute("aria-hidden", "true");
      swipe(header(), { x: 0, y: 0 }, { x: 0, y: 300 });
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    } finally {
      restore();
    }
  });

  it("keeps a destructive confirm open: swiping follows closeOnOutsideClick", () => {
    const restore = mockCompactViewport();
    try {
      render(<BasicModal closeOnOutsideClick={false} />);
      fireEvent.click(screen.getByRole("button", { name: "Open" }));
      swipe(header(), { x: 0, y: 0 }, { x: 0, y: 300 });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    } finally {
      restore();
    }
  });
});
