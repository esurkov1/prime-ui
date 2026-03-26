import { Button, ProgressCircle, Typography } from "prime-ui-kit";
import * as React from "react";

/** Parent-owned `value` — typical for polling, uploads, or simulations. */
export default function ControlledExample() {
  const [value, setValue] = React.useState(35);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--prime-sys-spacing-l)",
      }}
    >
      <ProgressCircle.Root
        value={value}
        max={100}
        size="l"
        label={`Upload progress, ${value} percent`}
      >
        <Typography.Root as="span" variant="body-small" weight="medium">
          {value}%
        </Typography.Root>
      </ProgressCircle.Root>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--prime-sys-spacing-s)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button.Root
          mode="stroke"
          size="s"
          type="button"
          onClick={() => setValue((v) => Math.max(0, v - 10))}
        >
          −10
        </Button.Root>
        <Button.Root
          mode="stroke"
          size="s"
          type="button"
          onClick={() => setValue((v) => Math.min(100, v + 10))}
        >
          +10
        </Button.Root>
        <Button.Root mode="lighter" size="s" type="button" onClick={() => setValue(0)}>
          Reset
        </Button.Root>
      </div>
    </div>
  );
}
