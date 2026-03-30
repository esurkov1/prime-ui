import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";

import { Modal } from "./Modal";

function BasicModal({
  closeOnEscape = true,
  closeOnOverlayClick = true,
}: {
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}) {
  return (
    <Modal.Root closeOnEscape={closeOnEscape} closeOnOverlayClick={closeOnOverlayClick}>
      <Modal.Trigger>
        <Button.Root>Open</Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        description="Test description"
        footer={
          <>
            <Modal.Close>
              <Button.Root variant="neutral" mode="stroke">
                Cancel
              </Button.Root>
            </Modal.Close>
            <Button.Root>Confirm</Button.Root>
          </>
        }
        title="Test title"
      >
        <p>Body content</p>
        <Button.Root>Focusable inside</Button.Root>
      </Modal.Panel>
    </Modal.Root>
  );
}

describe("Modal", () => {
  it("renders Trigger and opens Panel on click", () => {
    render(<BasicModal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("sets aria-labelledby and aria-describedby from header", () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    const modal = screen.getByRole("dialog");
    const heading = screen.getByRole("heading", { name: "Test title" });
    const description = screen.getByText("Test description");
    expect(modal).toHaveAttribute("aria-labelledby", heading.id);
    expect(modal).toHaveAttribute("aria-describedby", description.id);
  });

  it("uses explicit aria-labelledby and aria-describedby on Panel", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Panel
          aria-describedby="custom-desc"
          aria-labelledby="custom-title"
          description="Custom desc"
          title="Custom"
        />
      </Modal.Root>,
    );

    const modal = screen.getByRole("dialog");
    expect(screen.getByRole("heading", { name: "Custom" })).toHaveAttribute("id", "custom-title");
    expect(screen.getByText("Custom desc")).toHaveAttribute("id", "custom-desc");
    expect(modal).toHaveAttribute("aria-labelledby", "custom-title");
    expect(modal).toHaveAttribute("aria-describedby", "custom-desc");
  });

  it("omits aria-describedby when there is no description", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Panel title="Title only" />
      </Modal.Root>,
    );

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveAttribute("aria-labelledby", screen.getByRole("heading").id);
    expect(modal).not.toHaveAttribute("aria-describedby");
  });

  it("uses modal shell size on built-in header close button", () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute("data-size", "m");
  });

  it("closes via built-in header close button", () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via Modal.Close in footer (Cancel)", () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape key by default", () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not close on Escape when closeOnEscape=false", () => {
    render(<BasicModal closeOnEscape={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on overlay click by default", () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const overlay = screen.getByTestId("modal-overlay");
    fireEvent.click(overlay);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not close on overlay click when closeOnOverlayClick=false", () => {
    render(<BasicModal closeOnOverlayClick={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const overlay = screen.getByTestId("modal-overlay");
    fireEvent.click(overlay);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders footer actions", () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("supports title and footer without body text", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Panel footer={<Button.Root>Action</Button.Root>} title="Header footer" />
      </Modal.Root>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    expect(screen.queryByText("Body content")).not.toBeInTheDocument();
  });

  it("supports title only", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Panel title="Header only" />
      </Modal.Root>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Header only" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Action" })).not.toBeInTheDocument();
  });

  it("moves focus to first focusable element on open (focus trap)", async () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    await waitFor(() => {
      const closeBtn = screen.getByRole("button", { name: "Close" });
      expect(document.activeElement).toBe(closeBtn);
    });
  });

  it("triggers footer primary button on Enter when focus is not on primary", () => {
    const onConfirm = vi.fn();
    render(
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root>Open</Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          footer={
            <>
              <Modal.Close>
                <Button.Root variant="neutral" mode="stroke">
                  Cancel
                </Button.Root>
              </Modal.Close>
              <Button.Root type="button" onClick={onConfirm}>
                Confirm
              </Button.Root>
            </>
          }
          title="Confirm action"
        >
          <p>Body</p>
        </Modal.Panel>
      </Modal.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    screen.getByRole("button", { name: "Cancel" }).focus();
    fireEvent.keyDown(screen.getByRole("button", { name: "Cancel" }), { key: "Enter" });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("does not trigger primary on Enter when confirmOnEnter is false", () => {
    const onConfirm = vi.fn();
    render(
      <Modal.Root confirmOnEnter={false}>
        <Modal.Trigger>
          <Button.Root>Open</Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          footer={
            <>
              <Modal.Close>
                <Button.Root variant="neutral" mode="stroke">
                  Cancel
                </Button.Root>
              </Modal.Close>
              <Button.Root type="button" onClick={onConfirm}>
                Confirm
              </Button.Root>
            </>
          }
          title="T"
        >
          <p>Body</p>
        </Modal.Panel>
      </Modal.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    screen.getByRole("button", { name: "Cancel" }).focus();
    fireEvent.keyDown(screen.getByRole("button", { name: "Cancel" }), { key: "Enter" });

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onEnterConfirm instead of default primary click", () => {
    const onCustom = vi.fn();
    const onConfirm = vi.fn();
    render(
      <Modal.Root onEnterConfirm={onCustom}>
        <Modal.Trigger>
          <Button.Root>Open</Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          footer={
            <>
              <Modal.Close>
                <Button.Root variant="neutral" mode="stroke">
                  Cancel
                </Button.Root>
              </Modal.Close>
              <Button.Root type="button" onClick={onConfirm}>
                Confirm
              </Button.Root>
            </>
          }
          title="T"
        >
          <p>Body</p>
        </Modal.Panel>
      </Modal.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    screen.getByRole("button", { name: "Cancel" }).focus();
    fireEvent.keyDown(screen.getByRole("button", { name: "Cancel" }), { key: "Enter" });

    expect(onCustom).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("uses Modal.PrimaryAction as Enter target over last footer button", () => {
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();
    render(
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root>Open</Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          footer={
            <>
              <Modal.PrimaryAction>
                <Button.Root type="button" onClick={onPrimary}>
                  Primary first
                </Button.Root>
              </Modal.PrimaryAction>
              <Button.Root type="button" onClick={onSecondary}>
                Last in DOM
              </Button.Root>
            </>
          }
          title="Order"
        >
          <p>Body</p>
        </Modal.Panel>
      </Modal.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    screen.getByRole("button", { name: "Last in DOM" }).focus();
    fireEvent.keyDown(screen.getByRole("button", { name: "Last in DOM" }), { key: "Enter" });

    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onSecondary).not.toHaveBeenCalled();
  });

  it("does not fire Enter confirm from textarea", () => {
    const onConfirm = vi.fn();
    render(
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root>Open</Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          footer={
            <Button.Root type="button" onClick={onConfirm}>
              OK
            </Button.Root>
          }
          title="Form"
        >
          <textarea data-testid="ta" defaultValue="line" />
        </Modal.Panel>
      </Modal.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    screen.getByTestId("ta").focus();
    fireEvent.keyDown(screen.getByTestId("ta"), { key: "Enter" });

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("works in controlled mode with aria-label only", () => {
    const { rerender } = render(
      <Modal.Root open={false}>
        <Modal.Panel aria-label="Controlled modal">
          <p>Controlled</p>
        </Modal.Panel>
      </Modal.Root>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Modal.Root open={true}>
        <Modal.Panel aria-label="Controlled modal">
          <p>Controlled</p>
        </Modal.Panel>
      </Modal.Root>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
