/** An amount and its currency as one field: a Select after the field is the box's end segment — `Input.Wrapper`, `Select.Root`, `Input.Field`, `aria-label`. */
import { Input, Select } from "prime-ui-kit";
import * as React from "react";

const CURRENCIES = [
  { value: "RUB", symbol: "₽", name: "Рубль" },
  { value: "USD", symbol: "$", name: "Доллар" },
  { value: "EUR", symbol: "€", name: "Евро" },
  { value: "THB", symbol: "฿", name: "Бат" },
];

export default function InputAmountCurrencyExample() {
  const [amount, setAmount] = React.useState("300");
  const [currency, setCurrency] = React.useState("USD");

  return (
    <Input.Root label="Залог" hint="Сумма в валюте договора">
      <Input.Wrapper>
        <Input.Field inputMode="decimal" value={amount} onValueChange={setAmount} />
        <Select.Root aria-label="Валюта" value={currency} onValueChange={setCurrency}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {CURRENCIES.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                <Select.ItemText>{option.symbol}</Select.ItemText>
                <Select.ItemDescription>{option.name}</Select.ItemDescription>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Input.Wrapper>
    </Input.Root>
  );
}
