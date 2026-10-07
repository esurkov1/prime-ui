/** A preview + code frame with the toolbar (pane switch, device width, theme, copy) and a `row` preview layout. Use in documentation pages to show a live example next to its source. */
import { Button, ExampleFrame } from "prime-ui-kit";

const code = `<Button.Root variant="ghost" tone="neutral">Отмена</Button.Root>
<Button.Root>Сохранить</Button.Root>`;

export default function ExampleFrameBasicExample() {
  return (
    <ExampleFrame.Root code={code} previewLayout="row">
      <ExampleFrame.Stage>
        <Button.Root variant="ghost" tone="neutral">
          Отмена
        </Button.Root>
        <Button.Root>Сохранить</Button.Root>
      </ExampleFrame.Stage>
    </ExampleFrame.Root>
  );
}
