/** Horizontal (default) and vertical groups side by side. Use `orientation="vertical"` for a column of related options. */
import { ButtonGroup } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ButtonGroupOrientationExample() {
  return (
    <div className={styles.row}>
      <ButtonGroup.Root aria-label="Сортировка">
        <ButtonGroup.Item pressed>Новые</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Популярные</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Старые</ButtonGroup.Item>
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Раздел" orientation="vertical">
        <ButtonGroup.Item pressed>Профиль</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Безопасность</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Уведомления</ButtonGroup.Item>
      </ButtonGroup.Root>
    </div>
  );
}
