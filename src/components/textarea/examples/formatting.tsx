/** A long announcement where a selection gets the formatting toolbar and its hotkeys, written as Markdown around it — `formatting`. */
import { Textarea } from "prime-ui-kit";

const ANNOUNCEMENT = `С понедельника счета клиентам выставляет **отдел расчётов**, а не менеджеры проектов.

> Счёт уходит в течение _одного рабочего дня_ после подписания акта.

Шаблон договора — [в базе знаний](https://prime.app/kb/contracts). Пароль от архива актов: ||Prime-2048||. Старый процесс ~~через почту~~ отключаем 1 апреля.`;

export default function TextareaFormattingExample() {
  return (
    <Textarea.Root
      label="Текст публикации"
      hint="Выделите текст, чтобы оформить его; публикация покажет оформление"
      defaultValue={ANNOUNCEMENT}
      rows={6}
      formatting
    />
  );
}
