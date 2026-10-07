/** Empty, filled, disabled, read-only and invalid fields (with and without an error message). Use it to check every state a form field can be in. */
import { Icon, Input } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function InputStatesExample() {
  return (
    <div className={styles.statesGrid}>
      <Input.Root label="Пустое" hint="Плейсхолдер не заменяет подпись">
        <Input.Wrapper>
          <Input.Field placeholder="Например, Москва" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Заполненное">
        <Input.Wrapper>
          <Input.Field defaultValue="Санкт-Петербург" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Отключено" hint="Значение нельзя изменить">
        <Input.Wrapper>
          <Input.Field defaultValue="Екатеринбург" disabled />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Только чтение">
        <Input.Wrapper>
          <Input.Field defaultValue="ID 4821-0093" readOnly />
          <Input.Icon side="end">
            <Icon name="status.locked" tone="secondary" />
          </Input.Icon>
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Ошибка" required error="Укажите город доставки">
        <Input.Wrapper>
          <Input.Field placeholder="Город" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root invalid label="Ошибка без текста" hint="invalid — только кольцо">
        <Input.Wrapper>
          <Input.Field defaultValue="Казань" />
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
