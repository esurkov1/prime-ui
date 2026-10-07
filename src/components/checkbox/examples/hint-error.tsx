/** A description under the label and a validation error that marks the field invalid. Use it for consents and options that need an explanation. */
import { Checkbox } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CheckboxHintErrorExample() {
  return (
    <div className={styles.column}>
      <Checkbox.Root name="marketing">
        <Checkbox.Label>Получать новости продукта</Checkbox.Label>
        <Checkbox.Hint>
          Не чаще одного письма в неделю, отписаться можно в любой момент.
        </Checkbox.Hint>
      </Checkbox.Root>
      <Checkbox.Root name="terms" required>
        <Checkbox.Label>Принимаю условия оферты</Checkbox.Label>
        <Checkbox.Hint>Без этого мы не сможем оформить заказ.</Checkbox.Hint>
        <Checkbox.Error>Отметьте пункт, чтобы продолжить.</Checkbox.Error>
      </Checkbox.Root>
    </div>
  );
}
