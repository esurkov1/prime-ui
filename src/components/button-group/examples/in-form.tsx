/** Segments are native buttons, so submit and reset work in one group — `type`. */
import { ButtonGroup, Input } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ButtonGroupInFormExample() {
  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <Input.Root label="Поиск по заказам">
        <Input.Wrapper>
          <Input.Field name="query" type="search" placeholder="Номер заказа или клиент" />
        </Input.Wrapper>
      </Input.Root>
      <ButtonGroup.Root aria-label="Отправить или сбросить поиск">
        <ButtonGroup.Item type="submit">Найти</ButtonGroup.Item>
        <ButtonGroup.Item type="reset">Сбросить</ButtonGroup.Item>
      </ButtonGroup.Root>
    </form>
  );
}
