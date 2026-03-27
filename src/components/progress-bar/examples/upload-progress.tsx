import { ProgressBar, Typography } from "prime-ui-kit";
import * as React from "react";

import s from "./progress-bar-examples.module.css";

/** Determinate upload: drive `value` from bytes transferred; keep filename and percent in surrounding copy. */
export default function ProgressBarUploadExample() {
  const [loaded, setLoaded] = React.useState(0);
  const total = 100;

  return (
    <div className={s.card}>
      <Typography.Root variant="body-small" tone="muted">
        quarterly-report.pdf
      </Typography.Root>
      <ProgressBar.Root value={loaded} max={total} label={`Upload progress: ${loaded}%`} />
      <div className={s.actions}>
        <button type="button" onClick={() => setLoaded((n) => Math.max(0, n - 20))}>
          −20%
        </button>
        <button type="button" onClick={() => setLoaded((n) => Math.min(total, n + 20))}>
          +20%
        </button>
      </div>
    </div>
  );
}
