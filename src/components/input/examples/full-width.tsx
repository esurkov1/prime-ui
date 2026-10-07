/** Input.Root always fills its parent; the width comes from the layout column, there is no `fullWidth` prop. Use a capped wrapper for short values like a postal code. */
import { Input } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function InputFullWidthExample() {
  return (
    <div className={styles.widthRoot}>
      <div className={styles.widthNarrow}>
        <Input.Root label="Индекс" hint="Колонка ограничена родителем">
          <Input.Wrapper>
            <Input.Field placeholder="190000" inputMode="numeric" />
          </Input.Wrapper>
        </Input.Root>
      </div>
      <Input.Root label="Адрес доставки" hint="Родитель на всю ширину">
        <Input.Wrapper>
          <Input.Field placeholder="Улица, дом, квартира" autoComplete="street-address" />
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
