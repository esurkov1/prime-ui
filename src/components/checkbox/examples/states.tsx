/** Unchecked, checked, indeterminate, invalid and disabled checkboxes. Use it as a reference for every visual state. */
import { Checkbox } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CheckboxStatesExample() {
  return (
    <div className={styles.stack}>
      <Checkbox.Root>
        <Checkbox.Label>Не отмечен</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root defaultChecked>
        <Checkbox.Label>Отмечен</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root indeterminate>
        <Checkbox.Label>Частично (indeterminate)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root invalid>
        <Checkbox.Label>Ошибка</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root disabled>
        <Checkbox.Label>Недоступен</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root disabled defaultChecked>
        <Checkbox.Label>Недоступен, отмечен</Checkbox.Label>
      </Checkbox.Root>
    </div>
  );
}
