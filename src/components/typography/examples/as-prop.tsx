/** The `as` prop: `p` and `div` as block wrappers, `span` as an inline fragment inside a paragraph. Use `as` to keep the right HTML element while the role sets the look. */
import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyAsPropExample() {
  return (
    <div className={styles.scaleList}>
      <Typography.Root as="p" variant="body-m">
        as=&quot;p&quot; — отдельный абзац с нулевыми внешними отступами по умолчанию у компонента.
      </Typography.Root>
      <Typography.Root as="div" variant="body-m">
        as=&quot;div&quot; — блочный контейнер, если нужна обёртка без семантики абзаца (например
        внутри карточки).
      </Typography.Root>
      <Typography.Root as="p" variant="body-m">
        В одной строке можно вставить{" "}
        <Typography.Root as="span" variant="body-m" weight="semibold">
          span с акцентом
        </Typography.Root>{" "}
        без нового абзаца.
      </Typography.Root>
    </div>
  );
}
