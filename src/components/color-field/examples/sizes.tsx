/** Every size tier: the field is 28 to 48 px high, the swatch follows the tier icon — `size`. */
import { ColorField } from "prime-ui-kit/color-picker";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ColorFieldSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <ColorField size={size} label={size} defaultValue="#0090ff" />
          </div>
        </div>
      ))}
    </>
  );
}
