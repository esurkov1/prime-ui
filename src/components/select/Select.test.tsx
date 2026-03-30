import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Select } from "./Select";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicSelect({
  defaultValue,
  value,
  onChange,
  disabled,
  hasError,
  placeholder = "Pick one",
  size,
}: {
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
  size?: "s" | "m" | "l" | "xl";
}) {
  return (
    <Select.Root
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      disabled={disabled}
      hasError={hasError}
      placeholder={placeholder}
      size={size}
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="one">One</Select.Item>
        <Select.Item value="two">Two</Select.Item>
        <Select.Item value="three" disabled>
          Three
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
}

// ─── Select (composable) ─────────────────────────────────────────────────────

describe("Select (composable)", () => {
  it("renders trigger with placeholder when no value selected", () => {
    render(<BasicSelect />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("opens listbox on trigger click", () => {
    render(<BasicSelect />);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("closes listbox on second trigger click", () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");

    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("sets aria-expanded correctly", () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("sets aria-haspopup and aria-controls", () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-controls");
  });

  it("selects item on click and closes listbox", () => {
    render(<BasicSelect />);

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "One" }));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("One");
  });

  it("aria-selected reflects selected item", () => {
    render(<BasicSelect />);

    fireEvent.click(screen.getByRole("combobox"));
    const optionOne = screen.getByRole("option", { name: "One" });
    expect(optionOne).toHaveAttribute("aria-selected", "false");

    fireEvent.click(optionOne);

    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "One" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Two" })).toHaveAttribute("aria-selected", "false");
  });

  it("closes on Escape key", () => {
    render(<BasicSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens on ArrowDown key from trigger", () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("opens on Enter key from trigger", () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");

    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("keyboard ArrowDown navigates to next item and Enter selects", () => {
    render(<BasicSelect />);

    fireEvent.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");

    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    fireEvent.keyDown(listbox, { key: "Enter" });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("keyboard ArrowUp wraps around to last item", () => {
    render(<BasicSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");

    fireEvent.keyDown(listbox, { key: "ArrowUp" });
    // Now on last non-disabled item (Two, since Three is disabled)
    fireEvent.keyDown(listbox, { key: "Enter" });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Two");
  });

  it("Home key highlights first item", () => {
    render(<BasicSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    fireEvent.keyDown(listbox, { key: "End" });
    fireEvent.keyDown(listbox, { key: "Home" });
    fireEvent.keyDown(listbox, { key: "Enter" });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("One");
  });

  it("Space key selects highlighted item", () => {
    render(<BasicSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");

    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    fireEvent.keyDown(listbox, { key: " " });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("calls onChange with selected value", () => {
    const onChange = vi.fn();
    render(<BasicSelect onChange={onChange} />);

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Two" }));

    expect(onChange).toHaveBeenCalledWith("two");
  });

  it("controlled: value prop controls displayed label", async () => {
    const onChange = vi.fn();
    render(<BasicSelect value="two" onChange={onChange} />);

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveTextContent("Two");
    });
  });

  it("controlled: external value change does not keep stale item label (e.g. __none__ → id)", async () => {
    const noop = vi.fn();
    const { rerender } = render(
      <Select.Root value="__none__" onChange={noop} placeholder="Pick">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="__none__">—</Select.Item>
          <Select.Item value="one">One</Select.Item>
          <Select.Item value="two">Two</Select.Item>
        </Select.Content>
      </Select.Root>,
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveTextContent("—");
    });

    rerender(
      <Select.Root value="two" onChange={noop} placeholder="Pick">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="__none__">—</Select.Item>
          <Select.Item value="one">One</Select.Item>
          <Select.Item value="two">Two</Select.Item>
        </Select.Content>
      </Select.Root>,
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveTextContent("Two");
    });
    expect(screen.getByRole("combobox")).not.toHaveTextContent("—");
  });

  it("controlled: rapid external value changes resolve to final label", async () => {
    const noop = vi.fn();
    const { rerender } = render(
      <Select.Root value="one" onChange={noop} placeholder="Pick">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="one">One</Select.Item>
          <Select.Item value="two">Two</Select.Item>
        </Select.Content>
      </Select.Root>,
    );

    rerender(
      <Select.Root value="two" onChange={noop} placeholder="Pick">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="one">One</Select.Item>
          <Select.Item value="two">Two</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    rerender(
      <Select.Root value="one" onChange={noop} placeholder="Pick">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="one">One</Select.Item>
          <Select.Item value="two">Two</Select.Item>
        </Select.Content>
      </Select.Root>,
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveTextContent("One");
    });
  });

  it("controlled: label tracks value under StrictMode", async () => {
    const noop = vi.fn();
    render(
      <React.StrictMode>
        <Select.Root value="two" onChange={noop} placeholder="Pick">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="__none__">—</Select.Item>
            <Select.Item value="two">Two</Select.Item>
          </Select.Content>
        </Select.Root>
      </React.StrictMode>,
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveTextContent("Two");
    });
  });

  it("defaultValue sets initial selection", () => {
    render(<BasicSelect defaultValue="one" />);
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "One" })).toHaveAttribute("aria-selected", "true");
  });

  it("disabled trigger cannot be opened", () => {
    render(<BasicSelect disabled />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeDisabled();

    fireEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("disabled item is not selectable", () => {
    render(<BasicSelect />);
    fireEvent.click(screen.getByRole("combobox"));

    const disabledOption = screen.getByRole("option", { name: "Three" });
    expect(disabledOption).toHaveAttribute("aria-disabled", "true");
    expect(disabledOption).toHaveAttribute("data-disabled", "true");

    fireEvent.click(disabledOption);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("hasError sets data-has-error on trigger", () => {
    render(<BasicSelect hasError />);
    expect(screen.getByRole("combobox")).toHaveAttribute("data-has-error", "true");
  });

  it("size variant sets data-size on trigger", () => {
    render(<BasicSelect size="xl" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("data-size", "xl");
  });

  it("closes on outside click", () => {
    render(
      <div>
        <BasicSelect />
        <button type="button">Outside</button>
      </div>,
    );

    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders SelectGroup and SelectGroupLabel", () => {
    render(
      <Select.Root placeholder="Pick">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.GroupLabel>Group A</Select.GroupLabel>
            <Select.Item value="a1">Item A1</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.GroupLabel>Group B</Select.GroupLabel>
            <Select.Item value="b1">Item B1</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>,
    );

    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("Group A")).toBeInTheDocument();
    expect(screen.getByText("Group B")).toBeInTheDocument();
    expect(screen.getByText("Item A1")).toBeInTheDocument();
  });

  it("renders item with icon slot", () => {
    render(
      <Select.Root placeholder="Pick">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="star">
            <Select.ItemIcon>★</Select.ItemIcon>
            Star
          </Select.Item>
        </Select.Content>
      </Select.Root>,
    );

    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("★")).toBeInTheDocument();
  });

  it("renders trigger with icon slot", () => {
    render(
      <Select.Root placeholder="Pick">
        <Select.Trigger>
          <Select.TriggerIcon>🌐</Select.TriggerIcon>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="x">X</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(screen.getByText("🌐")).toBeInTheDocument();
  });

  it("listbox has aria-labelledby pointing to trigger id", () => {
    render(<BasicSelect />);
    fireEvent.click(screen.getByRole("combobox"));

    const trigger = screen.getByRole("combobox");
    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("aria-labelledby", trigger.id);
  });

  it("does not auto-highlight any item when opening without selected value", () => {
    render(<BasicSelect />);
    fireEvent.click(screen.getByRole("combobox"));

    const options = screen.getAllByRole("option");
    // Ни один пункт не должен иметь data-highlighted="true"
    options.forEach((option) => {
      expect(option).not.toHaveAttribute("data-highlighted", "true");
    });
  });

  it("highlights selected item when opening with selected value", async () => {
    render(<BasicSelect defaultValue="two" />);
    fireEvent.click(screen.getByRole("combobox"));

    const optionTwo = screen.getByRole("option", { name: "Two" });
    await waitFor(() => {
      expect(optionTwo).toHaveAttribute("data-highlighted", "true");
    });
  });
});

describe("Select (native)", () => {
  it("renders a native select instead of button listbox", () => {
    const { container } = render(
      <Select.Root native placeholder="Pick">
        <Select.Content>
          <Select.Item value="one">One</Select.Item>
          <Select.Item value="two">Two</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(container.querySelector("select")).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("fires onChange when native select value changes", () => {
    const onChange = vi.fn();
    render(
      <Select.Root native placeholder="Pick" onChange={onChange}>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
          <Select.Item value="b">B</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
    expect(onChange).toHaveBeenCalledWith("b");
  });
});
