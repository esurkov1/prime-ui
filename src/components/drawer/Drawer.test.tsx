import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { swipe } from "@/test/mobile";

import { Drawer, type DrawerContentProps, type DrawerRootProps } from "./Drawer";

/** The scrim: the sibling before the (topmost) drawer panel. */
function drawerScrim() {
  const dialogs = screen.getAllByRole("dialog");
  return dialogs[dialogs.length - 1]?.previousElementSibling as HTMLElement;
}

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
    clickScrim(drawerScrim());
    await expectClosed();
    unmount();

    render(<BasicDrawer closeOnOutsideClick={false} />);
    openDrawer();
    clickScrim(drawerScrim());
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
    clickScrim(drawerScrim());
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

describe("Drawer — no swipe", () => {
  it("has no grab handle and a touch swipe toward its edge does not close it", () => {
    render(<BasicDrawer defaultOpen />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.querySelector("[data-swipe-handle]")).toBeNull();
    swipe(screen.getByText("Body content"), { x: 100, y: 0 }, { x: 400, y: 0 });
    swipe(dialog.querySelector("header") as HTMLElement, { x: 100, y: 0 }, { x: 400, y: 0 });
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).not.toHaveAttribute("data-swiping");
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
    expect(drawerScrim().closest("[inert]")).toBeNull();
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
    clickScrim(drawerScrim());
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
    clickScrim(drawerScrim());
    await expectClosed();
    expect(trigger).toHaveFocus();
  });
});

describe("Drawer — header actions, footer meta, exit snapshot", () => {
  it("places Actions in the header before the close button, one tier down", () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Сделка №1042</Drawer.Title>
            <Drawer.Actions data-testid="actions">
              <Button.Root variant="ghost" tone="neutral">
                Ещё
              </Button.Root>
            </Drawer.Actions>
          </Drawer.Header>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const actions = screen.getByTestId("actions");
    const close = screen.getByRole("button", { name: "Закрыть" });
    expect(actions.nextElementSibling).toBe(close);
    expect(screen.getByRole("button", { name: "Ещё" })).toHaveAttribute("data-size", "s");
  });

  it("renders Meta as a footer paragraph that does not describe the dialog", () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Сделка</Drawer.Title>
          </Drawer.Header>
          <Drawer.Footer>
            <Drawer.Meta>Есть несохранённые изменения</Drawer.Meta>
            <Button.Root>Сохранить</Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const meta = screen.getByText("Есть несохранённые изменения");
    expect(meta.tagName).toBe("P");
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-describedby");
  });

  it("keeps the last open content while it slides out", async () => {
    function RecordDrawer() {
      const [record, setRecord] = React.useState<string | null>("Сделка №1042");
      return (
        <Drawer.Root open={record !== null} onOpenChange={(open) => !open && setRecord(null)}>
          <Drawer.Content aria-label="Карточка">
            <Drawer.Body>{record ?? "Пусто"}</Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button.Root>Закрыть карточку</Button.Root>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      );
    }
    // With motion: the panel stays mounted for its exit.
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    try {
      render(<RecordDrawer />);
      fireEvent.click(screen.getByRole("button", { name: "Закрыть карточку" }));
      const panel = screen.getByRole("dialog", { hidden: true });
      expect(panel).toHaveAttribute("data-state", "closed");
      expect(screen.getByText("Сделка №1042")).toBeInTheDocument();
      expect(screen.queryByText("Пусто")).not.toBeInTheDocument();
      fireEvent.animationEnd(panel);
      await expectClosed();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("Drawer.Guard", () => {
  function GuardedDrawer({
    busy,
    dirty,
    onOpenChange,
  }: {
    busy?: boolean;
    dirty?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) {
    return (
      <Drawer.Root defaultOpen onOpenChange={onOpenChange}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Новая сделка</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Drawer.Guard busy={busy} dirty={dirty} />
            <input aria-label="Название" />
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root variant="soft" tone="neutral">
                Отмена
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    );
  }

  it("busy: no dismiss closes it; the close button and Close stay in place, disabled", () => {
    const onOpenChange = vi.fn();
    render(<GuardedDrawer busy onOpenChange={onOpenChange} />);
    fireEvent.keyDown(document, { key: "Escape" });
    clickScrim(drawerScrim());
    expect(screen.getByRole("button", { name: "Закрыть" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Отмена" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("dirty: Escape asks first; «Продолжить» keeps the drawer and its changes", async () => {
    const onOpenChange = vi.fn();
    render(<GuardedDrawer dirty onOpenChange={onOpenChange} />);
    fireEvent.keyDown(document, { key: "Escape" });
    const confirm = await screen.findByRole("alertdialog", { name: "Не сохранять изменения?" });
    expect(confirm).toHaveAccessibleDescription("Изменения в форме пропадут.");
    fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("dirty: confirming «Не сохранять» closes the drawer", async () => {
    const onOpenChange = vi.fn();
    render(<GuardedDrawer dirty onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Отмена" }));
    fireEvent.click(await screen.findByRole("button", { name: "Не сохранять" }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    await expectClosed();
  });

  it("takes the confirm texts from the Root labels", async () => {
    render(
      <Drawer.Root defaultOpen labels={{ discardTitle: "Закрыть без сохранения?" }}>
        <Drawer.Content aria-label="Сделка">
          <Drawer.Guard dirty />
          <Drawer.Header>
            <Drawer.Title>Сделка</Drawer.Title>
          </Drawer.Header>
        </Drawer.Content>
      </Drawer.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(
      await screen.findByRole("alertdialog", { name: "Закрыть без сохранения?" }),
    ).toBeInTheDocument();
  });

  it("closing from code is never held", async () => {
    function Controlled() {
      const [open, setOpen] = React.useState(true);
      return (
        <>
          <button type="button" onClick={() => setOpen(false)}>
            Сохранено
          </button>
          <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Content aria-label="Сделка">
              <Drawer.Guard busy dirty />
            </Drawer.Content>
          </Drawer.Root>
        </>
      );
    }
    render(<Controlled />);
    // The drawer makes the page inert; the owner closes it from code.
    fireEvent.click(screen.getByText("Сохранено"));
    await expectClosed();
  });
});
