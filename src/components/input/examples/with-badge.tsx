/** A soft status badge inside the field (`Input.Badge`, `Select.Badge`, `Datepicker.Badge`). Use it to mark a field value as verified, new or missing without changing the field height. */
import { Datepicker, Input, Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function InputWithBadgeExample() {
  const [serviceDate, setServiceDate] = React.useState<Date | null>(null);
  return (
    <div className={styles.stack}>
      <Datepicker.Root
        mode="single"
        label="Дата последнего ТО"
        placeholder="дд.мм.гггг"
        fullWidth
        value={serviceDate}
        onValueChange={setServiceDate}
      >
        {serviceDate ? null : <Datepicker.Badge color="orange">Не заполнено</Datepicker.Badge>}
      </Datepicker.Root>
      <Input.Root label="ИНН контрагента">
        <Input.Wrapper>
          <Input.Field defaultValue="7707083893" inputMode="numeric" />
          <Input.Badge color="green">Проверен</Input.Badge>
        </Input.Wrapper>
      </Input.Root>
      <Select.Root label="Тариф" defaultValue="business">
        <Select.Trigger>
          <Select.Value />
          <Select.Badge color="blue">Новое</Select.Badge>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="start">Старт</Select.Item>
          <Select.Item value="business">Бизнес с расширенной поддержкой</Select.Item>
          <Select.Item value="corporate">Корпоративный</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
