import { Button, Typography } from "prime-ui-kit";

import s from "./progress-bar-examples.module.css";

/**
 * `ProgressBar.Root` always requires a numeric `value` — it cannot represent a native indeterminate meter.
 * For unknown duration, use loading affordances on the relevant control (and optional supporting text).
 */
export default function ProgressBarIndeterminateBusyExample() {
  return (
    <div className={s.stack}>
      <Typography.Root variant="body-small" tone="muted">
        Preparing your workspace…
      </Typography.Root>
      <Button.Root type="button" loading variant="neutral" mode="stroke">
        <Button.Spinner />
        Please wait
      </Button.Root>
    </div>
  );
}
