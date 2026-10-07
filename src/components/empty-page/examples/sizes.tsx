/** Sizes xs–xl change the icon tile, title size and padding; pass the same `size` to the buttons in Actions. Use small sizes inside cards and tables, large ones for whole pages. */
import { FileText } from "lucide-react";
import { Button, type ControlSize, EmptyPage, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function EmptyPageSizesExample() {
  return (
    <div className={styles.grid}>
      {sizes.map((size) => (
        <div key={size} className={styles.group}>
          <Typography.Root variant="code" tone="muted">
            size="{size}"
          </Typography.Root>
          <EmptyPage.Root size={size} aria-labelledby={`empty-size-${size}`}>
            <EmptyPage.Icon>
              <FileText aria-hidden />
            </EmptyPage.Icon>
            <EmptyPage.Title id={`empty-size-${size}`}>Счетов нет</EmptyPage.Title>
            <EmptyPage.Description>Выставленные счета появятся здесь.</EmptyPage.Description>
            <EmptyPage.Actions>
              <Button.Root size={size}>Выставить счёт</Button.Root>
            </EmptyPage.Actions>
          </EmptyPage.Root>
        </div>
      ))}
    </div>
  );
}
