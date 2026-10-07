/** Unselected, selected, invalid and disabled radios, each in its own group so the selected ones do not compete. Use it as a reference for every visual state. */
import { Radio } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function RadioStatesExample() {
  return (
    <div className={styles.stack}>
      <Radio.Group aria-label="Не выбран">
        <Radio.Root value="off">
          <Radio.Label>Не выбран</Radio.Label>
        </Radio.Root>
      </Radio.Group>
      <Radio.Group defaultValue="on" aria-label="Выбран">
        <Radio.Root value="on">
          <Radio.Label>Выбран</Radio.Label>
        </Radio.Root>
      </Radio.Group>
      <Radio.Group invalid aria-label="Ошибка">
        <Radio.Root value="error">
          <Radio.Label>Ошибка</Radio.Label>
        </Radio.Root>
      </Radio.Group>
      <Radio.Group disabled aria-label="Недоступен">
        <Radio.Root value="disabled">
          <Radio.Label>Недоступен</Radio.Label>
        </Radio.Root>
      </Radio.Group>
      <Radio.Group disabled defaultValue="disabled-on" aria-label="Недоступен, выбран">
        <Radio.Root value="disabled-on">
          <Radio.Label>Недоступен, выбран</Radio.Label>
        </Radio.Root>
      </Radio.Group>
    </div>
  );
}
