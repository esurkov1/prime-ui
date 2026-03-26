import { ProgressBar, Typography } from "prime-ui-kit";

import s from "./progress-bar-examples.module.css";

/** Stack heading, bar, and muted helper copy — typical block in a wizard or long-running task panel. */
export default function ProgressBarWizardCompositionExample() {
  return (
    <div className={s.card}>
      <Typography.Root variant="body-large" weight="semibold">
        Generating report
      </Typography.Root>
      <ProgressBar.Root value={72} max={100} label="Collecting data" size="m" />
      <Typography.Root variant="body-small" tone="muted">
        Usually under five minutes; you can return to the task list.
      </Typography.Root>
    </div>
  );
}
