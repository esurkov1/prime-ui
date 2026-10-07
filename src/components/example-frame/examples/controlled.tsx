/** Frames of one page share the preview width and theme: the parent owns both — `viewport`, `colorScheme`. */
import { Button, ExampleFrame, type ExampleFrameViewport, Input } from "prime-ui-kit";
import * as React from "react";

const BUTTON_CODE = "<Button.Root>Сохранить</Button.Root>";
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
      <ExampleFrame.Root
        code={BUTTON_CODE}
        viewport={viewport}
        onViewportChange={setViewport}
        colorScheme={scheme}
        onColorSchemeChange={setScheme}
      >
        <Button.Root>Сохранить</Button.Root>
      </ExampleFrame.Root>
      <ExampleFrame.Root
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
      </ExampleFrame.Root>
    </>
  );
}
