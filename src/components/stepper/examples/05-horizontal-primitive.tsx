import { HorizontalStepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const STEPS = ["Draft", "Review", "Publish"] as const;

function rowState(idx: number, active: number): "default" | "active" | "completed" {
  if (idx < active) return "completed";
  if (idx === active) return "active";
  return "default";
}

/**
 * Horizontal primitive rail: non-semantic `div` + buttons; you supply each `state`.
 */
export default function StepperExampleHorizontalPrimitive() {
  const [active, setActive] = React.useState(0);

  return (
    <HorizontalStepper.Root size="m" className={styles.rail}>
      {STEPS.map((label, idx) => (
        <React.Fragment key={label}>
          {idx > 0 ? <HorizontalStepper.SeparatorIcon /> : null}
          <HorizontalStepper.Item
            type="button"
            state={rowState(idx, active)}
            onClick={() => setActive(idx)}
          >
            <HorizontalStepper.ItemIndicator>{String(idx + 1)}</HorizontalStepper.ItemIndicator>
            {label}
          </HorizontalStepper.Item>
        </React.Fragment>
      ))}
    </HorizontalStepper.Root>
  );
}
