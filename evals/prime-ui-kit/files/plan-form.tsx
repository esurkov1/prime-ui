// A plan editor built without the UX rules: the input of the «change an existing screen» eval.
// Labels in every row, numbered labels, a record split over two lines, a hint that explains the
// layout, a base price apart from its changes, a deposit in three currencies with three labels.
import { Button, Fieldset, Input, Select, Typography } from "prime-ui-kit";
import { ColorField } from "prime-ui-kit/color-picker";
import * as React from "react";

import styles from "./plan-form.module.css";

type Spec = { id: string; icon: string; name: string; value: string; color: string };

export function PlanForm() {
  const [specs, setSpecs] = React.useState<Spec[]>([
    { id: "seats", icon: "users", name: "Сотрудники", value: "до 50", color: "#5068f5" },
    { id: "storage", icon: "storage", name: "Хранилище", value: "200 ГБ", color: "#22c55e" },
  ]);
  const [points, setPoints] = React.useState(["Вся команда в одном месте", "API и вебхуки"]);

  return (
    <form className={styles.form}>
      <Fieldset label="Характеристики">
        <Typography variant="body-s" tone="secondary">
          Сотрудники и хранилище всегда первыми. Остальные можно перетаскивать.
        </Typography>
        {specs.map((spec) => (
          <div key={spec.id} className={styles.grid}>
            <Select.Root label="Иконка" defaultValue={spec.icon}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="users">Сотрудники</Select.Item>
                <Select.Item value="storage">Хранилище</Select.Item>
              </Select.Content>
            </Select.Root>
            <Input.Root label="Параметр">
              <Input.Wrapper>
                <Input.Field defaultValue={spec.name} />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Значение">
              <Input.Wrapper>
                <Input.Field defaultValue={spec.value} />
              </Input.Wrapper>
            </Input.Root>
            <ColorField label="Цвет иконки" defaultValue={spec.color} />
          </div>
        ))}
        <Button.Root
          variant="soft"
          tone="neutral"
          onClick={() =>
            setSpecs((list) => [
              ...list,
              { id: String(list.length), icon: "users", name: "", value: "", color: "#5068f5" },
            ])
          }
        >
          Добавить характеристику
        </Button.Root>
      </Fieldset>

      <Fieldset label="Преимущества">
        {points.map((point, index) => (
          <Input.Root key={point} label={`Преимущество ${index + 1}`}>
            <Input.Wrapper>
              <Input.Field defaultValue={point} />
            </Input.Wrapper>
          </Input.Root>
        ))}
        <Button.Root variant="soft" tone="neutral" onClick={() => setPoints((list) => [...list, ""])}>
          Добавить преимущество
        </Button.Root>
      </Fieldset>

      <Fieldset label="Цены">
        <Input.Root label="Базовая цена, ₽ / месяц">
          <Input.Wrapper>
            <Input.Field defaultValue="4900" />
            <Input.InlineAffix side="end">₽ / месяц</Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>
        <div className={styles.grid}>
          <Input.Root label="Действует с">
            <Input.Wrapper>
              <Input.Field defaultValue="С 1 октября" />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root label="Цена, ₽ / месяц">
            <Input.Wrapper>
              <Input.Field defaultValue="5400" />
              <Input.InlineAffix side="end">₽ / месяц</Input.InlineAffix>
            </Input.Wrapper>
          </Input.Root>
        </div>
        <Input.Root label="Подключение, ₽" optional>
          <Input.Wrapper>
            <Input.Field defaultValue="15000" />
            <Input.InlineAffix side="end">₽</Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>
        <Input.Root label="Подключение, $" optional>
          <Input.Wrapper>
            <Input.Field defaultValue="170" />
            <Input.InlineAffix side="end">$</Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>
        <Input.Root label="Подключение, €" optional>
          <Input.Wrapper>
            <Input.Field />
            <Input.InlineAffix side="end">€</Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>
      </Fieldset>

      <Button.Root type="submit">ОК</Button.Root>
    </form>
  );
}
