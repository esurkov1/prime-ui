import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

import { Drawer, type DrawerContentProps, type DrawerRootProps } from "./Drawer";

/** A scrim dismiss is a full click that starts and ends outside the panel. */
function clickScrim(scrim: HTMLElement) {
  fireEvent.pointerDown(scrim);
  fireEvent.click(scrim);
}

function BasicDrawer({
  side,
  size,
  ...rootProps
}: Omit<DrawerRootProps, "children"> & Pick<DrawerContentProps, "side" | "size">) {
  return (
    <Drawer.Root {...rootProps}>
      <Drawer.Trigger>
        <Button.Root>Open</Button.Root>
      </Drawer.Trigger>
      <Drawer.Content side={side} size={size}>
        <Drawer.Header>
          <Drawer.Icon tone="accent">
            <svg />
          </Drawer.Icon>
          <Drawer.Title>Drawer title</Drawer.Title>
          <Drawer.Description>Drawer description</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <p>Body content</p>
          <Button.Root>Focusable inside</Button.Root>
        </Drawer.Body>
        <Drawer.Footer data-testid="footer">
          <Drawer.Close>
            <Button.Root variant="outline" tone="neutral">
              Cancel
            </Button.Root>
          </Drawer.Close>
          <Button.Root>Confirm</Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}

function openDrawer() {
  fireEvent.click(screen.getByRole("button", { name: "Open" }));
}

async function expectClosed() {
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
}

describe("Drawer", () => {
  it("opens from Trigger", () => {
    render(<BasicDrawer />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    openDrawer();

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).toHaveAttribute("tabindex", "-1");
  });

  it("labels the dialog from Title and Description", () => {
    render(<BasicDrawer defaultOpen />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute(
      "aria-labelledby",
      screen.getByRole("heading", { name: "Drawer title" }).id,
    );
    expect(dialog).toHaveAttribute("aria-describedby", screen.getByText("Drawer description").id);
  });

  it("closes by the header close button", async () => {
    render(<BasicDrawer />);
    openDrawer();
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    await expectClosed();
  });

  it("closes by Drawer.Close", async () => {
    render(<BasicDrawer />);
    openDrawer();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await expectClosed();
  });

  it("closes by Escape unless closeOnEscape={false}", async () => {
    const { unmount } = render(<BasicDrawer />);
    openDrawer();
    fireEvent.keyDown(document, { key: "Escape" });
    await expectClosed();
    unmount();

    render(<BasicDrawer closeOnEscape={false} />);
    openDrawer();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("closes by overlay click unless closeOnOutsideClick={false}", async () => {
    const { unmount } = render(<BasicDrawer />);
    openDrawer();
    clickScrim(screen.getByTestId("drawer-overlay"));
    await expectClosed();
    unmount();

    render(<BasicDrawer closeOnOutsideClick={false} />);
    openDrawer();
    clickScrim(screen.getByTestId("drawer-overlay"));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("locks and restores body scroll", async () => {
    render(<BasicDrawer />);
    openDrawer();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
  });

  it("renders header parts, body and footer", () => {
    render(<BasicDrawer defaultOpen />);
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("dialog").querySelector("[data-tone]")).toHaveAttribute(
      "data-tone",
      "accent",
    );
  });

  it("right-aligns footer actions by default", () => {
    render(<BasicDrawer defaultOpen />);
    expect(screen.getByTestId("footer")).toHaveAttribute("data-layout", "end");
  });

  it("exposes side and size, defaulting to right and m", () => {
    const { unmount } = render(<BasicDrawer defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "right");
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "m");
    unmount();

    render(<BasicDrawer defaultOpen side="left" size="xl" />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "left");
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "xl");
  });

  it("notifies onOpenChange(false) when controlled", () => {
    const onOpenChange = vi.fn();
    render(<BasicDrawer open onOpenChange={onOpenChange} />);
    clickScrim(screen.getByTestId("drawer-overlay"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("uses labels.close for the header close button", () => {
    render(<BasicDrawer defaultOpen labels={{ close: "Закрыть панель" }} />);
    expect(screen.getByRole("button", { name: "Закрыть панель" })).toHaveAttribute(
      "data-size",
      "s",
    );
  });

  it("closes only the topmost nested drawer on Escape", async () => {
    function Nested() {
      const [inner, setInner] = React.useState(false);
      return (
        <Drawer.Root defaultOpen>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Outer</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Button.Root onClick={() => setInner(true)}>Open inner</Button.Root>
              <Drawer.Root open={inner} onOpenChange={setInner}>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Inner</Drawer.Title>
                  </Drawer.Header>
                </Drawer.Content>
              </Drawer.Root>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      );
    }

    render(<Nested />);
    fireEvent.click(screen.getByRole("button", { name: "Open inner" }));
    expect(screen.getAllByRole("dialog", { hidden: true })).toHaveLength(2);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Inner", hidden: true }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Outer", hidden: true })).toBeInTheDocument();
  });
});

describe("Drawer — overlay contract", () => {
  function DrawerWithMenu() {
    return (
      <Drawer.Root defaultOpen>
        <Drawer.Content aria-label="With menu">
          <Drawer.Body>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root>Menu</Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Rename</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    );
  }

  it("the scrim is not inert, so a click on it reaches the drawer", () => {
    render(<BasicDrawer defaultOpen />);
    expect(screen.getByTestId("drawer-overlay").closest("[inert]")).toBeNull();
  });

  it("a pointerdown outside the panel (not only on the scrim) closes it", async () => {
    render(<BasicDrawer />);
    openDrawer();
    clickScrim(document.body);
    await expectClosed();
  });

  it("a pointerdown inside a nested menu does not close the drawer", () => {
    render(<DrawerWithMenu />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.pointerDown(screen.getByRole("menuitem", { name: "Rename" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("outside click and Escape close only the topmost layer", () => {
    render(<DrawerWithMenu />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    clickScrim(screen.getByTestId("drawer-overlay"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("returns focus to the trigger", async () => {
    render(<BasicDrawer />);
    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    fireEvent.click(trigger);
    clickScrim(screen.getByTestId("drawer-overlay"));
    await expectClosed();
    expect(trigger).toHaveFocus();
  });
});
