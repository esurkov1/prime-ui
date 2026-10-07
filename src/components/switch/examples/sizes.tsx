/** Every size, track 24×16 to 44×24; the text follows the control tier — `size`. */
import { Switch } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SwitchSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Switch.Root size={size} defaultChecked>
            <Switch.Label>{size}</Switch.Label>
          </Switch.Root>
        </div>
      ))}
    </div>
  );
}
