import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/button/Button";

import { Drawer } from "./Drawer";

// ─── Helper ───────────────────────────────────────────────────────────────────

function BasicDrawer({
  closeOnEscape = true,
  closeOnOverlayClick = true,
  side = "right" as const,
}: {
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  side?: "left" | "right" | "bottom" | "top";
}) {
  return (
    <Drawer.Root closeOnEscape={closeOnEscape} closeOnOverlayClick={closeOnOverlayClick}>
      <Drawer.Trigger>
        <Button.Root>Open</Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side={side} aria-labelledby="drw-title">
          <Drawer.Header>
            <Drawer.Title id="drw-title">Drawer title</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>Body content</p>
            <Button.Root>Focusable inside</Button.Root>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root variant="neutral" mode="stroke">
                Cancel
              </Button.Root>
            </Drawer.Close>
            <Button.Root>Confirm</Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Drawer", () => {
  it("renders Trigger and opens Content on click", () => {
    render(<BasicDrawer />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("closes via Drawer.Close button in Footer", () => {
    render(<BasicDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via built-in close button in Header", () => {
    render(<BasicDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close drawer" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape key by default", () => {
    render(<BasicDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not close on Escape when closeOnEscape=false", () => {
    render(<BasicDrawer closeOnEscape={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on overlay click by default", () => {
    render(<BasicDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const overlay = screen.getByTestId("drawer-overlay");
    fireEvent.click(overlay);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not close on overlay click when closeOnOverlayClick=false", () => {
    render(<BasicDrawer closeOnOverlayClick={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const overlay = screen.getByTestId("drawer-overlay");
    fireEvent.click(overlay);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("moves focus to first focusable element on open (focus trap)", async () => {
    render(<BasicDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    await waitFor(() => {
      const closeBtn = screen.getByRole("button", { name: "Close drawer" });
      expect(document.activeElement).toBe(closeBtn);
    });
  });

  it("locks body scroll when open", () => {
    render(<BasicDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll after closing", () => {
    render(<BasicDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.body.style.overflow).toBe("");
  });

  it("sets data-size='m' on Content by default", () => {
    render(<BasicDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from Content size prop", () => {
    render(
      <Drawer.Root>
        <Drawer.Trigger>
          <Button.Root>Open</Button.Root>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content size="xl" aria-label="Sized drawer">
            <Drawer.Body>
              <p>Sized</p>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "xl");
  });

  it("matches close button size to Content size", () => {
    render(
      <Drawer.Root>
        <Drawer.Trigger>
          <Button.Root>Open</Button.Root>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content size="s" aria-labelledby="drw-sz">
            <Drawer.Header>
              <Drawer.Title id="drw-sz">T</Drawer.Title>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("button", { name: "Close drawer" })).toHaveAttribute("data-size", "s");
  });

  it("sets data-side='right' by default", () => {
    render(<BasicDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "right");
  });

  it("sets data-side='left'", () => {
    render(<BasicDrawer side="left" />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "left");
  });

  it("sets data-side='bottom'", () => {
    render(<BasicDrawer side="bottom" />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "bottom");
  });

  it("sets data-side='top'", () => {
    render(<BasicDrawer side="top" />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "top");
  });

  it("renders DrawerHeader, DrawerBody and DrawerFooter", () => {
    render(<BasicDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByText("Drawer title")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("works in controlled mode", () => {
    const { rerender } = render(
      <Drawer.Root open={false}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content aria-label="Controlled drawer">
            <Drawer.Body>
              <p>Controlled</p>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Drawer.Root open={true}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content aria-label="Controlled drawer">
            <Drawer.Body>
              <p>Controlled</p>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
