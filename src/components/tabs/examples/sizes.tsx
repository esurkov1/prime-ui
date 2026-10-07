/** Tabs at every size tier next to a Button of the same size; the tab height equals the control height. Use to align tabs with toolbar controls. */
import { Button, type ControlSize, Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function TabsSizesExample() {
  return (
    <div className={styles.sizes}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeRow}>
          <Typography.Root as="span" variant="code" tone="muted" className={styles.caption}>
            {size}
          </Typography.Root>
          <Tabs.Root size={size} defaultValue="all">
            <Tabs.List aria-label={`Заявки, ${size}`}>
              <Tabs.Trigger value="all">Все</Tabs.Trigger>
              <Tabs.Trigger value="active">Активные</Tabs.Trigger>
              <Tabs.Trigger value="archive">Архив</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
          <Button.Root variant="outline" tone="neutral" size={size}>
            Фильтр
          </Button.Root>
        </div>
      ))}
    </div>
  );
}
