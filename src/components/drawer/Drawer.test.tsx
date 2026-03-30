import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";

import { Drawer } from "./Drawer";

function ControlledDrawer({ side = "right" as const }: { side?: "left" | "right" }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root onClick={() => setOpen(true)}>Open</Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Drawer title"
        description="Drawer description"
        side={side}
        footer={
          <>
            <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(false)}>
              Cancel
            </Button.Root>
            <Button.Root>Confirm</Button.Root>
          </>
        }
      >
        <p>Body content</p>
        <Button.Root>Focusable inside</Button.Root>
      </Drawer>
    </>
  );
}

describe("Drawer", () => {
  it("opens on external state change", () => {
    render(<ControlledDrawer />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("closes by close button in header", async () => {
    render(<ControlledDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.click(screen.getByRole("button", { name: "Close drawer" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes by Escape", async () => {
    render(<ControlledDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes by overlay click", async () => {
    render(<ControlledDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.click(screen.getByTestId("drawer-overlay"));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("marks dialog as focus-trap container", () => {
    render(<ControlledDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toHaveAttribute("tabindex", "-1");
  });

  it("locks and restores body scroll", async () => {
    render(<ControlledDrawer />);

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
  });

  it("renders title, description and footer", () => {
    render(<ControlledDrawer />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByText("Drawer title")).toBeInTheDocument();
    expect(screen.getByText("Drawer description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("supports side left", () => {
    render(<ControlledDrawer side="left" />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "left");
  });

  it("notifies onOpenChange(false) from overlay", () => {
    const onOpenChange = vi.fn();

    render(
      <Drawer open={true} onOpenChange={onOpenChange} title="Title">
        <p>Body</p>
      </Drawer>,
    );

    fireEvent.click(screen.getByTestId("drawer-overlay"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
