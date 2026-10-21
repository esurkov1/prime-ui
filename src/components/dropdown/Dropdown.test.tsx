import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Avatar } from "@/components/avatar/Avatar";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import textTone from "@/internal/textTone.module.css";
import { describeOverlayConformance } from "@/test/overlayConformance";

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
  it("picks a person: the avatar at the row's media size, the chosen one checked with a mark", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Ответственный</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item selected>
            <Avatar.Root data-testid="avatar">
              <Avatar.Fallback>ЕС</Avatar.Fallback>
            </Avatar.Root>
            Евгений Сурков
          </Dropdown.Item>
          <Dropdown.Item selected={false} onSelect={onSelect}>
            Анна Котова
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Ответственный" }));
    const chosen = screen.getByRole("menuitemradio", { name: "Евгений Сурков" });
    expect(chosen).toHaveAttribute("aria-checked", "true");
    expect(chosen.querySelector("svg")).not.toBeNull();
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("avatar")).toHaveAttribute("aria-hidden", "true");
    const other = screen.getByRole("menuitemradio", { name: "Анна Котова" });
    expect(other).toHaveAttribute("aria-checked", "false");
    await user.click(other);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

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

  // Enter and Space reach the item as the native button click (no second keydown handler).
  it("Enter on item calls onSelect once, closes menu and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const onSelect1 = vi.fn();
    render(<DropdownWithOnSelect onSelect1={onSelect1} />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    expect(screen.getByRole("menuitem", { name: "Item 1" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onSelect1).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("Space on item calls onSelect once and closes menu", async () => {
    const user = userEvent.setup();
    const onSelect1 = vi.fn();
    render(<DropdownWithOnSelect onSelect1={onSelect1} />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.keyboard(" ");
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

  it("opening focuses the first item (WAI-ARIA menu button)", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Item 1" }));
  });

  it("ArrowDown moves focus to next item", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const menu = screen.getByRole("menu");
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
    // Item 1 → Item 2 → wraps back to Item 1 (the disabled item is excluded)
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Item 1" }));
  });

  // ─── Disabled item ───────────────────────────────────────────────────────────

  it("disabled item is disabled and marked data-disabled", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const disabled = screen.getByRole("menuitem", { name: "Item Disabled" });
    expect(disabled).toBeDisabled();
    expect(disabled).toHaveAttribute("data-disabled", "true");
  });

  it("items are no tab stops: the arrow keys move between them", () => {
    render(<BasicDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    for (const item of screen.getAllByRole("menuitem")) {
      expect(item).toHaveAttribute("tabindex", "-1");
    }
  });

  it("a disabled item runs no handler, the consumer's onClick included", () => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Действия</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item disabled onClick={onClick} onSelect={onSelect}>
            Архивировать
          </Dropdown.Item>
          <Dropdown.CheckboxItem disabled onClick={onClick}>
            Сумма
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "Архивировать" }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Сумма" }));
    expect(onClick).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("ArrowDown and ArrowUp on the trigger open the menu at its first item", async () => {
    const user = userEvent.setup();
    render(<BasicDropdown />);
    screen.getByRole("button", { name: "Open" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Item 1" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
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
          <Dropdown.Item tone="danger" disabled>
            Archive
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const danger = screen.getByRole("menuitem", { name: "Delete" });
    expect(danger).toHaveAttribute("data-tone", "danger");
    // The ink comes from the shared tone ladder; a disabled row keeps the disabled ink.
    expect(danger).toHaveClass(textTone.tone);
    expect(screen.getByRole("menuitem", { name: "Archive" })).not.toHaveClass(textTone.tone);
  });

  // ─── Groups ──────────────────────────────────────────────────────────────────

  it("renders groups named by their label", () => {
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group label="Actions">
            <Dropdown.Item>Edit</Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group label="Danger zone">
            <Dropdown.Item tone="danger">Delete</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("group", { name: "Actions" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Danger zone" })).toBeInTheDocument();
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

  it("ItemIcon holds its glyph and hides it from screen readers", () => {
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.ItemIcon>
              <svg data-testid="glyph" />
            </Dropdown.ItemIcon>
            Action
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const glyph = screen.getByTestId("glyph");
    expect(glyph.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("menuitem", { name: "Action" })).toBeInTheDocument();
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

  it("Header stacks Title and Description in one column between leading and trailing nodes", () => {
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Header data-testid="hdr">
            <span data-testid="lead">АП</span>
            <Dropdown.Title>Title</Dropdown.Title>
            <Dropdown.Description>Subtitle</Dropdown.Description>
            <span data-testid="trail">PRO</span>
          </Dropdown.Header>
          <Dropdown.Separator />
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const header = screen.getByTestId("hdr");
    const title = screen.getByText("Title");
    expect(title.parentElement).toBe(screen.getByText("Subtitle").parentElement);
    expect([...header.children]).toEqual([
      screen.getByTestId("lead"),
      title.parentElement,
      screen.getByTestId("trail"),
    ]);
    expect(screen.getByRole("separator")).toBeInTheDocument();
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

  it("the glyph in ItemIcon follows the menu tier (xl, xs)", () => {
    function TierProbe() {
      return <span data-testid={`tier-${useOptionalControlSize()}`} />;
    }
    render(
      <>
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>
            <button type="button">A</button>
          </Dropdown.Trigger>
          <Dropdown.Content size="xl">
            <Dropdown.Item>
              <Dropdown.ItemIcon>
                <TierProbe />
              </Dropdown.ItemIcon>
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
              <Dropdown.ItemIcon>
                <TierProbe />
              </Dropdown.ItemIcon>
              Small
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </>,
    );
    expect(screen.getByTestId("tier-xl")).toBeInTheDocument();
    expect(screen.getByTestId("tier-xs")).toBeInTheDocument();
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

  it("Tab closes the menu and returns focus to the trigger (the page then moves on)", async () => {
    const user = userEvent.setup();
    render(<BasicDropdown />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    expect(screen.getByRole("menuitem", { name: "Item 1" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "Item 1" }), { key: "Tab" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("Tooltip.Trigger around Dropdown.Trigger keeps both: menu ARIA, tooltip description, both handlers", () => {
    render(
      <Dropdown.Root>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>
            <Dropdown.Trigger>
              <button type="button">Ещё</button>
            </Dropdown.Trigger>
          </Tooltip.Trigger>
          <Tooltip.Content>Действия</Tooltip.Content>
        </Tooltip.Root>
        <Dropdown.Content>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Ещё" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-describedby", screen.getByRole("tooltip").id);
    fireEvent.pointerDown(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("a pointerdown on the trigger is not an outside click", () => {
    render(<BasicDropdown />);
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);
    fireEvent.pointerDown(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closeOnEscape={false} keeps it open on Escape", () => {
    render(
      <Dropdown.Root defaultOpen closeOnEscape={false}>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("CheckboxItem toggles aria-checked and keeps the menu open", () => {
    const onCheckedChange = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Колонки</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem defaultChecked onCheckedChange={onCheckedChange}>
            Сумма
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem disabled>Номер</Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitemcheckbox", { name: "Сумма" });
    expect(item).toHaveAttribute("aria-checked", "true");
    // The label leads; a check mark closes the row while checked, nothing while not.
    expect(item.firstChild).toHaveTextContent("Сумма");
    expect(item.lastElementChild?.querySelector("svg")).toBeInTheDocument();
    fireEvent.click(item);
    expect(item).toHaveAttribute("aria-checked", "false");
    expect(item.lastElementChild?.querySelector("svg")).toBeNull();
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    const disabled = screen.getByRole("menuitemcheckbox", { name: "Номер" });
    fireEvent.click(disabled);
    expect(disabled).toHaveAttribute("aria-checked", "false");
    expect(disabled).toBeDisabled();
  });

  it("CheckboxItem follows a controlled value and takes the arrow keys like an item", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [checked, setChecked] = React.useState(false);
      return (
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>
            <button type="button">Колонки</button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>Сбросить</Dropdown.Item>
            <Dropdown.CheckboxItem checked={checked} onCheckedChange={setChecked}>
              Сумма
            </Dropdown.CheckboxItem>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    }
    render(<Controlled />);
    const reset = screen.getByRole("menuitem", { name: "Сбросить" });
    reset.focus();
    await user.keyboard("{ArrowDown}");
    const item = screen.getByRole("menuitemcheckbox", { name: "Сумма" });
    expect(item).toHaveFocus();
    await user.keyboard(" ");
    expect(item).toHaveAttribute("aria-checked", "true");
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

describe("Dropdown — item description and link items", () => {
  it("a description is a second line that describes, not names, the item", () => {
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Действия</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item disabled tone="danger">
            <Dropdown.ItemIcon>
              <svg />
            </Dropdown.ItemIcon>
            Удалить проект
            <Dropdown.ItemDescription>Доступно владельцу проекта</Dropdown.ItemDescription>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitem");
    expect(item).toHaveAccessibleName("Удалить проект");
    expect(item).toHaveAccessibleDescription("Доступно владельцу проекта");
    expect(item).toBeDisabled();
  });

  it("asChild renders the item as the link: href kept, the pick closes the menu", () => {
    const onSelect = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Действия</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item asChild onSelect={onSelect}>
            <a href="/deals/1042">Открыть сделку</a>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const link = screen.getByRole("menuitem", { name: "Открыть сделку" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/deals/1042");
    // A menu item is reached with the arrow keys, not Tab.
    expect(link).toHaveAttribute("tabindex", "-1");
    // A modified click keeps its native meaning (new tab); the kit does not prevent it.
    const event = new MouseEvent("click", { bubbles: true, cancelable: true, metaKey: true });
    act(() => {
      link.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(false);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("a disabled link item does not navigate or select", () => {
    const onSelect = vi.fn();
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Действия</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item asChild disabled onSelect={onSelect}>
            <a href="/deals/1042">Открыть сделку</a>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const link = screen.getByRole("menuitem", { name: "Открыть сделку" });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("Dropdown — context menu", () => {
  it("opens at anchorPoint inside a Dropdown.Anchor, named by its control; focus returns to it", async () => {
    const user = userEvent.setup();
    function Row() {
      const [open, setOpen] = React.useState(false);
      return (
        <Dropdown.Root open={open} onOpenChange={setOpen} anchorPoint={{ x: 40, y: 12 }}>
          <Dropdown.Anchor>
            <button
              type="button"
              onContextMenu={(event) => {
                event.preventDefault();
                setOpen(true);
              }}
            >
              Поставка оборудования
            </button>
          </Dropdown.Anchor>
          <Dropdown.Content>
            <Dropdown.Item>Переименовать</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    }
    render(<Row />);
    const row = screen.getByRole("button", { name: "Поставка оборудования" });
    // An anchor adds no ARIA and no click of its own.
    expect(row).not.toHaveAttribute("aria-haspopup");
    fireEvent.click(row);
    expect(screen.queryByRole("menu")).toBeNull();
    row.focus();
    fireEvent.contextMenu(row);
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAccessibleName("Поставка оборудования");
    expect(screen.getByRole("menuitem", { name: "Переименовать" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(row).toHaveFocus();
  });
});

describeOverlayConformance("Dropdown", {
  render: () => (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <button type="button">Открыть</button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Переименовать</Dropdown.Item>
        <Dropdown.Item>Архивировать</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  ),
  trigger: "Открыть",
  role: "menu",
});

// ─── Search, meta, width, rows ────────────────────────────────────────────────

function ChatsDropdown({
  onNew,
  onPick,
  labels,
}: {
  onNew?: () => void;
  onPick?: (title: string) => void;
  labels?: { search?: string; empty?: string };
}) {
  return (
    <Dropdown.Root labels={labels}>
      <Dropdown.Trigger>
        <button type="button">Чаты</button>
      </Dropdown.Trigger>
      <Dropdown.Content width="m" maxRows={12}>
        <Dropdown.Search />
        <Dropdown.Item persistent onSelect={onNew}>
          Новый чат
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Group label="Сегодня">
          <Dropdown.Item onSelect={() => onPick?.("Сверка счетов")}>
            Сверка счетов
            <Dropdown.ItemMeta>14:32</Dropdown.ItemMeta>
          </Dropdown.Item>
          <Dropdown.Item onSelect={() => onPick?.("Отчёт по выручке")}>
            Отчёт по выручке
            <Dropdown.ItemMeta>11:05</Dropdown.ItemMeta>
          </Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Group label="Ранее">
          <Dropdown.Item disabled>Отчёт за август</Dropdown.Item>
          <Dropdown.Item keywords="оптовый" onSelect={() => onPick?.("Расчёт скидки")}>
            Расчёт скидки
            <Dropdown.ItemMeta>вчера</Dropdown.ItemMeta>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

describe("Dropdown.Search", () => {
  it("takes focus on open; the arrows move the highlight while focus stays in the field", async () => {
    const user = userEvent.setup();
    render(<ChatsDropdown />);
    await user.click(screen.getByRole("button", { name: "Чаты" }));
    const search = screen.getByRole("searchbox", { name: "Поиск" });
    expect(search).toHaveFocus();
    expect(search).toHaveAttribute("aria-controls", screen.getByRole("menu").id);
    const first = screen.getByRole("menuitem", { name: "Новый чат" });
    expect(search).toHaveAttribute("aria-activedescendant", first.id);
    expect(first).toHaveAttribute("data-highlighted", "true");

    await user.keyboard("{ArrowDown}");
    const next = screen.getByRole("menuitem", { name: "Сверка счетов" });
    expect(search).toHaveFocus();
    expect(search).toHaveAttribute("aria-activedescendant", next.id);
    expect(next).toHaveAttribute("data-highlighted", "true");
    expect(first).not.toHaveAttribute("data-highlighted");

    // Wraps both ways; a disabled item is skipped.
    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(search).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("menuitem", { name: "Расчёт скидки" }).id,
    );
  });

  it("filters by the item text and keywords, hides empty groups and separators, marks the match", async () => {
    const user = userEvent.setup();
    render(<ChatsDropdown />);
    await user.click(screen.getByRole("button", { name: "Чаты" }));
    await user.keyboard("отчёт");
    expect(screen.getByRole("menuitem", { name: "Отчёт по выручке" })).toBeVisible();
    expect(screen.queryByRole("menuitem", { name: "Сверка счетов" })).toBeNull();
    // The persistent action stays; the highlight goes to the first match, not to it.
    expect(screen.getByRole("menuitem", { name: "Новый чат" })).toBeVisible();
    expect(screen.getByRole("searchbox")).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("menuitem", { name: "Отчёт по выручке" }).id,
    );
    expect(screen.queryByRole("separator")).toBeNull();
    expect(
      screen.getByRole("menuitem", { name: "Отчёт по выручке" }).querySelector("mark"),
    ).toHaveTextContent("Отчёт");

    await user.clear(screen.getByRole("searchbox"));
    await user.keyboard("оптовый");
    expect(screen.getByRole("menuitem", { name: "Расчёт скидки" })).toBeVisible();
    expect(screen.queryByRole("group", { name: "Сегодня" })).toBeNull();
    expect(screen.getByRole("group", { name: "Ранее" })).toBeVisible();
  });

  it("Enter runs the highlighted item and closes the menu; Space types into the query", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<ChatsDropdown onPick={onPick} />);
    const trigger = screen.getByRole("button", { name: "Чаты" });
    await user.click(trigger);
    await user.keyboard("расчёт скидки");
    expect(screen.getByRole("searchbox")).toHaveValue("расчёт скидки");
    await user.keyboard("{Enter}");
    expect(onPick).toHaveBeenCalledWith("Расчёт скидки");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("shows the empty state while nothing matches; the persistent item still runs", async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    render(<ChatsDropdown onNew={onNew} labels={{ empty: "Таких чатов нет" }} />);
    await user.click(screen.getByRole("button", { name: "Чаты" }));
    await user.keyboard("накладная");
    expect(screen.getByRole("status")).toHaveTextContent("Таких чатов нет");
    await user.keyboard("{Enter}");
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it("starts every opening with an empty query; Escape closes from the field", async () => {
    const user = userEvent.setup();
    render(<ChatsDropdown />);
    const trigger = screen.getByRole("button", { name: "Чаты" });
    await user.click(trigger);
    await user.keyboard("скидки");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByRole("menuitem", { name: "Сверка счетов" })).toBeVisible();
  });

  it("the pointer moves the highlight", async () => {
    const user = userEvent.setup();
    render(<ChatsDropdown />);
    await user.click(screen.getByRole("button", { name: "Чаты" }));
    const item = screen.getByRole("menuitem", { name: "Отчёт по выручке" });
    fireEvent.pointerMove(item);
    expect(screen.getByRole("searchbox")).toHaveAttribute("aria-activedescendant", item.id);
  });
});

describe("Dropdown.Content width and maxRows · Dropdown.ItemMeta", () => {
  it("writes the measure and the row count onto the panel", async () => {
    const user = userEvent.setup();
    render(<ChatsDropdown />);
    await user.click(screen.getByRole("button", { name: "Чаты" }));
    const panel = screen.getByRole("searchbox").closest("[data-width]");
    expect(panel).toHaveAttribute("data-width", "m");
    expect(panel).toHaveAttribute("data-rows");
    expect((panel as HTMLElement).style.getPropertyValue("--menu-rows")).toBe("12");
  });

  it("the meta sits after the label on its line and describes the item, not names it", () => {
    render(
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            Квартальный отчёт
            <Dropdown.ItemMeta>14:32</Dropdown.ItemMeta>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    const item = screen.getByRole("menuitem", { name: "Квартальный отчёт" });
    expect(item).toHaveAccessibleDescription("14:32");
    const [label, meta] = Array.from(item.children);
    expect(label).toHaveTextContent("Квартальный отчёт");
    expect(meta).toHaveTextContent("14:32");
  });
});
