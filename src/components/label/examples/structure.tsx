/** The required asterisk, the optional marker and an inline clarification — `required`, `optional`, `Label.Description`. */
import { Label, Typography } from "prime-ui-kit";

export default function LabelStructureExample() {
  return (
    <div>
      <div>
        <Label.Root required>ИНН</Label.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          required
        </Typography.Root>
      </div>
      <div>
        <Label.Root optional>КПП</Label.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          optional
        </Typography.Root>
      </div>
      <div>
        <Label.Root>
          Бюджет
          <Label.Description>₽, без НДС</Label.Description>
        </Label.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          Label.Description
        </Typography.Root>
      </div>
    </div>
  );
}
