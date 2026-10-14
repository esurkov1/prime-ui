/** The Markdown the Composer writes, rendered safely: bold, italic, strike, code, a code block, links and a quote; long words and URLs wrap; a pasted error log stays as typed, its stars and underscores kept — `Message.Text`, `edited`, `plain`. */
import { Message } from "prime-ui-kit";

import styles from "./examples.module.css";

const RELEASE = `**Релиз 2.4** готов к выкатке.
Изменения: _экспорт счетов_, ~~старый отчёт~~ удалён, флаг \`invoices.v2\`.
> Миграцию запускать только после бэкапа.
\`\`\`
bun run migrate --env=prod
\`\`\`
Чеклист: https://prime.app/wiki/release-2-4`;

/** An error copied from the 1C log: its stars and underscores are data, not markup. */
const ERROR_LOG = "ERR_EXPORT_1C: поле *ИНН* пусто (counterparty_id=4_12_1)";

export default function MessageTextFormattingExample() {
  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" time="16:05">
        <Message.Text>{RELEASE}</Message.Text>
      </Message.Root>
      <Message.Root direction="outgoing" time="16:07" edited status="read">
        <Message.Text>
          Принято, запускаю после бэкапа. Отчёт положу в [задачу](https://prime.app/t/PRJ-430).
        </Message.Text>
      </Message.Root>
      <Message.Root direction="incoming" time="16:12">
        <Message.Text plain>{ERROR_LOG}</Message.Text>
      </Message.Root>
    </div>
  );
}
