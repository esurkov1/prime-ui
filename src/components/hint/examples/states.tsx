/** Default help text, `invalid` error, `disabled` hint and a hint with `Hint.Icon`. Use it to pick the right message style under a field. */
import { Hint, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function HintStatesExample() {
  return (
    <div className={styles.list}>
      <Hint.Root>Формат: +7 900 000-00-00</Hint.Root>
      <Hint.Root invalid>Введите 10 или 12 цифр ИНН.</Hint.Root>
      <Hint.Root disabled>Лимит задаётся тарифом и не редактируется.</Hint.Root>
      <Hint.Root>
        <Hint.Icon>
          <Icon name="field.email" />
        </Hint.Icon>
        На этот адрес придёт код подтверждения.
      </Hint.Root>
    </div>
  );
}
