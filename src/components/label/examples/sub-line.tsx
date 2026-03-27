import { Label } from "prime-ui-kit";

/** Mirrors `playground/snippets/label/sub-line.tsx`: short secondary line via `Label.Sub`. */
export function LabelSubLineExample() {
  return (
    <Label.Root htmlFor="example-label-sub-budget">
      Campaign budget
      <Label.Sub>in RUB, excluding VAT</Label.Sub>
    </Label.Root>
  );
}
