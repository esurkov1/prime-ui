/** Every size; the cell is a square on its own scale, two steps above the control heights — `size`. */
import { DigitInput } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function DigitInputSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <DigitInput key={size} size={size} label={size} defaultValue="2048" />
      ))}
    </>
  );
}
