/** Checkboxes with no visible text, named via aria-label and submitted with name/value. Use it in table rows where the row itself explains the choice. */
import { Checkbox } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CheckboxWithoutLabelExample() {
  return (
    <div className={styles.row}>
      <Checkbox.Root aria-label="Выбрать заказ №1042" name="orders" value="1042">
        <Checkbox.Label />
      </Checkbox.Root>
      <Checkbox.Root aria-label="Выбрать заказ №1043" name="orders" value="1043" defaultChecked>
        <Checkbox.Label />
      </Checkbox.Root>
    </div>
  );
}
