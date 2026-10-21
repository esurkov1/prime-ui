/** The currency of a deposit: a coin with the sign before each option and in the trigger, while the amount elsewhere keeps its code — `Select.ItemIcon`, `Select.TriggerIcon`. */
import { Icon, type IconName, Select } from "prime-ui-kit";
import * as React from "react";

const CURRENCIES: { value: string; label: string; icon: IconName }[] = [
  { value: "usd", label: "Доллар, $", icon: "currency.dollar" },
  { value: "thb", label: "Бат, ฿", icon: "currency.baht" },
  { value: "eur", label: "Евро, €", icon: "currency.euro" },
  { value: "rub", label: "Рубль, ₽", icon: "currency.ruble" },
  { value: "usdt", label: "USDT", icon: "currency.usdt" },
  { value: "usdc", label: "USDC", icon: "currency.usdc" },
];

export default function SelectCurrencyExample() {
  const [currency, setCurrency] = React.useState("usdt");
  const selected = CURRENCIES.find((option) => option.value === currency) ?? CURRENCIES[0];

  return (
    <div>
      <Select.Root label="Валюта депозита" value={currency} onValueChange={setCurrency}>
        <Select.Trigger>
          <Select.TriggerIcon>
            <Icon name={selected.icon} />
          </Select.TriggerIcon>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {CURRENCIES.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              <Select.ItemIcon>
                <Icon name={option.icon} />
              </Select.ItemIcon>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}
