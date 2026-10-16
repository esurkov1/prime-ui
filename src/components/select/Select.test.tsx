import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Input } from "@/components/input/Input";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { touchTargetBlockClass } from "@/internal/touchTarget";
import { cssRule, cssValue } from "@/test/css";
import { withMotion } from "@/test/motion";

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

  it("sets aria-haspopup; aria-controls names the list while it is open", () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).not.toHaveAttribute("aria-controls");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
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

  it("opened with a pointer, focuses the list without the ring until a key", async () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    const listbox = screen.getByRole("listbox");
    await waitFor(() => expect(listbox).toHaveFocus());
    expect(listbox).toHaveAttribute("data-focus-quiet");
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    expect(listbox).not.toHaveAttribute("data-focus-quiet");
  });

  it("opened with a key, focuses the list with the ring", async () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const listbox = screen.getByRole("listbox");
    await waitFor(() => expect(listbox).toHaveFocus());
    expect(listbox).not.toHaveAttribute("data-focus-quiet");
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

  it("draws an icon-only trigger from a lone TriggerIcon and still reads the value", () => {
    render(
      <Select.Root label="Иконка" defaultValue="truck">
        <Select.Trigger>
          <Select.TriggerIcon>🚚</Select.TriggerIcon>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="truck">Доставка</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    const trigger = screen.getByRole("combobox", { name: "Иконка" });
    expect(trigger).toHaveAttribute("data-icon-only", "true");
    expect(trigger).toHaveTextContent("Доставка");
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
    // No option may have data-highlighted="true"
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

  it("clearable: сегмент очистки растит зону касания по высоте", () => {
    const { container } = render(<SearchSelect />);
    expect(container.querySelector("[data-select-clear]")).toHaveClass(touchTargetBlockClass);
  });

  it("clearable: Delete на триггере сбрасывает значение", () => {
    const onChange = vi.fn();
    render(<SearchSelect onValueChange={onChange} />);
    const trigger = screen.getByRole("combobox");
    fireEvent.keyDown(trigger, { key: "Delete" });
    expect(onChange).toHaveBeenCalledWith("");
    expect(trigger).toHaveTextContent("Город");
  });

  it("clearable: Backspace on the trigger clears the value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchSelect onValueChange={onChange} />);
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    await user.keyboard("{Backspace}");
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

  it("loading: aria-busy на триггере, пункты на месте, объявление загрузки", () => {
    render(<SearchSelect loading />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-busy", "true");
    fireEvent.click(trigger);
    expect(screen.getByText("Загрузка…")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByRole("listbox").querySelector("[data-skeleton]")).toBeNull();
  });
});

describe("Select (server search)", () => {
  const CLIENTS = [
    { value: "c1", label: "ООО «Вектор»" },
    { value: "c2", label: "АО «Северсталь-Сервис»" },
    { value: "c3", label: "ИП Лебедева" },
  ];

  type ServerSelectProps = Pick<
    React.ComponentProps<typeof Select.Root>,
    | "search"
    | "defaultSearch"
    | "onSearchChange"
    | "loading"
    | "loadingMore"
    | "hasMore"
    | "onLoadMore"
    | "loadError"
    | "onRetry"
  > & { children?: React.ReactNode };

  function ServerSelect(props: ServerSelectProps) {
    const { children, ...rest } = props;
    return (
      <Select.Root defaultOpen placeholder="Клиент" filter={false} {...rest}>
        <Select.Trigger aria-label="Клиент">
          <Select.Value />
        </Select.Trigger>
        <Select.Content searchable>
          {"children" in props
            ? children
            : CLIENTS.map((client) => (
                <Select.Item key={client.value} value={client.value}>
                  {client.label}
                </Select.Item>
              ))}
        </Select.Content>
      </Select.Root>
    );
  }

  it("search / onSearchChange own the query; filter={false} keeps every item", () => {
    const onSearchChange = vi.fn();
    function Harness() {
      const [search, setSearch] = React.useState("");
      return (
        <ServerSelect
          search={search}
          onSearchChange={(next) => {
            onSearchChange(next);
            setSearch(next);
          }}
        />
      );
    }
    render(<Harness />);
    const field = screen.getByRole("textbox", { name: "Поиск" });
    fireEvent.change(field, { target: { value: "zzz" } });
    expect(onSearchChange).toHaveBeenLastCalledWith("zzz");
    expect(field).toHaveValue("zzz");
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.queryByText("Ничего не найдено")).not.toBeInTheDocument();
  });

  it("closing clears the query through onSearchChange", () => {
    const onSearchChange = vi.fn();
    render(<ServerSelect defaultSearch="век" onSearchChange={onSearchChange} />);
    expect(screen.getByRole("textbox", { name: "Поиск" })).toHaveValue("век");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onSearchChange).toHaveBeenLastCalledWith("");
  });

  it("results that arrive later take the highlight", () => {
    const { rerender } = render(<ServerSelect search="лебед">{null}</ServerSelect>);
    rerender(
      <ServerSelect search="лебед">
        <Select.Item value="c3">ИП Лебедева</Select.Item>
      </ServerSelect>,
    );
    expect(screen.getByRole("option", { name: "ИП Лебедева" })).toHaveAttribute(
      "data-highlighted",
      "true",
    );
  });

  it("loading with no items: skeleton rows in the list instead of the empty state", () => {
    render(<ServerSelect loading>{null}</ServerSelect>);
    const list = screen.getByRole("listbox");
    expect(list).toHaveAttribute("aria-busy", "true");
    expect(list.querySelectorAll("[data-skeleton]").length).toBeGreaterThan(0);
    expect(screen.queryByText("Ничего не найдено")).not.toBeInTheDocument();
  });

  it("loadingMore: skeleton rows after the items", () => {
    render(<ServerSelect hasMore loadingMore />);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByRole("listbox").querySelectorAll("[data-skeleton]").length).toBeGreaterThan(
      0,
    );
  });

  it("the highlight reaching the last option asks for more once per round", () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(<ServerSelect hasMore onLoadMore={onLoadMore} />);
    const field = screen.getByRole("textbox", { name: "Поиск" });
    fireEvent.keyDown(field, { key: "ArrowUp" });
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(field, { key: "ArrowDown" });
    fireEvent.keyDown(field, { key: "ArrowUp" });
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    rerender(<ServerSelect hasMore={false} onLoadMore={onLoadMore} />);
    fireEvent.keyDown(field, { key: "ArrowDown" });
    fireEvent.keyDown(field, { key: "ArrowUp" });
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("loadError replaces the list with an alert; the button and Enter call onRetry", () => {
    const onRetry = vi.fn();
    render(<ServerSelect loadError="Не удалось загрузить клиентов" onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Не удалось загрузить клиентов");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Повторить" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Поиск" }), { key: "Enter" });
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it("a load state change cross-fades: the old content leaves inert while the new one shows", () => {
    withMotion();
    const { rerender } = render(<ServerSelect />);
    expect(screen.getByRole("listbox").closest("[inert]")).toBeNull();
    rerender(<ServerSelect loadError="Ошибка" />);
    expect(screen.getByRole("alert").closest("[inert]")).toBeNull();
    expect(screen.getByRole("listbox", { hidden: true }).closest("[inert]")).not.toBeNull();
    rerender(<ServerSelect />);
    expect(screen.getByRole("listbox").closest("[inert]")).toBeNull();
  });
});

describe("Select (form name)", () => {
  it("name submits the value through hidden inputs", () => {
    const { container, unmount } = render(
      <form>
        <Select.Root name="client" defaultValue="c1">
          <Select.Trigger aria-label="Клиент">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="c1">Вектор</Select.Item>
          </Select.Content>
        </Select.Root>
      </form>,
    );
    expect(new FormData(container.querySelector("form") as HTMLFormElement).get("client")).toBe(
      "c1",
    );
    unmount();
    const multiple = render(
      <form>
        <Select.Root name="tags" multiple defaultValue={["a", "b"]}>
          <Select.Trigger aria-label="Метки">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">A</Select.Item>
            <Select.Item value="b">B</Select.Item>
          </Select.Content>
        </Select.Root>
      </form>,
    );
    const form = multiple.container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).getAll("tags")).toEqual(["a", "b"]);
  });

  it("native trigger events reach the button", () => {
    const onBlur = vi.fn();
    const onFocus = vi.fn();
    render(
      <Select.Root>
        <Select.Trigger aria-label="Клиент" onFocus={onFocus} onBlur={onBlur}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="c1">Вектор</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.focus(trigger);
    fireEvent.blur(trigger);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
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

  it("the panel search takes focus and draws no ring: the row tints instead", () => {
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
    expect(screen.getByRole("textbox", { name: "Поиск" })).toHaveFocus();
    const menuCss = "src/internal/menu.module.css";
    expect(cssValue(cssRule(menuCss, ".searchInput"), "outline")).toBe("none");
    expect(cssValue(cssRule(menuCss, ".searchRow:focus-within"), "color")).toBe(
      "var(--prime-color-text-secondary)",
    );
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

  it("closeOnEscape={false} and closeOnOutsideClick={false} keep the list open", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Select.Root closeOnEscape={false} closeOnOutsideClick={false} placeholder="Статус">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="new">Новый</Select.Item>
          </Select.Content>
        </Select.Root>
        <div data-testid="empty-space">empty</div>
      </div>,
    );
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Escape}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.click(screen.getByTestId("empty-space"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
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

  it("a mouse pick in single mode closes and returns focus to the trigger (not to body)", async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Two" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("Tab in the panel focuses the trigger first, then closes (the page goes on from it)", async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const listbox = screen.getByRole("listbox");
    await waitFor(() => expect(listbox).toHaveFocus());
    fireEvent.keyDown(listbox, { key: "Tab" });
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closed, the panel is not in the DOM but the trigger still shows the item label", () => {
    render(<BasicSelect defaultValue="two" />);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Two");
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
            <Select.ItemMeta data-testid="row-meta">{v.price}</Select.ItemMeta>
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
    expect(screen.getByRole("combobox")).toHaveTextContent("Honda ADV 160");
    expect(option).toHaveAttribute("data-rich", "true");
    const meta = option.querySelector('[data-testid="row-meta"]');
    expect(meta?.textContent).toBe("300 ฿ / день");
    // The check of the selected option follows the meta.
    expect(meta?.nextElementSibling).toHaveAttribute("aria-hidden", "true");
    expect(meta?.nextElementSibling?.querySelector("svg")).not.toBeNull();
  });

  it("trigger renders the selected option through renderValue", async () => {
    render(<RichSelect defaultValue="adv160" />);
    const trigger = screen.getByRole("combobox");
    await waitFor(() => expect(trigger).toHaveTextContent("Honda ADV 160"));
    expect(trigger).toHaveTextContent("Скутер · 300 ฿ / день");
    expect(trigger.querySelector('[data-rich="true"]')).not.toBeNull();
  });

  it("renderValue keeps a trailing Badge at the end of the value, after the name", () => {
    render(
      <Select.Root defaultValue="u1">
        <Select.Trigger aria-label="Ответственный">
          <Select.Value
            renderValue={(item) => (
              <>
                <Avatar.Root>
                  <Avatar.Fallback>ВЛ</Avatar.Fallback>
                </Avatar.Root>
                <Select.ItemText>{item.label}</Select.ItemText>
                <Badge.Root data-testid="value-badge">Админ</Badge.Root>
              </>
            )}
          />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="u1">Вера Лебедева</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    const badge = screen.getByTestId("value-badge");
    const value = badge.parentElement as HTMLElement;
    expect(value).toHaveAttribute("data-media", "true");
    expect(value.lastElementChild).toBe(badge);
    expect(badge.previousElementSibling).toHaveTextContent("Вера Лебедева");
  });

  it("empty rich trigger shows the placeholder, not the render function", () => {
    render(<RichSelect />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Выберите байк");
    expect(trigger.querySelector('[data-rich="true"]')).toBeNull();
  });

  it("an Avatar is leading media sized to the tier, a Badge sits after the text; the label stays the name", () => {
    render(
      <Select.Root defaultValue="u1" size="l" defaultOpen>
        <Select.Trigger aria-label="Ответственный">
          <Select.Value
            renderValue={(item) => (
              <>
                <Avatar.Root>
                  <Avatar.Fallback>АС</Avatar.Fallback>
                </Avatar.Root>
                <Select.ItemText>{item.label}</Select.ItemText>
              </>
            )}
          />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="u1">
            <Avatar.Root data-testid="row-avatar">
              <Avatar.Fallback>АС</Avatar.Fallback>
            </Avatar.Root>
            <Select.ItemText>Анна Смирнова</Select.ItemText>
            <Badge.Root data-testid="row-badge">Админ</Badge.Root>
          </Select.Item>
          <Select.Item value="u2">
            <Avatar.Root size="xs">
              <Avatar.Fallback>БК</Avatar.Fallback>
            </Avatar.Root>
            Борис Котов
          </Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    const option = screen.getByRole("option", { name: /Анна Смирнова/ });
    const avatar = screen.getByTestId("row-avatar");
    expect(avatar).toHaveAttribute("data-size", "s");
    expect(avatar).toHaveAttribute("aria-hidden", "true");
    expect(option).not.toHaveAttribute("data-rich");
    expect(option.firstElementChild).toBe(avatar);
    const badge = screen.getByTestId("row-badge");
    expect(badge.previousElementSibling).toHaveTextContent("Анна Смирнова");
    expect(
      screen.getByRole("option", { name: /Борис Котов/ }).querySelector("[data-size]"),
    ).toHaveAttribute("data-size", "xs");
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Анна Смирнова");
    expect(trigger.querySelector('[data-media="true"] [data-size="s"]')).not.toBeNull();
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
    expect(options[0]?.querySelector("mark")).toHaveTextContent(/максискутер/i);
  });

  it("marks the match in the option title while searching, never in the trigger", () => {
    render(<RichSelect />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.change(screen.getByRole("textbox", { name: "Поиск" }), {
      target: { value: "adv" },
    });
    for (const option of screen.getAllByRole("option")) {
      expect(option.querySelector("mark")).toHaveTextContent(/adv/i);
    }
    expect(screen.getByRole("combobox").querySelector("mark")).toBeNull();
  });

  it("single-line items keep the plain layout", () => {
    render(<BasicSelect />);
    for (const option of screen.getAllByRole("option", { hidden: true })) {
      expect(option).not.toHaveAttribute("data-rich");
    }
  });
});

describe("Select typeahead", () => {
  it("a Cyrillic letter typed in the open list highlights the option it starts", async () => {
    const user = userEvent.setup();
    render(
      <Select.Root placeholder="Город">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="msk">Москва</Select.Item>
          <Select.Item value="smr">Самара</Select.Item>
          <Select.Item value="tvr">Тверь</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("т");
    const highlighted = screen.getAllByRole("option").find((o) => o.dataset.highlighted === "true");
    expect(highlighted?.dataset.value).toBe("tvr");
  });

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

// ─── Async onValueChange ─────────────────────────────────────────────────────

function deferred() {
  let resolve: () => void = () => {};
  let reject: (reason?: unknown) => void = () => {};
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("Select onValueChange returning a promise", () => {
  function SavingSelect({
    onValueChange,
    multiple = false,
  }: {
    onValueChange: (value: string | string[]) => Promise<void>;
    multiple?: boolean;
  }) {
    const items = (
      <Select.Content>
        <Select.Item value="one">One</Select.Item>
        <Select.Item value="two">Two</Select.Item>
      </Select.Content>
    );
    const trigger = (
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
    );
    return multiple ? (
      <Select.Root multiple placeholder="Pick" onValueChange={onValueChange}>
        {trigger}
        {items}
      </Select.Root>
    ) : (
      <Select.Root placeholder="Pick" onValueChange={onValueChange}>
        {trigger}
        {items}
      </Select.Root>
    );
  }

  it("shows the picked value at once with a busy trigger; resolve keeps it", async () => {
    const save = deferred();
    const onValueChange = vi.fn(() => save.promise);
    render(<SavingSelect onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("option", { name: "One" }));

    expect(onValueChange).toHaveBeenCalledWith("one");
    expect(trigger).toHaveTextContent("One");
    expect(trigger).toHaveAttribute("aria-busy", "true");

    save.resolve();
    await waitFor(() => expect(trigger).not.toHaveAttribute("aria-busy"));
    expect(trigger).toHaveTextContent("One");
  });

  it("a rejection rolls the value back and announces labels.changeFailed", async () => {
    const save = deferred();
    render(<SavingSelect onValueChange={() => save.promise} />);
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("option", { name: "Two" }));
    expect(trigger).toHaveTextContent("Two");

    save.reject(new Error("offline"));
    await waitFor(() => expect(trigger).toHaveTextContent("Pick"));
    expect(trigger).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("status")).toHaveTextContent("Не удалось сохранить выбор");
  });

  it("multiple: picks wait while a save is pending (no double submit), reject rolls back", async () => {
    const save = deferred();
    const onValueChange = vi.fn(() => save.promise);
    render(<SavingSelect multiple onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "One" }));
    fireEvent.click(screen.getByRole("option", { name: "Two" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["one"]);
    expect(screen.getByRole("option", { name: "One" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Two" })).toHaveAttribute("aria-selected", "false");

    save.reject(new Error("offline"));
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "One" })).toHaveAttribute("aria-selected", "false"),
    );
  });

  it("a synchronous handler applies the value as before", () => {
    const onValueChange = vi.fn();
    render(<BasicSelect onChange={onValueChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Two" }));
    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(screen.getByRole("combobox")).toHaveTextContent("Two");
    expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-busy");
  });
});

// ─── Select.Action ───────────────────────────────────────────────────────────

describe("Select.Action", () => {
  function ClientSelect({ onCreate }: { onCreate: () => void }) {
    return (
      <Select.Root placeholder="Клиент" labels={{ search: "Найти клиента" }}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content searchable>
          <Select.Item value="romashka">Ромашка</Select.Item>
          <Select.Item value="vector">Вектор</Select.Item>
          <Select.Action onSelect={onCreate}>
            <Select.ItemIcon>+</Select.ItemIcon>
            Новый клиент
          </Select.Action>
        </Select.Content>
      </Select.Root>
    );
  }

  it("stands outside the scroller, owned by the listbox", () => {
    render(<ClientSelect onCreate={() => {}} />);
    fireEvent.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    const action = screen.getByRole("option", { name: "Новый клиент" });
    expect(listbox).not.toContainElement(action);
    const group = action.closest('[role="group"]');
    expect(group).not.toBeNull();
    expect(listbox).toHaveAttribute("aria-owns", group?.id);
  });

  it("is never filtered: shows with the empty state and takes the highlight", () => {
    const onCreate = vi.fn();
    render(<ClientSelect onCreate={onCreate} />);
    fireEvent.click(screen.getByRole("combobox"));
    const search = screen.getByRole("textbox", { name: "Найти клиента" });
    fireEvent.change(search, { target: { value: "zzz" } });

    expect(screen.queryByRole("option", { name: "Ромашка" })).not.toBeInTheDocument();
    expect(screen.getByText("Ничего не найдено").closest('[role="status"]')).toHaveTextContent(
      /^Ничего не найдено$/,
    );
    const action = screen.getByRole("option", { name: "Новый клиент" });
    expect(action).toHaveAttribute("data-highlighted", "true");

    fireEvent.keyDown(search, { key: "Enter" });
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("the arrows reach it after the last option; Enter runs it and closes the list", () => {
    const onCreate = vi.fn();
    render(<ClientSelect onCreate={onCreate} />);
    fireEvent.click(screen.getByRole("combobox"));
    const search = screen.getByRole("textbox", { name: "Найти клиента" });
    fireEvent.keyDown(search, { key: "ArrowDown" });
    fireEvent.keyDown(search, { key: "ArrowDown" });
    fireEvent.keyDown(search, { key: "ArrowDown" });
    const action = screen.getByRole("option", { name: "Новый клиент" });
    expect(action).toHaveAttribute("data-highlighted", "true");
    expect(search).toHaveAttribute("aria-activedescendant", action.id);

    fireEvent.keyDown(search, { key: "Enter" });
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Клиент");
  });

  it("a click runs onSelect and closes without changing the value", () => {
    const onCreate = vi.fn();
    render(<ClientSelect onCreate={onCreate} />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Новый клиент" }));
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Клиент");
  });
});

const SEGMENT_ICONS = [
  { value: "star", label: "Звезда" },
  { value: "bolt", label: "Молния" },
];

function BadgeField() {
  return (
    <Input.Root label="Текст плашки">
      <Input.Wrapper>
        <Select.Root aria-label="Иконка плашки" defaultValue="star">
          <Select.Trigger>
            <Select.TriggerIcon>★</Select.TriggerIcon>
          </Select.Trigger>
          <Select.Content>
            {SEGMENT_ICONS.map((icon) => (
              <Select.Item key={icon.value} value={icon.value}>
                {icon.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Input.Field defaultValue="Хит сезона" />
      </Input.Wrapper>
    </Input.Root>
  );
}

describe("Select inside Input.Wrapper", () => {
  it("a Select inside Input.Wrapper is the box's start segment with no frame of its own", () => {
    render(<BadgeField />);
    const trigger = screen.getByRole("combobox", { name: "Иконка плашки: Звезда" });
    expect(trigger).toHaveAttribute("data-segment", "true");
    const segment = trigger.closest("[data-field-segment]");
    expect(segment?.parentElement).toBe(
      screen.getByRole("textbox", { name: "Текст плашки" }).parentElement,
    );
    // The field's label names the input only; the segment brings no label of its own.
    expect(screen.getAllByText("Текст плашки")).toHaveLength(1);
  });

  it("the segment opens its list from the keyboard and names the new value", () => {
    render(<BadgeField />);
    const trigger = screen.getByRole("combobox", { name: "Иконка плашки: Звезда" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("option", { name: "Молния" }));
    expect(screen.getByRole("combobox", { name: "Иконка плашки: Молния" })).toBeInTheDocument();
  });
});
