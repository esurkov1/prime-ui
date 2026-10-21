/** The step of a deposit picked in its row: the options in their status hues, the trigger a chip in the picked one, and a save that keeps the new hue or rolls it back — `variant`, `color`. */
import { Select } from "prime-ui-kit";
import * as React from "react";

const STEPS = [
  { value: "pending", label: "Не взят", color: "gray" },
  { value: "held", label: "Принят", color: "green" },
  { value: "returned", label: "Возвращён", color: "blue" },
] as const;

const save = () => new Promise<void>((resolve) => setTimeout(resolve, 600));

export default function SelectStatusExample() {
  const [step, setStep] = React.useState<string>("held");

  return (
    <Select.Root
      variant="status"
      aria-label="Шаг депозита"
      value={step}
      onValueChange={async (next) => {
        await save();
        setStep(next);
      }}
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {STEPS.map((option) => (
          <Select.Item key={option.value} value={option.value} color={option.color}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
