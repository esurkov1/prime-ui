import { Input } from "@/components/input/Input";

import styles from "./full-width.module.css";

export default function InputFullWidthSnippet() {
  return (
    <div className={styles.root}>
      <div className={styles.narrow}>
        <p className={styles.caption}>Узкая колонка: корень поля тянется на ширину родителя.</p>
        <Input.Root size="m" hint="Родитель max-width: 220px">
          <Input.Wrapper>
            <Input.Field placeholder="Короткая колонка" />
          </Input.Wrapper>
        </Input.Root>
      </div>
      <div className={styles.wide}>
        <p className={styles.caption}>
          На всю ширину карточки: тот же Input.Root в растянутом контейнере.
        </p>
        <Input.Root size="m" hint="Родитель на 100% ширины превью">
          <Input.Wrapper>
            <Input.Field placeholder="Поле на всю ширину блока" />
          </Input.Wrapper>
        </Input.Root>
      </div>
    </div>
  );
}
