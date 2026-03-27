import { Button, Popover, Typography } from "prime-ui-kit";

import styles from "./popover-examples.module.css";

type Demo = { label: string; side: "top" | "bottom"; align: "start" | "center" | "end" };

const demos: Demo[] = [
  { label: "Bottom · start", side: "bottom", align: "start" },
  { label: "Bottom · center", side: "bottom", align: "center" },
  { label: "Bottom · end", side: "bottom", align: "end" },
  { label: "Top · start", side: "top", align: "start" },
];

/**
 * Preferred `side` and `align`; the kit may flip at the viewport edge.
 */
export default function PlacementExample() {
  return (
    <div className={styles.placementGrid}>
      {demos.map(({ label, side, align }) => (
        <Popover.Root key={label}>
          <Popover.Trigger asChild>
            <Button.Root
              className={styles.placementTrigger}
              mode="stroke"
              size="m"
              variant="neutral"
            >
              {label}
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align={align} insetGap="x2" insetPadding="x2" side={side} size="m">
            <Typography.Root as="p" variant="body-small">
              <code>side=&quot;{side}&quot;</code>, <code>align=&quot;{align}&quot;</code>. Near the
              viewport edge the panel may flip to stay on screen.
            </Typography.Root>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
