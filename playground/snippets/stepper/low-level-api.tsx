import * as React from "react";

import { HorizontalStepper } from "@/components/stepper/HorizontalStepper";
import { VerticalStepper } from "@/components/stepper/VerticalStepper";

/** Примитивные корни: вы сами задаёте `state` каждого шага и разметку без семантического списка. */
export default function StepperLowLevelApiSnippet() {
  const [horizontalActive, setHorizontalActive] = React.useState(0);
  const [verticalActive, setVerticalActive] = React.useState(0);

  const steps = [
    { label: "Профиль", indicator: "1" },
    { label: "Роль", indicator: "2" },
    { label: "Доступ", indicator: "3" },
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
    <div className="flex flex-col gap-10">
      <HorizontalStepper.Root className="w-full max-w-md">
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

      <VerticalStepper.Root className="w-[232px] shrink-0">
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
