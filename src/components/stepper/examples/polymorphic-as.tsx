import { HorizontalStepper, IconHouse, IconMail, VerticalStepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** `as` on `HorizontalStepper.SeparatorIcon` and `VerticalStepper.Arrow` for custom icons. */
export default function StepperPolymorphicAsExample() {
  const [horizontalActive, setHorizontalActive] = React.useState(1);
  const [verticalActive, setVerticalActive] = React.useState(0);

  return (
    <div className={styles.stackLoose}>
      <HorizontalStepper.Root className={styles.horizontalRailMd}>
        <HorizontalStepper.Item
          state={horizontalActive > 0 ? "completed" : horizontalActive === 0 ? "active" : "default"}
          onClick={() => setHorizontalActive(0)}
        >
          <HorizontalStepper.ItemIndicator>1</HorizontalStepper.ItemIndicator>
          Start
        </HorizontalStepper.Item>
        <HorizontalStepper.SeparatorIcon as={IconHouse} />
        <HorizontalStepper.Item
          state={horizontalActive > 1 ? "completed" : horizontalActive === 1 ? "active" : "default"}
          onClick={() => setHorizontalActive(1)}
        >
          <HorizontalStepper.ItemIndicator>2</HorizontalStepper.ItemIndicator>
          Home
        </HorizontalStepper.Item>
      </HorizontalStepper.Root>

      <VerticalStepper.Root className={styles.verticalRailNarrow}>
        <VerticalStepper.Item
          state={verticalActive > 0 ? "completed" : verticalActive === 0 ? "active" : "default"}
          onClick={() => setVerticalActive(0)}
        >
          <VerticalStepper.ItemIndicator>1</VerticalStepper.ItemIndicator>
          Notifications
          {verticalActive === 0 ? <VerticalStepper.Arrow as={IconMail} /> : null}
        </VerticalStepper.Item>
        <VerticalStepper.Item
          state={verticalActive > 1 ? "completed" : verticalActive === 1 ? "active" : "default"}
          onClick={() => setVerticalActive(1)}
        >
          <VerticalStepper.ItemIndicator>2</VerticalStepper.ItemIndicator>
          Cadence
          {verticalActive === 1 ? <VerticalStepper.Arrow as={IconMail} /> : null}
        </VerticalStepper.Item>
      </VerticalStepper.Root>
    </div>
  );
}
