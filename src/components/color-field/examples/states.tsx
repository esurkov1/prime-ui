/** A default field next to an invalid one and a disabled one that shows its color but does not open — `invalid`, `disabled`. */
import { ColorField } from "prime-ui-kit/color-picker";

export default function ColorFieldStatesExample() {
  return (
    <>
      <ColorField label="default" defaultValue="#30a46c" />
      <ColorField label="invalid" defaultValue="#f5f5f5" invalid />
      <ColorField label="disabled" defaultValue="#30a46c" disabled />
    </>
  );
}
