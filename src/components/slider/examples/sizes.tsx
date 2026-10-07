/** Every size; the thumb, the label and the value grow with the tier — `size`. */
import { Slider } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SliderSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <Slider size={size} label={size} showValue defaultValue={40} />
          </div>
        </div>
      ))}
    </>
  );
}
