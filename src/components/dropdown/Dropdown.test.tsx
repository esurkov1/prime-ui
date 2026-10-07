import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Dropdown } from "./Dropdown";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicDropdown({
  onOpenChange,
  open,
  defaultOpen,
}: {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  defaultOpen?: boolean;
}) {
  return (
    <Dropdown.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Dropdown.Trigger>
        <button type="button">Open</button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Item 1</Dropdown.Item>
        <Dropdown.Item>Item 2</Dropdown.Item>
        <Dropdown.Item disabled>Item Disabled</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

function DropdownWithOnSelect({
  onSelect1,
  onSelect2,
}: {
  onSelect1?: () => void;
  onSelect2?: () => void;
}) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <button type="button">Open</button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onSelect={onSelect1}>Item 1</Dropdown.Item>
        <Dropdown.Item onSelect={onSelect2}>Item 2</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

// ─── Render ───────────────────────────────────────────────────────────────────

describe("Dropdown", () => {
  it("renders trigger, menu is not present initially", () => {
    render(<BasicDropdown />);
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens menu on trigger click", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes menu on second trigger click", () => {
    render(<BasicDropdown />);
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // ─── ARIA ────────────────────────────────────────────────────────────────────

  it("sets aria-expanded on trigger", () => {
    render(<BasicDropdown />);
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("sets aria-haspopup='menu' on trigger", () => {
    render(<BasicDropdown />);
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("aria-haspopup", "menu");
  });

  it("sets aria-controls pointing to menu id", () => {
    render(<BasicDropdown />);
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    expect(trigger).toHaveAttribute("aria-controls", menu.id);
  });

  it("menu has aria-labelledby pointing to trigger id", () => {
    render(<BasicDropdown />);
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("aria-labelledby", trigger.id);
  });

  it("items have role='menuitem'", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const items = screen.getAllByRole("menuitem");
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it("menu has data-size m by default", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("menu")).toHaveAttribute("data-size", "m");
  });

  it.each(["s", "m", "l", "xl"] as const)("menu reflects Content size %s", (size) => {
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content size={size}>
          <Dropdown.Item>A</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    expect(screen.getByRole("menu")).toHaveAttribute("data-size", size);
  });

  // ─── Item interaction ────────────────────────────────────────────────────────

  it("item click calls onSelect", () => {
    const onSelect1 = vi.fn();
    render(<DropdownWithOnSelect onSelect1={onSelect1} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Item 1" }));
    expect(onSelect1).toHaveBeenCalledTimes(1);
  });

  it("item click closes the menu", () => {
    render(<DropdownWithOnSelect />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("menuitem", { name: "Item 1" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("Enter on item calls onSelect and closes menu", () => {
    const onSelect1 = vi.fn();
    render(<DropdownWithOnSelect onSelect1={onSelect1} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const item = screen.getByRole("menuitem", { name: "Item 1" });
    fireEvent.keyDown(item, { key: "Enter" });
    expect(onSelect1).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("Space on item calls onSelect and closes menu", () => {
    const onSelect1 = vi.fn();
    render(<DropdownWithOnSelect onSelect1={onSelect1} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const item = screen.getByRole("menuitem", { name: "Item 1" });
    fireEvent.keyDown(item, { key: " " });
    expect(onSelect1).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // ─── Dismiss ─────────────────────────────────────────────────────────────────

  it("closes on Escape key", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on outside click (pointerdown)", () => {
    render(
      <div>
        <BasicDropdown />
        <button type="button">Outside</button>
      </div>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // ─── Keyboard navigation ──────────────────────────────────────────────────────

  it("ArrowDown focuses first item when none focused", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Item 1" }));
  });

  it("ArrowDown moves focus to next item", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Item 2" }));
  });

  it("ArrowUp wraps to last enabled item from start", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Item 2" }));
  });

  it("Home key focuses first enabled item", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "Home" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Item 1" }));
  });

  it("End key focuses last enabled item", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "End" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Item 2" }));
  });

  it("disabled item is skipped in keyboard navigation", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const menu = screen.getByRole("menu");
    // ArrowDown twice should skip disabled item
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    // Wraps back to Item 1 (disabled is excluded)
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Item 1" }));
  });

  // ─── Disabled item ───────────────────────────────────────────────────────────

  it("disabled item has aria-disabled and data-disabled", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const disabled = screen.getByRole("menuitem", { name: "Item Disabled" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).toHaveAttribute("data-disabled", "true");
  });

  it("disabled item click does not call onSelect and does not close", () => {
    const onSelect = vi.fn();
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect} disabled>
            Disabled
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Disabled" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  // ─── Danger item ────────────────────────────────────────────────────────

  it("tone=danger item has data-tone attribute", () => {
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item tone="danger">Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute("data-tone", "danger");
  });

  // ─── Groups ──────────────────────────────────────────────────────────────────

  it("renders Block wrapper", () => {
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Block>
            <Dropdown.Item>A</Dropdown.Item>
          </Dropdown.Block>
          <Dropdown.Block>
            <Dropdown.Item>B</Dropdown.Item>
          </Dropdown.Block>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("menuitem", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "B" })).toBeInTheDocument();
  });

  it("renders groups and group labels", () => {
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.GroupLabel>Actions</Dropdown.GroupLabel>
            <Dropdown.Item>Edit</Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.GroupLabel>Danger zone</Dropdown.GroupLabel>
            <Dropdown.Item tone="danger">Delete</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Danger zone")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
  });

  it("renders separator", () => {
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>A</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>B</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  // ─── Item with icon ──────────────────────────────────────────────────────────

  it("renders item with ItemIcon slot", () => {
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.ItemIcon>★</Dropdown.ItemIcon>
            Star
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("★")).toBeInTheDocument();
  });

  it("ItemIcon supports polymorphic as", () => {
    function TinyIcon() {
      return <svg data-testid="poly-icon" aria-hidden />;
    }
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={TinyIcon} />
            Action
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByTestId("poly-icon")).toBeInTheDocument();
  });

  it("Trigger merges external ref with internal anchor ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button ref={ref} type="button">
            Open
          </button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent("Open");
  });

  it("renders HeaderRow with title and description", () => {
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.HeaderRow>
            <Dropdown.HeaderMain>
              <Dropdown.HeaderTitle>Title</Dropdown.HeaderTitle>
              <Dropdown.HeaderDescription>Subtitle</Dropdown.HeaderDescription>
            </Dropdown.HeaderMain>
          </Dropdown.HeaderRow>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });

  it("Header wraps row and separator without extra gap class on wrapper", () => {
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Header data-testid="hdr">
            <Dropdown.HeaderRow>
              <Dropdown.HeaderTitle>T</Dropdown.HeaderTitle>
            </Dropdown.HeaderRow>
            <Dropdown.Separator />
          </Dropdown.Header>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    expect(screen.getByTestId("hdr")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("HeaderTrailing alignSelf center sets data-trailing-align", () => {
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.HeaderRow>
            <Dropdown.HeaderTrailing alignSelf="center" data-testid="trail">
              x
            </Dropdown.HeaderTrailing>
          </Dropdown.HeaderRow>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    expect(screen.getByTestId("trail")).toHaveAttribute("data-trailing-align", "center");
  });

  // ─── Controlled ──────────────────────────────────────────────────────────────

  it("controlled: respects open prop", () => {
    render(<BasicDropdown open={true} />);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("controlled: calls onOpenChange on toggle", () => {
    const onOpenChange = vi.fn();
    render(<BasicDropdown onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("defaultOpen=true opens menu on mount", () => {
    render(<BasicDropdown defaultOpen={true} />);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("ItemIcon получает размер иконки яруса меню (xl → 20, xs → 14)", () => {
    function SizedIcon({ size }: { size?: number }) {
      return <svg data-testid={`icon-${size}`} aria-hidden />;
    }
    render(
      <>
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>
            <button type="button">A</button>
          </Dropdown.Trigger>
          <Dropdown.Content size="xl">
            <Dropdown.Item>
              <Dropdown.ItemIcon as={SizedIcon} />
              Big
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>
            <button type="button">B</button>
          </Dropdown.Trigger>
          <Dropdown.Content size="xs">
            <Dropdown.Item>
              <Dropdown.ItemIcon as={SizedIcon} />
              Small
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </>,
    );
    expect(screen.getByTestId("icon-20")).toBeInTheDocument();
    expect(screen.getByTestId("icon-14")).toBeInTheDocument();
  });

  it("ItemShortcut рендерит подсказку клавиш как <kbd> внутри пункта", () => {
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            Копировать
            <Dropdown.ItemShortcut>⌘C</Dropdown.ItemShortcut>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitem", { name: /Копировать/ });
    expect(item.querySelector("kbd")).toHaveTextContent("⌘C");
  });

  it("trigger reflects data-state open/closed", () => {
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Toggle</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <span>Body</span>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger).toHaveAttribute("data-state", "closed");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");
  });
});

describe("Dropdown — overlay contract", () => {
  it("Escape closes and returns focus to the trigger", () => {
    render(<BasicDropdown />);
    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  // Focus follows the pointer (foundation §8): the focus trap does not restore the opener after an
  // outside press, so a click on another control keeps that control's focus.
  it("an outside click on another control closes it and focuses that control", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <BasicDropdown />
        <button type="button">Снаружи</button>
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    const outside = screen.getByRole("button", { name: "Снаружи" });
    await user.click(outside);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(outside).toHaveFocus();
  });

  it("a pointerdown on the trigger is not an outside click", () => {
    render(<BasicDropdown />);
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);
    fireEvent.pointerDown(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closeOnOutsideClick={false} keeps it open on an outside click", () => {
    render(
      <div>
        <Dropdown.Root closeOnOutsideClick={false}>
          <Dropdown.Trigger>
            <button type="button">Open</button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>Item</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
        <button type="button">Outside</button>
      </div>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});
