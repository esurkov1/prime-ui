/**
 * The field conformance suite: what every field must do the same way, checked on all of them.
 * - A disabled field never opens its panel, even with `defaultOpen`.
 * - A disabled `Fieldset` disables every control inside (`src/internal/disabledContext`).
 * - In a FieldList cell the field is named by its column heading, and a required column makes it
 *   required for assistive tech.
 *
 * In ratchet mode (`field-conformance`): the fields that failed when the suite landed are the
 * baseline.
 */
import { cleanup, render, screen } from "@testing-library/react";
import type * as React from "react";

import {
  Button,
  ButtonGroup,
  Checkbox,
  ColorPresets,
  ColorSwatches,
  Datepicker,
  DigitInput,
  FieldList,
  Fieldset,
  Input,
  NativeSelect,
  Radio,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  TagSelect,
  Textarea,
} from "@/components";

import { ratchet } from "./ratchet";

const OPTIONS = [
  { value: "new", label: "Новый" },
  { value: "paid", label: "Оплачен" },
];

const SELECT = (props: { disabled?: boolean; defaultOpen?: boolean }) => (
  <Select.Root label="Статус" {...props}>
    <Select.Trigger />
    <Select.Content>
      <Select.Item value="new">Новый</Select.Item>
      <Select.Item value="paid">Оплачен</Select.Item>
    </Select.Content>
  </Select.Root>
);

/** Fields with a floating panel: rendered disabled and `defaultOpen`. */
const PANEL_FIELDS: Record<string, { ui: React.ReactElement; panel: string }> = {
  Select: { ui: <SELECT disabled defaultOpen />, panel: "listbox" },
  TagSelect: {
    ui: <TagSelect label="Метки" options={OPTIONS} disabled defaultOpen />,
    panel: "listbox",
  },
  Datepicker: {
    ui: <Datepicker.Root mode="single" label="Дата отгрузки" disabled defaultOpen />,
    panel: "dialog",
  },
  ColorPresets: {
    ui: (
      <ColorPresets.Root disabled defaultOpen>
        <ColorPresets.Trigger>
          <ColorPresets.SwatchButton />
        </ColorPresets.Trigger>
        <ColorPresets.Content />
      </ColorPresets.Root>
    ),
    panel: "listbox",
  },
};

/** Every control with a `disabled` prop, inside a disabled Fieldset, and how to find it. */
const CONTROLS: Record<string, { ui: React.ReactElement; find: () => HTMLElement[] }> = {
  Input: {
    ui: (
      <Input.Root label="Название">
        <Input.Wrapper>
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>
    ),
    find: () => [screen.getByRole("textbox", { name: "Название" })],
  },
  Textarea: {
    ui: <Textarea.Root label="Комментарий" />,
    find: () => [screen.getByRole("textbox", { name: "Комментарий" })],
  },
  Select: { ui: <SELECT />, find: () => [screen.getByRole("combobox", { name: "Статус" })] },
  NativeSelect: {
    ui: (
      <NativeSelect label="Статус">
        <option value="new">Новый</option>
      </NativeSelect>
    ),
    find: () => [screen.getByRole("combobox", { name: "Статус" })],
  },
  TagSelect: {
    ui: <TagSelect label="Метки" options={OPTIONS} />,
    find: () => [screen.getByRole("combobox", { name: "Метки" })],
  },
  Datepicker: {
    ui: <Datepicker.Root mode="single" label="Дата отгрузки" />,
    find: () => screen.getAllByRole("button").filter((el) => !el.closest("[role=dialog]")),
  },
  DigitInput: {
    ui: <DigitInput label="Код" length={4} />,
    find: () => screen.getAllByRole("textbox"),
  },
  Checkbox: {
    ui: (
      <Checkbox.Root>
        <Checkbox.Label>Согласен</Checkbox.Label>
      </Checkbox.Root>
    ),
    find: () => [screen.getByRole("checkbox")],
  },
  Radio: {
    ui: (
      <Radio.Group label="Доставка" defaultValue="courier">
        <Radio.Root value="courier">
          <Radio.Label>Курьер</Radio.Label>
        </Radio.Root>
      </Radio.Group>
    ),
    find: () => screen.getAllByRole("radio"),
  },
  Switch: {
    ui: (
      <Switch.Root>
        <Switch.Label>Уведомления</Switch.Label>
      </Switch.Root>
    ),
    find: () => [screen.getByRole("switch")],
  },
  Slider: { ui: <Slider label="Скидка" />, find: () => [screen.getByRole("slider")] },
  SegmentedControl: {
    ui: (
      <SegmentedControl.Root label="Период" defaultValue="week">
        <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
      </SegmentedControl.Root>
    ),
    find: () => screen.getAllByRole("radio"),
  },
  ButtonGroup: {
    ui: (
      <ButtonGroup.Root label="Вид">
        <ButtonGroup.Item value="list">Список</ButtonGroup.Item>
        <ButtonGroup.Item value="board">Доска</ButtonGroup.Item>
      </ButtonGroup.Root>
    ),
    find: () => screen.getAllByRole("button"),
  },
  ColorSwatches: {
    ui: (
      <ColorSwatches
        label="Цвет"
        presets={[
          { value: "#2563eb", label: "Синий" },
          { value: "#16a34a", label: "Зелёный" },
        ]}
      />
    ),
    find: () => screen.getAllByRole("radio"),
  },
  ColorPresets: {
    ui: (
      <ColorPresets.Root>
        <ColorPresets.Trigger>
          <ColorPresets.SwatchButton />
        </ColorPresets.Trigger>
      </ColorPresets.Root>
    ),
    find: () => [screen.getByRole("button")],
  },
  Button: { ui: <Button.Root>Сохранить</Button.Root>, find: () => [screen.getByRole("button")] },
};

