/** Every size; the circle and the text follow the group tier — `size`. */
import { Radio } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function RadioSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Radio.Group size={size} defaultValue={size} aria-label={`Размер ${size}`}>
            <Radio.Root value={size}>
              <Radio.Label>{size}</Radio.Label>
            </Radio.Root>
          </Radio.Group>
        </div>
      ))}
    </div>
  );
}
