/** A live example next to its source, with the pane, width, theme and copy controls — `code`, `previewLayout`. */
import { Button, ExampleFrame } from "prime-ui-kit";

const CODE = `<Button.Root variant="soft" tone="neutral">Отмена</Button.Root>
<Button.Root>Сохранить</Button.Root>`;

export default function ExampleFrameOverviewExample() {
  return (
    <ExampleFrame.Root code={CODE} previewLayout="row">
      <ExampleFrame.Stage>
        <Button.Root variant="soft" tone="neutral">
          Отмена
        </Button.Root>
        <Button.Root>Сохранить</Button.Root>
      </ExampleFrame.Stage>
    </ExampleFrame.Root>
  );
}
