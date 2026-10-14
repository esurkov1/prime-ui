import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "@/components/checkbox/Checkbox";
import { Radio } from "@/components/radio/Radio";
import { Switch } from "@/components/switch/Switch";

import { ChoiceField, ChoiceLabel } from "./ChoiceField";
import { useFieldFrame } from "./FieldFrame";

function Row({ optional, error }: { optional?: boolean; error?: string }) {
  const ids = useFieldFrame("terms", { error });
  return (
    <ChoiceField
      ids={ids}
      size="m"
      state="unchecked"
      disabled={false}
      optional={optional}
      optionalLabel="необязательно"
      error={error}
      control={<input id={ids.controlId} type="checkbox" />}
    >
      <ChoiceLabel>Присылать счета на почту</ChoiceLabel>
    </ChoiceField>
  );
}

const shaking = (container: HTMLElement) => container.querySelectorAll("[data-shake]");

describe("ChoiceField", () => {
  it("draws the required mark after the text, hidden from the name", () => {
    render(
      <Checkbox.Root required>
        <Checkbox.Label>Принимаю условия договора</Checkbox.Label>
      </Checkbox.Root>,
    );
    const box = screen.getByRole("checkbox", { name: "Принимаю условия договора" });
    expect(box).toBeRequired();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("a required Switch draws the same mark", () => {
    render(
      <Switch.Root required>
        <Switch.Label>Согласие на обработку данных</Switch.Label>
      </Switch.Root>,
    );
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("draws the optional marker as part of the name", () => {
    render(<Row optional />);
    expect(
      screen.getByRole("checkbox", { name: "Присылать счета на почту необязательно" }),
    ).toBeInTheDocument();
  });

  it("shakes only the control cell when an error arrives", () => {
    const { container, rerender } = render(<Row />);
    expect(shaking(container)).toHaveLength(0);
    rerender(<Row error="Выберите вариант" />);
    const moving = shaking(container);
    expect(moving).toHaveLength(1);
    expect(moving[0]).toContainElement(screen.getByRole("checkbox"));
    expect(moving[0]).not.toContainElement(screen.getByText("Присылать счета на почту"));
  });

  it("in a Radio.Group only the group shakes and announces, never each option", () => {
    const group = (error?: string) => (
      <Radio.Group label="Тариф" error={error}>
        <Radio.Root value="base">
          <Radio.Label>Базовый</Radio.Label>
        </Radio.Root>
        <Radio.Root value="pro">
          <Radio.Label>Расширенный</Radio.Label>
        </Radio.Root>
      </Radio.Group>
    );
    const { container, rerender } = render(group());
    rerender(group("Выберите тариф"));
    const moving = shaking(container);
    expect(moving).toHaveLength(1);
    expect(moving[0]).toContainElement(screen.getByRole("radiogroup"));
    // One live region: the group's support slot.
    expect(container.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);
  });

  it("the support slot is a polite live region that stays while the row does", () => {
    const { rerender } = render(<Row />);
    const slot = screen.getByRole("checkbox").closest("label")?.nextElementSibling;
    expect(slot).toHaveAttribute("aria-live", "polite");
    rerender(<Row error="Подтвердите согласие" />);
    expect(screen.getByText("Подтвердите согласие").parentElement).toBe(slot);
  });

  it("a busy Switch marks its row, so the track takes no press", () => {
    render(
      <Switch.Root loading>
        <Switch.Label>Автопродление</Switch.Label>
      </Switch.Root>,
    );
    expect(screen.getByRole("switch").closest("label")).toHaveAttribute("data-loading", "true");
  });
});
