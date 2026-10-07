/** Every tier changes the icon tile, the title and the padding; buttons in Actions take the same size — `size`. */
import { Button, EmptyPage, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function EmptyPageSizesExample() {
  return (
    <div className={styles.grid}>
      {SIZES.map((size) => (
        <EmptyPage.Root key={size} size={size} aria-labelledby={`empty-size-${size}`}>
          <EmptyPage.Icon>
            <Icon name="object.document" />
          </EmptyPage.Icon>
          <EmptyPage.Title id={`empty-size-${size}`}>Счетов нет · {size}</EmptyPage.Title>
          <EmptyPage.Description>Выставленные счета появятся здесь.</EmptyPage.Description>
          <EmptyPage.Actions>
            <Button.Root size={size}>Выставить счёт</Button.Root>
          </EmptyPage.Actions>
        </EmptyPage.Root>
      ))}
    </div>
  );
}
