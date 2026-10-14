/** A default field next to a read-only, a disabled and an invalid one with no message — `readOnly`, `disabled`, `invalid`. */
import { Textarea } from "prime-ui-kit";

export default function TextareaStatesExample() {
  return (
    <>
      <div>
        <div>
          <Textarea.Root label="default" placeholder="Причина возврата" />
        </div>
      </div>
      <div>
        <div>
          <Textarea.Root
            label="readOnly"
            readOnly
            defaultValue="Заявка закрыта 12 марта: товар принят на склад."
          />
        </div>
      </div>
      <div>
        <div>
          <Textarea.Root
            label="disabled"
            disabled
            placeholder="Причина возврата"
            hint="Станет доступно после выбора заказа"
          />
        </div>
      </div>
      <div>
        <div>
          <Textarea.Root label="invalid" invalid defaultValue="Не подошёл размер" />
        </div>
      </div>
    </>
  );
}
