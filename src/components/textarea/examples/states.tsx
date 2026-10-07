/** A default field next to a read-only and a disabled one — `readOnly`, `disabled`. */
import { Textarea } from "prime-ui-kit";

export default function TextareaStatesExample() {
  return (
    <>
      <Textarea.Root label="default" placeholder="Причина возврата" />
      <Textarea.Root
        label="readOnly"
        readOnly
        defaultValue="Заявка закрыта 12 марта: товар принят на склад."
      />
      <Textarea.Root
        label="disabled"
        disabled
        placeholder="Причина возврата"
        hint="Станет доступно после выбора заказа"
      />
    </>
  );
}
