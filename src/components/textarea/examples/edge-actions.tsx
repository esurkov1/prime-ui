/** A read-only generated reply with copying and a link to the template in the field's corner — `Textarea.CopyButton`, `Textarea.Action`. */
import { Icon, Textarea } from "prime-ui-kit";

const REPLY = `Добрый день, Ирина!

Счёт № 1042 на сумму 184 500 ₽ выставлен и отправлен на почту бухгалтерии. Оплатить его можно до 15 ноября.`;

export default function TextareaEdgeActionsExample() {
  return (
    <Textarea.Root
      label="Ответ клиенту"
      hint="Собран из шаблона «Счёт выставлен»"
      readOnly
      value={REPLY}
    >
      <Textarea.Action label="Открыть шаблон" asChild>
        <a href="#template-invoice-sent">
          <Icon name="object.document" />
        </a>
      </Textarea.Action>
      <Textarea.CopyButton />
    </Textarea.Root>
  );
}
