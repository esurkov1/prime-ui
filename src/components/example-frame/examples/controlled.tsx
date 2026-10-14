/** Frames of one page share the preview width and theme: the parent owns both — `viewport`, `onViewportChange`, `colorScheme`. */
import { Button, ExampleFrame, type ExampleFrameViewport, Input } from "prime-ui-kit";
import * as React from "react";

const BUTTON_CODE = "<Button.Root>Создать счёт</Button.Root>";
const INPUT_CODE = `<Input.Root label="Рабочая почта">
  <Input.Wrapper>
    <Input.Field placeholder="name@company.ru" />
  </Input.Wrapper>
</Input.Root>`;

export default function ExampleFrameControlledExample() {
  const [viewport, setViewport] = React.useState<ExampleFrameViewport>("desktop");
  const [scheme, setScheme] = React.useState<"light" | "dark">("light");

  return (
    <>
      <ExampleFrame
        code={BUTTON_CODE}
        viewport={viewport}
        onViewportChange={setViewport}
        colorScheme={scheme}
        onColorSchemeChange={setScheme}
      >
        <Button.Root>Создать счёт</Button.Root>
      </ExampleFrame>
      <ExampleFrame
        code={INPUT_CODE}
        viewport={viewport}
        onViewportChange={setViewport}
        colorScheme={scheme}
        onColorSchemeChange={setScheme}
      >
        <Input.Root label="Рабочая почта">
          <Input.Wrapper>
            <Input.Field placeholder="name@company.ru" />
          </Input.Wrapper>
        </Input.Root>
      </ExampleFrame>
    </>
  );
}
