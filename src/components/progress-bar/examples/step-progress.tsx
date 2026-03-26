import { ProgressBar, Typography } from "prime-ui-kit";

import s from "./progress-bar-examples.module.css";

/** Map the current step index and total steps to `value` / `max` so the bar matches “step k of n”. */
export default function ProgressBarStepProgressExample() {
  const currentStep = 2;
  const totalSteps = 5;

  return (
    <div className={s.stack}>
      <Typography.Root variant="body-large" weight="semibold">
        Account setup
      </Typography.Root>
      <ProgressBar.Root
        value={currentStep}
        max={totalSteps}
        label={`Step ${currentStep} of ${totalSteps}`}
        size="m"
      />
    </div>
  );
}
