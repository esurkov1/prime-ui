import { HorizontalStepper, VerticalStepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** `HorizontalStepper` / `VerticalStepper`: you own each row `state`; no semantic `<ol>`. */
export default function StepperLowLevelApiExample() {
  const [horizontalActive, setHorizontalActive] = React.useState(0);
  const [verticalActive, setVerticalActive] = React.useState(0);

  const steps = [
    { label: "Profile", indicator: "1" },
    { label: "Role", indicator: "2" },
    { label: "Access", indicator: "3" },
  ] as const;

  const getState = (idx: number): "completed" | "active" | "default" => {
    if (idx < horizontalActive) return "completed";
    if (idx === horizontalActive) return "active";
    return "default";
  };

  const getStateV = (idx: number): "completed" | "active" | "default" => {
    if (idx < verticalActive) return "completed";
    if (idx === verticalActive) return "active";
    return "default";
  };

  return (
    <div className={styles.stackLoose}>
      <HorizontalStepper.Root className={styles.horizontalRailMd}>
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            {idx > 0 ? <HorizontalStepper.SeparatorIcon /> : null}
            <HorizontalStepper.Item state={getState(idx)} onClick={() => setHorizontalActive(idx)}>
              <HorizontalStepper.ItemIndicator>{step.indicator}</HorizontalStepper.ItemIndicator>
              {step.label}
            </HorizontalStepper.Item>
          </React.Fragment>
        ))}
      </HorizontalStepper.Root>

      <VerticalStepper.Root className={styles.verticalRail}>
        {steps.map((step, idx) => (
          <VerticalStepper.Item
            key={step.label}
            state={getStateV(idx)}
            onClick={() => setVerticalActive(idx)}
          >
            <VerticalStepper.ItemIndicator>{step.indicator}</VerticalStepper.ItemIndicator>
            {step.label}
            {getStateV(idx) === "active" ? <VerticalStepper.Arrow /> : null}
          </VerticalStepper.Item>
        ))}
      </VerticalStepper.Root>
    </div>
  );
}
