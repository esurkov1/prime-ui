import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button/Button";
import { ButtonGroup } from "../button-group/ButtonGroup";
import { Checkbox } from "../checkbox/Checkbox";
import { Datepicker } from "../datepicker/Datepicker";
import { Input } from "../input/Input";
import { NativeSelect } from "../native-select/NativeSelect";
import { Radio } from "../radio/Radio";
import { SegmentedControl } from "../segmented-control/SegmentedControl";
import { Select } from "../select/Select";
import { Slider } from "../slider/Slider";
import { Switch } from "../switch/Switch";
import { TagSelect } from "../tag-select/TagSelect";
import { Textarea } from "../textarea/Textarea";
import { Fieldset } from "./Fieldset";

describe("Fieldset", () => {
  it("is a group named by its legend and described by its description", () => {
    render(
      <Fieldset label="Реквизиты" description="Попадут в счёт и акт">
        <Input.Root label="ИНН">
          <Input.Wrapper>
            <Input.Field />
          </Input.Wrapper>
        </Input.Root>
      </Fieldset>,
    );
    const group = screen.getByRole("group", { name: "Реквизиты" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group).toHaveAccessibleDescription("Попадут в счёт и акт");
    expect(group.querySelector("legend")).toHaveTextContent("Реквизиты");
  });

  it("sends ref, className and native attributes to the fieldset", () => {
    const ref = React.createRef<HTMLFieldSetElement>();
    render(
      <Fieldset ref={ref} className="section" name="company" aria-label="Компания">
        <span />
      </Fieldset>,
    );
    const group = screen.getByRole("group", { name: "Компания" });
    expect(ref.current).toBe(group);
    expect(group).toHaveClass("section");
    expect(group).toHaveAttribute("name", "company");
    expect(group).not.toHaveAttribute("aria-describedby");
  });

  it("disabled disables every kit control inside, natively and in its own state", () => {
    render(
      <Fieldset label="Реквизиты" disabled>
        <Input.Root label="Название">
          <Input.Wrapper>
            <Input.Field />
          </Input.Wrapper>
        </Input.Root>
        <Textarea.Root label="Комментарий" />
        <NativeSelect label="Город">
          <option value="msk">Москва</option>
        </NativeSelect>
        <Select.Root label="Менеджер">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="anna">Анна</Select.Item>
          </Select.Content>
        </Select.Root>
        <Datepicker.Root mode="single" label="Дата" />
        <TagSelect label="Теги" options={[{ value: "vip", label: "VIP" }]} />
        <Checkbox.Root>
          <Checkbox.Label>Пригласить</Checkbox.Label>
        </Checkbox.Root>
        <Switch.Root>
          <Switch.Label>Уведомления</Switch.Label>
        </Switch.Root>
        <Radio.Group label="Тип">
          <Radio.Root value="company">
            <Radio.Label>Компания</Radio.Label>
          </Radio.Root>
        </Radio.Group>
        <Slider label="Скидка" defaultValue={10} />
        <SegmentedControl.Root label="Чей расход" defaultValue="company">
          <SegmentedControl.Item value="company">Компании</SegmentedControl.Item>
          <SegmentedControl.Item value="personal">Личный</SegmentedControl.Item>
        </SegmentedControl.Root>
        <ButtonGroup.Root aria-label="Приоритет">
          <ButtonGroup.Item>Высокий</ButtonGroup.Item>
        </ButtonGroup.Root>
        <Button.Root type="submit">Сохранить</Button.Root>
      </Fieldset>,
    );
    expect(screen.getByLabelText("Название")).toBeDisabled();
    expect(screen.getByLabelText("Комментарий")).toBeDisabled();
    expect(screen.getByLabelText("Город")).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "Пригласить" })).toBeDisabled();
    expect(screen.getByRole("switch", { name: "Уведомления" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Компания" })).toBeDisabled();
    expect(screen.getByRole("slider", { name: "Скидка" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Высокий" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Сохранить" })).toBeDisabled();
    for (const radio of screen.getAllByRole("radio", { name: /Компании|Личный/ })) {
      expect(radio).toBeDisabled();
      expect(radio).toHaveAttribute("data-disabled", "true");
    }
    expect(screen.getByRole("radiogroup", { name: "Чей расход" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    // The kit's own disabled state (look, ARIA), not only the native one.
    expect(document.querySelectorAll('[data-disabled="true"]').length).toBeGreaterThan(8);
    expect(screen.getByText("Пригласить").closest('[data-disabled="true"]')).not.toBeNull();
    expect(screen.getByText("Уведомления").closest('[data-disabled="true"]')).not.toBeNull();
  });

  it("a disabled group ignores presses; enabling it gives the controls back", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Fieldset label="Настройки" disabled>
        <Checkbox.Root onCheckedChange={onCheckedChange}>
          <Checkbox.Label>Пригласить</Checkbox.Label>
        </Checkbox.Root>
      </Fieldset>,
    );
    await user.click(screen.getByText("Пригласить"));
    expect(onCheckedChange).not.toHaveBeenCalled();

    rerender(
      <Fieldset label="Настройки">
        <Checkbox.Root onCheckedChange={onCheckedChange}>
          <Checkbox.Label>Пригласить</Checkbox.Label>
        </Checkbox.Root>
      </Fieldset>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Пригласить" });
    expect(checkbox).toBeEnabled();
    expect(checkbox.closest('[data-disabled="true"]')).toBeNull();
    await user.click(screen.getByText("Пригласить"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("a disabled outer group disables a nested one", () => {
    render(
      <Fieldset label="Клиент" disabled>
        <Fieldset label="Контакты">
          <Switch.Root>
            <Switch.Label>Рассылка</Switch.Label>
          </Switch.Root>
        </Fieldset>
      </Fieldset>,
    );
    expect(screen.getByRole("group", { name: "Контакты" })).toBeDisabled();
    expect(screen.getByRole("switch", { name: "Рассылка" })).toBeDisabled();
  });
});
