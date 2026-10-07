/** Every size; the box and the text follow the control tier — `size`. */
import { Checkbox } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function CheckboxSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Checkbox.Root size={size} defaultChecked>
            <Checkbox.Label>{size}</Checkbox.Label>
          </Checkbox.Root>
        </div>
      ))}
    </div>
  );
}
