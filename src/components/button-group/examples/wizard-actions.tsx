import { ButtonGroup } from "prime-ui-kit";
import * as React from "react";

const STEP_LAST = 2;

/**
 * Wizard step actions: Back disabled on first step; Next advances (demo stops at last step).
 */
export default function WizardActionsExample() {
  const [step, setStep] = React.useState(0);

  return (
    <ButtonGroup.Root aria-label="Wizard navigation">
      <ButtonGroup.Item
        disabled={step === 0}
        type="button"
        onClick={() => setStep((s) => Math.max(0, s - 1))}
      >
        Back
      </ButtonGroup.Item>
      <ButtonGroup.Item
        disabled={step >= STEP_LAST}
        type="button"
        onClick={() => setStep((s) => Math.min(STEP_LAST, s + 1))}
      >
        Next
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
