/** Every `tone` × `variant` combination as a matrix. Use to choose the treatment (variant) and the meaning (tone) of an action. */
import { Button, Typography } from "prime-ui-kit";
import { Fragment } from "react";

import styles from "./examples.module.css";

const tones = [
  { tone: "accent", label: "Сохранить" },
  { tone: "neutral", label: "Отмена" },
  { tone: "danger", label: "Удалить" },
] as const;
const variants = ["solid", "soft", "outline", "ghost"] as const;

export default function ButtonVariantsTonesExample() {
  return (
    <div className={styles.matrixScroll}>
      <div className={styles.matrix}>
        <span />
        {variants.map((variant) => (
          <Typography.Root key={variant} as="span" variant="caption" tone="muted">
            {variant}
          </Typography.Root>
        ))}
        {tones.map(({ tone, label }) => (
          <Fragment key={tone}>
            <Typography.Root as="span" variant="caption" tone="muted">
              {tone}
            </Typography.Root>
            {variants.map((variant) => (
              <Button.Root key={variant} variant={variant} tone={tone}>
                {label}
              </Button.Root>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
