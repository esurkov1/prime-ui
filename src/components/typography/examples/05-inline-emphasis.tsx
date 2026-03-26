import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Nested Typography.Root spans inside one paragraph: weight and tracking without new variants. */
export default function TypographyExampleInlineEmphasis() {
  return (
    <div className={styles.stack}>
      <Typography.Root as="p" variant="body-default">
        Order{" "}
        <Typography.Root as="span" variant="body-default" weight="semibold">
          #4821
        </Typography.Root>{" "}
        is{" "}
        <Typography.Root as="span" variant="body-default" weight="medium" tracking="tight">
          out for delivery
        </Typography.Root>
        . Total{" "}
        <Typography.Root as="span" variant="body-default" weight="medium">
          $124.00
        </Typography.Root>
        ; estimated arrival{" "}
        <Typography.Root as="span" variant="body-default" tone="muted">
          Tue, Apr 2
        </Typography.Root>
        .
      </Typography.Root>
    </div>
  );
}
