/** A labelled multi-line field with a hint; the height follows the text — `label`, `hint`. */
import { Textarea } from "prime-ui-kit";

export default function TextareaOverviewExample() {
  return (
    <Textarea.Root
      label="Комментарий к заказу"
      placeholder="Пожелания по доставке и упаковке"
      hint="Курьер увидит этот текст"
    />
  );
}
