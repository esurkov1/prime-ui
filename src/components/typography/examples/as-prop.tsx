import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Проп `as`: `p`, `div`, вложенный `span`. Зеркало `playground/snippets/typography/as-prop.tsx`. */
export default function TypographyExampleAsProp() {
  return (
    <div className={styles.typographyScaleList}>
      <Typography.Root as="p" variant="body-default">
        as=&quot;p&quot; — отдельный абзац с нулевыми внешними отступами по умолчанию у компонента.
      </Typography.Root>
      <Typography.Root as="div" variant="body-default">
        as=&quot;div&quot; — блочный контейнер, если нужна обёртка без семантики абзаца (например
        внутри карточки).
      </Typography.Root>
      <Typography.Root as="p" variant="body-default">
        В одной строке можно вставить{" "}
        <Typography.Root as="span" variant="body-default" weight="semibold">
          span с акцентом
        </Typography.Root>{" "}
        без нового абзаца.
      </Typography.Root>
    </div>
  );
}
