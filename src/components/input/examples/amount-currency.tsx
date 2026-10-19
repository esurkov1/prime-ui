/** An amount and its currency as one field: a Select after the field is the box's end segment, its trigger the symbol, its rows the symbol as the icon and the name — `Input.Wrapper`, `Select.Root`, `renderValue`, `Select.ItemIcon`, `aria-label`. */
import { Input, Select } from "prime-ui-kit";
import * as React from "react";

const CURRENCIES = [
  { value: "RUB", symbol: "₽", name: "Рубль" },
  { value: "USD", symbol: "$", name: "Доллар" },
  { value: "EUR", symbol: "€", name: "Евро" },
  { value: "THB", symbol: "฿", name: "Бат" },
];

const symbolOf = (value: string) =>
  CURRENCIES.find((currency) => currency.value === value)?.symbol ?? value;

export default function InputAmountCurrencyExample() {
  const [amount, setAmount] = React.useState("300");
  const [currency, setCurrency] = React.useState("USD");

  return (
    <Input.Root label="Залог" hint="Сумма в валюте договора">
      <Input.Wrapper>
        <Input.Field inputMode="decimal" value={amount} onValueChange={setAmount} />
        <Select.Root aria-label="Валюта" value={currency} onValueChange={setCurrency}>
          <Select.Trigger>
            <Select.Value renderValue={({ value }) => symbolOf(value)} />
          </Select.Trigger>
          <Select.Content>
            {CURRENCIES.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                <Select.ItemIcon>{option.symbol}</Select.ItemIcon>
                {option.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Input.Wrapper>
    </Input.Root>
  );
}
