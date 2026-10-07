/** The parent owns the value: the plan drives the price under the field — `value`, `onValueChange`. */
import { NativeSelect, Typography } from "prime-ui-kit";
import * as React from "react";

const PRICES: Record<string, string> = {
  free: "0 ₽ в месяц",
  pro: "990 ₽ в месяц",
  team: "4 900 ₽ в месяц",
};

export default function NativeSelectControlledExample() {
  const [plan, setPlan] = React.useState("pro");

  return (
    <>
      <NativeSelect label="Тариф" value={plan} onValueChange={setPlan}>
        <option value="free">Бесплатный</option>
        <option value="pro">Профессиональный</option>
        <option value="team">Командный</option>
      </NativeSelect>
      <Typography.Root as="p" variant="body-s" tone="secondary">
        {PRICES[plan]}
      </Typography.Root>
    </>
  );
}
