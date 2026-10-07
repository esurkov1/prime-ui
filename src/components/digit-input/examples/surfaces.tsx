/** Cells use the field fill: white on the canvas, `field-bg-surface` inside a card or popover. Place the code field on any surface without overrides. */
import { DigitInput } from "prime-ui-kit";

export default function DigitInputSurfacesExample() {
  return <DigitInput.Root length={4} defaultValue="73" labels={{ group: "PIN-код" }} />;
}
