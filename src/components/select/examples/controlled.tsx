/** The parent owns the value: the plan drives the price under the field and a button resets it — `value`, `onValueChange`. */
import { Button, Select, Typography } from "prime-ui-kit";
import * as React from "react";

const PRICES: Record<string, string> = {
  free: "0 ₽ в месяц",
  pro: "990 ₽ в месяц",
  team: "4 900 ₽ в месяц",
};

export default function SelectControlledExample() {
  const [plan, setPlan] = React.useState("pro");

  return (
    <>
      <Select.Root label="Тариф" value={plan} onValueChange={setPlan} placeholder="Выберите тариф">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="free">Бесплатный</Select.Item>
          <Select.Item value="pro">Профессиональный</Select.Item>
          <Select.Item value="team">Командный</Select.Item>
        </Select.Content>
      </Select.Root>
      <Typography.Root as="p" variant="body-s" tone="secondary">
        {PRICES[plan] ?? "Тариф не выбран"}
      </Typography.Root>
      <Button.Root variant="soft" tone="neutral" onClick={() => setPlan("free")}>
        Вернуть бесплатный
      </Button.Root>
    </>
  );
}