const isDisabled = (element: HTMLElement) =>
  element.matches(":disabled") || element.getAttribute("aria-disabled") === "true";

/** Fields in a FieldList cell: how to find the field the column names. */
const CELL_FIELDS: Record<string, { ui: React.ReactElement; find: (name: string) => HTMLElement }> =
  {
    Input: {
      ui: (
        <Input.Root>
          <Input.Wrapper>
            <Input.Field />
          </Input.Wrapper>
        </Input.Root>
      ),
      find: (name) => screen.getByRole("textbox", { name }),
    },
    Textarea: { ui: <Textarea.Root />, find: (name) => screen.getByRole("textbox", { name }) },
    Select: {
      ui: (
        <Select.Root>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="new">Новый</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
      find: (name) => screen.getByRole("combobox", { name }),
    },
    NativeSelect: {
      ui: (
        <NativeSelect>
          <option value="new">Новый</option>
        </NativeSelect>
      ),
      find: (name) => screen.getByRole("combobox", { name }),
    },
    Datepicker: {
      ui: <Datepicker.Root mode="single" />,
      find: (name) => screen.getByRole("button", { name: new RegExp(name) }),
    },
  };

describe("field conformance", () => {
  it("a disabled field never opens its panel, even with defaultOpen", () => {
    const offenders: string[] = [];
    for (const [name, { ui, panel }] of Object.entries(PANEL_FIELDS)) {
      render(ui);
      if (screen.queryByRole(panel))
        offenders.push(`disabled-open/${name}: disabled + defaultOpen opens`);
      cleanup();
    }
    ratchet("field-conformance", offenders, "disabled-open/");
  });

  it("a disabled Fieldset disables every control inside", () => {
    const offenders: string[] = [];
    for (const [name, { ui, find }] of Object.entries(CONTROLS)) {
      render(
        <Fieldset title="Доставка" disabled>
          {ui}
        </Fieldset>,
      );
      const controls = find();
      if (controls.length === 0 || controls.some((control) => !isDisabled(control))) {
        offenders.push(`fieldset/${name}: stays enabled in a disabled Fieldset`);
      }
      cleanup();
    }
    ratchet("field-conformance", offenders, "fieldset/");
  });

  it("a FieldList cell names its field by the column and marks a required column", () => {
    const offenders: string[] = [];
    for (const [name, { ui, find }] of Object.entries(CELL_FIELDS)) {
      render(
        <FieldList
          label="Позиции"
          columns={[{ label: "Значение", required: true }]}
          defaultValue={[{ id: "a" }]}
          getId={(item: { id: string }) => item.id}
          renderItem={() => ui}
        />,
      );
      const field = (() => {
        try {
          return find("Значение");
        } catch {
          return null;
        }
      })();
      if (!field) offenders.push(`cell/${name}: not named by the column heading`);
      else if (field.getAttribute("aria-required") !== "true" && !field.hasAttribute("required")) {
        offenders.push(`cell/${name}: a required column leaves it optional`);
      }
      cleanup();
    }
    ratchet("field-conformance", offenders, "cell/");
  });
});
