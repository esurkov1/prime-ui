import { Divider, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Курсив `italic` при том же `variant` и `weight`. Зеркало `playground/snippets/typography/states.tsx`. */
export default function TypographyExampleStates() {
  return (
    <div className={styles.typographyScaleList}>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-default" weight="medium">
          Заголовок карточки без курсива — обычный акцент.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          italic не задан (false)
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-default" weight="medium" italic>
          Тот же размер и вес с курсивом — цитата или название научной работы.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          italic — курсив через data-атрибут и токены
        </Divider.Root>
      </div>
    </div>
  );
}
