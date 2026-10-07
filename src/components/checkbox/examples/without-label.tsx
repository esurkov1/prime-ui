/** Bare boxes in table rows, named by `aria-label` and submitted with `name` and `value`. */
import { Checkbox } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CheckboxWithoutLabelExample() {
  return (
    <div className={styles.row}>
      <Checkbox.Root aria-label="Выбрать заказ №1042" name="orders" value="1042" />
      <Checkbox.Root aria-label="Выбрать заказ №1043" name="orders" value="1043" defaultChecked />
    </div>
  );
}
