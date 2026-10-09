/** One composer in every tier: field, buttons and the paperclip follow it — `size`. */
import { Composer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ComposerSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size} className={styles.cell}>
          <Composer.Root size={size} defaultValue="Счёт № 2187 оплачен" onSend={() => {}}>
            <Composer.Attach />
          </Composer.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </>
  );
}
