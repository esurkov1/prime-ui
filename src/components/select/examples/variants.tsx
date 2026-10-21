/** The field trigger and the status chip side by side — `variant`. */
import { Select, Typography } from "prime-ui-kit";

const STEPS = [
  { value: "pending", label: "Не взят", color: "gray" },
  { value: "held", label: "Принят", color: "green" },
  { value: "returned", label: "Возвращён", color: "blue" },
] as const;

const VARIANTS = ["field", "status"] as const;

export default function SelectVariantsExample() {
  return (
    <div>
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <Select.Root variant={variant} label="Шаг депозита" defaultValue="held">
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
          <Typography as="span" variant="caption" tone="muted">
            {variant}
          </Typography>
        </div>
      ))}
    </div>
  );
}
