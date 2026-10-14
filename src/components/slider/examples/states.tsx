/** The fill at both ends, an invalid slider and a disabled one — `invalid`, `disabled`. */
import { Slider } from "prime-ui-kit";

export default function SliderStatesExample() {
  return (
    <div>
      <div>
        <Slider label="min" showValue defaultValue={0} />
      </div>
      <div>
        <Slider label="max" showValue defaultValue={100} />
      </div>
      <div>
        <Slider label="invalid" showValue defaultValue={90} invalid />
      </div>
      <div>
        <Slider label="disabled" showValue defaultValue={35} disabled />
      </div>
    </div>
  );
}
