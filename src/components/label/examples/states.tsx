/** A default label next to a disabled one; the markers dim with the text — `disabled`. */
import { Label, Typography } from "prime-ui-kit";

export default function LabelStatesExample() {
  return (
    <div>
      <div>
        <Label.Root required>Название проекта</Label.Root>
        <Typography as="span" variant="caption" tone="muted">
          default
        </Typography>
      </div>
      <div>
        <Label.Root required disabled>
          Название проекта
        </Label.Root>
        <Typography as="span" variant="caption" tone="muted">
          disabled
        </Typography>
      </div>
    </div>
  );
}
