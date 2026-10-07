/** A default palette next to an invalid and a disabled one — `invalid`, `disabled`. */
import { COLOR_PRESETS, ColorSwatches } from "prime-ui-kit";

const PRESETS = COLOR_PRESETS.slice(0, 6);

export default function ColorSwatchesStatesExample() {
  return (
    <div>
      <div>
        <ColorSwatches label="default" presets={PRESETS} defaultValue="#22c55e" />
      </div>
      <div>
        <ColorSwatches label="invalid" presets={PRESETS} defaultValue="#22c55e" invalid />
      </div>
      <div>
        <ColorSwatches label="disabled" presets={PRESETS} defaultValue="#22c55e" disabled />
      </div>
    </div>
  );
}
