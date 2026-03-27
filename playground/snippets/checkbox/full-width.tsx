import { Checkbox } from "@/components/checkbox/Checkbox";

import styles from "./full-width.module.css";

export default function CheckboxFullWidthSnippet() {
  return (
    <div className={styles.narrowCard}>
      <Checkbox.Root>
        <Checkbox.Label>
          Я согласен с условиями использования сервиса и политикой конфиденциальности
        </Checkbox.Label>
        <Checkbox.Hint>
          Корень поля тянется на ширину контейнера; подпись переносится во второй колонке сетки.
        </Checkbox.Hint>
      </Checkbox.Root>
    </div>
  );
}
