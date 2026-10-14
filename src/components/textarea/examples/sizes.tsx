/** Every size tier; text, padding, label and hint follow the tier — `size`. */
import { Textarea } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function TextareaSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <Textarea.Root
              size={size}
              label={size}
              placeholder="Комментарий к заказу"
              hint="Курьер увидит этот текст"
            />
          </div>
        </div>
      ))}
    </>
  );
}
