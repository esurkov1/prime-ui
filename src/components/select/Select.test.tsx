import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "@/components/badge/Badge";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";

import { Select } from "./Select";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicSelect({
  defaultValue,
  value,
  onChange,
  disabled,
  invalid,
  placeholder = "Pick one",
  size,
}: {
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  size?: "s" | "m" | "l" | "xl";
}) {
  return (
    <Select.Root
      invalid={invalid}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onChange}
      disabled={disabled}
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
      <Select.Root value="__none__" onValueChange={noop} placeholder="Pick">
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
      <Select.Root value="two" onValueChange={noop} placeholder="Pick">
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
      <Select.Root value="one" onValueChange={noop} placeholder="Pick">
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
      <Select.Root value="two" onValueChange={noop} placeholder="Pick">
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
      <Select.Root value="one" onValueChange={noop} placeholder="Pick">
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
        <Select.Root value="two" onValueChange={noop} placeholder="Pick">
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

  it("invalid sets data-invalid on trigger", () => {
    render(<BasicSelect invalid />);
    expect(screen.getByRole("combobox")).toHaveAttribute("data-invalid", "true");
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

    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders groups named by their label, with a separator", () => {
    render(
      <Select.Root placeholder="Pick">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Group label="Group A">
            <Select.Item value="a1">Item A1</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group label="Group B">
            <Select.Item value="b1">Item B1</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>,
    );

    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("group", { name: "Group A" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Group B" })).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
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

describe("Select (multiple combobox)", () => {
  function MultiSelect({
    value,
    onChange,
    defaultValue,
  }: {
    value?: string[];
    defaultValue?: string[];
    onChange?: (v: string[]) => void;
  }) {
    return (
      <Select.Root
        multiple
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        placeholder="Pick"
      >
        <Select.Trigger aria-label="Multi">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="one">One</Select.Item>
          <Select.Item value="two">Two</Select.Item>
          <Select.Item value="three">Three</Select.Item>
        </Select.Content>
      </Select.Root>
    );
  }

  it("listbox has aria-multiselectable when multiple", () => {
    render(<MultiSelect defaultValue={["one"]} />);
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
  });

  it("selects and toggles items without closing list", () => {
    const onChange = vi.fn();
    const { rerender } = render(<MultiSelect value={[]} onChange={onChange} />);

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "One" }));
    expect(onChange).toHaveBeenCalledWith(["one"]);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    rerender(<MultiSelect value={["one"]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("option", { name: "One" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("shows comma-separated labels in trigger", async () => {
    render(<MultiSelect defaultValue={["one", "two"]} />);
    const trigger = screen.getByRole("combobox");
    await waitFor(() => {
      expect(trigger).toHaveTextContent("One, Two");
    });
  });
});

describe("Select (search, clear, loading, empty)", () => {
  function SearchSelect(props: { onValueChange?: (v: string) => void; loading?: boolean }) {
    return (
      <Select.Root
        placeholder="Город"
        clearable
        defaultValue="msk"
        labels={{ search: "Найти город" }}
        {...props}
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content searchable>
          <Select.Group label="Россия">
            <Select.Item value="msk">Москва</Select.Item>
            <Select.Item value="spb" keywords="питер">
              Санкт-Петербург
            </Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    );
  }

  it("фильтрует пункты по строке поиска и ключевым словам", () => {
    render(<SearchSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    const search = screen.getByRole("textbox", { name: "Найти город" });
    fireEvent.change(search, { target: { value: "питер" } });
    expect(screen.getByRole("option", { name: "Санкт-Петербург" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Москва" })).not.toBeInTheDocument();
  });

  it("показывает пустое состояние, когда ничего не найдено", () => {
    render(<SearchSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.change(screen.getByRole("textbox", { name: "Найти город" }), {
      target: { value: "zzz" },
    });
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("Ничего не найдено")).toBeInTheDocument();
  });

  it("Enter в поиске выбирает первый найденный пункт", async () => {
    const onChange = vi.fn();
    render(<SearchSelect onValueChange={onChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    const search = screen.getByRole("textbox", { name: "Найти город" });
    fireEvent.change(search, { target: { value: "санкт" } });
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Санкт-Петербург" })).toHaveAttribute(
        "data-highlighted",
        "true",
      ),
    );
    fireEvent.keyDown(search, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("spb");
  });

  it("clearable: Delete на триггере сбрасывает значение", () => {
    const onChange = vi.fn();
    render(<SearchSelect onValueChange={onChange} />);
    const trigger = screen.getByRole("combobox");
    fireEvent.keyDown(trigger, { key: "Delete" });
    expect(onChange).toHaveBeenCalledWith("");
    expect(trigger).toHaveTextContent("Город");
  });

  it("controlled open: onOpenChange reports the trigger toggle", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Select.Root open={false} onOpenChange={onOpenChange}>
        <Select.Trigger aria-label="Город">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("data-state", "closed");
    rerender(
      <Select.Root open onOpenChange={onOpenChange}>
        <Select.Trigger aria-label="Город">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("loading: aria-busy на триггере и строка загрузки в панели", () => {
    render(<SearchSelect loading />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-busy", "true");
    fireEvent.click(trigger);
    expect(screen.getByText("Загрузка…")).toBeInTheDocument();
  });
});

describe("Select (field)", () => {
  it("label, hint and error: label names the trigger, error replaces hint and implies invalid", () => {
    const { rerender } = render(
      <Select.Root label="Город" hint="Подсказка" required>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    const trigger = screen.getByRole("combobox", { name: /Город/ });
    expect(trigger).toHaveAttribute("aria-required", "true");
    expect(trigger).toHaveAccessibleDescription("Подсказка");
    expect(trigger).not.toHaveAttribute("aria-invalid");

    rerender(
      <Select.Root label="Город" hint="Подсказка" error="Выберите город">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(trigger).toHaveAccessibleDescription("Выберите город");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("data-invalid", "true");
    expect(screen.queryByText("Подсказка")).not.toBeInTheDocument();
  });
});

describe("Select focusRing", () => {
  it("focusRing={false} marks the trigger and keeps the invalid state", () => {
    render(
      <Select.Root focusRing={false} invalid placeholder="Pick">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content searchable>
          <Select.Item value="one">One</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("data-focus-ring", "false");
    expect(trigger).toHaveAttribute("data-invalid", "true");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });

  it("the panel search row never draws a ring", () => {
    render(
      <Select.Root placeholder="Pick">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content searchable>
          <Select.Item value="one">One</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(screen.getByRole("combobox")).not.toHaveAttribute("data-focus-ring");
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("textbox").parentElement).toHaveAttribute("data-focus-ring", "false");
  });
});

describe("Select — overlay contract", () => {
  // Focus follows the pointer (foundation §8): an outside press closes the listbox and does NOT
  // pull focus back to the trigger — empty space leaves nothing focused, another control takes it.
  // (Earlier the trigger got focus back, so leaving a field took two clicks.)
  it("an outside click on empty space closes the listbox and leaves nothing focused", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <BasicSelect />
        <div data-testid="empty-space">empty</div>
      </div>,
    );
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.click(screen.getByTestId("empty-space"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).not.toHaveFocus();
    expect(document.activeElement).toBe(document.body);
  });

  it("an outside click on another control moves focus to that control", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <BasicSelect />
        <button type="button">Другая кнопка</button>
      </div>,
    );
    await user.click(screen.getByRole("combobox"));
    const other = screen.getByRole("button", { name: "Другая кнопка" });
    await user.click(other);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(other).toHaveFocus();
  });

  it("Escape closes the listbox and returns focus to the trigger", () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

// ─── Rich options, badge, typeahead ─────────────────────────────────────────

const VEHICLES = [
  { value: "nmax", title: "Yamaha NMAX 155", kind: "Скутер", price: "250 ฿ / день" },
  { value: "adv160", title: "Honda ADV 160", kind: "Скутер", price: "300 ฿ / день" },
  { value: "adv350", title: "Honda ADV 350", kind: "Максискутер", price: "450 ฿ / день" },
];

function RichSelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <Select.Root defaultValue={defaultValue} placeholder="Выберите байк" label="Байк">
      <Select.Trigger>
        <Select.Value
          renderValue={({ value, label }) => {
            const v = VEHICLES.find((x) => x.value === value);
            return (
              <>
                <Thumbnail.Root color="green" data-testid="trigger-media">
                  <Thumbnail.Fallback>M</Thumbnail.Fallback>
                </Thumbnail.Root>
                <Select.ItemText>{label}</Select.ItemText>
                <Select.ItemDescription>{`${v?.kind} · ${v?.price}`}</Select.ItemDescription>
              </>
            );
          }}
        />
        <Badge.Root color="orange">Новое</Badge.Root>
      </Select.Trigger>
      <Select.Content searchable>
        {VEHICLES.map((v) => (
          <Select.Item key={v.value} value={v.value}>
            <Thumbnail.Root color="blue" ratio="4:3">
              <Thumbnail.Fallback>M</Thumbnail.Fallback>
            </Thumbnail.Root>
            <Select.ItemText>{v.title}</Select.ItemText>
            <Select.ItemDescription>{v.kind}</Select.ItemDescription>
            <Select.ItemMeta>{v.price}</Select.ItemMeta>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}

describe("Select rich options", () => {
  it("a Thumbnail is the leading media, sized to the tier unless it sets its own size", () => {
    render(<RichSelect defaultValue="adv160" />);
    const media = screen.getByTestId("trigger-media");
    expect(media).toHaveAttribute("data-size", "s");
    expect(media).toHaveAttribute("aria-hidden", "true");
    const option = screen.getByRole("option", { name: /Honda ADV 160/, hidden: true });
    expect(option.querySelector('[data-ratio="4:3"]')).toHaveAttribute("data-size", "s");
  });

  it("rich item: title is the label, two-line layout, meta before the check", () => {
    render(<RichSelect defaultValue="adv160" />);
    const option = screen.getByRole("option", { name: /Honda ADV 160/, hidden: true });
    expect(option).toHaveAttribute("data-label", "Honda ADV 160");
    expect(option).toHaveAttribute("data-rich", "true");
    const meta = option.querySelector('[class*="itemMeta"]');
    expect(meta?.textContent).toBe("300 ฿ / день");
    expect(meta?.nextElementSibling?.className).toMatch(/check/);
  });

  it("trigger renders the selected option through renderValue", async () => {
    render(<RichSelect defaultValue="adv160" />);
    const trigger = screen.getByRole("combobox");
    await waitFor(() => expect(trigger).toHaveTextContent("Honda ADV 160"));
    expect(trigger).toHaveTextContent("Скутер · 300 ฿ / день");
    expect(trigger.querySelector('[data-rich="true"]')).not.toBeNull();
  });

  it("empty rich trigger shows the placeholder, not the render function", () => {
    render(<RichSelect />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Выберите байк");
    expect(trigger.querySelector('[data-rich="true"]')).toBeNull();
  });

  it("a Badge among the Trigger children sits in the trigger one tier down", () => {
    render(<RichSelect />);
    const badge = screen.getByText("Новое");
    expect(screen.getByRole("combobox")).toContainElement(badge);
    expect(badge).toHaveAttribute("data-color", "orange");
    expect(badge).toHaveAttribute("data-tier", "s");
  });

  it("search matches the description too", () => {
    render(<RichSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.change(screen.getByRole("textbox", { name: "Поиск" }), {
      target: { value: "максискутер" },
    });
    const options = screen.getAllByRole("option");
    expect(options.map((o) => o.dataset.value)).toEqual(["adv350"]);
  });

  it("single-line items keep the plain layout", () => {
    render(<BasicSelect />);
    for (const option of screen.getAllByRole("option", { hidden: true })) {
      expect(option).not.toHaveAttribute("data-rich");
    }
  });
});

describe("Select typeahead", () => {
  it("a letter highlights the next option whose title starts with it; repeats cycle", () => {
    render(<RichSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    const panel = screen.getByRole("listbox");
    fireEvent.keyDown(panel, { key: "h" });
    const highlighted = () =>
      screen.getAllByRole("option").find((o) => o.dataset.highlighted === "true")?.dataset.value;
    expect(highlighted()).toBe("adv160");
    fireEvent.keyDown(panel, { key: "h" });
    expect(highlighted()).toBe("adv350");
    fireEvent.keyDown(panel, { key: "h" });
    expect(highlighted()).toBe("adv160");
  });

  it("typed prefix narrows to the matching title", () => {
    vi.useFakeTimers();
    try {
      render(<RichSelect />);
      fireEvent.click(screen.getByRole("combobox"));
      const panel = screen.getByRole("listbox");
      /* Space inside a typed prefix is part of the query, not «select». */
      for (const key of "honda adv 3") fireEvent.keyDown(panel, { key });
      const value = screen.getAllByRole("option").find((o) => o.dataset.highlighted === "true")
        ?.dataset.value;
      expect(value).toBe("adv350");
      expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
      vi.advanceTimersByTime(600);
    } finally {
      vi.useRealTimers();
    }
  });
});
