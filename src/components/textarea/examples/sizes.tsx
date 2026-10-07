/** Every size tier; text, padding, label and hint follow the tier — `size`. */
import { Textarea } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function TextareaSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <Textarea.Root
          key={size}
          size={size}
          label={size}
          placeholder="Комментарий к заказу"
          hint="Курьер увидит этот текст"
        />
      ))}
    </>
  );
}
