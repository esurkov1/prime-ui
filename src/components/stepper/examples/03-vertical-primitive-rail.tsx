import { VerticalStepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const STEPS = ["Basics", "Security", "Billing"] as const;

function rowState(idx: number, active: number): "default" | "active" | "completed" {
  if (idx < active) return "completed";
  if (idx === active) return "active";
  return "default";
}

/**
 * Vertical rail without `<ol>` semantics: app-owned `state` per row (e.g. store or router).
 */
export default function StepperExampleVerticalPrimitiveRail() {
  const [active, setActive] = React.useState(1);

  return (
    <VerticalStepper.Root className={styles.rail}>
      {STEPS.map((label, idx) => (
        <VerticalStepper.Item
          key={label}
          type="button"
          state={rowState(idx, active)}
          onClick={() => setActive(idx)}
        >
          <VerticalStepper.ItemIndicator>{String(idx + 1)}</VerticalStepper.ItemIndicator>
          {label}
          {rowState(idx, active) === "active" ? <VerticalStepper.Arrow /> : null}
        </VerticalStepper.Item>
      ))}
    </VerticalStepper.Root>
  );
}
