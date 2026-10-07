/** `required` adds a red asterisk, `optional` a muted marker (text via `labels.optional`), `Label.Sub` an inline clarification. Mark the minority of fields in a form. */
import { Label } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LabelMarkersExample() {
  return (
    <div className={styles.list}>
      <Label.Root htmlFor="label-mk-phone" required>
        Телефон
      </Label.Root>
      <Label.Root htmlFor="label-mk-company" optional>
        Компания
      </Label.Root>
      <Label.Root labels={{ optional: "если есть" }} htmlFor="label-mk-promo" optional>
        Промокод
      </Label.Root>
      <Label.Root htmlFor="label-mk-note" optional>
        Комментарий
      </Label.Root>
      <Label.Root htmlFor="label-mk-budget">
        Бюджет
        <Label.Sub>₽, без НДС</Label.Sub>
      </Label.Root>
    </div>
  );
}
