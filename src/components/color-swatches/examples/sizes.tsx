/** Every size: the swatch height 20 to 40 px with the tier gap, the label stays the form's — `size`. */
import { COLOR_PRESETS, ColorSwatches } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;
const PRESETS = COLOR_PRESETS.slice(0, 6);

export default function ColorSwatchesSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <ColorSwatches size={size} label={size} presets={PRESETS} defaultValue="#5068f5" />
          </div>
        </div>
      ))}
    </>
  );
}
