import * as React from "react";

import { HorizontalStepper } from "@/components/stepper/HorizontalStepper";
import { VerticalStepper } from "@/components/stepper/VerticalStepper";
import { IconHouse, IconMail } from "@/icons";

/** У `HorizontalStepper.SeparatorIcon` и `VerticalStepper.Arrow` можно передать `as`, чтобы заменить иконку по умолчанию. */
export default function StepperPolymorphicAsSnippet() {
  const [horizontalActive, setHorizontalActive] = React.useState(1);
  const [verticalActive, setVerticalActive] = React.useState(0);

  return (
    <div className="flex flex-col gap-8">
      <HorizontalStepper.Root className="w-full max-w-md">
        <HorizontalStepper.Item
          state={horizontalActive > 0 ? "completed" : horizontalActive === 0 ? "active" : "default"}
          onClick={() => setHorizontalActive(0)}
        >
          <HorizontalStepper.ItemIndicator>1</HorizontalStepper.ItemIndicator>
          Старт
        </HorizontalStepper.Item>
        <HorizontalStepper.SeparatorIcon as={IconHouse} />
        <HorizontalStepper.Item
          state={horizontalActive > 1 ? "completed" : horizontalActive === 1 ? "active" : "default"}
          onClick={() => setHorizontalActive(1)}
        >
          <HorizontalStepper.ItemIndicator>2</HorizontalStepper.ItemIndicator>
          Дом
        </HorizontalStepper.Item>
      </HorizontalStepper.Root>

      <VerticalStepper.Root className="w-[200px]">
        <VerticalStepper.Item
          state={verticalActive > 0 ? "completed" : verticalActive === 0 ? "active" : "default"}
          onClick={() => setVerticalActive(0)}
        >
          <VerticalStepper.ItemIndicator>1</VerticalStepper.ItemIndicator>
          Уведомления
          {verticalActive === 0 ? <VerticalStepper.Arrow as={IconMail} /> : null}
        </VerticalStepper.Item>
        <VerticalStepper.Item
          state={verticalActive > 1 ? "completed" : verticalActive === 1 ? "active" : "default"}
          onClick={() => setVerticalActive(1)}
        >
          <VerticalStepper.ItemIndicator>2</VerticalStepper.ItemIndicator>
          Частота
          {verticalActive === 1 ? <VerticalStepper.Arrow as={IconMail} /> : null}
        </VerticalStepper.Item>
      </VerticalStepper.Root>
    </div>
  );
}
