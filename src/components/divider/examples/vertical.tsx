/** Vertical lines between groups of toolbar buttons: one as tall as the row, one inset to a text line — `orientation`, `inset`. */
import { Button, Divider, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DividerVerticalExample() {
  return (
    <div className={styles.toolbar}>
      <Button.Root variant="ghost" tone="neutral" aria-label="Жирный">
        <Button.Icon>
          <Icon name="format.bold" />
        </Button.Icon>
      </Button.Root>
      <Button.Root variant="ghost" tone="neutral" aria-label="Курсив">
        <Button.Icon>
          <Icon name="format.italic" />
        </Button.Icon>
      </Button.Root>
      <Divider orientation="vertical" />
      <Button.Root variant="ghost" tone="neutral" aria-label="Список">
        <Button.Icon>
          <Icon name="format.list" />
        </Button.Icon>
      </Button.Root>
      <Button.Root variant="ghost" tone="neutral" aria-label="Цитата">
        <Button.Icon>
          <Icon name="format.quote" />
        </Button.Icon>
      </Button.Root>
      <Divider orientation="vertical" inset />
      <Button.Root variant="ghost" tone="neutral" aria-label="Ссылка">
        <Button.Icon>
          <Icon name="format.link" />
        </Button.Icon>
      </Button.Root>
    </div>
  );
}
