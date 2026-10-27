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

  it("disabled disables every kit control inside, each in its own state", () => {
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
    // Segments stay reachable in their roving group: `aria-disabled`, never native.
    for (const radio of screen.getAllByRole("radio", { name: /Компании|Личный/ })) {
      expect(radio).toHaveAttribute("aria-disabled", "true");
      expect(radio).toHaveAttribute("data-disabled", "true");
    }
    // The group says it is disabled; the controls disable themselves (the form skips them).
    expect(screen.getByRole("group", { name: "Реквизиты" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("group", { name: "Реквизиты" })).not.toHaveAttribute("disabled");
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
    expect(screen.getByRole("group", { name: "Контакты" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("switch", { name: "Рассылка" })).toBeDisabled();
  });

  it("dims the label and the hint of every field kind inside a disabled group", () => {
    render(
      <Fieldset label="Реквизиты" disabled>
        <Input.Root label="Название" hint="Как в уставе">
          <Input.Wrapper>
            <Input.Field />
          </Input.Wrapper>
        </Input.Root>
        <Textarea.Root label="Комментарий" hint="Видят все участники" />
        <NativeSelect label="Город" hint="Город доставки">
          <option value="msk">Москва</option>
        </NativeSelect>
        <Select.Root label="Менеджер" hint="Ответственный за сделку">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="anna">Анна</Select.Item>
          </Select.Content>
        </Select.Root>
        <Datepicker.Root mode="single" label="Дата" hint="Дата отгрузки" />
        <TagSelect label="Теги" hint="До пяти тегов" options={[{ value: "vip", label: "VIP" }]} />
        <Checkbox.Root hint="Письмо уйдёт сразу">
          <Checkbox.Label>Пригласить</Checkbox.Label>
        </Checkbox.Root>
        <Radio.Group label="Тип" hint="Влияет на реквизиты">
          <Radio.Root value="company">
            <Radio.Label>Компания</Radio.Label>
          </Radio.Root>
        </Radio.Group>
        <Slider label="Скидка" hint="Не больше 30%" defaultValue={10} />
        <SegmentedControl.Root label="Чей расход" hint="Для отчёта" defaultValue="company">
          <SegmentedControl.Item value="company">Компании</SegmentedControl.Item>
          <SegmentedControl.Item value="personal">Личный</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Fieldset>,
    );
    for (const label of ["Название", "Комментарий", "Город", "Менеджер", "Дата", "Теги"]) {
      expect(screen.getByText(label).closest("label"), label).toHaveAttribute(
        "data-disabled",
        "true",
      );
    }
    for (const label of ["Тип", "Скидка", "Чей расход"]) {
      expect(screen.getByText(label), label).toHaveAttribute("data-disabled", "true");
    }
    for (const hint of [
      "Как в уставе",
      "Видят все участники",
      "Город доставки",
      "Ответственный за сделку",
      "Дата отгрузки",
      "До пяти тегов",
      "Письмо уйдёт сразу",
      "Влияет на реквизиты",
      "Не больше 30%",
      "Для отчёта",
    ]) {
      expect(screen.getByText(hint), hint).toHaveAttribute("data-disabled", "true");
    }
  });

  it("Tab moves through the group's fields and skips a disabled group", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <Fieldset label="Реквизиты">
          <Input.Root label="ИНН">
            <Input.Wrapper>
              <Input.Field />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root label="КПП">
            <Input.Wrapper>
              <Input.Field />
            </Input.Wrapper>
          </Input.Root>
        </Fieldset>
        <Button.Root>Сохранить</Button.Root>
      </>,
    );
    await user.tab();
    expect(screen.getByLabelText("ИНН")).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText("КПП")).toHaveFocus();
    rerender(
      <>
        <Fieldset label="Реквизиты" disabled>
          <Input.Root label="ИНН">
            <Input.Wrapper>
              <Input.Field />
            </Input.Wrapper>
          </Input.Root>
        </Fieldset>
        <Button.Root>Сохранить</Button.Root>
      </>,
    );
    screen.getByRole("button", { name: "Сохранить" }).blur();
    await user.tab();
    expect(screen.getByRole("button", { name: "Сохранить" })).toHaveFocus();
  });

  it("without a label it is the plain field column: no legend, the fields at the form rhythm", () => {
    render(
      <Fieldset>
        <Input.Root label="Почта">
          <Input.Wrapper>
            <Input.Field />
          </Input.Wrapper>
        </Input.Root>
      </Fieldset>,
    );
    const group = screen.getByRole("group");
    expect(group.querySelector("legend")).toBeNull();
    expect(group).toContainElement(screen.getByLabelText("Почта"));
  });
  it("layout sets how the fields stand: a stack by default, pair on request, every child one cell", () => {
    const { rerender } = render(
      <Fieldset label="Реквизиты">
        <span>ИНН</span>
      </Fieldset>,
    );
    expect(screen.getByRole("group", { name: "Реквизиты" })).toHaveAttribute(
      "data-layout",
      "stack",
    );
    rerender(
      <Fieldset label="Реквизиты" layout="pair">
        <span>ИНН</span>
        <span>КПП</span>
        <span>БИК</span>
      </Fieldset>,
    );
    const group = screen.getByRole("group", { name: "Реквизиты" });
    expect(group).toHaveAttribute("data-layout", "pair");
    const cells = screen.getByText("ИНН").parentElement;
    expect(cells?.children).toHaveLength(3);
    expect(screen.getByText("БИК").parentElement).toBe(cells);
  });
});
