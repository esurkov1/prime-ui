/** The fill at both ends and a disabled slider — `disabled`. */
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
        <Slider label="disabled" showValue defaultValue={35} disabled />
      </div>
    </div>
  );
}
