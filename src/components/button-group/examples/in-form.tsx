/** Segments are native buttons: `type="submit"` and `type="reset"` work inside one group. Use for a compact submit/reset pair in a search or filter form. */
import { ButtonGroup, Input } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ButtonGroupInFormExample() {
  return (
    <form className={styles.column} onSubmit={(e) => e.preventDefault()}>
      <Input.Root label="Поиск по заказам">
        <Input.Wrapper>
          <Input.Field name="q" type="search" placeholder="Номер заказа или клиент" />
        </Input.Wrapper>
      </Input.Root>
      <ButtonGroup.Root aria-label="Отправить или сбросить поиск">
        <ButtonGroup.Item type="submit">Найти</ButtonGroup.Item>
        <ButtonGroup.Item type="reset">Сбросить</ButtonGroup.Item>
      </ButtonGroup.Root>
    </form>
  );
}
