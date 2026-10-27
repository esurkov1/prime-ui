import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Dropdown } from "@/components/dropdown/Dropdown";
import { Popover } from "@/components/popover/Popover";
import { Select } from "@/components/select/Select";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { mockCompactViewport, swipe } from "@/test/mobile";

/** The sheet around a panel: the handle's parent. */
function sheetOf(panel: HTMLElement) {
  return panel.parentElement as HTMLElement;
}

function Menu({ menuRef }: { menuRef?: React.Ref<HTMLDivElement> }) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <button type="button">Действия</button>
      </Dropdown.Trigger>
      <Dropdown.Content ref={menuRef}>
        <Dropdown.Item>Переименовать</Dropdown.Item>
        <Dropdown.Item>Архивировать</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

describe("floating layers on a wide viewport", () => {
  it("stay anchored panels without a handle or scrim", () => {
    render(<Menu />);
    fireEvent.click(screen.getByRole("button", { name: "Действия" }));
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("data-state", "open");
    expect(menu).not.toHaveAttribute("data-sheet");
    expect(menu.parentElement?.querySelector("[data-swipe-handle]")).toBeNull();
  });

  it("carry their width mode on the surface", () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button type="button">Период</button>
        </Popover.Trigger>
        <Popover.Content width="content">Два месяца</Popover.Content>
      </Popover.Root>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("data-width", "content");
  });
});

describe("floating layers below 640px", () => {
  let restore: () => void;
  beforeEach(() => {
    restore = mockCompactViewport();
  });
  afterEach(() => {
    restore();
    document.body.removeAttribute("style");
  });

  it("a Dropdown becomes a bottom sheet: scrim, handle, the menu inside, page scroll locked", () => {
    const menuRef = React.createRef<HTMLDivElement>();
    render(<Menu menuRef={menuRef} />);
    fireEvent.click(screen.getByRole("button", { name: "Действия" }));
    const menu = screen.getByRole("menu");
    const sheet = sheetOf(menu);
    expect(sheet).toHaveAttribute("data-state", "open");
    expect(menu).not.toHaveAttribute("data-state");
    // The panel stands in the sheet: its own width rules give way to the sheet's.
    expect(menu).toHaveAttribute("data-sheet");
    expect(menu).not.toHaveAttribute("data-width");
    expect(sheet.firstElementChild).toHaveAttribute("data-swipe-handle");
    expect(sheet.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(sheet.previousElementSibling).toHaveAttribute("role", "presentation");
    // The consumer ref stays on the menu, not on the sheet around it.
    expect(menuRef.current).toBe(menu);
    expect(document.body.style.overflow).toBe("hidden");
    // Keyboard works as in the anchored menu: focus is in the menu.
    expect(menu.contains(document.activeElement)).toBe(true);
  });

  it("closes with a swipe down from the handle, or a press on the scrim", async () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "Действия" });
    fireEvent.click(trigger);
    const handle = sheetOf(screen.getByRole("menu")).firstElementChild as Element;
    swipe(handle, { x: 0, y: 0 }, { x: 0, y: 300 });
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());

    fireEvent.click(trigger);
    const scrim = sheetOf(screen.getByRole("menu")).previousElementSibling as Element;
    fireEvent.pointerDown(scrim);
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("draws no handle and takes no swipe when an outside press does not close it", () => {
    render(
      <Dropdown.Root closeOnOutsideClick={false}>
        <Dropdown.Trigger>
          <button type="button">Действия</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Переименовать</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Действия" }));
    expect(document.querySelector("[data-swipe-handle]")).toBeNull();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("a Select listbox picks a value inside the sheet", async () => {
    render(
      <Select.Root placeholder="Статус">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="paid">Оплачен</Select.Item>
          <Select.Item value="sent">Отправлен</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(document.querySelector("[data-swipe-handle]")).not.toBeNull();
    fireEvent.click(screen.getByRole("option", { name: "Отправлен" }));
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(screen.getByRole("combobox")).toHaveTextContent("Отправлен");
  });

  it("a Popover becomes a sheet, but not when a field drives it through Popover.Anchor", () => {
    const { unmount } = render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button type="button">Период</button>
        </Popover.Trigger>
        <Popover.Content>Выбор периода</Popover.Content>
      </Popover.Root>,
    );
    expect(sheetOf(screen.getByRole("dialog")).querySelector("[data-swipe-handle]")).not.toBeNull();
    unmount();

    render(
      <Popover.Root open>
        <Popover.Anchor>
          <input aria-label="Поиск" />
        </Popover.Anchor>
        <Popover.Content>Подсказки</Popover.Content>
      </Popover.Root>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
    expect(document.querySelector("[data-swipe-handle]")).toBeNull();
  });

  it("a sheet stands on the on-screen keyboard; a Popover sheet is a column on the sheet frame", () => {
    const viewport = Object.assign(new EventTarget(), { height: 800, offsetTop: 0, scale: 1 });
    vi.stubGlobal("visualViewport", viewport);
    vi.stubGlobal("innerHeight", 800);
    try {
      render(
        <Popover.Root defaultOpen>
          <Popover.Trigger>
            <button type="button">Пароль</button>
          </Popover.Trigger>
          <Popover.Content aria-label="Пароль сети">
            <input aria-label="Пароль" />
          </Popover.Content>
        </Popover.Root>,
      );
      const panel = screen.getByRole("dialog");
      const sheet = sheetOf(panel);
      expect(panel).toHaveAttribute("data-sheet");
      act(() => {
        viewport.height = 460;
        viewport.dispatchEvent(new Event("resize"));
      });
      // The surface, not the panel inside, moves onto the keyboard.
      expect(sheet.style.getPropertyValue("--visual-inset-bottom")).toBe("340px");
      expect(sheet).toHaveAttribute("data-keyboard");
      expect(panel).not.toHaveAttribute("data-keyboard");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("a Tooltip stays anchored", () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>
            <button type="button">Экспорт</button>
          </Tooltip.Trigger>
          <Tooltip.Content>Выгрузить CSV</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-state", "open");
    expect(document.querySelector("[data-swipe-handle]")).toBeNull();
  });
});
