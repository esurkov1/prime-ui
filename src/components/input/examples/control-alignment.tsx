/** Button, Input, Select and Datepicker of the same size share height and radius. Use it for filter bars and toolbars that mix controls in one row. */
import { Button, Datepicker, Icon, Input, Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

function FilterRow({ size }: { size: (typeof SIZES)[number] }) {
  const [date, setDate] = React.useState<Date | null>(null);
  return (
    <div className={styles.alignRow}>
      <Typography.Root as="span" variant="code" tone="muted" className={styles.alignSize}>
        {size}
      </Typography.Root>
      <div className={styles.alignField}>
        <Input.Root size={size}>
          <Input.Wrapper>
            <Input.Icon side="start">
              <Icon name="action.search" tone="secondary" />
            </Input.Icon>
            <Input.Field placeholder="Поиск заказа" aria-label="Поиск заказа" />
          </Input.Wrapper>
        </Input.Root>
      </div>
      <Select.Root size={size} placeholder="Статус">
        <Select.Trigger aria-label="Статус">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="new">Новый</Select.Item>
          <Select.Item value="paid">Оплачен</Select.Item>
          <Select.Item value="shipped">Отправлен</Select.Item>
        </Select.Content>
      </Select.Root>
      <Datepicker.Root
        size={size}
        mode="single"
        value={date}
        onValueChange={setDate}
        placeholder="Дата"
        aria-label="Дата заказа"
      />
      <Button.Root size={size}>Найти</Button.Root>
    </div>
  );
}

export default function InputControlAlignmentExample() {
  return (
    <div className={styles.alignStack}>
      {SIZES.map((size) => (
        <FilterRow key={size} size={size} />
      ))}
    </div>
  );
}
