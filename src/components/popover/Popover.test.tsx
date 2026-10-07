import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Select } from "@/components/select/Select";

import { Popover } from "./Popover";

function BasicPopover({
  onOpenChange,
  open,
  defaultOpen,
}: {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  defaultOpen?: boolean;
}) {
  return (
    <Popover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger>
        <button type="button">Open</button>
      </Popover.Trigger>
      <Popover.Content>
        <div>Panel content</div>
      </Popover.Content>
    </Popover.Root>
  );
}

describe("Popover", () => {
  it("renders trigger, content is not present initially", () => {
    render(<BasicPopover />);
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens content on trigger click", () => {
    render(<BasicPopover />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("sets trigger aria attrs for dialog", () => {
    render(<BasicPopover />);
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
  });

  it("keeps the child's own id on the trigger and names the dialog by it", () => {
    render(
      <>
        <label htmlFor="due-date">Срок</label>
        <Popover.Root>
          <Popover.Trigger>
            <button type="button" id="due-date">
              Open
            </button>
          </Popover.Trigger>
          <Popover.Content>
            <div>Panel content</div>
          </Popover.Content>
        </Popover.Root>
      </>,
    );
    const trigger = screen.getByRole("button", { name: "Срок" });
    expect(trigger).toHaveAttribute("id", "due-date");
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby", "due-date");
  });

  it("closes on Escape", () => {
    render(<BasicPopover />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on outside click", () => {
    render(
      <div>
        <BasicPopover />
        <button type="button">Outside</button>
      </div>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("defaultOpen=true opens content on mount", () => {
    render(<BasicPopover defaultOpen={true} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("controlled: calls onOpenChange on toggle", () => {
    const onOpenChange = vi.fn();
    render(<BasicPopover onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("Trigger merges external ref with internal anchor ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Popover.Root>
        <Popover.Trigger>
          <button ref={ref} type="button">
            Open
          </button>
        </Popover.Trigger>
        <Popover.Content>
          <div>Panel content</div>
        </Popover.Content>
      </Popover.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent("Open");
  });
});

describe("Popover title / description", () => {
  it("Title и Description становятся именем и описанием диалога", () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button type="button">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Header>
            <Popover.Title>Фильтры</Popover.Title>
            <Popover.Description>Сузьте выдачу</Popover.Description>
          </Popover.Header>
          <Popover.Actions>
            <button type="button">Применить</button>
          </Popover.Actions>
        </Popover.Content>
      </Popover.Root>,
    );
    const dialog = screen.getByRole("dialog", { name: "Фильтры" });
    expect(dialog).toHaveAccessibleDescription("Сузьте выдачу");
  });

  it("trigger reflects data-state open/closed", () => {
    render(
      <Popover.Root>
        <Popover.Trigger>
          <button type="button">Toggle</button>
        </Popover.Trigger>
        <Popover.Content>
          <span>Body</span>
        </Popover.Content>
      </Popover.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger).toHaveAttribute("data-state", "closed");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");
  });
});

describe("Popover — overlay contract", () => {
  function PopoverWithSelect({ closeOnOutsideClick }: { closeOnOutsideClick?: boolean }) {
    return (
      <div>
        <Popover.Root closeOnOutsideClick={closeOnOutsideClick}>
          <Popover.Trigger>
            <button type="button">Open</button>
          </Popover.Trigger>
          <Popover.Content>
            <Select.Root placeholder="Pick">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="one">One</Select.Item>
              </Select.Content>
            </Select.Root>
          </Popover.Content>
        </Popover.Root>
        <button type="button">Outside</button>
      </div>
    );
  }

  it("a pointerdown inside a nested Select listbox does not close the popover", () => {
    render(<PopoverWithSelect />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.pointerDown(screen.getByRole("option", { name: "One" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("Escape closes only the topmost layer, then the popover with focus back on the trigger", () => {
    render(<PopoverWithSelect />);
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  // Focus follows the pointer (foundation §8): no return to the trigger after an outside press.
  it("an outside press on empty space closes it without returning focus to the trigger", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <PopoverWithSelect />
        <p>empty</p>
      </div>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByText("empty"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).not.toHaveFocus();
    expect(document.activeElement).toBe(document.body);
  });

  it("closeOnOutsideClick={false} keeps it open on an outside click", () => {
    render(<PopoverWithSelect closeOnOutsideClick={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("sets data-state and the resolved side for the shared motion", () => {
    render(<BasicPopover defaultOpen />);
    const panel = screen.getByRole("dialog");
    expect(panel).toHaveAttribute("data-state", "open");
    expect(panel).toHaveAttribute("data-side", "bottom");
  });

  it("Anchor positions the panel without opening it, and presses on it do not dismiss", () => {
    const onOpenChange = vi.fn();
    render(
      <Popover.Root open onOpenChange={onOpenChange}>
        <Popover.Anchor>
          <div data-testid="anchor">
            <input aria-label="field" />
          </div>
        </Popover.Anchor>
        <Popover.Content>
          <div>Panel content</div>
        </Popover.Content>
      </Popover.Root>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByLabelText("field"));
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("anchor"));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("anchor")).not.toHaveAttribute("aria-expanded");
    fireEvent.pointerDown(document.body);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
