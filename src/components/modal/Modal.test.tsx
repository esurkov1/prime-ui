import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/button/Button";

import { Modal } from "./Modal";

// ─── Composable API ───────────────────────────────────────────────────────────

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
      <Modal.Portal>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header title="Test title" description="Test description" />
          <Modal.Body>
            <p>Body content</p>
            <Button.Root>Focusable inside</Button.Root>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root variant="neutral" mode="stroke">
                Cancel
              </Button.Root>
            </Modal.Close>
            <Button.Root>Confirm</Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Portal>
    </Modal.Root>
  );
}

describe("Modal (composable API)", () => {
  it("throws when Modal.Header is not inside Modal.Content", () => {
    expect(() =>
      render(
        <Modal.Root defaultOpen>
          <Modal.Portal>
            <Modal.Overlay>
              <Modal.Header title="Invalid" />
            </Modal.Overlay>
          </Modal.Portal>
        </Modal.Root>,
      ),
    ).toThrow(/must be used inside `Modal\.Content`/);
  });

  it("renders Trigger and opens Content on click", () => {
    render(<BasicModal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("sets aria-labelledby and aria-describedby on Content from Modal.Header", () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    const modal = screen.getByRole("dialog");
    const heading = screen.getByRole("heading", { name: "Test title" });
    const description = screen.getByText("Test description");
    expect(modal).toHaveAttribute("aria-labelledby", heading.id);
    expect(modal).toHaveAttribute("aria-describedby", description.id);
  });

  it("uses explicit aria-labelledby and aria-describedby on Content for header ids", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content aria-labelledby="custom-title" aria-describedby="custom-desc">
            <Modal.Header title="Custom" description="Custom desc" />
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    const modal = screen.getByRole("dialog");
    expect(screen.getByRole("heading", { name: "Custom" })).toHaveAttribute("id", "custom-title");
    expect(screen.getByText("Custom desc")).toHaveAttribute("id", "custom-desc");
    expect(modal).toHaveAttribute("aria-labelledby", "custom-title");
    expect(modal).toHaveAttribute("aria-describedby", "custom-desc");
  });

  it("omits aria-describedby when Header has no description", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header title="Title only" />
          </Modal.Content>
        </Modal.Portal>
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

  it("closes via Modal.Close in Footer (Cancel)", () => {
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

  it("renders ModalFooter", () => {
    render(<BasicModal />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("supports Header + Footer without Body", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header title="Header footer" />
            <Modal.Footer>
              <Button.Root>Action</Button.Root>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    expect(screen.queryByText("Body content")).not.toBeInTheDocument();
  });

  it("supports Header only without Body and Footer", () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header title="Header only" />
          </Modal.Content>
        </Modal.Portal>
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

  it("works in controlled mode", () => {
    const { rerender } = render(
      <Modal.Root open={false}>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content aria-label="Controlled modal">
            <Modal.Body>
              <p>Controlled</p>
            </Modal.Body>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Modal.Root open={true}>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content aria-label="Controlled modal">
            <Modal.Body>
              <p>Controlled</p>
            </Modal.Body>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
